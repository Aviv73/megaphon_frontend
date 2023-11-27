<template>
  <div class="about-page main-pad-y inner-container flex column gap30 height-all">

    <RoutesLocator :links="[
      {label: $t('main'), to: {name: 'ReleasePage'}/*$store.getters.mainLinkRouteTo*/ },
      {label: $t('about'), to: {name: 'AboutPage' } },
    ]"/>

    <div class="about-msg flex column gap10">
      <h1>
        אודות אגם
      </h1>
      <p>
        אגם היא הוצאת ספרים קטנה ושובבה אשר בשנים האחרונות עושה את צעדיה למרכז הבמה הספרותית בישראל. 
        <br/>
        ההקפדה על המסרים והערכים, הבררנות הבלתי מתפשרת בבחירת היוצרים, הטיפול המקצועי בחומרים - וכמובן האומץ והחדשנות שאנחנו מביאים לתוך הספרים, כל אלו הם שמציבים אותנו כיום במקום כל כך מיוחד בנוף הישראלי – וכמונו גם את הקוראים שלנו!
      </p>
    </div>

    <div class="features-section flex column gap30">
      <!-- <h2>{{$t('features')}}</h2> -->
      <ul class="flex space-between wrap gap30">
        <li class="flex column align-center gap20" v-for="(feature, idx) in features" :key="idx">
          <img :src="feature.img" :alt="feature.title">
          <div class="its-content flex column gap10">
            <p class="title">{{feature.title}}</p>
            <p class="exact-spacing">{{feature.content}}</p>
          </div>
          <p>{{feature.contactFor}}</p>
        </li>
      </ul>
    </div>
    <div class="crew-section flex column gap30">
      <h2>{{$t('theCrew')}}</h2>
      <ul class="flex align-center space-around wrap gap20">
        <li class="flex column align-center gap20" v-for="(member, idx) in crewMembers" :key="idx">
          <img :src="member.img" :alt="member.name">
          <div class="member-info flex column gap15 width-all">
            <div class="flex column gap10 width-all">
              <h3 class="name width-all">{{member.name}} - <span>{{member.role}}</span></h3>
              
            </div>
            <!-- <div class="flex column gap10">
              <h3 class="name">{{member.name}}</h3>
              <p>{{member.role}}</p>
            </div> -->
            <!-- <p>{{member.contactFor}}</p> -->
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import RoutesLocator from '../../release/cmps/agam_RoutesLocator.vue'
import { crewMembers, features } from '../../../static.data.js'
export default {
  components: { RoutesLocator },
  name: 'agam_About',
  data() {
    return { crewMembers, features }
  } 
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.agam-app {
  .about-page {
    .routes-locator {
      // margin-inline-start: 60px;
    }
    h2 {
      color: $layout-red;
      // margin-inline-start: 60px;
      font-weight: bold;
    }
    .about-msg {
      // margin-inline-start: 60px;
      // max-width: 60%;
      p {
        line-height: 2em;
      }
    }
    .crew-section, .features-section {
      li {
        text-align: center;
        min-width: 240px;
        width: 240px;
        img {
          width: 240px;
          height: 240px;
          border-radius: 50%;
          // border: 8px solid $layout-red;
          border: 0px solid $layout-red;
        }
      }
    }
    .crew-section {
      li {
        .name {
          color: $layout-red;
          p {
            color: $light-gray;
          }
        }
        
        .member-info {
          // width: 150px;
          span {
            color: $light-gray;
          }
        }
      }
    }
    .features-section {
      padding-top: 120px;
      h2 {
        margin-bottom: 100px;
      }
      li {
        height: auto;
        flex: 1;
        position: relative;
        border-radius: 10px;
        color: $light-white;
        .title {
          color: white;
        }
        img {
          border-color: white;
          position: absolute;
          top: 0;
          transform: translateY(-50%);
        }
        .its-content {
          margin-top: 120px;
          padding: 20px;
          line-height: 1.3em;
        }
        &:first-child {
          background-color: $layout-red;
        }
        &:nth-child(2) {
          color: black;
          .title {
            color: black;
          }
          background-color: #F4CF7E;
        }
        &:nth-child(3) {
          background-color: #699FBA;
        }
        @media (max-width: $small-screen-breake) {
          min-width: 300px;
          &:not(:last-child) {
            margin-bottom: 100px;
          }
        }
      }
    }
  }
}
</style>