
<template>
  <section class="dashboard-page flex column align-center space-around">
      <div class="width-all flex align-center space-between">
        <h2>{{$t('dashboard.dashboard')}}</h2>
        <button class="btn" @click="showFilterModal = !showFilterModal">{{$t('filter')}}</button>
      </div>
      <Modal @close="showFilterModal = false" v-if="showFilterModal">
        <div class="filter-modal flex column align-center gap5">
          <FormInput class="space-between width-all" type="date" labelholder="from" v-model="filterToEdit.from"/>
          <FormInput class="space-between width-all" type="date" labelholder="to" v-model="filterToEdit.to"/>
          <FormInput class="space-between width-all" type="select" labelholder="timeGroup" v-model="filterToEdit.timeGroup" :itemsMap="{day:'day', week:'week', month:'month'}"/>
          <button @click="setFilter" class="btn secondary width-content">{{$t('submit')}}</button>
        </div>
      </Modal>
      <div class="charts-container flex wrap align-center space-around">
        <div class="chart bar2-container"/>
        <div class="chart frame-container"/>
        <div class="chart line-container"/>
        <div class="chart bar3-container"/>
        <div class="chart donat-container"/>
        <div class="chart bar-container"/>
        <div class="chart disc-container"/>
        <div class="chart pi-container"/>
        <!-- <div class="chart hitmap-container"></div> -->
      </div>
  </section>
</template>

<script>
import { LineChart, BarChart, PiChart, DonatChart, DiscChart, FrameDiscChart, Heatmap } from '@/modules/common/services/AvivChart.js';
import { setDeepVal, deepIterateWithObj } from '@/modules/common/services/util.service';
import FormInput from '../../common/cmps/FormInput.vue';
import Modal from '../../common/cmps/Modal.vue';

export default {
  components: { FormInput, Modal },
    name: 'about-page',
    data() {
      return {
        charts: [],
        filter: { 
          from: Date.now() - (1000*60*60*24*7),
          to: Date.now(),
          timeGroup: 'day'
        },
        filterToEdit: null,
        showFilterModal: false
      }
    },
    mounted() {
      this.init();
    },
    destroyed() {
      this.charts.forEach(c => c.destroy());
      this.charts = [];
    },
    methods: {
      mountCharts() {
        const range = (count) => '0'.repeat(count).split('').map((_, i) => i);
        const randInt = (min = -infinity, max) => Math.floor(Math.random() * (max - min) + min);

        const labels = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
        const randData = (min = false) => range(labels.length).map(c => randInt(min? -50 : 0, 100));

        const baseOptions = () => ({ 
          // width: 1500,
          // height: 1000,
          data: [
            {tag: 'Data sample 1', vals: randData(), style: {color: '#abcdeb'}},
            {tag: 'Data sample 2', vals: randData(), style: {color: '#fdaaaa'}},
            {tag: 'Data sample 3', vals: randData(), style: {color: '#b4ffd9'}},
            {tag: 'Data sample 4', vals: randData(), style: {color: '#fcfdcd'}},
            {tag: 'Data sample 5', vals: randData(), style: {color: '#f2ddff'}},
          ], 
          labels,
          horizontal: false,
          labelsNegative: true,
          dataNegative: false,
          // width: 1000, height: 1000,
          info: {
            disable: true,
            size: 40,
            position: 'right',
            align: 'middle'
          },
          // legend: { tag: 'Chart test', align: 'start' }
        })

        this.charts = [
          new DonatChart(baseOptions(), '.donat-container'),
      
          new BarChart(baseOptions(), '.bar-container'),
          
          new BarChart({
            ...baseOptions(),
            data: [
              {tag: 'Data sample 1', vals: randData(true), style: {color: '#abcdeb'}},
              {tag: 'Data sample 2', vals: randData(true), style: {color: '#fdaaaa'}},
              {tag: 'Data sample 3', vals: randData(true), style: {color: '#b4ffd9'}},
              {tag: 'Data sample 4', vals: randData(true), style: {color: '#fcfdcd'}},
              {tag: 'Data sample 5', vals: randData(true), style: {color: '#f2ddff'}},
            ],
          }, '.bar2-container'),
          
          new BarChart({...baseOptions(), horizontal: true}, '.bar3-container'),
        
          new LineChart(baseOptions(), '.line-container'),
        
          new DiscChart(baseOptions(), '.disc-container'),
        
          new PiChart(baseOptions(), '.pi-container'),
        
          new FrameDiscChart({...baseOptions(), info: { disable: false }}, '.frame-container')
        ]
      },

      getData() {
        return this.$store.dispatch({ type: 'dashboard/loadDashboardData', filter: this.filter });
      },

      async init() {
        this.initFilter();
        this.initData();
      },

      async initData() {
        await this.getData();
        this.mountCharts();
      },


      setFilter() {
        this.filter = {...this.filterToEdit};
        this.showFilterModal = false;
      },
      initFilter() {
        const filterByToSet = JSON.parse(JSON.stringify(this.filter));
        const queryParams = this.$route.query;
        deepIterateWithObj(filterByToSet, (key, val) => {
          let valToSet = +queryParams[key];
          if (isNaN(valToSet)) valToSet = queryParams[key]
          if (queryParams[key]) setDeepVal(filterByToSet, key, valToSet, '_');
        }, '_');
        if (JSON.stringify(this.filterByToSet) === JSON.stringify(this.filter)) return;
        this.filter = filterByToSet;
      }
    },

    watch: {
      filter: {
        deep: true,
        handler(filterVal) {
          const query = {};
          deepIterateWithObj(filterVal, (key, val) => {
            if (this.$route.query[key] != val) query[key] = val;
          }, '_');
          if (Object.keys(query).length) this.$router.push({ query: { ...this.$route.query, ...query} });
          
          this.initData();
        }
      }
    }
}
</script>

<style lang="scss" scoped>
.dashboard-page {
  h2 {
    margin: 30px 0;
  }
  .charts-container {
    gap: 10px;
    .chart {
      width: 300px;
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    margin-bottom: 30px;
  }
  .filter-modal {
    width: 200px;
  }
}
</style>