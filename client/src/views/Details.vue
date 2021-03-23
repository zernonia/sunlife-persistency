<template>
  <div>
    <h1>Persistency Calculator</h1>
    <el-page-header @back="$router.push('/')" content="Overall" />

    <new-mob-target ref="mobChart" @highlight="highlightData" style="margin-top: 1rem;" />

    <el-divider></el-divider>

    <selection-d-n-d></selection-d-n-d>

    <h2 class="el-page-header__content">History</h2>

    <el-timeline>
      <el-timeline-item timestamp="2018/4/12" placement="top" color="#1876d6">
        <el-card>
          <h4>Update Github template</h4>
          <p>Tom committed 2018/4/12 20:46</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="2018/4/3" placement="top" color="#1876d6">
        <el-card>
          <h4>Update Github template</h4>
          <p>Tom committed 2018/4/3 20:46</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="2018/4/2" placement="top" color="#1876d6">
        <el-card>
          <h4>Update Github template</h4>
          <p>Tom committed 2018/4/2 20:46</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, ComponentPublicInstance } from 'vue'
import newMobTarget from '../components/newMOBTargetSearch.vue'
import SelectionDND from '../components/SelectionDND.vue'


export default defineComponent({
  components: {
    newMobTarget,
    SelectionDND
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
      highlightData
    }
  }
})
</script>

<style>
.el-timeline-item__tail {
  border-left: 2px solid #1876d6;
}
</style>