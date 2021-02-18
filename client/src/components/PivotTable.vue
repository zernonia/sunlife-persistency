<template>
  <div class=" el-table container" style="padding: 2rem;">
    <h1>LIMRA Table</h1>
    <table class="el-table__body el-table__footer el-table__header" style=" width: 100%;">
      <thead>
        <tr>
          <th style=""></th>
          <th style="">2021 Projected</th>
          <th style="">Short Term Target<br>(2021 LIMRA)</th>
          <th style="">Long Term Target<br>(2022 LIMRA)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>Overall</th>
          <td v-for="(item,index) in data.overall" :key="index">{{ item }}%</td>
        </tr>
        <tr>
          <th>New Business Quality<br>(Average Risk Score)</th>
          <td v-for="(item,index) in data.NBQ" :key="index">{{ item }}%</td>
        </tr>
        <tr><br><br></tr>
        <tr>
          <th style="padding-bottom: 0px; text-decoration: underline;">Product Persistency (MOB13)</th>
        </tr>
        <tr>
          <th style="padding-bottom: 0px;">In-Branch:</th>
        </tr>
        <tr v-for="(group, index) in data.IB" :key="index">
          <th>&nbsp;&nbsp;&nbsp;&nbsp;{{ index + 1 }}. {{ group.title }}</th>
          <td v-for="(item, index) in group.data" :key="index">{{ item }}%</td>
        </tr>
        <tr>
          <th style="padding-bottom: 0px;"><br>DMTM:</th>
        </tr>
        <tr v-for="(group, index) in data.DMTM" :key="index">
          <th>&nbsp;&nbsp;&nbsp;&nbsp;{{ index + 1 }}. {{ group.title }}</th>
          <td v-for="(item, index) in group.data" :key="index">{{ item }}%</td>
        </tr>
        <tr>
          <th style="padding-bottom: 0px;"><br>Agency:</th>
        </tr>
        <tr v-for="(group, index) in data.AGENCY" :key="index">
          <th>&nbsp;&nbsp;&nbsp;&nbsp;{{ index + 1 }}. {{ group.title }}</th>
          <td v-for="(item, index) in group.data" :key="index">{{ item }}%</td>
        </tr>
      </tbody>
    </table>
    <br>
    <br>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
  setup(){
    const data = ref({
      overall: [0],
      NBQ: [45,46,48],
      IB: [{}],
      DMTM: [{}],
      AGENCY: [{}]
    })

    const fetchData = () => {
      fetch('./productLIMRA', {
        mode: "cors",
      }).then( async res => {
        const response = await res.json()
        data.value.overall = [response.Overall, response.Overall + 1, response.Overall + 2 ]
        data.value.IB = [
          {
            title: 'Sun Link',
            data: [response.SunLink, response.SunLink + 1, response.SunLink + 2 ]
          }, 
          {
            title: 'Sun Link Istismar',
            data: [response['SunLink Istismar'], response['SunLink Istismar'] + 1, response['SunLink Istismar'] + 2 ]
          }, 
          {
            title: 'Sun Wealth',
            data: [response['Sun Wealth'], response['Sun Wealth'] + 1, response['Sun Wealth'] + 2 ]
          },
          {
            title: 'Sun SaveAssured',
            data: [response['Sun SaveAssured'], response['Sun SaveAssured'] + 1, response['Sun SaveAssured'] + 2 ]
          },
          {
            title: 'Sinar Series',
            data: [response['Sinar Series'], response['Sinar Series'] + 1, response['Sinar Series'] + 2 ]
          },
          {
            title: 'Pay As You Go',
            data: [response['Pay As You Go'], response['Pay As You Go'] + 1, response['Pay As You Go'] + 2 ]
          },
          {
            title: 'In Branch OTH',
            data: [response['IN_BRANCH_OTH'], response['IN_BRANCH_OTH'] + 1, response['IN_BRANCH_OTH'] + 2 ]
          },
        ]
        data.value.DMTM = [
          {
            title: 'Sun Protector',
            data: [response['Sun Protector'], response['Sun Protector'] + 1, response['Sun Protector'] + 2 ]
          }, 
          {
            title: 'Sun ProtectMax',
            data: [response['Sun ProtectMax'], response['Sun ProtectMax'] + 1, response['Sun ProtectMax'] + 2 ]
          }, 
          {
            title: 'MediDirect',
            data: [response['MEDIDIRECT'], response['MEDIDIRECT'] + 1, response['MEDIDIRECT'] + 2 ]
          },
          {
            title: 'DMTM OTH',
            data: [response['DMTM_OTH'], response['DMTM_OTH'] + 1, response['DMTM_OTH'] + 2 ]
          },
        ]
        data.value.AGENCY = [
          {
            title: 'Agency Product',
            data: [response['Agency_Product'], response['Agency_Product'] + 1, response['Agency_Product'] + 2 ]
          }
        ]
      })
    }

    // Call Data
    fetchData()

    return {
      data
    }
  }
})
</script>

<style>

</style>