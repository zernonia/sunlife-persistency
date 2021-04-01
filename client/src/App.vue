<template>
  <div style="display: flex; width: 100vw">
    <div style="display: flex; flex-direction: column; justify-content: space-between; height: 100vh; background-color: white; align-items: center;">
      <el-menu :default-active="activeVal" style="" :collapse="true">
        <el-menu-item index="1" @click="$router.push({ name: 'Home'})">
          <i class="el-icon-menu"></i>
          <!-- <template #title>Navigator Two</template> -->
        </el-menu-item>
        <el-menu-item index="2"  @click="$router.push(`/details/${ routeData.lastDetailRoute }`)">
          <i class="el-icon-document"></i>
          <!-- <template #title>Navigator Three</template> -->
        </el-menu-item>
        <el-menu-item index="3">
          <i class="el-icon-setting"></i>
          <!-- <template #title>Navigator Four</template> -->
        </el-menu-item>
      </el-menu>
      <el-avatar style="margin-bottom: 1rem; cursor: pointer; background-color: rgb(112, 214, 255);"> user </el-avatar>
    </div>
      <div style="display: flex; justify-content: center; height: 100vh; overflow-y: scroll; padding: 0rem 1.5rem; width: 100%;">
        <router-view class="main-container" v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref } from 'vue'
import { useRoute } from 'vue-router'
import { routeData } from './store/route'

export default defineComponent({
  setup() {
    const activeVal = ref('1')
    const route = useRoute()
    watch(
      () => route.name,
      async newNames => {
        newNames == 'Home' ? activeVal.value = '1' :
        newNames == 'Details' ? activeVal.value = '2' : activeVal.value = '3'
      }
    )

    return {
      activeVal,
      routeData
    }
  }
})
</script>

<style>

</style>
