<template>
    <div class="pagination-btns flex column align-center gap20 ltr_ width-all" v-if="paginationData">
      <div class="navigator-container row-reverse flex wrap align-center space-between gap40 width-all">
        <div class="flex align-center gap5 ltr" v-if="!noLimitSelection">
          <FormInput type="select" labell="Per page:" v-model="paginationData.limit" @change="updateLimit" :items="[15,30,50,100,150,200,500]" class="align-center gap15 count-select" :listUp="true"/>
          <span class="out-of-span">/</span>
          <span class="total-span">{{total}}</span>
        </div>
        <div class="navigator">
          <div class="page-buttons" :class="{ disable: (page <= 0) }">
            <component :is="btnCmp" class="button prev-btn flex align-center_ gap5 bold_" 
              :to="getTo(+page - 1)"
              @click="routeToNewPage(+page - 1)"
            >
              <div style="font-size:1.1em">{{btnIcos[0]}}</div>
              <div>{{$t('prev')}}</div>
            </component>
          </div>
          <div class="page-num-btns">
            <template v-if="isLotsOfPages && !pagesToRender.includes(0) && isScreenWide">
              <component :is="btnCmp" class="button"
                :to="getTo(0)"
                @click="routeToNewPage(0)"
              >
                1
              </component>
              <span class="dots" v-if="(page > 3) && isScreenWide">...</span>
            </template>

            <template v-if="isScreenWide">
              <component :is="btnCmp" class="button"
                :to="getTo(pageNum)" 
                v-for="pageNum in pagesToRender" :key="pageNum"
                @click="routeToNewPage(pageNum)" 
                :class="{selected: page == pageNum, bold: page == pageNum, underline_: page == pageNum}" 
              >
                {{pageToDisplay(pageNum)}}
              </component>
            </template>
            <template v-else>
              <component :is="btnCmp" class="button" 
                :to="getTo(page)"
                :class="{selected: true, bold: true}" 
              >
                {{pageToDisplay(page)}}
              </component>
            </template>
              
            <template v-if="isLotsOfPages && !pagesToRender.includes(totalPages-1) && isScreenWide">
              <span class="dots" v-if="(page < (totalPages-1)-2) && isScreenWide">...</span>
              <component :is="btnCmp" class="button"
                :to="getTo(totalPages-1)"
                @click="routeToNewPage(totalPages-1)"
              >
                {{pageToDisplay(totalPages-1)}}
              </component>
            </template>
          </div>
          <div class="page-buttons" :class="{ disable: (totalPages <= (page+1)) }">
            <component :is="btnCmp" class="button next-btn flex align-center_ gap5 bold_"
              :to="getTo(+page + 1)"
              @click="routeToNewPage(+page + 1)"
            >
              <div>{{$t('next')}}</div>
              <div style="font-size:1.1em">{{btnIcos[1]}}</div>
            </component>
          </div>
        </div>
        <div class="ph" v-if="isScreenWide"></div>
      </div>
      <div v-if="showAllPages" class="flex align-center space-between wrap gap10">
          <component :is="btnCmp" class="button"
            v-for="pageNum in allPageNums" :key="pageNum"
            :to="getTo(pageNum)" 
            @click="routeToNewPage(pageNum)" 
            :class="{selected: page == pageNum}" 
          >
            {{pageToDisplay(pageNum)}}
          </component>
        </div>
      </div>
</template>

<script>
import FormInput from '../FormInput.vue';
export default {
  name: 'PaginationBtns',
  props: {
    value: [Object],
    total: [Number],
    // perPage: [Number],
    // initFilter: {
    //   type: Object,
    //   // required: true
    // },
    showAllPages: {
      type: Boolean,
      default: false
    },
    btnsAsLinks: {
      type: Boolean,
      default: false
    },
    noLimitSelection: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      renderPagesLimit: 7,
      paginationData: null,
      btnIcos: ['‹', '›'] || ['<', '>']
    }
  },
  created() {
    // this.filterBy = JSON.parse(JSON.stringify(this.initFilter || { pagination: { limit: this.perPage, page: this.value } }));
    this.paginationData = JSON.parse(JSON.stringify(this.value || { limit: 15, page: 0 }));
  },
  computed: {
    btnCmp() {
      if (this.btnsAsLinks) return 'router-link';
      return 'button';
    },
    isScreenWide() {
      return this.$store.getters.isScreenWide;
    },
    page() {
      return this.paginationData.page;
    },
    totalPages() {
      // return Math.ceil(this.total/this.perPage);
      // return Math.ceil(this.total/this.filterBy.pagination.limit);
      return Math.ceil(this.total/this.paginationData.limit);
    },
    isLotsOfPages() {
      return this.totalPages > this.renderPagesLimit;
    },
    allPageNums() {
      const pageNums = '0'.repeat(this.totalPages).split('').map((_, idx) => idx);
      return pageNums;
    },
    pagesToRender() {
      const { totalPages, page: currPage, isLotsOfPages, renderPagesLimit, allPageNums : pageNums } = this;
      // const pageNums = '0'.repeat(totalPages).split('').map((_, idx) => idx+1);
      
      if (!isLotsOfPages) return pageNums;
      
      const halfAmount = Math.floor(renderPagesLimit/2)

      let startIdx = currPage - halfAmount;
      if (startIdx < 0) startIdx = 0;
      else if (startIdx >= totalPages-(renderPagesLimit-1)) startIdx = totalPages-(renderPagesLimit-1);

      const endIdx = startIdx + Math.floor(( (currPage > halfAmount && currPage <= totalPages-1-halfAmount)? halfAmount*1.5 : halfAmount*2));
      // return [pageNums[startIdx]];
      return pageNums.slice(startIdx, endIdx);
    }
  },
  methods: {
    getTo(pageNum) {
      return { query: { ...this.$route.query, pagination_page: pageNum } };
    },
    pageToDisplay(pageNum) {
      return pageNum + 1;
    },
    emitFilter() {
      this.$emit('filtered', this.paginationData);
      this.$emit('input', this.paginationData);
    },
    routeToNewPage(pageNum) {
      // pageNum -= 1;
      if (pageNum < 0 || pageNum >= this.totalPages) return;
      this.paginationData.page = pageNum;
      this.emitFilter();
    },
    updateLimit(val) {
      this.paginationData.limit = val || 50;
      this.paginationData.page = 0;
      this.emitFilter();
    }
  },
  components: { FormInput }
};
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
// .dark-theme {
//   .pagination-btns {
//     button, .dots {
//       color: white;
//     }
//   }
// }
.pagination-btns {
  font-weight: 300;

  .form-input.form-input-select {
      border-bottom: em(1px) solid var(--clr-0) !important;
      width: fit-content;
      min-width: unset;
      border: 0;
      .input, .actual-input {
        border: 0;
        // width: em(80px);
        // min-width: em(80px);
      }
      min-width: unset;
      .actual-input, .head {
        // $borderColor: rgba(128, 128, 128, 0.5);
        background-color: unset !important;
      }
      .input {
        .select {
          .head {
            // background-color: unset !important;
          }
        }
      }
    }

    .navigator {
      display: flex;
      // width: 220px;
      justify-content: space-between;
      align-items: center;
      // margin: auto;
  
      gap: 25px;
  
      // width: 300px;
      width: fit-content;
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

    .button {
        display: flex;
        align-items: center;
        justify-content: center;
        // border: em(1px) solid black;
        color: var(--clr-0); // black // var(--clr-0)
        border-radius: em(5px);
        padding: 0 em(5px);
    }

    .button, span {
        min-width: em(26px);
        // min-width: em(15px);
    }

    .out-of-span {
        width: fit-content;
        min-width: unset;
    }

    .button {
        &.selected {
            color: var(--clr-4); // #0075FF
        }
    }

    .page-num-btns {
        // flex: 1;
        color: var(--clr-0); // black // var(--clr-0)
        // font-weight: 700;

        display: flex;
        align-items: center;
        gap: em(25px);
        @media (max-width: $small-screen-break) {
          gap: em(10px);

        }
        justify-content: space-around;
        
        
        .dots {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
        }
    }
}
</style>