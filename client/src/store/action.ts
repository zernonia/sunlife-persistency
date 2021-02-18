import { reactive } from 'vue'

export const storeAction = reactive({
  policyNo: [] as any[],
  sendMessage: (val: any[]) => {
    val.forEach((item: any) => {
      storeAction.policyNo.push(item.policy_no)
      
    })    
  }
})