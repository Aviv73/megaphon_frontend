<template>
  <footer class="app-footer flex column">
    <div class="content">
      <div class="inner-container flex">
        <div class="right flex column gap30 inner-area">
          <h3>יצירת קשר</h3>
          <ul class="contact-list flex column gap10">
            <li class="contact-preview flex column gap10" v-for="(contact, idx) in contactData.contacts" :key="idx">
              <p>{{contact.title}}</p>
              <p>{{contact.phone}}</p>
              <p>{{contact.email}}</p>
              <hr v-if="idx !== contactData.contacts.length-1"/>
            </li>
          </ul>
        </div>
        <div class="left flex column gap30 inner-area">
          <h3>עוקבים ונשארים מעודכנים</h3>
          <ul class="media-list flex gap20 wrap">
            <li class="media-preview" v-for="(mediaItem, idx) in contactData.mediaItems" :key="idx">
              <a :href="mediaItem.link" target="_blank" class="flex-center gap20 height-all width-all">
                <img :src="mediaItem.img" :alt="mediaItem.name">
                <p>{{mediaItem.title}}</p>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="credits flex-center width-all inner-area">
      <div class="inner-container width-all flex align-center space-between">
        <p>עיצוב: גרייס דיזיין</p>
        <p>כל הזכויות שמורות © דבי תקשורת</p>
      </div>
    </div>
  </footer>
</template>

<script>
import { contactData } from '../../../static.data.js'
export default {
  name: "AppFooter",
  data() {
    return {
      contactData
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.default-app {
  .app-footer {
    .inner-area {
      padding: 20px;
    }
    .credits {
      // height: 60px;
      color: $layout-black;
      background-color: #F4CF7E;
    }
    
    h3 {
      color: white;
    }
  
    .content {
      background: linear-gradient(90deg, $layout-red 50%, $layout-black 50%);
      color: $light-white;
    }
    .right {
      flex: 1;
      background-color: $layout-black;
      padding-inline-start: 0;
    }
    .left {
      flex: 2;
      background-color: $layout-red;
      padding-inline-end: 0;
    }
  
    .contact-list {
      hr {
        width: 70px;
        height: 1px;
        align-self: flex-start;
        margin: 0;
        background-color: #fff;
        border: 0;
      }
    }
    .media-list {
      .media-preview {
        height: 55px;
        // width: 200px;
  
        img {
          height: 55px;
          width: 55px;
        }
        p {
          direction: ltr;
          width: 110px;
        }
      }
    }
  
  }
}
</style>