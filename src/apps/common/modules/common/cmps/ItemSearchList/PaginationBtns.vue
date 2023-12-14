<template>
    <div class="pagination-btns">
      <FormInput type="select" labell="Per page:" v-model="filterBy.pagination.limit" @change="updateLimit" :items="[15,30,50,100,150,200]" class="align-center gap15" :listUp="true"/>
      <div class="page-buttons" :class="{ disable: (page <= 1) }">
        <button @click="routeToNewPage(+page - 1)">
          <
        </button>
      </div>
      <div class="page-num-btns">
        <template v-if="isLotsOfPages && !pagesToRender.includes(1)">
          <button @click="routeToNewPage(1)">1</button>
          <span class="dots" v-if="page > 3">...</span>
        </template>

        <button 
          v-for="pageNum in pagesToRender" :key="pageNum"
          @click="routeToNewPage(pageNum)" 
          :class="{selected: page == pageNum}" 
        >
          {{pageNum}}
        </button>
          
        <template v-if="isLotsOfPages && !pagesToRender.includes(totalPages)">
          <span class="dots" v-if="page < totalPages-2">...</span>
          <button @click="routeToNewPage(totalPages)">{{totalPages}}</button>
        </template>
      </div>
      <div class="page-buttons" :class="{ disable: (totalPages <= page) }">
        <button @click="routeToNewPage(+page + 1)">
          >
        </button>
      </div>
    </div>
</template>

<script>
import FormInput from '../FormInput.vue';
export default {
  name: 'PaginationBtns',
  props: {
    perPage: [Number],
    total: [Number],
    value: [Number],
    initFilter: {
      type: Object,
      // required: true
    }
  },
  data() {
    return {
      renderPagesLimit: 7,
      filterBy: null
    }
  },
  created() {
    this.filterBy = JSON.parse(JSON.stringify(this.initFilter || { pagination: { limit: this.perPage, page: this.value } }));
  },
  computed: {
    page() {
      return this.value + 1;
    },
    totalPages() {
      // return Math.ceil(this.total/this.perPage);
      return Math.ceil(this.total/this.filterBy.pagination.limit);
    },
    isLotsOfPages() {
      return this.totalPages > this.renderPagesLimit;
    },
    pagesToRender() {
      const { totalPages, page: currPage, isLotsOfPages, renderPagesLimit } = this;
      const pageNums = '0'.repeat(totalPages).split('').map((_, idx) => idx+1);
      
      if (!isLotsOfPages) return pageNums;
      
      const halfAmount = Math.floor(renderPagesLimit/2)

      let startIdx = currPage - halfAmount;
      if (startIdx < 0) startIdx = 0;
      else if (startIdx >= totalPages-(renderPagesLimit-1)) startIdx = totalPages-(renderPagesLimit-1);

      const endIdx = startIdx + Math.floor(( (currPage > halfAmount && currPage <= totalPages-1-halfAmount)? halfAmount*1.5 : halfAmount*2));
      return pageNums.slice(startIdx, endIdx);
    }
  },
  methods: {
    emitFilter() {
      this.$emit('filtered', this.filterBy);
      this.$emit('input', this.filterBy.pagination.page);
    },
    routeToNewPage(pageNum) {
      pageNum -= 1;
      if (pageNum < 0 || pageNum >= this.totalPages) return;
      this.filterBy.pagination.page = pageNum;
      this.emitFilter();
    },
    updateLimit(val) {
      this.filterBy.pagination.limit = val;
      this.filterBy.pagination.page = 0;
      this.emitFilter();
    }
  },
  components: { FormInput }
};
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.dark-theme {
  .pagination-btns {
    button, .dots {
      color: white;
    }
  }
}
.pagination-btns {
    .form-input.form-input-select {
      // border-bottom: em(1px) solid black;
      .input {
        width: em(80px);
        min-width: em(80px);
      }
    }

    display: flex;
    // width: em(220px);
    justify-content: space-between;
    align-items: center;
    margin: auto;

    gap: em(25px);

    // width: em(300px);
    width: fit-content;

    .disable {
        opacity: 0.5;
    }

    button {
        display: flex;
        align-items: center;
        justify-content: center;
        // border: em(1px) solid black;
        color: black;
        border-radius: em(5px);
        padding: 0 em(5px);
    }

    button, span {
        min-width: em(26px);
        // min-width: em(15px);
    }

    .page-num-btns {
        // flex: 1;
        color: black;
        font-weight: 700;

        display: flex;
        align-items: center;
        gap: em(25px);
        justify-content: space-around;
        
        button {
            &.selected {
                color: #0075FF;
            }
        }
        .dots {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
        }
    }
}
</style>