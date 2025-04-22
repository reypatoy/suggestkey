<template>
  <div class="banner_title">
    <div class="wrapper text-center">
      <h1 class="text-white text-5xl font-bold inline-block relative mt-4">
        <span class="quote before:content-['“'] after:content-['”']">
          {{ results?.target_keyword }}
        </span>
      </h1>
      <h1 class="text-white text-2xl py-8">
        サジェスト：{{ results?.suggestion }}
      </h1>
    </div>
  </div>
  <main>
    <div class="wrapper absolute inset-x-0 -top-20">
      <section id="">
        <h2 class="h2 mb-2">調査結果</h2>
        <div class="of_table">
          <table class="t1">
            <thead>
              <tr>
                <td>キーワード</td>
                <td class="w-1/3">検索数</td>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="result in results?.competitors_keywords"
                :key="result?.id"
              >
                <th class="tl">{{ result.competitors_keyword }}</th>
                <th class="tl flex justify-center">{{ result.volume }}</th>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <div class="wrapper mt-4">
      <section id="container_history">
        <h2 class="h2 mb-2">対応可否</h2>
        <div class="">
          <h1
            v-if="results?.score !== undefined && results.score < 300"
            class="text-8xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#88d3ce] to-[#6e45e2] text-center"
          >
            ○ 対応可能
          </h1>
          <h1 v-else class="text-8xl text-center font-extrabold">× 対応不可</h1>
        </div>
        <div class="mt-2 text-center">
          <span
            >本ツールは簡易的な難易度チェックツールであり、各種検索エンジンでのサジェスト表示を確実に表示できる事をお約束できるものではありません。
          </span>
        </div>
      </section>
    </div>

    <div class="wrapper mt-4" v-if="store.role !== '2' && store.role !== '3'">
      <section id="container_history">
        <h2 class="h2 mb-2">スコア</h2>
        <div class="text-center">
          <span
            class="text-9xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#88d3ce] to-[#6e45e2]"
          >
            {{ results?.score }}
          </span>
          <span
            class="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#6e45e2] to-[#6e45e2]"
          >
            /300
          </span>
        </div>
      </section>
    </div>

    <div class="wrapper mt-4">
      <section id="container_history">
        <h2 class="h2 mb-2">情報</h2>

        <div class="of_table">
          <table class="t1">
            <tbody>
              <tr>
                <th class="text-center">チェック日</th>
                <th class="text-center">{{ formattedDate }}</th>
              </tr>
              <tr v-if="(results?.score !== undefined && results.score < 300) && store.role !== '2'">
                <th class="text-center">検索コード</th>
                <th class="text-center">
                  <span>{{ results?.id }}</span>
                  <button
                    class="bg-blue-800 px-4 text-white rounded-full ml-4"
                    @click="copyCode"
                  >
                    コードをコピー
                  </button>
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <div class="text-center">
      <NuxtLink
        class="border border-blue-700 rounded-full text-blue-700 px-12 py-2"
        :to="props.onBackRoute"
        >一覧へ戻る</NuxtLink
      >
    </div>

    <v-snackbar v-model="snackbarVisible" :color="snackbarColor" timeout="3000">
      {{ snackbarMessage }}
    </v-snackbar>
  </main>
</template>

<script lang="ts" setup>
import { authStore } from "~/store/authStore";
import { resultsStore } from "~/store/resultsStore";
import type { Results } from "~/types/results";
const props = defineProps(["id", "onBackRoute"]);
const route = useRoute();
const keywordID = String(route.params.id);
const store = authStore();
const storeResult = resultsStore();
const results = ref<Results>();

onMounted(() => {
  getKeywordByID();
});

const getKeywordByID = async () => {
  await storeResult.getKeywordByID(keywordID);
};

watch(
  [storeResult],
  () => {
    results.value = storeResult.data;
  },
  { deep: true },
);

const formattedDate = computed(() => {
  if (!results.value?.createdAt) return "";
  const date = new Date(results.value.createdAt);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
});

const snackbarVisible = ref(false);
const snackbarMessage = ref("");
const snackbarColor = ref("success");

const copyCode = () => {
  if (results.value?.id) {
    navigator.clipboard
      .writeText(results.value.id)
      .then(() => {
        snackbarMessage.value = "コードがコピーされました！";
        snackbarColor.value = "success";
        snackbarVisible.value = true;
      })
      .catch((err) => {
        snackbarMessage.value = "コピーに失敗しました。";
        snackbarColor.value = "error";
        snackbarVisible.value = true;
      });
  } else {
    snackbarMessage.value = "コピーするコードがありません！";
    snackbarColor.value = "error";
    snackbarVisible.value = true;
  }
};
</script>
