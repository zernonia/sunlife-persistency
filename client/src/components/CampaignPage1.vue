<template>
  <div>
    <el-form inline label-width="120px" style="margin-top: 2rem;">
      <el-form-item label="Product">
        <el-input :placeholder="product" disabled ></el-input>
      </el-form-item>
      <el-form-item label="LIMRA">
        <el-input :placeholder="limra" disabled ></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="form" label-width="120px">
      <el-row :gutter="20" >
        <el-col :span="16">
          <el-form-item label="Client Segment">
            <el-select v-model="form.segment" multiple clearable placeholder="Select Client Segment">
              <el-option label="Good Value" value="Good Value"></el-option>
              <el-option label="Self Conserve" value="Self Conserve"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Gender">
            <el-select v-model="form.gender" multiple clearable placeholder="Select Target Gender">
              <el-option label="Male" value="Male"></el-option>
              <el-option label="Female" value="Female"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Billing Freq">
            <el-select v-model="form.billing" multiple clearable placeholder="Select Target Billing Freq">
              <el-option label="Monthly" value="Monthly"></el-option>
              <el-option label="Quarterly" value="Quarterly"></el-option>
              <el-option label="Half-Yearly" value="Half-Yearly"></el-option>
              <el-option label="Yearly" value="Yearly"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Payment Type">
            <el-select v-model="form.payment" multiple clearable placeholder="Select Target Payment Type">
              <el-option label="Cash" value="Cash"></el-option>
              <el-option label="Debit Card" value="Debit Card"></el-option>
              <el-option label="DebitC" value="DebitC"></el-option>
              <el-option label="CreditC" value="CreditC"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Age">
            <el-select v-model="form.age" multiple clearable placeholder="Select Target Age">
              <el-option label="< 21" value="< 21"></el-option>
              <el-option label="21-30" value="21-30"></el-option>
              <el-option label="31-40" value="31-40"></el-option>
              <el-option label="41-50" value="41-50"></el-option>
              <el-option label="51-60" value="51-60"></el-option>
              <el-option label="> 60" value="> 60"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-card>
            <h3>Expected Reach</h3>
            <!-- <apexchart type="radialBar" :options="option.chartOptions" :series="option.series"></apexchart> -->
            <p>Reach around 800 clients</p>
          </el-card>
        </el-col>
      </el-row>

      <el-divider></el-divider>

      <h3>Schedule</h3>
      <el-form-item label="Date Range">
        <el-date-picker
          v-model="form.date"
          type="daterange"
          range-separator="To"
          start-placeholder="Start date"
          end-placeholder="End date">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="Day">
        <el-select v-model="form.day" multiple clearable placeholder="Select Which Day">
          <el-option label="Monday" value="Monday"></el-option>
          <el-option label="Tuesday" value="Tuesday"></el-option>
          <el-option label="Wednesday" value="Wednesday"></el-option>
          <el-option label="Thursday" value="Thursday"></el-option>
          <el-option label="Friday" value="Friday"></el-option>
          <el-option label="Saturday" value="Saturday"></el-option>
          <el-option label="Sunday" value="Sunday"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item>
        <el-button type="primary" @click="fetchCreate">Create</el-button>
        <el-button>Cancel</el-button>
      </el-form-item> -->
    </el-form>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue'

export default defineComponent({
  props: {
    form: {
      type: Object,
      required: true 
    },
    limra: {
      type: String,
      default: '2021'
    },
    product: {
      type: String,
      required: true
    },
  },
  setup(props) {
    const { form } = toRefs(props)
    const formEdit = computed
  },
})
</script>


<style>

</style>