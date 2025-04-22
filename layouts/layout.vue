<template>
  <div>
    <NavBar></NavBar>
    <v-app class="pt-sm-10">
      <slot />
    </v-app>
    <Footer></Footer>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  setup() {
    useHead({
      titleTemplate: (title) => {
        return title ? `${title}` : "Suggest Optimize";
      },
    });
  },
});
</script>

<style></style>
