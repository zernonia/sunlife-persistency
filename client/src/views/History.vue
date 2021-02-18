<template>
  <div>
    <h1>Persistency Calculator</h1>

    <new-mob-target @highlight="highlightData" />

    <el-divider></el-divider>

    <el-space wrap>
      <el-cascader v-model="storeFilter.selectedStaffDesignation" :options="filterStaffDesignation" placeholder="All Staff" />
      <el-cascader v-model="storeFilter.selectedProduct" :options="filterProduct" placeholder="All Products" />
      <el-cascader v-model="storeFilter.selectedLIMRA" :options="filterLIMRA" placeholder="LIMRA" />
      <el-cascader v-model="storeFilter.selectedPaymentMethod" :options="filterPaymentMethod" :props="props" collapse-tags placeholder="All Payment Method" />
      <el-switch v-model="movingAverageToggle" />
      <el-checkbox v-model="checkedNumber">Number</el-checkbox>
      <el-checkbox v-model="checkedPercentage">Percentage</el-checkbox>
    </el-space>

    <v-table ref="refTable" :data="storeData.rawData" style="margin-top: 1.5rem;"></v-table>

    <transfer style="margin-top: 1.5rem;" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, ComponentPublicInstance } from 'vue'
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
      filterPaymentMethod,
      filterStaffDesignation,
      filterLIMRA,
      storeData,
      storeFilter,
      props,
      tableLoading,
      checkedNumber,
      checkedPercentage,
      downloadLoading,
      movingAverageToggle,
      refTable,
      highlightData
    }
  }
})
</script>

<style>

</style>