<template>
  <el-card class="box-card" style="flex-grow: 1">
    <template #header>
      <h3 style="padding: 0; margin: 0;">{{ title }}</h3>
    </template>
    <performance :data="data" style="height: 175px" />
  </el-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Performance from './Performance.vue'

export default defineComponent({
  props: {
    title: String,
    data: Number
  },
  components: {
    Performance
  },
})
</script>

<style>

</style>