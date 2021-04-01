<template>
  <div>
    <h1>Persistency Calculator</h1>

    <el-space wrap>
      <el-select v-model="storeFilter.selectedStaffDesignation" placeholder="Select Staff Designation" @change="updateStaffDesignation" >
        <el-option v-for="item in filterStaffDesignation" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="storeFilter.selectedProduct" placeholder="Select Products">
        <el-option v-for="item in filterProduct" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="storeFilter.selectedLIMRA" placeholder="Select LIMRA">
        <el-option v-for="item in filterLIMRA" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button type="primary" @click="search" >Search</el-button>
    </el-space>

    <el-divider></el-divider>

    <new-mob-target ref="mobChart" @highlight="highlightData"  />

    <v-table ref="refTable" :data="storeData.rawData" style="margin-top: 1rem;"></v-table>

    <transfer style="margin-top: 1.5rem;" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, ComponentPublicInstance } from 'vue'
import Table from '../components/Table.vue'
import newMobTarget from '../components/newMOBTarget.vue'
import Transfer from '../components/Transfer.vue'
import { storeData } from '../store/data'
import { storeFilter } from '../store/filter'
import * as product from '../assets/product.js'


export default defineComponent({
  components: {
    'v-table': Table,
    newMobTarget,
    Transfer
  },
  setup() {
    const data = ref()
    const refTable = ref<ComponentPublicInstance<HTMLDivElement>>()
    const props = { multiple: true }

    const tableLoading = ref(false)
    const downloadLoading = ref(false)
    const checkedNumber = ref(false)
    const checkedPercentage = ref(true)
    const movingAverageToggle = ref(false)

    const mobChart = ref<typeof newMobTarget | null>(null)

    const updateStaffDesignation = () => {
      storeFilter.selectedProduct = ''
      storeFilter.selectedLIMRA = 0
    }

    const search = () => {
      if(mobChart.value != null) {
        mobChart.value.fetchQuery()
      }
    }

    const filterProduct = computed(() => {
      if(storeFilter.selectedStaffDesignation == '') {
        return product.product 
      } else {
        return product.product.filter((item: any) => {
          return item.group.find((group: any) => group == storeFilter.selectedStaffDesignation) != undefined
        })
      }
    })
    const filterLIMRA = product.periodLIMRA
    const filterStaffDesignation = product.staffDesignation

    // fetch Data
    const fetchAll = () => {
      fetch('./filterRawDataAll', {
        mode: "cors",
      }).then( async res => {
        const response = await res.json()
        storeData.populateData(response)
      })
    }

    // Call Data
    fetchAll()
      
    const highlightData = () => {
      if(refTable.value != null) {
        refTable.value.$el.scrollIntoView()
      }
    }

    return {
      data,
      filterProduct,
      filterLIMRA,
      filterStaffDesignation,
      storeData,
      storeFilter,
      updateStaffDesignation,
      props,
      tableLoading,
      checkedNumber,
      checkedPercentage,
      downloadLoading,
      movingAverageToggle,
      refTable,
      mobChart,
      highlightData,
      search
    }
  }
})
</script>

<style>

</style>