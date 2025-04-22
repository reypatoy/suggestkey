<script setup lang="ts">
const isLogin = computed(() => {
  return useAuth().isLogin;
});
</script>
<template>
  <client-only>
    <NuxtLayout :name="isLogin.value ? 'layout' : false">
      <NuxtPage />
    </NuxtLayout>
  </client-only>
</template>
