<template>
  <Checklist :id="route.params.id" />
</template>

<script lang="ts" setup>
const route = useRoute();
</script>

<style>
@import url("../../../assets/sass/user.scss");
</style>
