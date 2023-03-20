<template>
  <div class="chat-page flex space-between">
    <div class="chat-section">
      <h2>{{$t('chat')}}!</h2>
      <form @submit.prevent="sendMsg">
        <FormInput placeholder="Send a message!" v-model="msgTxt"/>
      </form>
      <ul>
        <li v-for="message in chatData.msgs" :key="message._id">
          {{message.from?.username || $t('unknown')}}: {{message.txt}}
        </li>
      </ul>
    </div>
    <div class="accounts">
      <div v-for="account in chatData.accounts" :key="account._id" @click="toggleAccountToMsg(account)">
        {{account.username}} <span v-if="isAccountInMsg(account)">V</span>
      </div>
    </div>
  </div>
</template>

<script>
import { socketService } from '@/modules/common/services/socket.service';
import FormInput from '../common/cmps/FormInput.vue';
export default {
  name: 'ChatPage',
  data() {
    return {
      // messages: [], // {from: {username, _id}, txt}
      chatData: { accounts: [], msgs: [] },
      room: '',
      msgTxt: '',
      msgTo: []
    }
  },
  created() {
    socketService.emit('join_chat_room');
    socketService.on('chat_room_data', data => this.chatData = data);
    socketService.on('new_message', msg => this.chatData.msgs.unshift(msg));
  },
  destroyed() {
    socketService.emit('leave_chat_room');
    socketService.off('new_message');
  },
  methods: {
    sendMsg() {
      if (!this.msgTxt) return;
      const msg = { txt: this.msgTxt, to: this.msgTo };
      socketService.emit('send_message', msg);
      this.msgTxt = '';
      // this.msgTo = [];
    },
    isAccountInMsg(account) {
      return this.accountInMsgIdx(account) !== -1;
    },
    accountInMsgIdx(account) {
      return this.msgTo.findIndex(c => c._id === account._id);
    },
    toggleAccountToMsg(account) {
      if (this.isAccountInMsg(account)) this.msgTo.splice(this.accountInMsgIdx(account, 1));
      else this.msgTo.push(account);
    }
  },
  components: { FormInput },
}
</script>