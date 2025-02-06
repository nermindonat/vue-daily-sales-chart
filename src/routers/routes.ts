import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import Login from "../views/auth/Login.vue";
import DailySalesChart from "../views/dailySales/DailySalesChart.vue";
import store from "../stores/auth";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/daily-sales-chart",
    name: "DailySalesChart",
    component: DailySalesChart,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
    next({ name: "Login" });
  } else {
    next();
  }
});

export default router;
