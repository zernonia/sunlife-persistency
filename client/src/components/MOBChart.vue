<template>
  <apexchart type="line" height="750" width="100%" :options="chartOptions" :series="series"></apexchart>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, PropType } from 'vue'
export default defineComponent({
  props: {
    data: {
      type: Object as PropType<any[]>,
      required: true
    },
    MA: {
      type: Object as PropType<number[]>,
      required: true
    }
  },
  setup(props){
    const { data } = toRefs(props)

    const formatToDate = (val: number) => {
      const newDate = new Date(val)
      return newDate.toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
      }).slice(3)
    }

    const computeMOBArray = (MOB: number) => {
      const temp: any[] = []
      data.value.forEach( (item: any) => {
        if(item[`MOB_${ MOB }_perc`]) {
          temp.push(item[`MOB_${ MOB }_perc`])
        } else {
          temp.push(null)
        }
      })
      return temp
    }

    const computeMOBArrayPrediction = (MOB: number) => {
      const temp: any[] = []
      data.value.forEach( (item: any, index: number) => {
        if(item[`MOB_${ MOB }_predict_perc`]) {
          temp[index - 1] ? '' : temp[index -1] = (data.value[index - 1][`MOB_${ MOB }_perc`])
          temp.push(item[`MOB_${ MOB }_predict_perc`])
        } else {
          temp.push(null)
        }
      })
      return temp
    }

    const MOB3Array = computed(() => computeMOBArray(3))
    const MOB6Array = computed(() => computeMOBArray(6))
    const MOB9Array = computed(() => computeMOBArray(9))
    const MOB12Array = computed(() => computeMOBArray(12))
    const MOB3ArrayPredicted = computed(() => computeMOBArrayPrediction(3))
    const MOB6ArrayPredicted = computed(() => computeMOBArrayPrediction(6))
    const MOB9ArrayPredicted = computed(() => computeMOBArrayPrediction(9))
    const MOB12ArrayPredicted = computed(() => computeMOBArrayPrediction(12))

    const label = computed(() => {
      const temp: any[] = []
      data.value.forEach( (item: any) => {
        temp.push(formatToDate(item.mth_id))
      })
      return temp
    })

    const series = computed(() => {
      return [{
        name: 'MOB 3',
        data: MOB3Array.value
      },
      {
        name: 'MOB 6',
        data: MOB6Array.value
      },
      {
        name: 'MOB 9',
        data: MOB9Array.value
      },
      {
        name: 'MOB 12',
        data: MOB12Array.value
      },
      {
        name: 'MOB 3 Prediction',
        data: MOB3ArrayPredicted.value
      },
      {
        name: 'MOB 6 Prediction',
        data: MOB6ArrayPredicted.value
      },
      {
        name: 'MOB 9 Prediction',
        data: MOB9ArrayPredicted.value
      },
      {
        name: 'MOB 12 Prediction',
        data: MOB12ArrayPredicted.value
      },
    ]
    })

    const chartOptions = computed(() => {
      return { chart: {
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight',
          dashArray: [0,0,0,0,5,5,5,5]
        },
        xaxis: {
          categories: label.value
        },
        colors: ['#26a0fc','#d7efe1','#febc3b','#ff6178','#26a0fc','#d7efe1','#febc3b','#ff6178']
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