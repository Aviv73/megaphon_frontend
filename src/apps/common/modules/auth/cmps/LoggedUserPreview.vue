<template>
  <div v-if="loggedUser" class="logged-user-preview flex align-center space-between gap30">
    <span>{{$t('hello')}}, {{`${loggedUser.firstName} ${loggedUser.lastName}`}}</span>
    <div class="actions-section" @click="showActionsModal = !showActionsModal" @mouseoverr="showActionsModal = true" @mouseleavee="showActionsModal = false">
      <img class="avatar" :src="require('@/apps/megaphonApp/assets/images/avatar_black.svg')" alt="">
      <div class="actions-modal" v-if="showActionsModal">
        <div class="top-like"></div>
        <button class="logout-btn" @click="logout">{{$t('auth.logout')}}</button> | 
        <router-link class="edit-btn" :to="{ name: 'AccountEditModal', params: { id: loggedUser._id } }">{{$t('auth.editUserDetails')}}</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoggedUserPreview',
  data() {
    return {
      showActionsModal: false 
    }
  },
  computed: {
    loggedUser() {
      return this.$store.getters['auth/loggedUser'];
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch('auth/logout');
      this.$router.push({ name: 'LoginPage' });
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
// .dark-theme { // MOVED
//   .logged-user-preview {
//     .avatar {
//       background-color: var(--clr-4);
//     }
//   }
// }
// .megaphon-app {
  .logged-user-preview {
    width: 100%;
    .avatar {
      width: em(30px);
      height: em(30px);
      background-color: var(--clr-0); //black
      border-radius: 50%;
    }
    .actions-section {
      position: relative;
      cursor: pointer;
      .actions-modal {
        // display: none;
        position: absolute;
        z-index: 10;
        display: flex;
        align-items: center;
        gap: em(10px);
        left: 50%;
        transform: translateX(-50%);
        bottom: calc(-100% - #{em(15px)});
        background: #fff;
        border-radius: em(5px);
        box-shadow: $light-shadow;
        padding: em(10px);
        color: #808080;
        >* {
          text-wrap: nowrap;
        }
        >*:not(.top-like):hover {
          transform: .3s;
          transform: scale(1.02);
        }
        .top-like {
          position: absolute;
          background-color: #fff;
          position: absolute;
          top: 0;
          left: 50%;
          transform: translate(-50%, -50%) rotate(45deg);

          width: em(10px);
          height: em(10px);
          // box-shadow: $light-shadow;
          z-index: -1;
        }
      }
    }
    
    
    &.to-the-right {
      .actions-section {
        .actions-modal {
          .top-like {
            // display: none;
            top: 50%;
            left: 0;
            transform: translate(-50%, -50%) rotate(45deg);
          }
          left: calc(100% + #{em(10px)});
          transform: translateY(50%);
          bottom: 50%;
        }
      }
    }
  }
// }
</style>