<template>
  <Result :id="route.params.id" :onBackRoute="onBackRoute" />
</template>

<script lang="ts" setup>
const route = useRoute();
const onBackRoute = "/areus";
</script>
<style>
@import url("../../../assets/sass/result.scss");
</style>
