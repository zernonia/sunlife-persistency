<template>
  <el-card class="box-card" style="flex-grow: 1">
    <template #header>
      <h3 style="padding: 0; margin: 0;">{{ title }}</h3>
    </template>
    <apexchart :options="chartOptions" :series="series"></apexchart>
    <span style="position: absolute; top: 10px; right: 20px;">Target: 32</span>
  </el-card>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
export default defineComponent({
  props: {
    title: String
  },
  setup(){
    const series = computed(() => {
      return [
      {
        name: "Low - 2013",
        type: 'area',
        data: [65, 61, 60, 55, 49, 45, 39, 37, 35, 32]
      },
      {
        name: "High - 2013",
        type: 'area',
        data: [65, 61, 59, 54, 49, 43, 36, 32, 32, 28]
      }
      ]
    })

    const chartOptions = computed(() => {
      return {
        chart: {
          stacked: false,
          zoom: {
            enabled: false
          },
          sparkline: {
            enabled: true
          },
        },
        stroke: {
          curve: 'smooth',
          dashArray: [3, 0]
        },
        colors: ['#77b7f8', '#409EFF'],
        fill: {
          type: 'gradient',
          gradient: {
            type: "vertical",
            shadeIntensity: 0,
            opacityFrom: 0.6,
            opacityTo: 0,
            stops: [0, 100]
          }
        },
        tooltip: {
          fixed: {
            enabled: false
          },
          x: {
            show: false
          },
          y: {
            title: {
              formatter: function () {
                return ''
              }
            }
          },
          marker: {
            show: true
          }
        }
      }
    })

    return {
      series,
      chartOptions
    }
  }
})
</script>

<style>

</style>