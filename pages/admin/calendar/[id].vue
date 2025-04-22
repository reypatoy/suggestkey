<template>
  <div v-if="store.isGettingKeywords" class="text-center mt-20 loading-overlay">
    <v-progress-circular
      indeterminate
      color="gray"
      size="48"
    ></v-progress-circular>
  </div>
  <div v-else>
    <div v-if="store.keywordSummary?.keywords?.length > 0">
      <Calendar
        :keywords="store.keywordSummary?.keywords"
        :caseName="store?.keywordSummary?.caseName"
      />
    </div>
    <div v-else class="text-center mt-20">データが見つかりません</div>
  </div>
</template>

<script lang="ts" setup>
import { keywordStore } from "~/store/keywordStore";

definePageMeta({
  layout: "layout",
});

useHead({
  title: "Suggest Optimize",
});

const route = useRoute();
const store = keywordStore();
const caseId = route.params.id;

onMounted(async () => {
  await store.getAllKeywords(String(caseId));
});
</script>

<style>
@import url("../../../assets/sass/user.scss");
</style>
