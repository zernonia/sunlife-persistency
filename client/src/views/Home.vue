<template>
  <div>
    <h1>Persistency Dashboard</h1>
    <h2>LIMRA 2021</h2>
    
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); column-gap: 20px; margin-bottom: 20px;">
      <card :title="'Overall LIMRA Projected'" :data="52.1" />
      <card :title="'Target LIMRA 2021'" :data="53.1" />
      <card :title="'Target LIMRA 2022'" :data="54.1" />
    </div>

    <h2>In-Branch</h2>
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); column-gap: 20px; margin-bottom: 20px;">
      <card-dashboard :title="'Sun Link'" ></card-dashboard>
      <card-dashboard :title="'Sun Link Istismar'"></card-dashboard>
      <card-dashboard :title="'Sun Wealth'"></card-dashboard>
      <card-dashboard :title="'Sun SaveAssured'"></card-dashboard>
    </div>
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); column-gap: 20px; margin-bottom: 20px;">
      <card-dashboard :title="'Sun Series'" ></card-dashboard>
      <card-dashboard :title="'Pay As You Go'"></card-dashboard>
      <card-dashboard :title="'In Branch OTH'"></card-dashboard>
    </div>
    
    <pivot-table />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import pivotTable from '../components/PivotTable.vue'
import Card from '../components/Card.vue'
import CardDashboard from '../components/CardDashboard.vue'

export default defineComponent({
  name: 'Home',
  components: {
    pivotTable,
    Card,
    CardDashboard
  },
});
</script>

<style>
</style>