<template>
  <div>
    <n-button @click="showAddModal = true">添加</n-button>
      <n-table :bordered="false" :single-line="false">
      <thead>
        <tr>
          <th>编号</th>
          <th>名称</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(category, index) in categoryList">
          <td>{{category.id}}</td>
          <td>{{ category.name }}</td>
          <td>
            <n-space>
              <n-button @click="toUpdate(category)">修改</n-button>
              <n-button @click="delete_category(category)">删除</n-button>
            </n-space>

          </td>
        </tr>
      </tbody>
    </n-table>

    <n-modal v-model:show="showAddModal" preset="dialog" title="Dialog">
      <template #header>
        <div>添加分类</div>
      </template>
      <div>
        <n-input v-model:value="addCategory.name" type="text" placeholder="请输入名称"/>
      </div>
      <template #action>
        <div>
          <n-button @click="add">提交</n-button>
        </div>
      </template>
    </n-modal>

    <n-modal v-model:show="showUpdateModal" preset="dialog" title="Dialog">
      <template #header>
        <div>修改分类</div>
      </template>
      <div>
        <n-input v-model:value="updateCategory.name" type="text" placeholder="请输入名称"/>
      </div>
      <template #action>
        <div>
          <n-button @click="update">提交</n-button>
        </div>
      </template>
    </n-modal>


  </div>
</template>

<script setup>
import { AdminStore } from '../../stores/AdminStore'
import {ref, reactive,onMounted, inject} from 'vue'
import { useRouter,useRoute } from 'vue-router';
const router = useRouter()
const route = useRoute()

const message = inject("message")
const axios = inject("axios")
const dialog = inject("dialog")
const adminStore = AdminStore()

// console.log(adminStore.token);

const categoryList = ref([])
const showAddModal = ref(false)
const showUpdateModal = ref(false)
const addCategory = reactive({
  name:"",
})
const updateCategory = reactive({
  id: 0,
  name:"",
})
onMounted(() => {
  loadDatas()
})
const loadDatas =async () => {
  let res = await axios.get("/category/list")
  categoryList.value = res.data.rows
}

const add = async () => {
  let res = await axios.post("/category/_token/add", { name: addCategory.name })
  if (res.data.code == 200) {
    loadDatas()
    message.info(res.data.msg)
  } else {
    message.error(res.data.msg)
  }
  showAddModal.value = false
}

const toUpdate = (category)  => {
  showUpdateModal.value = true
  updateCategory.id = category.id
  updateCategory.name = category.name

}

const update = async () => {
  let res = await axios.put("/category/_token/update", { id: updateCategory.id, name: updateCategory.name })
  if (res.data.code == 200) {
    loadDatas()
    message.info(res.data.msg)
  } else {
    message.error(res.data.msg)
  }
  showUpdateModal.value = false
}


const delete_category = async (category) => {

  dialog.warning({
          title: '警告',
          content: '确定删除？',
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: async () => {
            let res = await axios.delete(`/category/_token/delete?id=${category.id}`)
            if (res.data.code == 200) {
              loadDatas()
              message.info(res.data.msg)
            } else {
              message.error(res.data.msg)
            }
          },
          onNegativeClick: () => {}
   })
}

</script>


<style lang="scss" scoped>

</style>
