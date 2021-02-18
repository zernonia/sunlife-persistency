<template>
  <div>
    <h1>Persistency Dashboard</h1>
    <h2>LIMRA 2021</h2>
    
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); column-gap: 20px; margin-bottom: 20px;">
      <card :title="'Overall LIMRA Projected'" :data="52.1" />
      <card :title="'Target LIMRA 2021'" :data="53.1" />
      <card :title="'Target LIMRA 2022'" :data="54.1" />
    </div>

    <pivot-table />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import pivotTable from '../components/PivotTable.vue'
import Card from '../components/Card.vue'

export default defineComponent({
  name: 'Home',
  components: {
    pivotTable,
    Card
  },
});
</script>

<style>
</style>