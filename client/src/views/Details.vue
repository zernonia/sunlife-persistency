<template>
  <div>
    <h1>Persistency Calculator</h1>
    <el-page-header @back="$router.push('/')" content="Overall" />

    <new-mob-target ref="mobChart" @highlight="highlightData" style="margin-top: 1rem;" />

    <el-divider></el-divider>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, ComponentPublicInstance } from 'vue'
import newMobTarget from '../components/newMOBTargetSearch.vue'


export default defineComponent({
  components: {
    newMobTarget
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

    const highlightData = () => {
      if(refTable.value != null) {
        refTable.value.$el.scrollIntoView()
      }
    }

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
    }
  }
})
</script>

<style>

</style>