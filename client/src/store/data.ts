import { reactive } from 'vue'

export const storeData = reactive({
  rawData: [],
  populateData: (data: any) => {
    storeData.rawData = data
  }
})