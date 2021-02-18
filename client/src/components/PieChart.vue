<template>
  <apexchart width="400" height="400" :series="series" :options="chartOptions" />
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs } from 'vue'
export default defineComponent({
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { data } = toRefs(props)
    const series = computed( () => {
      return Object.values(data.value)
    })
    const chartOptions = computed( () => {
      return {
        chart: {
            type: 'pie',
          },
          labels: Object.keys(data.value),
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }]
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