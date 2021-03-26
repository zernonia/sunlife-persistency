<template>
  <div>
    <el-row :gutter="20" >
      <el-col :span="18">
        <el-card>
          <h2>Selected Variables <span style="color: #409EFF;" v-if="mob != 0">(MOB {{ mob }})</span><span style="color: #409EFF;" v-else>(All)</span></h2>
          <h3>Priority: </h3>
          <div style="display: flex; flex-direction: row;">
            <div style="padding-right: 1rem;">
              <p class="list-group-item ranking" v-for="i in list1.length" :key="i">{{ i }}</p>
            </div>
            <draggable
              class="dragArea list-group"
              :list="list1"
              :group="{ name: 'people', pull: true}"
              item-key="item"
            >
              <template #item="{ element }">
                <div class="list-group-item">
                  {{ element }}
                </div>
              </template>
            </draggable>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card>
          <h2>Variables</h2>
          <draggable
            class="dragArea list-group"
            :list="list2"
            group="people"
            item-key="item"
          >
            <template #item="{ element }">
              <div class="list-group-item">
                {{ element }}
              </div>
            </template>
          </draggable>
        </el-card>
      </el-col>
    </el-row>
    
    <el-button @click="fetchQuery" type="primary" style="margin-top: 1rem;">Generate Leads</el-button>
    
    <h2 class="el-page-header__content" style="margin-top: 2rem;">History</h2>

    <el-timeline v-if="actions.length">
      <el-timeline-item v-for="(action, index) in actions" :key="index" :timestamp="parseDate(action.created_at)" placement="top" color="#1876d6">
        <el-card>
          <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center;">
            <div>
              <h4>{{ action.file }} <span v-if="action.mob != 0">(MOB {{ action.mob }})</span><span v-else>(All)</span></h4>
              <p style="margin: 0.75rem 0">{{ action.priority }}</p>
            </div>
            <el-button @click="fetchOldQuery(action.priority, action.mob)" type="primary">Generate Leads</el-button>
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script lang="ts">
import draggable from 'vuedraggable'
import { defineComponent, onMounted, ref, toRefs } from 'vue'

export default defineComponent({
  components:{
    draggable
  },
  props: {
    limra: {
      type: Number,
      default: 2021
    },
    product: {
      type: String,
      required: true
    },
    mob: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const { limra, product, mob } = toRefs(props)

    const list1 = ref([
      "Client_Segment",
      "Age_Score",
      "Gender_Score"
    ])

    const list2 = ref([
      "Billing_Score",
      "Payment_Score"
    ])

    const actions = ref([])
    const temp = ref('')

    const fetchQuery = () => {
      fetch('../dnd', {
        method: 'POST',
        mode: "cors",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          list: list1.value,
          product: product.value,
          limra: limra.value,
          mob: mob.value
        })
      }).then( async res => {
        const response = await res.text()
      //   const csvData = new Blob([response], {type: 'text/csv;charset=utf-8;'})
      //   //IE11 & Edge
      //   if (navigator.msSaveBlob) {
      //     navigator.msSaveBlob(csvData, 'testing.csv')
      //   } else {
      //     //In FF link must be added to DOM to be clicked
      //     const link = document.createElement('a')
      //     link.href = window.URL.createObjectURL(csvData)
      //     link.setAttribute('download', 'testing.csv')
      //     document.body.appendChild(link)    
      //     link.click()
      //     document.body.removeChild(link)    
      //   }
        temp.value = response
      })
    }

    const fetchAction = () => {
      fetch('../dnd/action', {
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
        actions.value = response
      })
    }

    const fetchOldQuery = (priority: string, mobVal: number) => {
      fetch('../dnd/old', {
        method: 'POST',
        mode: "cors",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product: product.value,
          limra: limra.value,
          priority,
          mob: mobVal
        })
      }).then( async res => {
        const response = await res.json()
        temp.value = response
        console.log(temp.value);
        
      })
    }

    const parseDate = (date: string) => {
      const d = new Date(date)
      return d.toLocaleString("en-GB")
    } 

    onMounted(() => {
      fetchAction()
    })

    return {
      list1,
      list2,
      fetchQuery,
      fetchOldQuery,
      actions,
      temp,
      parseDate
    }
  },
})
</script>

<style>
.list-group-item {
  cursor: move;
  position: relative;
  display: block;
  padding: .5rem;
  border-radius: 5px;
}

.sortable-chosen {
  background: rgba(230, 230, 255, 0.514);
}

.disabled {
  pointer-events: none;
  opacity: 0.7;
}
</style>