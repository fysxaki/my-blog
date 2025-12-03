<template>
  <div class="login-panel">
      <n-card title="管理后台登录">
        <n-form :rules="rules" :model="admin">
          <!-- 就是path和:value里面的值相同的话就可以校验 -->
          <n-form-item path="account" label="账号">
            <n-input v-model:value="admin.account" placeholder="请输入账号" />
          </n-form-item>
          <n-form-item path="password" label="密码">
            <n-input v-model:value="admin.password" type="password" placeholder="请输入密码" />
          </n-form-item>
        </n-form>
        <template #footer>
          <n-checkbox v-model:checked="admin.remember" label="记住我" />
          <n-button @click="login">登录</n-button>
        </template>
      </n-card>
  </div>
</template>

<script setup>

import {ref, reactive, inject} from 'vue'
import { AdminStore } from '../stores/AdminStore'
import { useRouter,useRoute } from 'vue-router';
const router = useRouter()
const route = useRoute()

const message = inject("message")
const axios = inject("axios")
const adminStore = AdminStore()



let rules = {
  account: [
      { required: true, message: "请输入账号", trigger: "blur" },
      { min: 3, max: 12, message: "账号长度在3到12个字符", trigger:"blur"},
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 18, message: "密码长度在6到18个字符", trigger:"blur"},
  ]
}

const admin = reactive({
  account: localStorage.getItem("account") || "",
  password: "",
  remember: localStorage.getItem("remember") == 1 || false
})


const login = async () => {
  let result =await axios.post("/admin/login", {
    account: admin.account,
    password: admin.password,
  })
  if (result.data.code == 200) {
    adminStore.token = result.data.data.token
    adminStore.account = result.data.data.account
    adminStore.id = result.data.data.id

    if (admin.remember) {
      localStorage.setItem("account", admin.account)
      localStorage.setItem("remember",admin.remember?1:0)
    }
    router.push("/dashboard")
    message.info("登陆成功")
  } else {
    message.info("登陆失败")
  }

}
</script>

<style lang="scss" scoped>
.login-panel{
  width: 500px;
  margin:0 auto;
  margin-top: 130px;
}
</style>
