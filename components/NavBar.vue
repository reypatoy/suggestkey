<template>
  <header>
    <h1 class="logo">
      <a @click="navigateTo(userRoute)" class="cursor-pointer text-6xl">
        <div class="flex flex-col">
          <span>suggest optimize</span>
        </div>
      </a>
    </h1>
    <nav :class="[navSPDialog ? 'show' : '']">
      <div class="bm">
        <span
          class="material-symbols-rounded"
          @click="navSPDialog = !navSPDialog"
          >menu</span
        >
        <span
          class="material-symbols-rounded"
          @click="navSPDialog = !navSPDialog"
          >close</span
        >
      </div>
      <ul>
        <li v-if="store.role !== '1'" :class="{ active: route.path === userRoute }">
          <a @click="navigateTo(userRoute)" class="cursor-pointer">検証</a>
        </li>
        <li v-if="store.role !== '1'" :class="{ active: route.path.startsWith(`${userRoute}/case`) }">
          <a @click="navigateTo(`${userRoute}/case`)" class="cursor-pointer"
            >案件管理</a
          >
        </li>
        <li v-if="store.role !== '1' && store.role !== '2' && store.role !== '3'"  :class="{ active: route.path.startsWith(`${userRoute}/checklist`) }">
          <a
            @click="navigateTo(`${userRoute}/checklist`)"
            class="cursor-pointer"
            >検索スケジュール</a
          >
        </li>
        <li v-if="store.role !== '1' && store.role !== '2'"  :class="{ active: route.path.startsWith(`${userRoute}/users`) }">
          <a @click="navigateTo(`${userRoute}/users`)" class="cursor-pointer"
            >ユーザー設定</a
          >
        </li>
        <li v-if="store.role !== '1' && store.role !== '2'  && store.role !== '3'"  :class="{ active: route.path.startsWith(`${userRoute}/value`) }">
          <a @click="navigateTo(`${userRoute}/value`)" class="cursor-pointer"
            >マスター設定</a
          >
        </li>
        <li>
          <a data-modal="logout"
            ><span
              class="material-symbols-rounded cursor-pointer"
              @click="showDialog = true"
              >logout</span
            ></a
          >
        </li>
      </ul>
    </nav>
  </header>

  <ModalLogoutDialog
    :cardTitle="'ログアウト確認'"
    :cardText="'本当にログアウトしますか？'"
    :cancelText="'キャンセル'"
    v-model="showDialog"
    @cancel="showDialog = false"
    @confirmed="logout"
  />
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { routeRoles } from "~/middleware/route.global";
import { authStore } from "~/store/authStore";

const store = authStore();
const route = useRoute();

const router = useRouter();
const showDialog = ref(false);
const navSPDialog = ref(false);

const cancel = () => {
  showDialog.value = false;
};

const userRoute = ref<string>(
  routeRoles[store.role as keyof typeof routeRoles]
);

const logout = async () => {
  await store.logout();
  router.push("/login").then(() => window.location.reload());
};

const closeMenu = (event: MouseEvent) => {
  const navMenu = document.querySelector("header nav");
  if (navMenu && !navMenu.contains(event.target as Node)) {
    navSPDialog.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", closeMenu);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", closeMenu);
});
</script>
