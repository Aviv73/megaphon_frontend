<template>
  <div class="pagination-btns">
    <div class="page-buttons" :class="{ disable: page <= 1 }">
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
    <div class="page-buttons" :class="{ disable: totalPages <= page }">
      <button @click="routeToNewPage(+page + 1)">
        >
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    perPage: [Number],
    total: [Number],
    value: [Number]
  },
  data() {
    return {
      renderPagesLimit: 7
    }
  },
  computed: {
    page() {
      return this.value + 1;
    },
    totalPages() {
      return Math.ceil(this.total/this.perPage);
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
    routeToNewPage(pageNum) {
      pageNum -= 1;
      if (pageNum < 0 || pageNum >= this.totalPages) return;
      this.$emit('input', pageNum);
    },
  },
};
</script>

<style lang="scss" scoped>
.pagination-btns {
    display: flex;
    // width: 220px;
    justify-content: space-between;
    align-items: center;
    margin: auto;

    gap: 25px;

    // width: 300px;
    width: fit-content;

    .disable {
        opacity: 0.5;
    }

    button {
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid black;
        color: black;
        border-radius: 5px;
        padding: 0 5px;
    }

    button, span {
        min-width: 15px;
    }

    .page-num-btns {
        // flex: 1;
        color: black;
        font-weight: 700;

        display: flex;
        align-items: center;
        gap: 25px;
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