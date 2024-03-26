<template>
  <div class="container">

    <n-button @click="back">返回</n-button>
    <!-- 标题 -->
    <n-h1>{{ blogInfo.title }}</n-h1>
    <!-- 文章内容 -->
    <div class="blog-content">
      <div v-html="blogInfo.content"></div>
    </div>
  </div>
</template>

<script setup>
import {ref,onMounted, inject} from 'vue'
import { useRouter, useRoute } from 'vue-router';
const router = useRouter()
const route = useRoute()
const axios = inject("axios")
const blogInfo = ref([])

onMounted(() => {
  loadBlog()
})

const loadBlog =async () => {
  let res = await axios.get("/blog/detail?id=" + route.query.id)
  blogInfo.value = res.data.rows[0]
}

const back = () => {
  router.push("/")
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;          /* Container occupies full width of its parent */
  margin: 0 auto;       /* Centers the container horizontally */
  text-align: center;   /* Text inside the container is centered */
  cursor: pointer;
}

.blog-content {
  width: 80%;           /* Set the width of blog content */
  max-width: 740px;     /* Maximum width the content can stretch */
  margin: 20px auto;    /* Vertical spacing and horizontal centering */
}

/* Adjust the <n-h1> (assuming it's a component that renders an <h1> tag) */
.n-h1 {
  margin-bottom: 5%;   /* Add some space below the title */
}

/* If the v-html content has its own styling that misaligns it, you can override it here */
.blog-content div {
  text-align: left;     /* Aligns the text inside the div to the left if needed */
}

</style>
