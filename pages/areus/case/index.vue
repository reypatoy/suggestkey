<template>
  <Case :editRoute="editRoute" />
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "layout",
});

useHead({
  title: "Suggest Optimize",
});

const editRoute = "/areus";
</script>

<style>
@import url("../../../assets/sass/cmn.scss");
</style>
