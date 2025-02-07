<template>
  <header
    class="w-full h-20 flex justify-between items-center shadow py-2 px-10 bg-blue-100 sticky top-0 left-0 z-50"
  >
    <div class="flex items-center justify-between p-2">
      <a href="/daily-sales-chart" class="flex items-center">
        <img
          src="/src/assets/images/image.png"
          alt=""
          class="w-12 h-12 mr-1 rounded"
        />
      </a>
    </div>
    <div class="flex items-center justify-between p-2">
      <div class="relative flex items-center font-bold cursor-pointer">
        <Icon icon="iconamoon:profile-bold" class="w-[1.2em] h-[1.2em] mr-1" />
        <div class="flex flex-col text-sm font-semibold leading-4">
          <span class="font-medium text-xs">Account</span>
          <span class="text-sm"
            >{{ userInfo.firstName }} {{ userInfo.lastName }}</span
          >
        </div>
        <div class="text-sm font-semibold leading-4 underline ml-6">
          <router-link to="/" @click.prevent="logout">Log Out</router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useStore } from "vuex";
import { onMounted, ref } from "vue";

const store = useStore();

interface User {
  firstName: string;
  lastName: string;
}
const userInfo = ref<User>({ firstName: "", lastName: "" });

const logout = () => {
  store.dispatch("logout");
};

onMounted(async () => {
  try {
    await store.dispatch("initializeAuth");
    const getUserInfo = store.getters.getUserInfo;
    userInfo.value = getUserInfo.Data.user;
  } catch (error) {
    console.error("Initialization failed:", error);
  }
});
</script>
