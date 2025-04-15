<template>
  <span class="tooltip">
    <span ref="elPreview" class="tooltip-preview flex align-center justify-center" @click="toggleShow" @mouseleave="toggleHoverShow(false)" @mouseover="toggleHoverShow(true)">
      <img class="tooltip-img" v-if="!$slots.preview" :src="require('@/assets/images/icons/tooltip.png')" alt="" />
      <!-- <span v-if="!$slots.preview">(?)</span> -->
      <slot v-else name="preview"/>

      <!-- <span v-if="!$slots.preview" class="default-preview flex align-center justify-center">?</span>
      <slot v-else name="preview"/> -->
    </span>
    <div v-show="show || hoverShow" ref="elMsg" class="tooltip-msg">
      <button v-if="show" class="btn_ small close-btn" @click="toggleShow(false)">✖</button>
      <p v-if="!$slots.content">{{ msg? $t(msg) : 'No tooltip message...' }}</p>
      <slot v-else name="content"/>
    </div>
  </span>
</template>

<script>
import { getElPosOnScreen, getElPosInParent } from '../services/util.service';
export default {
  name: 'Tooltip',
  props: {
    msg: {
      type: String, required: false,
      default: ''
    },
    attachToElement: {
      type: [String, HTMLElement],
      required: false,
      default: 'body'
    }
  },
  data() {
    return {
      show: false,
      hoverShow: false
    }
  },
  
  methods: {
    toggleShow(val) {
      this.show = typeof val === 'boolean'? val : !this.show;
      if (this.show) this.viewMsg();
      else this.hoverShow = false;
    },
    toggleHoverShow(val) {
      this.hoverShow = typeof val === 'boolean'? val : !this.hoverShow;
      if (this.hoverShow) this.viewMsg();
    },
    handleHover(ev) {
      // this.toggleHoverShow(true);
      this.hoverShow = true;
      this.viewMsg(ev);
    }, 
    viewMsg(ev) {
      // if (this.show || this.hoverShow) return;

      const { elPreview, elMsg } = this.$refs;
      const { offsetWidth: preWidth, offsetHeight: preHeight } = elPreview;
      let { offsetWidth: msgWidth, offsetHeight: msgHeight } = elMsg;
      const { offsetWidth: parentWidth, offsetHeight: parentHeight } = (this.attachToElement instanceof HTMLElement? this.attachToElement : document.querySelector(this.attachToElement));

      const elPreviewPos = getElPosInParent(elPreview, this.attachToElement);

      // const { clientX, clientY } = ev? ev : { clientX: elPreviewPos.x, clientY: elPreviewPos.y };

      const style = {};
      style.left = style.right = style.bottom = style.top = style.width = style.transform = '';
      
      let width = 280;
      const height = msgHeight || 100;

      // style.left = 0;
      style.left = preWidth/2;
      let diffXFromBorder;
      if ((parentWidth - elPreviewPos.x) < width) {
        style.left -= width
        diffXFromBorder = elPreviewPos.x - width;
      } else diffXFromBorder = elPreviewPos.x + width;
      if (diffXFromBorder < 0) style.left -= diffXFromBorder;
      else if (diffXFromBorder > parentWidth) style.left += diffXFromBorder;
      else style.left += preWidth / 2;
      style.left += 'px';
      
      // style.top = 0;
      style.top = preHeight/2;
      // let diffYFromBorder;
      if ((parentHeight - elPreviewPos.y) < height) {
        // style.top -= preHeight
        style.top -= height;
        // diffYFromBorder = elPreviewPos.y - preHeight;
      // } else diffYFromBorder = elPreviewPos.y + preHeight;
      }
      // diffYFromBorder = parentHeight - elPreviewPos.y;

      // if (diffYFromBorder < 0) style.top += diffYFromBorder;
      // else style.top -= diffYFromBorder;
      // else style.top += preHeight / 2;
      style.top += 'px';

      // const windowWidth = window.innerWidth;

      // if ((width*1.5) > windowWidth) {
      if ((width*1.5) > parentWidth) {
        // style.width = '95vw';
        style.width = 0.90*parentWidth + 'px';
        style.left = parentWidth / 2 - elPreviewPos.x + 'px';
        style.transform = 'translateX(-50%)';
      } else style.width = width + 'px';


      for (let key in style) elMsg.style[key] = style[key];
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/global/index';
.tooltip {
  // position: relative;
  // z-index: 1000;
  position: relative;
  // z-index: 1;
  display: inline-block;
  // z-index: 1;
  // widows: em(15px);
  // height: em(15px);
  .tooltip-preview {
    display: inline-block;
    width: fit-content;
    height: fit-content;
    // cursor: pointer;
    cursor: help;
    .tooltip-img {
      width: em(17px);
      height: em(17px);
      // padding: 0.em(5px);
      border-radius: 50%;
      background-color: #fff;
      // height: 100%;
      // width: 100%;
    }
  }
  .tooltip-msg {
    position: absolute;
    z-index: 1000;
    width: em(280px);
    padding: em(20px);
    line-height: 1.3;
    background-color: #5a5a5a;
    color: #ffffff;
    box-shadow: 0 em(5px) em(13px) 0 #44444478;
    font-weight: normal;

    .close-btn {
      position: absolute;
      top: em(5px);
      right: em(5px);
      line-height: 1em;
    }
  }

  // .default-preview {
  //     height: 1em;
  //     width: 1em;
  //     font-size: 0.8em;
  // }
}
</style>