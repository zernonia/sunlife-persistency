import { reactive } from 'vue'

export const routeData = reactive({
  lastDetailRoute: '',
  updateRoute: (newRoute: string | string[]) => {
    if(typeof newRoute == 'string') routeData.lastDetailRoute = newRoute
  }
})