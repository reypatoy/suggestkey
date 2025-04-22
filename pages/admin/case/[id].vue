<template>
  <EditCase
    :id="route.params.id"
    :onBackRoute="onBackRoute"
    :vieCheckerResultRoute="vieCheckerResultRoute"
  />
</template>

<script lang="ts" setup>
const route = useRoute();
const onBackRoute = "/admin/case";
const vieCheckerResultRoute = "/admin";
</script>

<style>
@import url("../../../assets/sass/editCase.scss");
</style>
