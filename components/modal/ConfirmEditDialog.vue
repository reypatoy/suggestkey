<template>
  <v-dialog v-model="showDialog" margin="0" class="confirm-dialog">
    <div class="wrapper">
      <section class="tc">
        <h2 class="h3 mb-2">自分のアカウントを編集しているため、保存すると現在のセッションからログアウトします</h2>
        <p class="mb-2" v-html="cardText"></p>
        <div class="form_input mt-1 tc">
          <div class="btn-cancel">
            <input type="button" value="キャンセル" @click="cancel" />
          </div>
          <div class="btn-primary">
            <input type="button" value="削除" @click="confirmed" />
          </div>
        </div>
      </section>
    </div>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "ConfirmDialog",
  props: {
    cardTitle: {
      type: String,
      default: "",
    },
    cardText: {
      type: String,
      default: "",
    },
    cardClass: {
      type: String,
      default: "",
    },
    multiLine: {
      type: Boolean,
      default: false,
    },
    multiLineTexts: Array,
    cancelText: {
      type: String,
      default: "Cancel",
    },
    isProcessing: {
      type: Boolean,
      default: false,
    },
  },
  setup(_, context) {
    const showDialog = ref(false);
    const cancel = () => {
      context.emit("cancel");
    };

    const confirmed = () => {
      context.emit("confirmed");
    };

    return {
      showDialog,
      cancel,
      confirmed,
    };
  },
});
</script>

<style scoped>
@import url("~/assets/sass/base.scss");
</style>
