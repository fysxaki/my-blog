interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
  // 可以继续添加其他环境变量的定义
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
