<template>
  <v-dialog
    v-model="showDialog"
    persistent
    max-width="400px"
    class="confirm-dialog"
  >
    <div class="wrapper">
      <section class="tc">
        <h2 class="h3 mb-2">{{ cardTitle }}</h2>
        <p class="mb-2" v-html="cardText"></p>
        <div class="form_input mt-1 !flex">
          <div class="btn-cancel">
            <input type="button" :value="cancelText" @click="cancel" />
          </div>
          <div class="btn-danger">
            <input type="button" value="ログアウト" @click="confirmed" />
          </div>
        </div>
      </section>
    </div>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "LogoutDialog",
  props: {
    cardTitle: {
      type: String,
      default: "確認",
    },
    cardText: {
      type: String,
      default: "ログアウトしますか？",
    },
    cancelText: {
      type: String,
      default: "キャンセル",
    },
  },
  setup(_, context) {
    const showDialog = ref(false);

    const openDialog = () => {
      showDialog.value = true;
    };

    const cancel = () => {
      showDialog.value = false;
      context.emit("cancel");
    };

    const confirmed = () => {
      showDialog.value = false;
      context.emit("confirmed");
    };

    return {
      showDialog,
      openDialog,
      cancel,
      confirmed,
    };
  },
});
</script>

<style scoped>
@import url("~/assets/sass/base.scss");
</style>
