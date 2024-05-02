import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  //vite.config.ts默认支持ts文件,不需要额外的配置项,.js需要配置
  plugins: [vue()],
  server: {
    // 指定开发服务器端口
    port: 3000,
  },
});
