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
      />
      <textarea
        v-else-if="componentType === 'textarea'"
        ref="elInput"
        :disabled="disabled"
        :id="inputId"
        :required="required"
        :placeholder="$t(placeholder || labelholder)"
        v-model="val"
      />

      <select
        v-else-if="componentType === 'select'"
        ref="elInput"
        :disabled="disabled"
        :id="inputId"
        :required="required"
        :placeholder="$t(placeholder || labelholder)"
        v-model="val"
        @change="$emit('change', val)"
      >
        <option
          v-for="item in itemsToRender"
          :key="item.label"
          :value="item.value"
          :label="$t(item.label)"
          :selected="val.value === item.value"
        />
      </select>

      <div
        v-else-if="componentType === 'multiselect'"
        ref="elInput"
        tabindex="0"
        :id="inputId"
        :class="{ open: isOpen }"
        @click="isOpen = !isOpen"
        @blur="closeDropDown"
      >
        <div style="height:100%;display:flex;align-items:center" class="head" >
          <span class="placeholder">{{ $t(placeholder || labelholder) }}</span>
          <div class="toggle-btn"></div>
          <div class="inner-square"></div>
        </div>
        <div class="drop-down" @click.stop="">
          <label v-for="item in itemsToRender" :key="item.label">
            <input
              type="checkbox"
              id="formCheckbox"
              :value="val[item.value]"
              v-model="val[item.value]"
              :disabled="disabled"
            />
            <span>{{ $t(item.label) }}</span>
          </label>
        </div>
      </div>

      <datalist v-if="componentType === 'autocomplete'" :id="'autocomplete-datalist-' + this.inputId">
        <option v-for="item in itemsToRender" :key="item.value" :value="item.value" :label="item.label"/>
      </datalist>

      <template>
        <!-- <div class="icon-img" @click="$refs.elInput.$el.querySelector('input').focus()" v-if="$slots.default || showError"> -->
        <div class="icon-img" @click="$refs.elInput.focus()" v-if="$slots.default || showError">
          <slot/>
        </div>
      </template>
    </div>
  </section>
</template>

<script>
import { getRandomId, padNum } from '../services/util.service';

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
  },
  data() {
    return {
      val: this.value,
      inputId: this.id || getRandomId(),
      isOpen: false,
    };
  },
  created() {
    if (this.componentType === 'select') {
      if (!this.val) this.val = '';
      // if (!this.val || typeof this.val === 'string') this.val = { value: this.value || '', label: this.value || '' };  
      else this.val = this.val?.value || this.val;
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
      if (this.itemsMap) {
        const res = [];
        for (let key in this.itemsMap) res.push({ label: this.itemsMap[key], value: key });
        return res;
      }
      return this.items.map((item) => {
        if (typeof item !== 'object') {
          return { value: item, label: item };
        }
        return item;
      });
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
    closeDropDown(e) {
      if(!e.relatedTarget || e.relatedTarget.id !== 'formCheckbox') {
        this.isOpen = false
      } else {
        e.target.focus()
      }
    }
  },
  watch: {
    val: {
      deep: true,
      handler(val) {
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
      if (val === prev) return;
      this.val = val;
    },
  },
};
</script>


<style lang="scss">
// @import '@/assets/styles/setup/variables';
.form-input {
  // height: 40px;
  // min-width: 150px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 5px;
  .input {
    position: relative;
    input, select, textarea {
      height: 100%;
      width: 100%;
      margin: 0;
      resize: none;

      &[type="checkbox"] {
        width: 15px;
        height: 15px;
      }
    }
    textarea {
      height: 100px;
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

  .icon-img {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }
}

.form-input-multiselect {
  // width: 220px;
  color: #606266;
  .placeholder {
    // color: $gray-700;
    font-weight: 400;
    padding-left: 8px;
  }
  $borderColor: rgba(128, 128, 128, 0.5);
  box-sizing: border-box;
  .input {
    > div {
      user-select: none;
      background-color: #fff;
      font-weight: 400;
      display: flex;
      align-items: center;
      padding: 0 5px;
      width: 100%;
      height: 100%;
      border: 1px solid $borderColor;
      border-radius: 3px;
      position: relative;
      .toggle-btn,
      .inner-square {
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 5px solid #c5c6cd;
        color: rgb(96, 98, 102);
        position: absolute;
        right: 14px;
        bottom: 50%;
        transform: translateY(50%) rotate(180deg);
        transition: 0.2s;
        z-index: 2;
        &:hover {
          cursor: pointer;
        }
      }
      .inner-square {
        top: 11px;
        border-bottom: 5px solid white;
      }
      .drop-down {
        background-color: #fff;
        min-width: calc(100% + 2px);
        width: fit-content;
        position: absolute;
        padding: 6px 0;
        top: 100%;
        left: -1px;
        opacity: 0;
        transform: translateY(3px);
        z-index: -1;
        transition: opacity 0.3s;
        box-shadow: 0px 0px 5px 3px rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        > * {
          height: 32px;
          line-height: 34px;
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 0 20px;
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
          z-index: 1;
          top: calc(100% + 12px);
        }
      }
    }
  }
}
</style>