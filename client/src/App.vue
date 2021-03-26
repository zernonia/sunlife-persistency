<template>
  <div style="display: flex; width: 100vw">
    <el-menu :default-active="activeVal" style="height: 100vh;" :collapse="true">
      <el-menu-item index="1" @click="$router.push('/')">
        <i class="el-icon-menu"></i>
        <!-- <template #title>Navigator Two</template> -->
      </el-menu-item>
      <el-menu-item index="2"  @click="$router.push('/history')">
        <i class="el-icon-document"></i>
        <!-- <template #title>Navigator Three</template> -->
      </el-menu-item>
      <el-menu-item index="3">
        <i class="el-icon-setting"></i>
        <!-- <template #title>Navigator Four</template> -->
      </el-menu-item>
    </el-menu>
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

export default defineComponent({

  setup() {
    const activeVal = ref('1')
    const route = useRoute()
    watch(
      () => route.name,
      async newNames => {
        newNames == 'Home' ? activeVal.value = '1' :
        newNames == 'History' ? activeVal.value = '2' : activeVal.value = '3'
      }
    )

    return {
      activeVal
    }
  }
})
</script>

<style>

</style>
