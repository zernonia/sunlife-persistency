<template>
  <el-space wrap>
    <teleport to="body">
    <div v-if="popper" class="el-dropdown__popper el-popper is-light is-pure" :style="{ left: posX, top: posY }">
      <ul class="el-dropdown-menu " style="width: 150px; text-align: left;">
        <li @click="viewDataEvent" class="el-dropdown-menu__item">View Data</li>
        <li @click="downloadRawData" class="el-dropdown-menu__item">Download Data</li>
      </ul>
    </div>
    </teleport>

    <el-space direction="vertical">
      <el-input-number disabled v-model="MOB3" @change="calculateProjection(0)" :min="0" :max="100"></el-input-number>
      <el-input-number disabled v-model="MOB6" @change="calculateProjection(6)" :min="0" :max="100"></el-input-number>
      <el-input-number disabled v-model="MOB9" @change="calculateProjection(9)" :min="0" :max="100"></el-input-number>
      <el-input-number v-model="MOB12" @change="calculateProjection(12)" :min="0" :max="100"></el-input-number>
    </el-space>

    <el-dialog :title="`MOB ${MOBSelected}`" v-model="viewData" width="70%" top="8vh">
      <el-table :data="rawDataPagination" height="60vh" style="width: 100%;" @selection-change="handleSelectionChange" v-loading="loading">
        <el-table-column
          type="selection"
          :selectable="rowSelectable"
          width="55">
        </el-table-column>
        <el-table-column
          prop="policy_no"
          label="Policy No."
          width="180">
        </el-table-column>
        <el-table-column
          prop="status_cd"
          label="Status"
          width="180">
        </el-table-column>
        <el-table-column
          prop="Pol_Inception_Dt"
          label="Inception Date">
        </el-table-column>
        <el-table-column>
          <template #default="props">
            <el-rate disabled
              v-model="randomizer">
            </el-rate>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="margin-top: 1rem;" background layout="prev, pager, next" :total="totalPage" :current-page="page" @current-change="pageEvent" >
      </el-pagination>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="viewData = false">Cancel</el-button>
          <el-button type="primary" @click="sendMsg">Send Message</el-button>
          <el-button type="primary" plain @click="downloadRawData">Download CSV</el-button>
        </span>
      </template>
    </el-dialog>

    <apexchart @click="popper = false" @contextmenu.prevent.stop="" class="el-dropdown-link" ref="limra" type="line" height="450" width="900" :options="chartOptions" :series="series"></apexchart>

  </el-space>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, toRefs, ref, watch  } from 'vue'
import { storeFilter } from '../store/filter'
import { storeAction } from '../store/action'
import * as product from '../assets/product.js'

declare global {
  interface Window {
    ApexCharts: any;
  }
}


export default defineComponent({
  props: {
    data: {
      type: Object as PropType<any[]>,
      required: true
    },
    MA: {
      type: Object as PropType<number[]>,
      required: true
    },
    maxData: {
      type: Object as PropType<number[]>,
      required: true
    },
    lastLIMRAMOB: {
      type: Object,
      required: true
    }
  },
  setup(prop, context) {
    const { data, MA, maxData, lastLIMRAMOB } = toRefs(prop)
    const MOB3 = ref(80)
    const MOB6 = ref(80)
    const MOB9 = ref(80)
    const MOB12 = ref(80)
    const MOB3Fixed = ref(80)
    const MOB6Fixed = ref(80)
    const MOB9Fixed = ref(80)
    const MOB12Fixed = ref(80)

    const posX = ref('0px')
    const posY = ref('0px')
    const popper = ref(false)
    const viewData = ref(false)
    const loading = ref(false)
    const configSelected = ref<any>({})
    const MOBSelected = ref(0)

    const rawData = ref([])
    const page = ref(1)
    const totalPage = computed(() => {
      return Math.ceil(rawData.value.length / 20)
    })
    const rawDataPagination = computed(() => {
      return rawData.value.slice((page.value - 1)*20, page.value*20 )
    })
    const rowSelected = ref([])
    const pageEvent = (val: number) => {
      page.value = val
    }

    const collectedData = computed(() => {
      const temp: any = {
        MOB_1: 0,
        MOB_2: 0,
        MOB_3: 0,
        MOB_4: 0,
        MOB_5: 0,
        MOB_6: 0,
        MOB_7: 0,
        MOB_8: 0,
        MOB_9: 0,
        MOB_10: 0,
        MOB_11: 0,
        MOB_12: 0,
        MOB_13: 0
      }
      data.value.forEach((item: any) => {
        for(let i = 1; i <= 13; i++) {
          temp[`MOB_${i}`] += item[`sum_MOB_${i}`]
        }
      })
      return Object.values(temp) as any[]
    })

    const total = computed(() => {
      return collectedData.value[0]
    })

    const actualRawData = computed(() => {
      const temp: any = {
        MOB_1: 0,
        MOB_2: 0,
        MOB_3: 0,
        MOB_4: 0,
        MOB_5: 0,
        MOB_6: 0,
        MOB_7: 0,
        MOB_8: 0,
        MOB_9: 0,
        MOB_10: 0,
        MOB_11: 0,
        MOB_12: 0,
        MOB_13: 0
      }

      data.value.forEach((item: any) => {
        for(let i = 1; i <= 13; i++) {
          temp[`MOB_${i}`] += item[`sum_MOB_${i}`]
        }
      })

      return Object.values(temp) as number[]
    })

    const actualData = computed(() => {
      const temp: any = {
        MOB_1: 0,
        MOB_2: 0,
        MOB_3: 0,
        MOB_4: 0,
        MOB_5: 0,
        MOB_6: 0,
        MOB_7: 0,
        MOB_8: 0,
        MOB_9: 0,
        MOB_10: 0,
        MOB_11: 0,
        MOB_12: 0,
        MOB_13: 0
      }
      data.value.forEach((item: any) => {
        for(let i = 1; i <= 13; i++) {
          if(item[`sum_MOB_${i}`] == 0) {
            temp[`MOB_${i}`] = null
          } else {
            temp[`MOB_${i}`] += item[`sum_MOB_${i}`]
          }
        }
      })

      const tempArray = Object.values(temp).map( (item: any) => {
        if(item == null) {
          return null
        } else {
          return item / total.value * 100
        }
      })
      
      return tempArray
    })

    const collectableRawData = computed(() => {
      const modifiedMA = MA.value.slice(1)
      const tempMA: number[] = []
      for(let i = 0; i < 13; i++) {
        const calculation = Math.round(modifiedMA[i] * maxData.value[i] / 100)
        if(i == 0) {
          tempMA.push(calculation)
        } else {
          tempMA.push(calculation + Math.round(tempMA[i - 1] * modifiedMA[i] / 100) )
        }
        
      }
      return tempMA
    })

    const projection = computed(() => {
      const temp: any[] = []
      MA.value.forEach((ma: any, index: number) => {
        if(actualData.value[index] != null) {
          temp.push(null)
          return
        } else
        if(temp[index - 1] == null) {
          temp[index - 1] = actualData.value[index - 1]
        }
        const calculation = collectableRawData.value[index - 1] + actualRawData.value[index]
        temp.push(calculation / actualRawData.value[0] * 100)
      })
      MOB3.value = temp[2]
      MOB6.value = temp[5]
      MOB9.value = temp[8]
      MOB12.value = temp[11]
      MOB3Fixed.value = temp[2]
      MOB6Fixed.value = temp[5]
      MOB9Fixed.value = temp[8]
      MOB12Fixed.value = temp[11]

      return temp
    })

    const targetProjection = ref<number[]>([])

    const calculateProjection = (mob: number) => {
      const difference = MOB12.value - MOB12Fixed.value 
      if(mob == 0) {
        targetProjection.value = projection.value
      } else {
        const temp: any[] = []
        MA.value.forEach((ma: any, index: number) => {
          if(actualData.value[index] != null) {
            temp.push(null)
            return
          } else
          if(temp[index - 1] == null) {
            temp[index - 1] = actualData.value[index - 1]
          }
          const calculation = collectableRawData.value[index - 1] + actualRawData.value[index] + difference
          temp.push(calculation / actualRawData.value[0] * 100)
        })

        targetProjection.value = temp
      }
    }

    watch(data, (newVal: any, oldVal: any) => {
      calculateProjection(0)
    })

    const MOBLabel = computed(() => {
      const temp: string[] = []
      for(let i = 1; i <= 13; i ++) {
        temp.push(`MOB ${i}`)
      }
      return temp
    })

    // Click Event when clicking on Line Chart
    const clickEvent = (event: any, chartContext: any, config: any) => {
      console.log({event, chartContext, config});
      if(event.which == 3) {
        popper.value = !popper.value
        posX.value = event.x + 'px'
        posY.value = event.y + 'px'
        configSelected.value = config
      }
    }

    // Event for View Raw Data
    const viewDataEvent = () => {
      loading.value = true
      popper.value = false
      viewData.value = true
      MOBSelected.value = configSelected.value.w.globals.labels[configSelected.value.dataPointIndex]
      const paymentMethodSelected = storeFilter.selectedPaymentMethod.length ? storeFilter.selectedPaymentMethod.map( item => { return item[0] } ) : product.paymentMethod.map((item: any) => {return item.value})

      fetch(`./filterRawData`, { 
        method: 'POST', 
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product: storeFilter.searchedProduct,
          paymentMethod: paymentMethodSelected,
          staffDesignation: storeFilter.searchedStaffDesignation,
          limra: storeFilter.searchedLIMRA,
          mob: MOBSelected.value
        })
      })
      .then( async(res: any) => {
        const response = await res.json()
        rawData.value = response
        loading.value = false
      })
    }

    const downloadRawData = () => {
      popper.value = false
      MOBSelected.value = configSelected.value.w.globals.labels[configSelected.value.dataPointIndex]
      const paymentMethodSelected = storeFilter.selectedPaymentMethod.length ? storeFilter.selectedPaymentMethod.map( item => { return item[0] } ) : product.paymentMethod.map((item: any) => {return item.value})

      fetch(`./filterRawDataDownload`, { 
        method: 'POST', 
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product: storeFilter.searchedProduct,
          paymentMethod: paymentMethodSelected,
          staffDesignation: storeFilter.searchedStaffDesignation,
          limra: storeFilter.searchedLIMRA,
          mob: MOBSelected.value
        })
      })
      .then( async(res: any) => {
        const resData = await res.json()
        window.location.href = `http://localhost:3000/downloadData/${resData.filename}`
      })
    }


    const rowSelectable = (row: any, index: number) => {
      if(storeAction.policyNo.findIndex((item: any) => item == row.policy_no) != -1) {
        return false
      } else {
        return true
      }
    }

    const handleSelectionChange = (val: any) => {
      rowSelected.value = val
    }

    const sendMsg = () => {
      viewData.value = false
      storeAction.sendMessage(rowSelected.value)
    }

    // ------------------------------ Chart Options ------------------------------------//

    const series = computed(() => {
      return [
      {
        name: "MOB",
        type: 'line',
        data: projection.value
      },
      {
        name: "Target",
        type: 'line',
        data: targetProjection.value
      },
      {
        name: "Actual Data",
        type: 'line',
        data: actualData.value
      }
      ]
    })

    const chartOptions = computed(() => {
      return {
        chart: {
          id: 'limra',
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          },
          events:{
            dataPointSelection: clickEvent
          }
        },
        dataLabels: {
          enabled: true,
          formatter: (val: any, opts: any) => {
            if(opts.seriesIndex == 3) return 
            if(val == null) return 
            return ( val.toFixed(1) + '%' ) 
          }
        },
        stroke: {
          show: true,
          width: 5,
          dashArray: [5,5,0,0]
        },
        markers: {
          size: 5 
        },
        colors: ['#2E93fA', '#66DA26', '#E1E1E1','#AARRGGBB'],
        xaxis: {
          categories: MOBLabel.value
        },
        yaxis: {
          min: () => { 
            if(projection.value[12]) {
              return Math.floor(projection.value[12]/ 5 ) * 5 
            } else 
            if(actualData.value[12]) {
              return Math.floor(actualData.value[12]/ 5 ) * 5 
            }
          },
          max: 100,
          labels: {
            formatter: (val: any) => {
              if(val) {
                return val.toFixed(0) + '%' 
              } else return
            }
          }
        },
        tooltip: {
          y: {
            formatter: (val: any, opts: any) => {
              if(opts.seriesIndex == 3 ) return val
              if(val == null) return
              return (val.toFixed(1) + '%')
            }
          }
        },
        annotations: {
          points: [
            { 
              x: 'MOB 3',
              y: lastLIMRAMOB.value.mob3,
              label: {
                text: `${ Number(storeFilter.searchedLIMRA[0]) - 1 }: ${ lastLIMRAMOB.value.mob3 }%`
              }
            },
            { 
              x: 'MOB 6',
              y: lastLIMRAMOB.value.mob6,
              label: {
                text: `${ Number(storeFilter.searchedLIMRA[0]) - 1 }: ${ lastLIMRAMOB.value.mob6 }%`
              }
            },
            { 
              x: 'MOB 9',
              y: lastLIMRAMOB.value.mob9,
              label: {
                text: `${ Number(storeFilter.searchedLIMRA[0]) - 1 }: ${ lastLIMRAMOB.value.mob9 }%`
              }
            },
            { 
              x: 'MOB 12',
              y: lastLIMRAMOB.value.mob12,
              label: {
                text: `${ Number(storeFilter.searchedLIMRA[0]) - 1 }: ${ lastLIMRAMOB.value.mob12 }%`
              }
            },
          ]
        }
      }
    })

    return {
      series,
      chartOptions,
      MOBLabel,
      MOB3,
      MOB6,
      MOB9,
      MOB12,
      actualData,
      actualRawData,
      clickEvent,
      posX,
      posY,
      popper,
      viewData,
      viewDataEvent,
      rawData,
      MOBSelected,
      handleSelectionChange,
      rowSelectable,
      sendMsg,
      storeAction,
      downloadRawData,
      loading,
      collectableRawData,
      projection,
      calculateProjection,
      page,
      rawDataPagination,
      totalPage,
      pageEvent
    }
  },
  computed: {
    randomizer() {

      return Math.floor(Math.random() * (6 - 1 + 1) + 1)
    }
  }
})
</script>

<style>
div.el-dialog__body {
  padding: 10px 20px;
}
div.el-table__header-wrapper > table > thead > tr > th.el-table_1_column_1.el-table-column--selection.is-leaf > div > label > span > span {
  margin-left: 4px;
}
</style>
