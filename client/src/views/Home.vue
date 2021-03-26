<template>
  <div>
    <h1>Persistency Dashboard</h1>
    <h2>LIMRA 2021</h2>
    
    <div style="display: grid; grid-template-columns: repeat(3, minmax(300px, 1fr)); gap: 20px; margin-bottom: 20px;">
      <card :title="'Overall LIMRA Projected'" :data="overall" />
      <card :title="'Target LIMRA 2021'" :data="overall + 1" />
      <card :title="'Target LIMRA 2022'" :data="overall + 2" />
    </div>
    
    <section id="in_branch">
      <h2>In-Branch</h2>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-bottom: 20px;">
        <card-dashboard :title="'Sun Link'" :data="allProductData['SunLink']" :product="'SunLink'" ></card-dashboard>
        <card-dashboard :title="'Sun Link Istismar'" :data="allProductData['SunLink Istismar']" :product="'SunLink Istismar'"></card-dashboard>
        <card-dashboard :title="'Sun Wealth'" :data="allProductData['Sun Wealth']" :product="'Sun Wealth'"></card-dashboard>
        <card-dashboard :title="'Sun SaveAssured'" :data="allProductData['Sun SaveAssured']" :product="'Sun SaveAssured'"></card-dashboard>
        <card-dashboard :title="'Sun Series'" :data="allProductData['Sinar Series']" :product="'Sinar Series'"></card-dashboard>
        <card-dashboard :title="'Pay As You Go'" :data="allProductData['Pay As You Go']" :product="'Pay As You Go'"></card-dashboard>
        <card-dashboard :title="'In Branch OTH'" :data="allProductData['IN_BRANCH_OTH']" :product="'IN_BRANCH_OTH'"></card-dashboard>
      </div>
    </section>

    <section id="dmtm">
      <h2>DMTM</h2>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-bottom: 20px;">
        <card-dashboard :title="'Medi Direct'" :data="allProductData['MEDIDIRECT']" :product="'MEDIDIRECT'" ></card-dashboard>
        <card-dashboard :title="'Sun Mozi'" :data="allProductData['Sun Mozi']" :product="'Sun Mozi'"></card-dashboard>
        <card-dashboard :title="'Sun ProtectMax'" :data="allProductData['Sun ProtectMax']" :product="'Sun ProtectMax'"></card-dashboard>
        <card-dashboard :title="'Sun Protector'" :data="allProductData['Sun Protector']" :product="'Sun Protector'"></card-dashboard>
        <card-dashboard :title="'DMTM OTH'" :data="allProductData['DMTM_OTH']" :product="'DMTM_OTH'"></card-dashboard>
      </div>
    </section>

  </div>
    <!-- <pivot-table /> -->
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
// import pivotTable from '../components/PivotTable.vue'
import Card from '../components/Card.vue'
import CardDashboard from '../components/CardDashboard.vue'

export default defineComponent({
  name: 'Home',
  components: {
    // pivotTable,
    Card,
    CardDashboard
  },
  setup() {
    const allProductData = ref({})
    const overall = ref(0)

    const fetchAll = () => {
      fetch('./main/maAll', {
        mode: "cors",
      }).then( async res => {
        const response = await res.json()
        allProductData.value = response
        overall.value = response.Overall
      })
    }

    fetchAll()

    return {
      allProductData,
      overall
    }

  }
});
</script>

<style>
</style>