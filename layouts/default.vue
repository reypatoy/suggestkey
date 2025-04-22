<template>
  <v-main>
    <v-app class="pt-sm-10 pt-5 pb-5">
      <slot />
    </v-app>
  </v-main>
</template>

<script lang="ts" setup>
useHead({
  titleTemplate: (title) => {
    return title ? `${title}` : "Suggest Optimize";
  },
});
</script>
