<template>
  <div class="about">
    <h1>This is an about page</h1>
    <el-slider v-model="value1"></el-slider>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({ 
  data: () => ({
    value1: 0
  })
})
</script>