<template>
  <div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; align-items: center">
      <h1 id="page-title">Persistency Calculator</h1>
      <el-select v-model="storeFilter.selectedLIMRA" placeholder="Select" style="width: 150px;">
        <el-option
          v-for="item in storeFilter.selectionLIMRA"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </div>
    <el-page-header @back="$router.push('/')" content="Overall" />

    <new-mob-target ref="mobChart" @highlight="highlightData" style="margin-top: 1rem;" :product="routeData.lastDetailRoute" :key="routeData.lastDetailRoute" />

    <el-divider></el-divider>

    <campaign :product="routeData.lastDetailRoute" :key="routeData.lastDetailRoute" />

    <el-divider></el-divider>

    <selection-d-n-d style="margin-top: 1rem;" :product="routeData.lastDetailRoute" :mob="highlightedMOB" :key="routeData.lastDetailRoute"></selection-d-n-d>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, ComponentPublicInstance, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { routeData } from '../store/route'
import newMobTarget from '../components/newMOBTargetSearch.vue'
import SelectionDND from '../components/SelectionDND.vue'
import Campaign from '../components/Campaign.vue'
import { storeFilter } from '../store/filter'

export default defineComponent({
  components: {
    newMobTarget,
    Campaign,
    SelectionDND
  },
  setup() {
    const route = useRoute()

    const data = ref()
    const refTable = ref<ComponentPublicInstance<HTMLDivElement>>()
    const props = { multiple: true }

    const tableLoading = ref(false)
    const downloadLoading = ref(false)
    const checkedNumber = ref(false)
    const checkedPercentage = ref(true)
    const movingAverageToggle = ref(false)

    const highlightedMOB = ref(0)

    const mobChart = ref<typeof newMobTarget | null>(null)

    const highlightData = (configSelected: any) => {
      console.log(configSelected);
      highlightedMOB.value = configSelected.dataPointIndex + 1
      
      if(refTable.value != null) {
        refTable.value.$el.scrollIntoView()
      }
    }

    onMounted(() => {
      routeData.updateRoute(route.params.product)
      document.getElementsByClassName('main-container')[0]?.scrollIntoView()
    })

    watch(() => route.params.product , (newVal, oldVal) => {
      if(newVal != "") {
        highlightedMOB.value = 0
        routeData.updateRoute(route.params.product)
        document.getElementsByClassName('main-container')[0]?.scrollIntoView()
      }
    }, { deep: false })
    

    return {
      data,
      props,
      tableLoading,
      checkedNumber,
      checkedPercentage,
      downloadLoading,
      movingAverageToggle,
      refTable,
      mobChart,
      highlightData,
      routeData,
      highlightedMOB,
      storeFilter
    }
  }
})
</script>

<style>
.el-timeline-item__tail {
  border-left: 2px solid #1876d6;
}
</style>