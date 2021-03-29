<template>
  <div>
    <teleport to="body">
    <div v-if="popper" @contextmenu.prevent.stop="" class="el-dropdown__popper el-popper is-light is-pure" :style="{ left: posX, top: posY }">
      <ul class="el-dropdown-menu " style="width: 150px; text-align: left;">
        <li @click="$emit('highlight', configSelected); popper = false" class="el-dropdown-menu__item">Highlight Data</li>
        <li class="el-dropdown-menu__item">Download Data</li>
      </ul>
    </div>
    </teleport>

    <div style="padding: 1rem;" class=" container">
      <h2 style="padding-left: 1rem;">{{ product }} | {{ limra }}</h2>
      <apexchart @click="popper = false" @contextmenu.prevent.stop="" type="line" height="450" :options="chartOptions" :series="series" v-if="product"></apexchart>
    </div>
    <div style="margin-top: 1rem; display: flex; justify-content: flex-end;">
      <el-form label-position="right" inline>
        <el-form-item label="Target" style="display: inline-flex;">
          <el-input-number v-model="target" @change="update" :min="0" :max="10"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchTarget('PUT')">Set</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, toRefs, watch, onMounted } from 'vue'
export default defineComponent({
  emits: ['highlight'],
  props: {
    limra: {
      type: Number,
      default: 2021
    },
    product: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { limra, product } = toRefs(props)

    const data = ref([])
    const dataOriginal = ref([])
    const dataTarget = ref([])
    const target = ref(5)
    const total = ref(0)
    const collected = ref([])
    
    const posX = ref('0px')
    const posY = ref('0px')
    const popper = ref(false)
    const configSelected = ref<any>({})

    const fetchTarget = (action: string) => {
      fetch('../target', {
        method: action,
        mode: "cors",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product: product.value,
          limra: limra.value,
          target: target.value
        })
      }).then( async res => {
        const response = await res.json()
        target.value = response[0].target
      })
    }
    
    const fetchQuery = () => {
      fetch('../main/ma', {
        method: 'POST',
        mode: "cors",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product: product.value,
          limra: limra.value
        })
      }).then( async res => {
        const response = await res.json()
        data.value = response.collectableDataArray
        collected.value = response.collectedData
        total.value = response.collectedData[0]
        dataOriginal.value = response.collectableDataArray[0]
        dataTarget.value = response.collectableDataArray[target.value]
      })
    }

    // Compute LIMRA for chart
    const limraOriginal = computed(() => {
      return dataOriginal.value.map((a) => a / total.value)
    }) 

    const limraTarget = computed(() => {
      return dataTarget.value.map((a) => a / total.value)
    }) 

    // Call Data
    onMounted(() => {
      if(product.value != '') {
        fetchTarget('POST')
        fetchQuery()
      }
    })

    // Update Target
    const update = () => {
      dataTarget.value = data.value[target.value]
    }

    // Right-Click Event
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
        colors: ['#cff1ff', '#1876d6'],
        fill: {
          type: 'solid'
        },
        stroke: {
          curve: 'smooth',
          dashArray: [0, 3]
        },
        markers: {
          size: 5 
        },
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
      fetchQuery,
      fetchTarget,
      configSelected
    }
  }
})
</script>
<style>

</style>