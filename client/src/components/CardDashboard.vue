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
    <div style="position: relative;">
      <apexchart :options="chartOptions" :series="series"></apexchart>
      <div class="small-card">
        <div>
          <div style="height: 8px; width: 8px; border-radius: 100%; background-color: #1876d6; margin-right: 5px;"></div>
          <span>{{ Math.round(limraTarget[12]*1000)/10 || 0 }}%</span>
        </div>
        <div>
          <div style="height: 8px; width: 8px; border-radius: 100%; background-color: #06c0ff; margin-right: 5px;"></div>
          <span>{{ Math.round(limraOriginal[12]*1000)/10 || 0 }}%</span>
        </div>
        <div>
          <i class="el-icon-caret-top" style="padding: 0;color: #29b30b; margin-right: 3px; transform: scale(1.2); margin-left: -2px;"></i>
          <span>3.0%</span>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue'

interface Target {
  product: string;
  limra: number;
  target: number;
}

export default defineComponent({
  props: {
    title: String,
    product: String,
    target: {
      type: Array,
      default: () => ([])
    },
    data: {
      type: Object,
      default: () => ({
        collectedData: [],
        collectableDataArray: []
      })
    }
  },
  setup(props){
    const { data, target } = toRefs(props)
    const dataOriginal = computed(() => data.value.collectableDataArray[0] || [])
    const getTarget = computed(() => {
      const obj = target.value[0] as Target
      if(obj) {
        return obj['target']
      } else {
        return 5
      }
    })
    const dataTarget =  computed(() => data.value.collectableDataArray[getTarget.value] || [])
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
        name: 'Target',
        type: 'line',
        data: limraTarget.value
      },
      {
        name: 'Static',
        type: 'area',
        data: limraOriginal.value
      },
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
        colors: ['#1876d6','#06c0ff'],
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
            formatter: function (val: any) {
              return `MOB ${ val }`
            }
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
      chartOptions,
      limraOriginal,
      limraTarget
    }
  }
})
</script>

<style>
.small-card {
  font-size: 12px;
  position: absolute; 
  top: 0; 
  right: 0;
  display: flex;
  flex-direction: column;
  background-color: #ffffffdb;
  padding: 0.5rem;
  border-radius: 5px;
}
.small-card > div {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 2px 0;
}
</style>