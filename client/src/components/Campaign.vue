<template>
  <div>
    <h2>Campaign</h2>
    <el-button type="primary" @click="dialogVisible = true; clearForm()">Add Campaign</el-button>
    <el-table
      :data="tableData"
      style="width: 100%; margin-top: 2rem;">
      <el-table-column type="expand">
        <template #default="props">
          <p>Segment: {{ props.row.client_segment }}</p>
          <p>Age: {{ props.row.age }}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="Running"
        width="100"
      >
        <template #default="scope">
          <el-switch v-model="scope.row.running"></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="modified_at"
        label="Date"
        sortable
        width="180"
        :formatter="parseDate"
      >
      </el-table-column>
      <el-table-column
        prop="id"
        label="ID"
        width="180">
      </el-table-column>
      <el-table-column
        label="Open Rate (%)"
        width="180">
        <template #default="scope">
          {{ (scope.row.id * Math.random() * 10).toFixed(2) }}%
        </template>
      </el-table-column>
      <el-table-column
        label="Bounce Rate (%)"
        width="180">
        <template #default="scope">
          {{ (scope.row.id * Math.random() * 3).toFixed(2) }}%
        </template>
      </el-table-column>
      <el-table-column
        label="Conserved (%)"
        width="180">
        <template #default="scope">
          {{ (scope.row.id * Math.random() * 10).toFixed(2) }}%
        </template>
      </el-table-column>
      <el-table-column
      label="Operations">
        <template #default="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      top="0"
      v-model="dialogVisible"
      width="70%">
      <template #title>
        <h2>Campaign</h2>
        <el-steps :space="200" :active="activeStep" simple style="">
          <el-step title="Step 1" icon="el-icon-edit"></el-step>
          <el-step title="Step 2" icon="el-icon-upload"></el-step>
          <el-step title="Step 3" icon="el-icon-picture"></el-step>
        </el-steps>
      </template>

      <div v-show="activeStep == 0">
        <el-form inline label-width="120px">
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
                <apexchart type="radialBar" :options="option.chartOptions" :series="option.series"></apexchart>
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

      <div v-show="activeStep == 1">
        <h2>Content</h2>
        <el-input
          type="textarea"
          :rows="2"
          placeholder="Please input"
          v-model="textarea">
        </el-input>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button v-if="activeStep != 0" @click="activeStep--">Back</el-button>
          <el-button v-if="activeStep != 2" type="primary" @click="activeStep++">Next</el-button>
          <el-button v-else type="primary" @click="dialogVisible = false; fetchCreate()">Complete</el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, toRefs, watch } from 'vue'

export default defineComponent({
  props: {
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
    const { limra, product } = toRefs(props)
    const tableData = ref([])
    const form = ref({
      segment: [],
      gender: [],
      billing: [],
      age:[],
      payment: [],
      date: [],
      day: [],
      running: false
    })
    const dialogVisible = ref(false)
    const activeStep = ref(0)

    const fetchHistory = () => {
      fetch('../campaign/history', {
        method: 'POST',
        mode: "cors",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product: product.value,
          limra: limra.value
        })
      }).then( async res => {
        const response = await res.json()
        tableData.value = response
      })
    }

    const fetchCreate = () => {
      fetch('../campaign/create', {
        method: 'POST',
        mode: "cors",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          segment: form.value.segment,
          gender: form.value.gender,
          billing: form.value.billing,
          age: form.value.age,
          payment: form.value.payment,
          date: form.value.date,
          day: form.value.day,
          product: product.value,
          limra: limra.value,
          running: form.value.running
        })
      }).then( async res => {
        const response = await res.json()
        fetchHistory()
      })
    }

    onMounted(fetchHistory)

    watch(dialogVisible, () => {
      setTimeout(() => {
        activeStep.value = 0
      }, 200);
    })

    const parseDate = (row: any, column: any, cellValue: any, index: any) => {
      const d = new Date(cellValue)
      return d.toLocaleString("en-GB")
    } 

    const handleEdit = (index: number, row: any) => {
      form.value = {
        segment: row.client_segment,
        gender: row.gender,
        billing: row.billing_frequency,
        age: row.age,
        payment: row.payment_type,
        date: row.date_range,
        day: row.day,
        running: row.running
      }
      dialogVisible.value = true
      console.log(index, row);
    }
    const handleDelete = (index: number, row: any) => {
      console.log(index, row);
    }

    const clearForm = () => {
      form.value = {
        segment: [],
        gender: [],
        billing: [],
        age:[],
        payment: [],
        date: [],
        day: [],
        running: false 
      }
    }

    const option = ref({
      series: [76],
      chartOptions: {
        chart: {
          type: 'radialBar',
          offsetY: -20,
          sparkline: {
            enabled: true
          }
        },
        plotOptions: {
          radialBar: {
            startAngle: -90,
            endAngle: 90,
            track: {
              background: "#e7e7e7",
              margin: 5, // margin is in pixels
            },
            dataLabels: {
              name: {
                show: false
              },
              value: {
                offsetY: -2,
                fontSize: '22px'
              }
            }
          }
        },
        colors: ['#409EFF'],
        grid: {
          padding: {
            top: -10
          }
        },
        labels: ['Average Results']
      }
    })

    const textarea = ref('')

    return {
      form,
      tableData,
      dialogVisible,
      activeStep,
      fetchCreate,
      parseDate,
      option,
      handleEdit,
      handleDelete,
      clearForm,

      textarea
    }
  },
})
</script>


<style>
.el-select {
  width: 100%;
}
.el-overlay {
  background-color: rgb(97 183 233 / 50%);
  display: grid;
  align-items: center;
}
.el-dialog {
  padding: 0rem 1rem;
  height: 85%;
  display: grid;
  grid-template-rows: auto 1fr auto;
}
.el-dialog__title {
  font-size: 1.5em;
  font-weight: bold;
}
.el-dialog__body {
  overflow: auto
}
.dialog-footer .el-button {
  min-width: 120px;
}
</style>