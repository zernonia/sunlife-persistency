<template>
  <div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; align-items: center">
      <h1>Persistency Dashboard</h1>
      <el-select v-model="storeFilter.selectedLIMRA" placeholder="Select" style="width: 150px;">
        <el-option
          v-for="item in storeFilter.selectionLIMRA"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </div>
    
    <div style="display: grid; grid-template-columns: repeat(3, minmax(300px, 1fr)); gap: 20px; margin-bottom: 20px;">
      <card :title="'Projected LIMRA 2021'" :data="overall.actual" />
      <card :title="'Target LIMRA 2021'" :data="overall.target" />
      <card :title="'Target LIMRA 2022'" :data="overall.target + 2" />
    </div>
    
    <section id="in_branch">
      <h2>In-Branch</h2>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-bottom: 20px;">
        <card-dashboard :title="'Sun Link'" :data="allProductData['SunLink']" :product="'SunLink'" :target="target['SunLink']" ></card-dashboard>
        <card-dashboard :title="'Sun Link Istismar'" :data="allProductData['SunLink Istismar']" :product="'SunLink Istismar'" :target="target['SunLink Istismar']"></card-dashboard>
        <card-dashboard :title="'Sun Wealth'" :data="allProductData['Sun Wealth']" :product="'Sun Wealth'" :target="target['Sun Wealth']"></card-dashboard>
        <card-dashboard :title="'Sun SaveAssured'" :data="allProductData['Sun SaveAssured']" :product="'Sun SaveAssured'" :target="target['Sun SaveAssured']"></card-dashboard>
        <card-dashboard :title="'Sun Series'" :data="allProductData['Sinar Series']" :product="'Sinar Series'" :target="target['Sinar Series']"></card-dashboard>
        <card-dashboard :title="'Pay As You Go'" :data="allProductData['Pay As You Go']" :product="'Pay As You Go'" :target="target['Pay As You Go']"></card-dashboard>
        <card-dashboard :title="'In Branch OTH'" :data="allProductData['IN_BRANCH_OTH']" :product="'IN_BRANCH_OTH'" :target="target['IN_BRANCH_OTH']"></card-dashboard>
      </div>
    </section>

    <section id="dmtm">
      <h2>DMTM</h2>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-bottom: 20px;">
        <card-dashboard :title="'Medi Direct'" :data="allProductData['MEDIDIRECT']" :product="'MEDIDIRECT'" :target="target['MEDIDIRECT']"></card-dashboard>
        <card-dashboard :title="'Sun Mozi'" :data="allProductData['Sun Mozi']" :product="'Sun Mozi'" :target="target['Sun Mozi']"></card-dashboard>
        <card-dashboard :title="'Sun ProtectMax'" :data="allProductData['Sun ProtectMax']" :product="'Sun ProtectMax'" :target="target['Sun ProtectMax']"></card-dashboard>
        <card-dashboard :title="'Sun Protector'" :data="allProductData['Sun Protector']" :product="'Sun Protector'" :target="target['Sun Protector']"></card-dashboard>
        <card-dashboard :title="'DMTM OTH'" :data="allProductData['DMTM_OTH']" :product="'DMTM_OTH'" :target="target['DMTM_OTH']"></card-dashboard>
      </div>
    </section>

  </div>
    <!-- <pivot-table /> -->
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
// import pivotTable from '../components/PivotTable.vue'
import Card from '../components/Card.vue'
import CardDashboard from '../components/CardDashboard.vue'
import { storeFilter } from '../store/filter'

export default defineComponent({
  name: 'Home',
  components: {
    // pivotTable,
    Card,
    CardDashboard
  },
  setup() {
    const allProductData = ref({})
    const target = ref({})
    const overall = ref(0)

    const fetchAll = () => {
      fetch(`./main/maAll/${ storeFilter.selectedLIMRA }`, {
        mode: "cors",
      }).then( async res => {
        const response = await res.json()
        allProductData.value = response
        overall.value = response.Overall
      })
    }
    
    const fetchTarget = () => {
      fetch(`./target/${ storeFilter.selectedLIMRA }`, {
        mode: "cors",
      }).then( async res => {
        const response = await res.json()
        target.value = response
      })
    }

    watch(() => storeFilter.selectedLIMRA, (newVal: number, oldVal: number) => {
      fetchAll(),
      fetchTarget()
    })

    fetchAll()
    fetchTarget()

    return {
      allProductData,
      target,
      overall,
      storeFilter
    }

  }
});
</script>

<style>
</style>