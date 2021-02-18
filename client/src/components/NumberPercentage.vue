<template>
  <el-space wrap :size="1" >
    <span v-if="number">{{ propValue }}</span>
    <span v-if="percentage && number" style="font-size: 10px; margin-left: 4px"> ({{ propPercentage2DP }}%)</span>
    <span v-if="percentage && !number">{{ propPercentage2DP }}%</span>
  </el-space>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    number: Boolean,
    percentage: Boolean,
    scope: Object,
    prop: Number
  },
  setup(props){
    const propValue = ref()
    const propPercentage = ref(0)
    const propPercentage2DP = ref('')

    if(props.scope && props.prop){
      // eslint-disable-next-line vue/no-setup-props-destructure
      propValue.value = props.scope.row['sum_MOB_'+ props.prop]
      if(props.prop == 1){
        propPercentage2DP.value = '100'
      } else {
        propPercentage.value = (props.scope.row['sum_MOB_'+ props.prop]) / (props.scope.row['sum_MOB_'+ ( props.prop - 1)]) * 100
       
        if(isNaN(propPercentage.value)){
          propPercentage2DP.value = '0.0'
        } else {
          propPercentage2DP.value = propPercentage.value.toFixed(1)
        }
       
      }
    }
    return {
      propValue,
      propPercentage,
      propPercentage2DP
    }
  }
})
</script>