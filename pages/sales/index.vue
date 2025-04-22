<template>
  <Checker :routePath="routePath" />
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "layout",
});

useHead({
  title: "Suggest Optimize",
});
const routePath = ref<string>("/sales");
</script>

<style>
@import url("../../assets/sass/user.scss");
</style>
