<template>
  <div class="map-page flex column space-between">
    <div v-if="userLocation" class="chat-section flex column gap10">
      <h2>Say something!</h2>
      <form @submit.prevent="sendMsg" class="flex align-center gap10">
        <FormInput type="select" placeholder="Send a message!" v-model="msgTxt" :itemsMap="msgMap"/>
        <button>{{$t('send')}}</button>
        <!-- <p v-if="accountsToShow.every(c => !isAccountInMsg(c))">{{$t('noUserSelectedMsg')}}</p> -->
      </form>
      <!-- <ul class="flex column gap10" ref="elAccounts"> -->
        <!-- <li v-for="account in accountsToShow" :key="account._id" class="flex column gap5 width-all">
          <p @click="toggleAccountToMsg(account)">User: {{account.username}} <span v-if="isAccountInMsg(account)">V</span></p>
          <ul class="flex wrap gap5 width-all">
            <li v-for="message in account.msgs" :key="message._id">
              {{msgMap[message.txt] || message.txt}}
            </li>
          </ul>
        </li> -->
      <!-- </ul> -->
    </div>
    <div class="google-map" ref="elMapContainer"></div>
  </div>
</template>

<script>
import { socketService } from '@/modules/common/services/socket.service';
import FormInput from '@/modules/common/cmps/FormInput.vue';
import { msgService } from '../services/msg.service';
import { getGeoLocation } from '../services/location.service';
import { googleMapService } from '../services/googleMap.service';
import { mapService } from '../services/map.service';
import { alertService } from '@/modules/common/services/alert.service';

import evEmmiter from '@/modules/common/services/event-emmiter.service';


export default {
  name: 'MapPage',
  data() {
    return {
      chatData: { accounts: [], msgs: [] },
      room: '',
      msgTxt: '',
      msgTo: [],
      msgMap: {},
      userLocation: null,
      map: null,

      autoLocationInterval: null
    }
  },
  async mounted() {
    this.init();
  },
  destroyed() {
    this.disconnectEvents();
  },
  computed: {
    accountsToShow() {
      const accounts = [];
      const allMsgs = this.chatData.msgs;
      for (let account of this.chatData.accounts) accounts.push({
        ...account,
        msgs: allMsgs.filter(c => c.from._id === account._id)
      });
      return accounts;
    }
  },
  methods: {
    connectEvents() {
      socketService.on('map_room_data', data => {
        this.chatData = data;

        if (data.msgMap) {
          this.msgMap = data.msgMap;
          msgService.setMsgMap(data.msgMap);
        }

        // const { elAccounts } = this.$refs;
        // elAccounts.innerHTML = '';
        // this.accountsToShow.forEach(c => elAccounts.appendChild(mapService.createAccountMapEl(c, this.msgTo)));

        this.accountsToShow.forEach(c => mapService.updateAccountMapPreview(this.map, c, this.msgTo));
      });
      socketService.on('new_map_message', msg => {
        // this.chatData.msgs.unshift(msg);
        alertService.toast({type: 'success', timeout: 5000, msg: `${msg.from.username} says: ${msgService.transMsg(msg.txt)}`});
      });
      evEmmiter.on('map-user-selected', ({ account, val, ev }) => {
        this.toggleAccountToMsg(account);
      });
    },
    disconnectEvents() {
      socketService.emit('leave_map_room');
      socketService.off('new_map_message');
      socketService.off('map_room_data');
      evEmmiter.off('map-user-selected');

      clearInterval(this.autoLocationInterval);
      mapService.clearAllAccountsData();
    },

    async sendMsg() {
      if (!this.msgTxt) return;
      const location = await this.getUserLocation();
      const msg = { txt: this.msgTxt, to: this.msgTo, location };
      socketService.emit('send_map_message', msg);
      this.msgTxt = '';
      // this.msgTo = [];
    },
    async getUserLocation() {
      const res = await getGeoLocation();
      if (res.err) this.handleError({err: `error getting geo lofation - ${res.err}`});
      this.userLocation = res;
      return res;
    },
    isAccountInMsg(account) {
      return this.accountInMsgIdx(account) !== -1;
    },
    accountInMsgIdx(account) {
      return this.msgTo.findIndex(c => c._id === account._id);
    },
    toggleAccountToMsg(account) {
      const accountToPush = { ...account, msgs: undefined };
      if (this.isAccountInMsg(account)) this.msgTo.splice(this.accountInMsgIdx(accountToPush, 1));
      else this.msgTo.push(accountToPush);
    },

    async updateUserLocation() {
      const location = await this.getUserLocation();
      socketService.emit('update_user_location', location);
    },


    
    async init() {
      googleMapService.setApiKey(this.$store.getters['settings/settings'].GOOGLE_API_KEY);
      const location = await this.getUserLocation();
      await this.initMap();
      socketService.emit('join_map_room', location);
      this.connectEvents();

      this.autoLocationInterval = setInterval(this.updateUserLocation, 5000);
    },
    async initMap() {
      const map = await googleMapService.initMap(this.$refs.elMapContainer, this.userLocation);
      if (map.err) this.handleError({err: `error getting loading map - ${map.err}`});
      this.map = map;
    },


    handleError(err) {
      alertService.toast({type: 'danger', msg: `Error: ${err.err}`});
      throw err;
    }
  },
  components: { FormInput },
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.map-page {
  width: 100%;
  height: 100%;
  position: relative;
  .chat-section {
    .form-input {
      width: 50px;
    }
    position: absolute;
    z-index: 20;
    top: 95px;
    left: 10px;
    color: black;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 15px;
    border-radius: 3px;
    border: 1px solid rgba(0, 0, 0, 0.5);
    box-shadow: $light-shadow;
  }
  .google-map {
    width: 100%;
    height: 100%;
  }

  .account-map-preview {
    width: fit-content;
    height: 30px;
    padding: 5px;
    @include flex-center;
    border-radius: 3px;
    box-shadow: $light-shadow;
    background-color: white;
    position: relative;
    color: black;
    p {
      &:hover {
        cursor: pointer;
      }
    }
    ul {
      position: absolute;
      left: calc(100% + 3px);
      top: 0;
      // width: 30px;
      padding: 5px;
      border-radius: 3px;
      box-shadow: $light-shadow;
      background-color: white;
      text-align: center;
      max-height: 150px;
      overflow-y: auto;
      overflow-x: hidden;

      >*:not(:last-child) {
        margin-bottom: 5px;
      }

    }
  }
}
</style>