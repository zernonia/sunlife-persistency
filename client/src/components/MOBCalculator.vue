<template>
  <div>
    <el-space wrap>
      <el-space direction="vertical">
        <el-select v-model="selectedMOB" placeholder="Select" @change="updateSelectedMOB">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="formatToDate(item)"
            :value="item">
          </el-option>
        </el-select>
        <el-input-number v-model="targetMOB" @change="handleMOBChange" :min="0" :max="100"></el-input-number>
      </el-space>
      <apexchart type="line" height="450" width="900" :options="chartOptions" :series="series"></apexchart>
    </el-space>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, toRefs, watch } from 'vue'
export default defineComponent({
  props:{
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
    // setup Graph
    const { data, MA } = toRefs(props)
    const targetMOB = ref(40)
    const lastMOB = ref(0)
    const maxTargetMOB = ref(0)
    const total = ref(0)
    const currentValue = ref(0)
    const multiplier = ref(1)
    const multiplierCount = ref(1)


    const formatToDate = (val: number) => {
      const newDate = new Date(val)
      return newDate.toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
      }).slice(3)
    }

    const options = computed(() => {
      const temp: number[] = []
      data.value.forEach((item: any) => {
        temp.push(item.mth_id) 
      })
      return temp
    })

    const MOBLabel = computed(() => {
      const temp: string[] = []
      for(let i = 1; i <= 13; i ++) {
        temp.push(`MOB ${i}`)
      }
      return temp
    })

    const selectedMOB = ref(1609344000000)
    const MOBData = ref<any[]>([])
    const MOBDataPrediction = ref<any[]>([])
    const MOBRawDataPrediction = ref<any[]>([])
    const MOBTarget = ref<any[]>([])

    const updateSelectedMOB = (val: any) => {
      const temp: any[] = []
      const temp2: any[] = []
      const temp3: any[] = []

      multiplier.value = 1
      multiplierCount.value = 0
      const i = data.value.findIndex( a => a.mth_id == selectedMOB.value)
        total.value = data.value[i]['total']
        for(let j = 1; j <= 13; j++) {
          if(i != -1) {
            if(data.value[i][`MOB_${j}_perc`]) {
              temp.push(data.value[i][`MOB_${j}_perc`])
            } else {
              temp.push(null)
            }

            if(data.value[i][`MOB_${j}_predict_perc`]) {
              if(temp2[j - 2]) {''} else {
                currentValue.value = (data.value[i][`sum_MOB_${j - 1}`])
                temp2[j - 2] = (data.value[i][`MOB_${j - 1}_perc`])
                temp3[j - 2] = (data.value[i][`sum_MOB_${j - 1}`])
              } 
              temp2.push(data.value[i][`MOB_${j}_predict_perc`])
              temp3.push(data.value[i][`MOB_${j}_predict`])
              multiplier.value *= (MA.value[j-1] / 100)
              multiplierCount.value++

            } else {
              temp2.push(null)
              temp3.push(null)
            }
          } else {
            temp.push(0)
            temp2.push(0)
            temp3.push(0)
          }
        }
      
      MOBData.value = temp
      MOBDataPrediction.value = temp2
      MOBTarget.value = temp2
      MOBRawDataPrediction.value = temp3
      maxTargetMOB.value = temp2.find((item: any) => item != null)
      targetMOB.value = temp2[temp2.length - 1]
      lastMOB.value = temp2[temp2.length - 1]
    }
    
    setTimeout(() => {
      updateSelectedMOB(1)
    }, 500);

    watch(data, (newVal: any, oldVal: any) => {
      updateSelectedMOB(selectedMOB)
    })
            
    const series = computed(() => {
      return [{
        name: "MOB Prediction",
        data: MOBDataPrediction.value
      },{
        name: "MOB Target",
        data: MOBTarget.value
      },{
        name: "MOB",
        data: MOBData.value
      }]
    })

    const chartOptions = computed(() => {
      return {
        chart: {
          type: 'line',
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: true
        },
        stroke: {
          curve: 'straight',
          dashArray: [5,5,0]
        },
        xaxis: {
          categories: MOBLabel
        },
        yaxis: {
          min: 0,
          max: 100,
          labels: {
            formatter: (val: any) => { return val + '%'} 
          }
        }
      }
    })

    // input MOBTarget

    const handleMOBChange = (e: any) => {
      const difference = (e - lastMOB.value) / 100
      
      const temp: any[] = []
      const newMultiplier = Math.pow((multiplier.value + (difference * total.value / currentValue.value) ), 1/multiplierCount.value )
      let countPower = 1

      MOBRawDataPrediction.value.map((item: any, index: number) => {
        if(item != null){
          if(temp[index - 1] == null) {
            temp.push((Math.round(currentValue.value / total.value * 1000) / 10))
          } else {
            if(MA.value[index +1 ]/100 > newMultiplier) { 
              console.log(MA.value[index +1 ]);
              console.log(index+1);
              console.log(newMultiplier);
              
              
            }
            temp.push((Math.round( currentValue.value / total.value * Math.pow(newMultiplier, countPower++ ) * 1000) / 10))
          }
        } else {
          temp.push(null)
        }
      })
         
      MOBTarget.value = temp
    }

    return {
      options,
      selectedMOB,
      series,
      chartOptions,
      formatToDate,
      updateSelectedMOB,



      targetMOB,
      lastMOB,
      maxTargetMOB,
      handleMOBChange,
      MOBRawDataPrediction,
      total,
      multiplier,
      currentValue
    }
  },
})
</script>

<style>

</style>