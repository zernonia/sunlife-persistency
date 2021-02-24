<template>
  <div>
    <teleport to="body">
    <div v-if="popper" @contextmenu.prevent.stop="" class="el-dropdown__popper el-popper is-light is-pure" :style="{ left: posX, top: posY }">
      <ul class="el-dropdown-menu " style="width: 150px; text-align: left;">
        <li @click="$emit('highlight'); popper = false" class="el-dropdown-menu__item">Highlight Data</li>
        <li class="el-dropdown-menu__item">Download Data</li>
      </ul>
    </div>
    </teleport>

    <div style="padding: 1rem;" class=" container">
      <h2 style="padding-left: 1rem;">DMTM 2021</h2>
      <apexchart @click="popper = false" @contextmenu.prevent.stop="" type="line" height="450" :options="chartOptions" :series="series"></apexchart>
    </div>
    <div  style="margin-top: 1rem; display: flex; justify-content: flex-end;">
      <el-form label-position="right">
        <el-form-item label="Set Target" style="display: inline-flex;">
          <el-input-number v-model="target" @change="update" :min="0" :max="10"></el-input-number>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
export default defineComponent({
  emits: ['highlight'],
  setup() {
    const data = ref([])
    const dataOriginal = ref([])
    const dataTarget = ref([])
    const target = ref(0)
    const total = ref(0)
    const collected = ref([])
    
    const posX = ref('0px')
    const posY = ref('0px')
    const popper = ref(false)
    const configSelected = ref<any>({})

    // Fetch Data
    const fetchAll = () => {
      fetch('./ma', {
        mode: "cors",
      }).then( async res => {
        const response = await res.json()
        data.value = response.collectableDataArray
        collected.value = response.collectedData
        total.value = response.collectedData[0]
        dataOriginal.value = response.collectableDataArray[0]
        dataTarget.value = response.collectableDataArray[0]
      })
    }

    const limraOriginal = computed(() => {
      return dataOriginal.value.map((a) => a / total.value)
    }) 

    const limraTarget = computed(() => {
      return dataTarget.value.map((a) => a / total.value)
    }) 

    // Call Data
    fetchAll()

    // Update Target
    const update = () => {
      dataTarget.value = data.value[target.value]
    }

    //
    const clickEvent = (event: any, chartContext: any, config: any) => {
      if(event.which == 3) {
      console.log({event, chartContext, config});
        popper.value = !popper.value
        posX.value = event.pageX + 'px'
        posY.value = event.pageY + 'px'
        configSelected.value = config
      }
    }

    // X-axis label
    const MOBLabel = computed(() => {
      const temp: string[] = []
      for(let i = 1; i <= 13; i ++) {
        temp.push(`MOB ${i}`)
      }
      return temp
    })
    

    // Computed Series 
    const series = computed(() => {
      return [
      {
        name: 'Static',
        type: 'line',
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
          events:{
            dataPointSelection: clickEvent
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function (val: any, opts: any) {
            return Math.round(val * 1000) / 10 + '%'
          }
        },
        stroke: {
          dashArray: [0, 3]
        },
        markers: {
          size: 5 
        },
        colors: ['#77b7f8', '#409EFF'],
        yaxis: {
          max: 1,
          labels: {
            formatter: function (val: any) {
              return (val * 100).toFixed(0) + '%';
            },
          },
        },
        xaxis: {
          categories: MOBLabel.value
        },
        tooltip: {
          y: {
            formatter: function (val: any, opts: any) {
              if(opts.seriesIndex == 0) {
                return Math.round(val * 1000) / 10 + '% | Collectable: ' + Math.round(dataOriginal.value[opts.dataPointIndex] - collected.value[opts.dataPointIndex])
              } else {
                return Math.round(val * 1000) / 10 + '% | Collectable: ' + Math.round(dataTarget.value[opts.dataPointIndex] - collected.value[opts.dataPointIndex]) + `<span style="color: orange; font-weight: 600;"> (+${ Math.round(dataTarget.value[opts.dataPointIndex] - collected.value[opts.dataPointIndex]) - Math.round(dataOriginal.value[opts.dataPointIndex] - collected.value[opts.dataPointIndex]) })</span>`              
              }
            }
          }
        }
      }
    })
    
    return {
      series,
      chartOptions,
      target,
      update,
      posX,
      posY,
      popper,
    }
  }
})
</script>
<style>

</style>