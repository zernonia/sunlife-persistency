<template>
  <div class="home" style="max-width: 1400px">
    <h1>Persistency Table</h1>

    <h2>Nov 2019 - Oct 2020</h2>
    

    <div style="display: grid; grid-template-columns: repeat(3, 1fr); column-gap: 20px; margin-bottom: 20px;">
      <card :title="'LIMRA Projected'" :data="52" />
      <card :title="'LIMRA 2021'" :data="50" />
      <card :title="'LIMRA 2022'" :data="55" />
    </div>

    <pivot-table />

    <!-- <mob-limra :data="tableData.slice(-12)" :MA="MAData" :maxData="maxData" :lastLIMRAMOB="lastLIMRAMOB" />  -->

    <!-- <mob-calculator :data="tableData.slice(-12)" :MA="MAData" ></mob-calculator> -->

    <new-mob-target />

    <el-divider></el-divider>

    <el-space direction="vertical">
      <el-space wrap>
        <el-cascader v-model="storeFilter.selectedStaffDesignation" :options="filterStaffDesignation" placeholder="All Staff" />
        <el-cascader v-model="storeFilter.selectedProduct" :options="filterProduct" placeholder="All Products" />
        <el-cascader v-model="storeFilter.selectedLIMRA" :options="filterLIMRA" placeholder="LIMRA" />
        <el-cascader v-model="storeFilter.selectedPaymentMethod" :options="filterPaymentMethod" :props="props" collapse-tags placeholder="All Payment Method" />
        <el-button type="primary" icon="el-icon-search" @click="fetchDataByFilter" :loading="tableLoading">Search</el-button>
        <el-button icon="el-icon-download" @click="downloadDataByProducts" :loading="downloadLoading">Download Raw CSV</el-button>
        <el-switch v-model="movingAverageToggle" />
        
      </el-space>
      
      <el-space wrap>
        <el-checkbox v-model="checkedNumber">Number</el-checkbox>
        <el-checkbox v-model="checkedPercentage">Percentage</el-checkbox>
      </el-space>
    </el-space>
<!-- 
    <el-table :data="tableData" style=" width: 100%" height="700" :default-sort="{prop: 'mth_id', order: 'ascending'}" :cell-style="movingAverage" @sort-change=sortChange
    v-loading="tableLoading" :summary-method="getMA" show-summary @expand-change="expandTable">
      <el-table-column type="expand" fixed>
        <template #default="props">
          <div style="height: 300px; display: flex; flex-direction: row;">
            <p>Metric: {{ props.row.data }}</p>
            <pie-chart v-if="props.row.data" :data="props.row.data[0]" />
          </div>
        </template>  
      </el-table-column>
      <el-table-column prop="mth_id" label="Date" width="180" sortable fixed :formatter="formatToDate"></el-table-column>
      <el-table-column header-align="center" label="MOB">
        <el-table-column label="1" #default="scope" prop="sum_MOB_1" >
          <el-space wrap :size="1" :style="[ scope.row.MOB_1_perc ? '' : {color: '#23c325'} ]">
            <span v-if="checkedNumber">{{ scope.row.sum_MOB_1 ? scope.row.sum_MOB_1: scope.row.MOB_1_predict }}</span>
            <span v-if="checkedPercentage && checkedNumber" style="font-size: 10px; margin-left: 4px"> ({{ scope.row.MOB_1_perc ? scope.row.MOB_1_perc : scope.row.MOB_1_predict_perc }}%)</span>
            <span v-if="checkedPercentage && !checkedNumber">{{ scope.row.MOB_1_perc ? scope.row.MOB_1_perc : scope.row.MOB_1_predict_perc }}%</span>
          </el-space>
        </el-table-column>
        <el-table-column label="2" #default="scope" prop="sum_MOB_2">
          <el-space wrap :size="1" :style="[ scope.row.MOB_2_perc ? '' : {color: '#23c325'} ]">
            <span v-if="checkedNumber">{{ scope.row.sum_MOB_2 ? scope.row.sum_MOB_2: scope.row.MOB_2_predict }}</span>
            <span v-if="checkedPercentage && checkedNumber" style="font-size: 10px; margin-left: 4px"> ({{ scope.row.MOB_2_perc ? scope.row.MOB_2_perc : scope.row.MOB_2_predict_perc }}%)</span>
            <span v-if="checkedPercentage && !checkedNumber">{{ scope.row.MOB_2_perc ? scope.row.MOB_2_perc : scope.row.MOB_2_predict_perc }}%</span>
          </el-space>
        </el-table-column>
        <el-table-column label="3" #default="scope" prop="sum_MOB_3">
          <el-space wrap :size="1" :style="[ scope.row.MOB_3_perc ? '' : {color: '#23c325'} ]">
            <span v-if="checkedNumber">{{ scope.row.sum_MOB_3 ? scope.row.sum_MOB_3: scope.row.MOB_3_predict }}</span>
            <span v-if="checkedPercentage && checkedNumber" style="font-size: 10px; margin-left: 4px"> ({{ scope.row.MOB_3_perc ? scope.row.MOB_3_perc : scope.row.MOB_3_predict_perc }}%)</span>
            <span v-if="checkedPercentage && !checkedNumber">{{ scope.row.MOB_3_perc ? scope.row.MOB_3_perc : scope.row.MOB_3_predict_perc }}%</span>
          </el-space>
        </el-table-column>
        <el-table-column label="4" #default="scope" prop="sum_MOB_4">
          <el-space wrap :size="1" :style="[ scope.row.MOB_4_perc ? '' : {color: '#23c325'} ]">
            <span v-if="checkedNumber">{{ scope.row.sum_MOB_4 ? scope.row.sum_MOB_4: scope.row.MOB_4_predict }}</span>
            <span v-if="checkedPercentage && checkedNumber" style="font-size: 10px; margin-left: 4px"> ({{ scope.row.MOB_4_perc ? scope.row.MOB_4_perc : scope.row.MOB_4_predict_perc }}%)</span>
            <span v-if="checkedPercentage && !checkedNumber">{{ scope.row.MOB_4_perc ? scope.row.MOB_4_perc : scope.row.MOB_4_predict_perc }}%</span>
          </el-space>
        </el-table-column>
        <el-table-column label="5" #default="scope" prop="sum_MOB_5">
          <el-space wrap :size="1" :style="[ scope.row.MOB_5_perc ? '' : {color: '#23c325'} ]">
            <span v-if="checkedNumber">{{ scope.row.sum_MOB_5 ? scope.row.sum_MOB_5: scope.row.MOB_5_predict }}</span>
            <span v-if="checkedPercentage && checkedNumber" style="font-size: 10px; margin-left: 4px"> ({{ scope.row.MOB_5_perc ? scope.row.MOB_5_perc : scope.row.MOB_5_predict_perc }}%)</span>
            <span v-if="checkedPercentage && !checkedNumber">{{ scope.row.MOB_5_perc ? scope.row.MOB_5_perc : scope.row.MOB_5_predict_perc }}%</span>
          </el-space>
        </el-table-column>
        <el-table-column label="6" #default="scope" prop="sum_MOB_6">
          <el-space wrap :size="1" :style="[ scope.row.MOB_6_perc ? '' : {color: '#23c325'} ]">
            <span v-if="checkedNumber">{{ scope.row.sum_MOB_6 ? scope.row.sum_MOB_6: scope.row.MOB_6_predict }}</span>
            <span v-if="checkedPercentage && checkedNumber" style="font-size: 10px; margin-left: 4px"> ({{ scope.row.MOB_6_perc ? scope.row.MOB_6_perc : scope.row.MOB_6_predict_perc }}%)</span>
            <span v-if="checkedPercentage && !checkedNumber">{{ scope.row.MOB_6_perc ? scope.row.MOB_6_perc : scope.row.MOB_6_predict_perc }}%</span>
          </el-space>
        </el-table-column>
        <el-table-column label="7" #default="scope" prop="sum_MOB_7">
          <el-space wrap :size="1" :style="[ scope.row.MOB_7_perc ? '' : {color: '#23c325'} ]">
            <span v-if="checkedNumber">{{ scope.row.sum_MOB_7 ? scope.row.sum_MOB_7: scope.row.MOB_7_predict }}</span>
            <span v-if="checkedPercentage && checkedNumber" style="font-size: 10px; margin-left: 4px"> ({{ scope.row.MOB_7_perc ? scope.row.MOB_7_perc : scope.row.MOB_7_predict_perc }}%)</span>
            <span v-if="checkedPercentage && !checkedNumber">{{ scope.row.MOB_7_perc ? scope.row.MOB_7_perc : scope.row.MOB_7_predict_perc }}%</span>
          </el-space>
        </el-table-column>
        <el-table-column label="8" #default="scope" prop="sum_MOB_8">
          <el-space wrap :size="1" :style="[ scope.row.MOB_8_perc ? '' : {color: '#23c325'} ]">
            <span v-if="checkedNumber">{{ scope.row.sum_MOB_8 ? scope.row.sum_MOB_8: scope.row.MOB_8_predict }}</span>
            <span v-if="checkedPercentage && checkedNumber" style="font-size: 10px; margin-left: 4px"> ({{ scope.row.MOB_8_perc ? scope.row.MOB_8_perc : scope.row.MOB_8_predict_perc }}%)</span>
            <span v-if="checkedPercentage && !checkedNumber">{{ scope.row.MOB_8_perc ? scope.row.MOB_8_perc : scope.row.MOB_8_predict_perc }}%</span>
          </el-space>
        </el-table-column>
        <el-table-column label="9" #default="scope" prop="sum_MOB_9">
          <el-space wrap :size="1" :style="[ scope.row.MOB_9_perc ? '' : {color: '#23c325'} ]">
            <span v-if="checkedNumber">{{ scope.row.sum_MOB_9 ? scope.row.sum_MOB_9: scope.row.MOB_9_predict }}</span>
            <span v-if="checkedPercentage && checkedNumber" style="font-size: 10px; margin-left: 4px"> ({{ scope.row.MOB_9_perc ? scope.row.MOB_9_perc : scope.row.MOB_9_predict_perc }}%)</span>
            <span v-if="checkedPercentage && !checkedNumber">{{ scope.row.MOB_9_perc ? scope.row.MOB_9_perc : scope.row.MOB_9_predict_perc }}%</span>
          </el-space>
        </el-table-column>
        <el-table-column label="10" #default="scope" prop="sum_MOB_10">
          <el-space wrap :size="1" :style="[ scope.row.MOB_10_perc ? '' : {color: '#23c325'} ]">
            <span v-if="checkedNumber">{{ scope.row.sum_MOB_10 ? scope.row.sum_MOB_10: scope.row.MOB_10_predict }}</span>
            <span v-if="checkedPercentage && checkedNumber" style="font-size: 10px; margin-left: 4px"> ({{ scope.row.MOB_10_perc ? scope.row.MOB_10_perc : scope.row.MOB_10_predict_perc }}%)</span>
            <span v-if="checkedPercentage && !checkedNumber">{{ scope.row.MOB_10_perc ? scope.row.MOB_10_perc : scope.row.MOB_10_predict_perc }}%</span>
          </el-space>
        </el-table-column>
        <el-table-column label="11" #default="scope" prop="sum_MOB_11"> 
          <el-space wrap :size="1" :style="[ scope.row.MOB_11_perc ? '' : {color: '#23c325'} ]">
            <span v-if="checkedNumber">{{ scope.row.sum_MOB_11 ? scope.row.sum_MOB_11: scope.row.MOB_11_predict }}</span>
            <span v-if="checkedPercentage && checkedNumber" style="font-size: 10px; margin-left: 4px"> ({{ scope.row.MOB_11_perc ? scope.row.MOB_11_perc : scope.row.MOB_11_predict_perc }}%)</span>
            <span v-if="checkedPercentage && !checkedNumber">{{ scope.row.MOB_11_perc ? scope.row.MOB_11_perc : scope.row.MOB_11_predict_perc }}%</span>
          </el-space>
        </el-table-column>
        <el-table-column label="12" #default="scope" prop="sum_MOB_12">
          <el-space wrap :size="1" :style="[ scope.row.MOB_12_perc ? '' : {color: '#23c325'} ]">
            <span v-if="checkedNumber">{{ scope.row.sum_MOB_12 ? scope.row.sum_MOB_12: scope.row.MOB_12_predict }}</span>
            <span v-if="checkedPercentage && checkedNumber" style="font-size: 10px; margin-left: 4px"> ({{ scope.row.MOB_12_perc ? scope.row.MOB_12_perc : scope.row.MOB_12_predict_perc }}%)</span>
            <span v-if="checkedPercentage && !checkedNumber">{{ scope.row.MOB_12_perc ? scope.row.MOB_12_perc : scope.row.MOB_12_predict_perc }}%</span>
          </el-space>
        </el-table-column>
      </el-table-column>
    </el-table> -->

    <!-- <mob-chart :data="tableData" :MA="MAData" /> -->
  </div>

</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import * as product from '../assets/product.js'
// import mobChart from '../components/MOBChart.vue'
// import pieChart from '../components/PieChart.vue'
// import mobCalculator from '../components/MOBCalculator.vue'
// import mobLimra from '../components/MOBLimra2.vue'
import pivotTable from '../components/PivotTable.vue'
import newMobTarget from '../components/newMOBTarget.vue'
import Card from '../components/Card.vue'
import { storeFilter } from '../store/filter'

export default defineComponent({
  name: 'Home',
  components: {
    // mobChart,
    // pieChart,
    // mobCalculator,
    // mobLimra,
    pivotTable,
    newMobTarget,
    Card
  },
  setup() {
    const rawData = ref()
    const tableData = ref<any[]>([])
    const expandRowArray = ref<number[]>([])
    const MAData = ref<number[]>([])
    const maxData = ref<number[]>([])
    const lastLIMRAMOB = ref({})

    const filterProduct = computed(() => {
      if(storeFilter.selectedStaffDesignation == []) {
        return product.product 
      } else {
        return product.product.filter((item: any) => {
          return item.group.find((group: any) => group == storeFilter.selectedStaffDesignation[0]) != undefined
        })
      }
    })
    const filterPaymentMethod = product.paymentMethod
    const filterStaffDesignation = product.staffDesignation
    const filterLIMRA = product.periodLIMRA

    const tableLoading = ref(true)
    const downloadLoading = ref(true)
    const checkedNumber = ref(false)
    const checkedPercentage = ref(true)
    const movingAverageToggle = ref(false)

    const sortOrder = ref('ascending')

    const props = { multiple: true }

    const fetchAll = () => {
      fetch('./initial', {
        mode: "cors",
      }).then( async res => {
        rawData.value = await res.json()
        tableData.value = rawData.value.row
        MAData.value = rawData.value.MA
        maxData.value = rawData.value.maxData
        lastLIMRAMOB.value = rawData.value.lastLIMRAMOB
        tableLoading.value = false
        downloadLoading.value = false
      })
    }
    
    const fetchDataByFilter = () => {
      tableLoading.value = true
      downloadLoading.value = true

      if(storeFilter.selectedProduct.length || storeFilter.selectedPaymentMethod.length || storeFilter.selectedStaffDesignation.length) {

      const paymentMethodSelected = storeFilter.selectedPaymentMethod.length ? storeFilter.selectedPaymentMethod.map( item => { return item[0] } ) : product.paymentMethod.map((item: any) => {return item.value})

      fetch(`./filter`, { 
        method: 'POST', 
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product: storeFilter.selectedProduct,
          paymentMethod: paymentMethodSelected,
          staffDesignation: storeFilter.selectedStaffDesignation,
          limra: storeFilter.selectedLIMRA
        })
      })
      .then( async res => {
        rawData.value = await res.json()
        tableData.value = rawData.value.row
        MAData.value = rawData.value.MA
        maxData.value = rawData.value.maxData
        lastLIMRAMOB.value = rawData.value.lastLIMRAMOB
        tableLoading.value = false
        downloadLoading.value = false

        storeFilter.updateSearch()
        })
      } else {
        fetchAll()
      }
    }

    const downloadDataByProducts = () => {
      downloadLoading.value = true
      const productSelected = storeFilter.selectedProduct.length ? storeFilter.selectedProduct.map( item => { return item[0] } ) : product.product.map((item: any) => {return item.value})
      const paymentMethodSelected = storeFilter.selectedPaymentMethod.length ? storeFilter.selectedPaymentMethod.map( item => { return item[0] } ) : product.paymentMethod.map((item: any) => {return item.value})

      fetch(`./prepareData`, { 
        method: 'POST', 
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
          },
        body: JSON.stringify({
          product: productSelected,
          paymentMethod: paymentMethodSelected
        })
      })
      .then( async res => {
        const resData = await res.json()
        window.location.href = `http://localhost:3000/downloadData/${resData.filename}`
        downloadLoading.value = false
      })
      .catch(e => {
        console.log(e)
        downloadLoading.value = false
      })
    } 


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formatToDate = (row: any, col: any, cellVal: any, index: any) => {
      const newDate = new Date(cellVal)
      return newDate.toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
      }).slice(3)
    }

    fetchAll()


    
    const expandTable = (row: any, expand: any) => {
      const i = tableData.value.findIndex( (item: any) => item['mth_id'] == row['mth_id'])
      
      if(!expandRowArray.value.find((x: number) => x == i )) {
        const date = new Date(row.mth_id)
        const dateString = date.toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'}).slice(3).replace(/\s+/g, '')
        const paymentMethodSelected = storeFilter.selectedPaymentMethod.length ? storeFilter.selectedPaymentMethod.map( item => { return item[0] } ) : product.paymentMethod.map((item: any) => {return item.value})

        fetch(`./filterRawData`, { 
          method: 'POST', 
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            product: storeFilter.selectedProduct,
            paymentMethod: paymentMethodSelected,
            staffDesignation: storeFilter.selectedStaffDesignation,
            limra: storeFilter.selectedLIMRA,
            selectedDate: dateString
          })
        })
        .then( async res => {
          const data = await res.json()
          tableData.value[i].data = data
          expandRowArray.value.push(i)
        })
      }
    }

    return {
      rawData,
      tableData,
      MAData,
      maxData,
      lastLIMRAMOB,
      formatToDate,
      filterProduct,
      filterPaymentMethod,
      filterStaffDesignation,
      filterLIMRA,
      tableLoading,
      props,
      storeFilter,
      fetchDataByFilter,
      checkedNumber,
      checkedPercentage,
      downloadDataByProducts,
      downloadLoading,
      movingAverageToggle,
      sortOrder,
      expandTable
    }
  },
  methods:{
    movingAverage(cell: any) {
      if(this.movingAverageToggle) {
        if(this.sortOrder == "descending") {
          const calculation = cell.rowIndex - cell.columnIndex + 2
          if( calculation >= 0 && calculation < 6 && cell.columnIndex != 0 && cell.columnIndex != 1 ) {
            return 'background: #1bffc4;'
          }
        } else {
          const calculation = this.tableData.length - cell.columnIndex - cell.rowIndex + 1
          if( calculation >= 0 && calculation < 6 && cell.columnIndex != 0 && cell.columnIndex != 1 ) {
            return 'background: #1bffc4;'
          }
        }
      }
      return ''
    },
    sortChange(table: any){
      this.sortOrder = table.order
    },
    getMA() {
      if(this.movingAverageToggle){
        const MA: string[] = this.MAData.map( (item: any) => {
          return ( item.toFixed(1) + '%')
        })
        return ['','MA (%)', ...MA]
      } else { return ['@'] }
    },
  }
});
</script>

<style>
body {
  background: #d8f3ff;
}

</style>