<template>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-card>
        <draggable
          class="dragArea list-group"
          :list="list1"
          :group="{ name: 'people', pull: true}"
          item-key="id"
        >
          <template #item="{ element }">
            <div class="list-group-item">
              {{ element.name }}
            </div>
          </template>
        </draggable>
      </el-card>
    </el-col>

    <el-col :span="12">
      <el-card>
        <draggable
          class="dragArea list-group"
          :list="list2"
          group="people"
          item-key="id"
        >
          <template #item="{ element }">
            <div class="list-group-item">
              {{ element.name }}
            </div>
          </template>
        </draggable>
      </el-card>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import draggable from 'vuedraggable'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  components:{
    draggable
  },
  setup() {
    const list1 = ref([
      { name: "Jesus", id: 1 },
      { name: "Paul", id: 2 },
      { name: "Peter", id: 3 }
    ])

    const list2 = ref([
      { name: "Luc", id: 5 },
      { name: "Thomas", id: 6 },
      { name: "John", id: 7 }
    ])


    return {
      list1,
      list2
    }
  },
})
</script>

<style>
.list-group-item {
  cursor: move;
  position: relative;
  display: block;
  padding: .75rem 1.25rem;
  /* background-color: #fff; */
  /* border: 1px solid rgba(0,0,0,.125); */
}


</style>