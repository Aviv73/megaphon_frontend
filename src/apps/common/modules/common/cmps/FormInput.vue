<template>
  <section class="form-input" :class="{ 'show-error': showError, ['form-input-' + type]: true }">
    <label class="label" :for="inputId" v-if="label || labelholder">
      <p>{{ $t(label || labelholder) }}</p>
      <span class="require-span" v-if="required" :style="{ opacity: isEmpty ? 1 : 0 }">*</span>
    </label>
    <div
      ref="elInputContainer"
      class="input"
      :class="{
        [type]: true,
        empty: isEmpty,
        [(iconPos && 'icon-' + iconPos) || '']: true,
      }"
    >
      <input
        class="actual-input"
        v-if="['input', 'autocomplete'].includes(componentType)"
        :list="componentType === 'autocomplete' ? 'autocomplete-datalist-' + this.inputId : ''"
        ref="elInput"
        :disabled="disabled"
        :id="inputId"
        :required="required"
        :min="min"
        :max="max"
        :placeholder="$t(placeholder || labelholder)"
        :type="componentType === 'autocomplete' ? 'text' : type"
        v-model="val"
        :step="step"
        :accept="accept"
      />
      <textarea
        class="actual-input"
        v-else-if="componentType === 'textarea'"
        ref="elInput"
        :disabled="disabled"
        :id="inputId"
        :required="required"
        :placeholder="$t(placeholder || labelholder)"
        v-model="val"
      />

      <select
        class="actual-input"
        v-else-if="componentType === '_select'"
        ref="elInput"
        :disabled="disabled"
        :id="inputId"
        :required="required"
        :placeholder="$t(placeholder || labelholder)"
        v-model="val"
        @change="$emit('change', val)"
      >
        <template v-if="itemsToRender.length">
          <option
            v-for="item in itemsToRender"
            :key="item.label"
            :value="item.value"
            :labellll="$t(item.label)"
            :selected="val === item.value"
          >
            <span>{{$t(item.label)}}</span>
            <span v-if="item.img" :style="{backgroundImage: item.img}" :src="item.img"></span>
          </option>
        </template>
        <option v-else @click.prevent.stop="">No data</option>
      </select>

      <div
        v-else-if="['select', 'multiselect'].includes(componentType)"
        ref="elInput"
        :id="inputId"
        :class="{ open: isOpen }"
        @blur="closeDropDown"
        class="select actual-input"
      >
        <div v-if="isOpen" @click="autoCloseSelect" class="blur"></div>
        <div @click="isOpen = !isOpen" style="height:100%;display:flex;align-items:center;gap:10px" class="head" >
          <div class="toggle-btn"></div>
          <div class="head-content">
            <template v-if="componentType === 'multiselect'">
              <input type="text" v-if="showVals" v-model="valsFilterStr" :placeholder="$t(placeholder)" @click.stop="isOpen = true"/>
              <span class="placeholder" v-else-if="!showVals || (showVals & !val?.length)">{{ $t(placeholder || labelholder) }}</span>
              <ul class="multiselect-vals-list" v-if="showVals && val?.length">
                <li v-for="curr in val.filter(Boolean)" :key="curr">
                  <span :title="curr">{{subValName(gatValToShowForMultiSelect(curr))}}</span>
                  <button @click.stop="val.splice(val.findIndex(c => c === curr) ,1)">x</button>
                </li>
                <li class="clear-li">
                  <button class="clear-btn" @click.stop="val = []">x</button>
                </li>
              </ul>
              <!-- <div class="inner-square"></div> -->
              <!-- {{ $t(val) }} -->
            </template>
            <template v-else>
              <div class="selected-preview" v-if="!itemsToRender.find(c => c.value === val)"><span>{{ $t(placeholder || labelholder) }}</span></div>
              <div class="selected-preview flex align-center gap20" v-else>
                <span>{{$t(itemsToRender.find(c => c.value === val)?.label || val)}}</span>
                <img v-if="itemsToRender.find(c => c.value === val)?.img" :src="itemsToRender.find(c => c.value === val)?.img"/>
              </div>
            </template>
          </div>
        </div>
        <div class="drop-down flex column" @click.stop="" :class="{'direction-up': listUp}">
          <template v-if="itemsToRender?.length">
            <template v-if="componentType === 'multiselect'">
              <label class="gap5" v-for="item in itemsToRender" :key="item.label" :class="{selected: val === item.value}">
                <input
                  v-if="componentType === 'multiselect'"
                  type="checkbox"
                  id="formCheckbox"
                  v-model="val"
                  :value="item.value"
                  :disabled="disabled"
                />
                <span>{{ $t(item.label) }}</span>
              </label>
            </template>
            <template v-else>
              <div class="flex align-center space-between gap30 drop-down-item" v-for="item in itemsToRender" :key="item.label" @click="item.disabled? () => {} : (val = item.value, autoCloseSelect())"  :class="{selected: val === item.value}">
                <span>{{ $t(item.label) }}</span>
                <img v-if="item.img" :src="item.img"/>
              </div>
            </template>
          </template>
          <p v-else class="width-all text-center justify-center">No data</p>
        </div>
      </div>

      <template v-else-if="['file'].includes(componentType)">
        <input
          class="actual-input"
          type="file"
          ref="elInput"
          :disabled="disabled"
          :id="inputId"
          :required="required"
          :placeholder="$t(placeholder || labelholder)"
          :accept="accept"
          @change="$event => val = $event.target.files"
          hidden
        />
        <button
          class="btn primary mid file-btn"
          @click="$refs.elInput.click()"
        >{{$t(placeholder || labelholder)}}
        </button>
      </template>

      <div v-else-if="['radio'].includes(componentType)" class="flex column gap10 align-start options-container">
        <label v-for="item in itemsToRender" :key="item.label" class="flex align-center gap5">
          <input type="radio" :value="item.value" v-model="val">
          <span>{{item.label}}</span>
        </label>
      </div>

      <VuePhoneNumberInput
        default-country-code="IL"
        v-else-if="componentType === 'phone-number'"
        class="ltr actual-input"
        ref="elInput"
        :disabled="disabled"
        :id="inputId"
        :required="required"
        :placeholder="$t(placeholder || labelholder)"
        v-model="val"
      />

      <datalist v-if="componentType === 'autocomplete'" :id="'autocomplete-datalist-' + this.inputId">
        <option v-for="item in itemsToRender" :key="item.value" :value="item.value" :label="item.label"/>
      </datalist>

      <template>
        <!-- <div class="icon-container" @click="$refs.elInput.$el.querySelector('input').focus()" v-if="$slots.default || showError"> -->
        <div class="icon-container" @click="$refs.elInput.focus()" v-if="$slots.default || showError">
          <slot v-if="$slots.default"/>
        </div>
        <Tooltip class="icon-container" v-if="error" :msg="error">
          <template v-slot:preview>
            <img class="icon-img" :src="require('@/assets/images/icons/red_exclamation_mark.png')" alt="">
          </template>
        </Tooltip>
      </template>
    </div>
  </section>
</template>

<script>
import { getRandomId, padNum } from '../services/util.service';
import Tooltip from './Tooltip.vue';

import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';

const inputTypes = [
  'text',
  'number',
  'textarea',
  'password',
  'checkbox',
  'color',
  'date'
];

export default {
  components: { Tooltip, VuePhoneNumberInput },
  name: 'FormInput',
  props: {
    label: { required: false, default: '', type: String },
    placeholder: { required: false, type: String, default: '' },
    labelholder: { required: false, type: String, default: '' },
    type: { required: false, type: String, default: 'text' },
    items: { required: false, type: Array, default: () => [] },
    itemsMap: { required: false, type: Object, default: () => {} },
    id: { required: false, type: String, default: '' },
    disabled: { required: false, type: Boolean, default: false },
    required: { required: false, type: Boolean, default: false },
    value: { required: true, type: null },
    iconPos: { type: String, required: false, default: '' },
    showError: { type: Boolean, required: false, default: false },
    min: { type: Number, required: false, default: -Infinity },
    max: { type: Number, required: false, default: Infinity },
    step: { required: false, type: Number, default: 0 },
    accept: { required: false, type: String, default: '' },
    
    showVals: { required: false, type: Boolean, default: false },
    showActualValues: { required: false, type: Boolean, default: false },
    listUp: { required: false, type: Boolean, default: false },

    error: { required: false, type: String, default: '' },

    debug: { required: false, type: Boolean, default: false },
    reactive: { required: false, type: Boolean, default: false },
  },
  data() {
    return {
      val: this.value,
      inputId: this.id || getRandomId(),
      isOpen: false,

      valsFilterStr: '',
      didInit: false,
      dontEmit: false,
    };
  },
  created() {
    if (this.type === 'multiselect') {
      if (!Array.isArray(this.value)) {
        this. val = [];
      }
    }
    if (this.componentType === 'select') {
      // if (!this.val) this.val = '';
      // else this.val = this.val?.value || this.val;
      // if (!this.val || typeof this.val === 'string') this.val = { value: this.value || '', label: this.value || '' };  
      // else 
      this.val = this.val?.value || this.val;
    }
    if (this.type === 'date') {
      const date = new Date(this.val || undefined);
      this.val = `${date.getFullYear()}-${padNum(date.getMonth()+1)}-${padNum(date.getDate())}`;
    }
  },
  computed: {
    componentType() {
      const { type } = this;
      if (type === 'multiselect') return 'multiselect';
      if (type === 'search') return 'search';
      if (type === 'textarea') return 'textarea';
      if (inputTypes.includes(type)) return 'input';
      return type;
    },
    itemsToRender() {
      const filterItems = c => this.type === 'multiselect'? c.label?.toLowerCase?.().includes(this.valsFilterStr.toLowerCase()) : true;
      if (this.itemsMap) {
        const res = [];
        // for (let key in this.itemsMap) res.push({ label: this.itemsMap[key], value: key });
        for (let key in this.itemsMap) res.push({ label: key, value: this.itemsMap[key] });
        return res.filter(filterItems);
      }
      return this.items.map((item) => {
        if (typeof item !== 'object') {
          return { value: item, label: item };
        }
        return item;
      }).filter(filterItems);
    },
    isEmpty() {
      if (
        this.type === 'number' &&
        (this.val < this.min || this.val > this.max)
      )
        return true;
      return !this.val && this.val !== 0;
    },
  },
  methods: {
    autoCloseSelect() {
      this.isOpen = false;
    },

    closeDropDown(e) {
      if(!e.relatedTarget || e.relatedTarget.id !== 'formCheckbox') {
        this.isOpen = false
      } else {
        e.target.focus()
      }
    },

    gatValToShowForMultiSelect(val) {
      return this.itemsToRender.find(c => c.value === val)?.label;
      // if (!this.showActualValues) return val;
      // return this.itemsToRender.find(c => c.value === val)?.label;
    },
    subValName(name = '') {
      let sub = name.slice(0, 8);
      if (sub.length < name.length) sub += '..';
      return sub
    }
  },
  watch: {
    val: {
      deep: true,
      handler(val, prev) {
        if (val === prev) return;
        if (this.dontEmit) return;
        if (this.type === 'number') {
          const { min, max } = this;
          if (typeof min === 'number' && val < min) this.val = min;
          if (typeof max === 'number' && val > max) this.val = max;
          val = +val;
        }
        this.$emit('input', val);
        this.$emit('change', val);
      },
    },

    value(val, prev) {
      if (this.didInit && !this.reactive) return; // TODO; MAKE SURE IT IS NOT NEEDED;
      if (val === prev) return;
      if (!this.didInit) this.dontEmit = true;
      this.val = val;
      this.dontEmit = false;
      this.didInit = true;
    },
  },
};
</script>


<style lang="scss">
@import '@/assets/styles/global/index';
// @import '@/assets/styles/setup/variables';
.form-input {
  // height: em(40px);
  // min-width: em(150px);
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: em(5px);
  // border-bottom: em(1px) solid gray;
  label {
    p {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .input {
    position: relative;
    height: 100%;
    &:not(.checkbox):not(.radio) {
      flex: 1;
    }
    input, select, textarea {
      // border: unset;
      height: 100%;
      width: 100%;
      margin: 0;
      resize: none;

      &[type="checkbox"] {
        width: em(15px);
        height: em(15px);
      }

      &[type="color"] {
        width: em(70px);
        height: em(40px);
      }
    }
    textarea {
      height: em(100px);
    }

    [type="checkbox"], select, option {
      &:hover:not(:disabled) {
        cursor: pointer;
      }
    }
    option {
      color: black;
    }
  }

  .icon-container {
    position: absolute;
    top: 50%;
    left: em(5px);
    transform: translateY(-50%);
    .icon-img, .tooltip-preview, .tooltip {
      width: em(18px);
      height: em(18px);
    }
  }
}

.form-input-multiselect, .form-input-select {
  // width: em(220px);
  color: #606266;
  height: 100%;
  display: flex;
  align-items: center;
  .selected-preview {
    display: flex;
    align-items: center;
    // color: $gray-700;
    font-weight: 400;
    padding-left: em(8px);
    height: 100%;
  }
  $borderColor: rgba(128, 128, 128, 0.5);
  box-sizing: border-box;
  .input {
    
    min-width: em(180px);
    min-height: em(25px);
    // width: 100%;
    flex: 1;
    // height: 100%;
    .select {
      cursor: pointer;
      height: 100%;
      .head {
        height: 100%;
        .head-content {
          height: 100%;
        }
      }

      .blur {
        position: fixed;
        top: 0;
        right: 0;
        width: 100vw;
        height: 100vh;
        z-index: 4;
        cursor: pointer !important;
      }
    }
    > div {
      user-select: none;
      background-color: #fff;
      font-weight: 400;
      display: flex;
      align-items: center;
      // padding: 0 em(5px);
      width: 100%;
      // height: 100%;
      border: em(1px) solid $borderColor;
      border-radius: em(3px);
      position: relative;
      .toggle-btn,
      .inner-square {
        border-left: em(5px) solid transparent;
        border-right: em(5px) solid transparent;
        border-bottom: em(5px) solid #c5c6cd;
        color: rgb(96, 98, 102);
        // position: absolute;
        // right: em(14px);
        // bottom: 50%;
        // transform: translateY(50%) rotate(180deg);
        transform: rotate(180deg);
        transition: 0.2s;
        // z-index: 1;
        &:hover {
          cursor: pointer;
        }
      }
      .inner-square {
        top: em(11px);
        border-bottom: em(5px) solid white;
      }
      .drop-down {
        height: 0;
        overflow: hidden;
        // overflow: auto;
        max-height: em(500px);
        background-color: #fff;
        min-width: calc(100% + em(2px));
        width: fit-content;
        position: absolute;
        padding: em(6px) 0;
        top: 100%;
        &.direction-up {
          top: unset !important;
          bottom: 100%;
        }
        left: -em(1px);
        opacity: 0;
        transform: translateY(em(3px));
        z-index: -1;
        transition: opacity 0.3s;
        box-shadow: 0px 0px em(5px) em(3px) rgba(0, 0, 0, 0.2);
        border-radius: em(4px);
        > * {
          // height: em(32px);
          // line-height: em(34px);
          &:not(:last-child) {
            border-bottom: em(1px) solid rgb(210, 210, 210);
          }
          display: flex;
          // align-items: center;
          // gap: em(5px);
          padding: em(5px) em(20px);
          cursor: pointer;
          &:hover {
            background-color: #f5f7fa;
          }
        }

      }
      &.open {
        .toggle-btn,
        .inner-square {
          transform: translateY(50%) rotate(0deg);
        }
        .drop-down {
          opacity: 1;
          z-index: 5;
          top: calc(100% + #{em(12px)});
          height: unset;
          overflow: auto;
        }
      }
    }
    
    img {
      width: em(50px);
      height: em(50px);
      object-fit: contain;
      background-color: rgb(206, 206, 206);
    }
  }

  .head {
    padding: em(5px);
    display: flex;
    // flex-direction: column;
    gap: em(2px);
    width: 100%;
    .head-content {
      width: 100%;
      input {
        width: 100%;
      }
      display: flex;
      flex-direction: column;
      gap: em(5px);

      .clear-li {
        background-color: rgb(255, 109, 109);
        border-radius: 50%;
        width: em(20px);
        height: em(20px);
        padding: 0;
        button {
          width: 100%;
          height: 100%;
        }
      }
      
    }
  }

  .multiselect-vals-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: em(5px);

    li {
      // width: em(50px);
      height: em(20px);
      border-radius: em(5px);
      padding: em(5px);
      color: white;
      background-color: #2090D4;
      font-size: em(12px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: em(5px)
    }
  }
}
</style>