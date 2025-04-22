<template>
  <v-dialog v-model="showNotifyDialog" class="notify-dialog">
    <div class="wrapper">
      <section class="tc">
        <h2 class="h3 mb-2">{{ cardTitle }}</h2>
        <p class="mb-2" v-html="cardText"></p>
        <div class="form_input mt-1 tc">
          <div class="btn-cancel">
            <input type="button" :value="buttonText" @click="close" />
          </div>
        </div>
      </section>
    </div>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "showNotifyDialog",
  props: {
    cardTitle: {
      type: String,
      default: "",
    },
    cardText: {
      type: String,
      default: "",
    },
    cardVal: {
      type: String,
      default: "",
    },
    buttonText: {
      type: String,
      default: "",
    },
  },
  setup(_, context) {
    const showNotifyDialog = ref(false);

    const close = () => {
      context.emit("close");
    };

    return {
      showNotifyDialog,
      close,
    };
  },
});
</script>

<style scoped>
@import url("~/assets/sass/base.scss");
</style>
