<template>
  <div  class=" container">
    <el-table :data="data" height="500">
      <el-table-column prop="policy_no" label="Policy No." width="180" />
      <el-table-column prop="Channel" label="Channel" width="180" />
      <el-table-column prop="FYAP" label="FYAP" width="180" />
      <el-table-column prop="Prod_Name" label="Product" width="180" />
      <el-table-column prop="est_MOB_13" label="MOB 13" width="180" />
      <el-table-column label="Score" width="180">
        <template #default="scope">
          <el-rate v-model="score" disabled />
        </template>
      </el-table-column>
      <el-table-column label="Action">
        <template #default="scope">
          <el-button type="text" size="small">Detail</el-button>
          <el-button type="text" size="small">Edit</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    data: Object
  },
  data: () => ({
    score: 3
  })
})
</script>

<style>

</style>