<template>
  <div>
    <div class="container">
      <div class="nav">

        <div @click="homePage">首页</div>

        <div>
          <n-popselect @update:value="searchByCategory" v-model:value="selectedCategory" :options="categoryOptions" trigger="click">
             <div>分类<span>{{ categoryName }}</span></div>
          </n-popselect>
        </div>

        <div @click="dashBoard">后台</div>

      </div>
    </div>


  <n-divider />

  <n-flex justify="center">
    <n-input v-model:value="pageInfo.keyword" :style="{width:'300px'}" placeholder="请输入关键字" />
    <n-button type="primary" ghost @click="loadBlogs(0)" >搜索</n-button>
  </n-flex>

  <div v-for="(blog, index) in blogListInfo" class="blog_content">
          <n-card :title="blog.title" @click="toDetail(blog)" content-class="n-card">
            {{ blog.content }}
            <template #footer>
              <n-flex>
                <div>发布时间:{{ blog.create_time }}</div>
              </n-flex>
            </template>
          </n-card>
    </div>

  <n-divider />
    <div class="blog-content">
      <div class="n-card">
        <n-pagination @update:page="loadBlogs" v-model:page="pageInfo.page" :page-count="pageInfo.pageCount" />
      </div>
    </div>



  <div class="footer">
    <div>Power by 一颗23岁的心</div>
    <div>前进!</div>
  </div>

</div>
</template>

<script setup>

import {ref, reactive,onMounted, inject,computed} from 'vue'
import { useRouter, useRoute } from 'vue-router';

import moment from 'moment';
import 'moment-timezone';// 这会在moment对象上增加时区处理的功能

const router = useRouter()
const route = useRoute()

const message = inject("message")
const axios = inject("axios")
const dialog = inject("dialog")

const selectedCategory = ref(0)
const categoryOptions = ref([])
const blogListInfo = ref([])


const pageInfo = reactive({
  page: 1,
  pageSize: 3,
  pageCount: 0,
  count: 0,
  keyword: "",
  categoryId:0
})

onMounted(() => {
  loadCategorys();
  loadBlogs()
})

const loadBlogs = async (page = 0) => {
  if (page != 0) {
    pageInfo.page = page
  }
  let res = await axios.get(`/blog/search?keyword=${pageInfo.keyword}&page=${pageInfo.page}&pageSize=${pageInfo.pageSize}&categoryId=${pageInfo.categoryId}`)
  let temp_rows = res.data.data.rows
  console.log(res.data)
  blogListInfo.value = res.data.data.rows
  for (let row of temp_rows) {
    row.content = repalceHtmlToText(row.content)
    row.content += '...'

    let timestamp = new Date(row.create_time)
    let timeInBeijing = moment(timestamp).tz('Asia/Shanghai').format('YYYY年MM月DD日 HH:mm:ss');
    row.create_time = timeInBeijing;
    // let d = new Date(row.create_time)
    // row.create_time = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
  }
  blogListInfo.value = temp_rows
  pageInfo.count = res.data.data.count

  pageInfo.pageCount = parseInt(pageInfo.count / pageInfo.pageSize) + (pageInfo.count % pageInfo.pageSize > 0 ? 1 : 0)
  console.log(res);
}


const categoryName = computed(() => {
  let selectedOption = categoryOptions.value.find((option) => {return option.value == selectedCategory.value})
  return selectedOption ? selectedOption.label: ""
})

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

const homePage = () => {
  router.push('/')
 }
const dashBoard = () => {
  router.push('/login')
}


const toDetail = (blog) => {
  router.push({ path: "/detail", query: { id: blog.id } })
}

const searchByCategory = (categoryId) => {
  pageInfo.categoryId = categoryId
  loadBlogs()
}

function repalceHtmlToText(str) {
    str = str.replace(/<\/?.+?>/g, "");
    str = str.replace(/&nbsp;/g, "");
    return str;
}
</script>

<style lang="scss" scoped>

.container{
  width: 200px;
  margin: 0 auto;
}
.nav{
  display: flex;
  font-size: 20px;
  color: #64676a;
  div{
    cursor:pointer;
    margin-right: 15px;

    &:hover{
      color: #f60;
    }
    span{
      font-size: 15px;
    }
  }
}

.blog_content{
  display: flex;        /* 使用flex布局 */
  justify-content: center; /* 水平居中 */
  align-items: center;     /* 垂直居中（如果需要） */
  margin-bottom: 15px;
  cursor: pointer;
  width: 100%;          /* 设置宽度为100%，或者使用一个固定的宽度 */
}

.n-card{
  width: 50%;
  margin: auto;/* 确保n-card也居中显示 */
  color: #0077aa;
}

.footer {
  text-align: center;
  line-height: 25px;
  color: #64676a;
}
</style>
