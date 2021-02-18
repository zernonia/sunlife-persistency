<template>
  <div id="chart">
    <apexchart type="radialBar" :height="height" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue'
export default defineComponent({
  props: {
    data: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 300
    }
  },
  setup(prop){
    const { data } = toRefs(prop) 
    const series = computed(() => {
      return [data.value.toFixed(1)]
    })
    const chartOptions = computed(() => {
      return {
        chart: {
        type: "radialBar"
      },  
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          hollow: {
            margin: 15,
            size: "70%"
          },
          dataLabels: {
            showOn: "always",
            name: {
              offsetY: -35,
              show: true,
              color: "#888",
              fontSize: "15px"
            },
            value: {
              offsetY: -10,
              color: "#111",
              fontSize: "30px",
              show: true
            }
          }
        }
      },
      stroke: {
        lineCap: "round",
      },
      labels: ["LIMRA"]
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