<template>
  <div>


    <n-tabs v-model:value="tabValue" justify-content="start" type="line">
      <n-tab-pane name="list" tab="文章列表">
        <div v-for="(blog, index) in blogListInfo" style="margin-bottom:15px">
          <n-card :title="blog.title" >
            {{ blog.content }}
            <template #footer>
              <n-space>
                <div>发布时间:{{ blog.create_time }}</div>
                <n-space align="center">
                  <n-button @click="toUpdate(blog)">修改</n-button>
                  <n-button @click="toDelete(blog)">删除</n-button>
                </n-space>

              </n-space>
            </template>
          </n-card>
        </div>

        <n-space>
          <div @click="toPage(pageNum)" v-for="pageNum in pageInfo.pageCount" >
            <div :style ="'color:' + (pageNum == pageInfo.page ? 'blue':'')">
              {{ pageNum }}
            </div>
          </div>
        </n-space>
      </n-tab-pane>
      <n-tab-pane name="add" tab="添加文章">

          <n-form>
              <n-form-item label="标题">
                    <n-input v-model:value="addArticle.title" placeholder="请输入标题"/>
              </n-form-item>
              <n-form-item label="分类">
                    <n-select v-model:value="addArticle.categoryId" :options="categoryOptions" />
              </n-form-item>
              <n-form-item label="内容">
                <RichTextEditor v-model="addArticle.content"></RichTextEditor>
              </n-form-item>
              <n-form-item label="">
                <n-button @click="add">提交</n-button>
              </n-form-item>
          </n-form>

      </n-tab-pane>
      <n-tab-pane name="update" tab="修改">

        <n-form>
              <n-form-item label="标题">
                    <n-input v-model:value="updateArticle.title" placeholder="请输入标题"/>
              </n-form-item>
              <n-form-item label="分类">
                    <n-select v-model:value="updateArticle.categoryId" :options="categoryOptions" />
              </n-form-item>
              <n-form-item label="内容">
                <RichTextEditor v-model="updateArticle.content"></RichTextEditor>
              </n-form-item>
              <n-form-item label="">
                <n-button @click="update">提交</n-button>
              </n-form-item>
          </n-form>

      </n-tab-pane>
    </n-tabs>

{{ addArticle.content }}
  </div>
</template>

<script setup>

  import { AdminStore } from '../../stores/AdminStore'
  import {ref, reactive,onMounted, inject} from 'vue'
  import { useRouter, useRoute } from 'vue-router';
  import RichTextEditor from '../../components/RichTextEditor.vue';
  const router = useRouter()
  const route = useRoute()

  import moment from 'moment';
  import 'moment-timezone';// 这会在moment对象上增加时区处理的功能

  const message = inject("message")
  const axios = inject("axios")
  const dialog = inject("dialog")
  const adminStore = AdminStore()


const addArticle = reactive({
  categoryId:0,
  title: "",
  content: "",
})

const updateArticle = reactive({
  id:0,
  categoryId: 0,
  title: "",
  content: "",
})

const categoryOptions = ref([])
const blogListInfo = ref([])
const tabValue = ref('list')

const pageInfo = reactive({
  page: 1,
  pageSize: 3,
  pageCount: 0,
  count: 0,
})

onMounted(() => {
  loadBlogs()
  loadCategorys()
})

const loadBlogs = async () => {
  let res = await axios.get(`/blog/search?page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`)
  let temp_rows = res.data.data.rows
  blogListInfo.value = res.data.data.rows
  for (let row of temp_rows) {
    row.content = repalceHtmlToText(row.content)
    // console.log(row.content)
    row.content += '...'


    let timestamp = new Date(row.create_time)
    let timeInBeijing = moment(timestamp).tz('Asia/Shanghai').format('YYYY年MM月DD日 HH:mm:ss');
    row.create_time = timeInBeijing;
    // console.log(timeInBeijing); // 输出北京时间
    // console.log(row.create_time);
  }
  blogListInfo.value = temp_rows
  pageInfo.count = res.data.data.count

  pageInfo.pageCount = parseInt(pageInfo.count / pageInfo.pageSize) + (pageInfo.count % pageInfo.pageSize > 0 ? 1 : 0)
}

const loadCategorys =async () => {
  let res = await axios.get("/category/list")
  categoryOptions.value = res.data.rows.map((item) => {
    return {
        label: item.name,
        value:item.id,
      }
  })
  console.log(categoryOptions.value);
}


const add = async () => {
  let res = await axios.post("/blog/_token/add", addArticle)

  if (res.data.code == 200) {
    message.info(res.data.msg)
    addArticle.title = ''
    addArticle.categoryId = ''
    addArticle.content = ''
  } else {
    message.info(res.data.msg)
  }
}

const toPage = async (pageNum) => {
  pageInfo.page = pageNum
  loadBlogs()
}

const toUpdate = async (blog) => {
  tabValue.value = "update"
  let res = await axios.get("/blog/detail?id=" + blog.id)
  updateArticle.id = blog.id
  updateArticle.title = res.data.rows[0].title
  updateArticle.content = res.data.rows[0].content
  updateArticle.categoryId = res.data.rows[0].category_id

}

const update = async () => {
  let res = await axios.put("/blog/_token/update", updateArticle)

  if (res.data.code == 200) {
      message.info(res.data.msg)
      loadBlogs()
      tabValue.value = 'list'
  } else {
      message.info(res.data.msg)
  }
}

const toDelete = async (blog) => {
  let res = await axios.delete("/blog/_token/delete?id=" + blog.id)
  console.log(res);
  if (res.data.code == 200) {
    message.info(res.data.msg)
    loadBlogs()
  } else {
    message.error(res.data.msg)
  }
}

function repalceHtmlToText(str) {
    str = str.replace(/<\/?.+?>/g, "");
    str = str.replace(/&nbsp;/g, "");
    return str;
}

</script>

<style lang="scss" scoped>

</style>
