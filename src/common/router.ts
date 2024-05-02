import {
  createRouter,
  createWebHashHistory,
  Router,
  RouteRecordRaw,
} from "vue-router";

// 定义路由数组时使用 RouteRecordRaw 类型
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("../views/HomePage.vue"),
  },
  {
    path: "/test",
    component: () => import("../views/Test.vue"),
  },
  {
    path: "/login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/detail",
    component: () => import("../views/Detail.vue"),
  },
  {
    path: "/dashboard",
    component: () => import("../views/dashboard/Dashboard.vue"),
    //子路由的 path 不要以 / 开头，除非你想让这个路径完全独立于父路径。如果路径以 / 开头，它将不会追加到父路径后面，而是作为根路径。
    children: [
      {
        path: "dashboard/category",
        component: () => import("../views/dashboard/Category.vue"),
      },
      {
        path: "dashboard/article",
        component: () => import("../views/dashboard/Article.vue"),
      },
    ],
  },
];

const router: Router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export { router, routes };
