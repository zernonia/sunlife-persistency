import { reactive } from 'vue'

export const storeFilter = reactive({
  selectedLIMRA: 2021,
  selectionLIMRA: [2021,2020],
  selectedProduct: 'DMTM_OTH',
  selectedPaymentMethod: [],
  selectedStaffDesignation: 'DMTM',
  searchedLIMRA: 2021,
  searchedProduct: 'DMTM_OTH',
  searchedPaymentMethod: [],
  searchedStaffDesignation: 'DMTM',
  updateSearch: () => {
    storeFilter.searchedLIMRA = storeFilter.selectedLIMRA
    storeFilter.searchedProduct = storeFilter.selectedProduct
    storeFilter.searchedPaymentMethod = storeFilter.selectedPaymentMethod
    storeFilter.searchedStaffDesignation = storeFilter.selectedStaffDesignation
  }
})