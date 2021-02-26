<template>
  <el-card class="box-card" style="flex-grow: 1" >
    <template #header>
      <div style="display: flex; justify-content: space-between;">
        <h3 style="padding: 0; margin: 0;">{{ title }}</h3>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="20" style="color: #1876d6; cursor: pointer;" height="20" viewBox="0 0 24 24" stroke="currentColor" @click="$router.push(`/details/${ product }`)">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </div>
    </template>
    <apexchart :options="chartOptions" :series="series"></apexchart>
  </el-card>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue'
export default defineComponent({
  props: {
    title: String,
    product: String,
    data: {
      type: Object,
      default: () => ({
        collectedData: [],
        collectableDataArray: []
      })
    }
  },
  setup(props){
    const { data } = toRefs(props)
    const dataOriginal = computed(() => data.value.collectableDataArray[0] || [])
    const dataTarget =  computed(() => data.value.collectableDataArray[5] || [])
    const total = computed(() => data.value.collectedData[0] || [])
    const collected = computed(() => data.value.collectedData[5] || [])

    const limraOriginal = computed(() => {
      return dataOriginal.value.map((a: number) => a / total.value)
    }) 

    const limraTarget = computed(() => {
      return dataTarget.value.map((a: number) => a / total.value)
    }) 

    const series = computed(() => {
      return [
      {
        name: 'Static',
        type: 'area',
        data: limraOriginal.value
      },
      {
        name: 'Target',
        type: 'line',
        data: limraTarget.value
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
          dashArray: [0, 3]
        },
        colors: ['#cff1ff', '#1876d6'],
        fill: {
          type: 'solid'
        },
        // fill: {
        //   type: 'gradient',
        //   gradient: {
        //     type: "vertical",
        //     shadeIntensity: 0,
        //     opacityFrom: 0.6,
        //     opacityTo: 0,
        //     stops: [0, 100]
        //   }
        // },
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
            },
            formatter: function (val: any) {
              return Math.round(val * 1000) / 10 + '%'
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