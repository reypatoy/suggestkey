<template>
  <div id="container_check">
    <transition name="fade">
      <div v-if="isSearchLoading || isValidateLoading" class="loading-overlay">
        <v-progress-circular
          indeterminate
        :color="isSearchLoading ? 'grey' : 'green'"
          size="64"
        ></v-progress-circular>
      </div>
    </transition>
    <form @submit.prevent="handleSubmit">
      <div class="wrapper" :class="getCopetetorsError != '' ? '!pt-0' : ''">
        <div class="checkform">
          <input
            v-model="targetKeyword"
            placeholder="ターゲットワード ex. 渋谷 ネイルサロン"
            type="text"
            required
          /><i></i>
        </div>
        <div class="checkform">
          <input
            v-model="suggestion"
            placeholder="サジェスト"
            type="text"
            required
          /><i></i>
        </div>
      </div>
      <div class="wrapper !mt-0 !p-0">
        <span class="text-left pl-20 text-red-600 h-full">{{
          getCopetetorsError
        }}</span>
      </div>
      <div class="btn-primary">
        <input type="submit" value="チェックする" />
      </div>
    </form>
  </div>
  <main>
    <div class="wrapper absolute inset-x-0 -top-20">
      <section id="container_history">
        <h2
          class="h2"
          :class="!store.deleteTargetKeywordErrorMessage ? 'mb-2' : ''"
        >
          過去のチェック履歴
        </h2>
        <div class="context">
          <a href="#" class="tgl"></a>
          <form>
            <div class="searchform">
              <input
                placeholder="検索コード"
                type="text"
                v-model="selector.searchCode"
              />
              <button type="button" @click="searchKeywordsData">search</button>
            </div>
            <div class="searchform">
              <input
                placeholder="ターゲットワードで検索"
                type="text"
                v-model="selector.targetKeyword"
              />
              <button type="button" @click="searchKeywordsData">search</button>
            </div>
            <div class="searchform">
              <input
                placeholder="サジェストで検索"
                type="text"
                v-model="selector.suggestion"
              />
              <button type="button" @click="searchKeywordsData">search</button>
            </div>
          </form>
        </div>
        <span
          v-if="store.deleteTargetKeywordErrorMessage"
          class="text-red-500 pl-4"
          >{{ store.deleteTargetKeywordErrorMessage }}</span
        >
        <div class="of_table">
          <table class="t1">
            <thead>
              <tr>
                <td>ターゲットワード</td>
                <td>サジェスト</td>
                <td v-if="auth.role !== '2' && auth.role !== '3'">
                  スコア/300
                </td>
                <td class="min-w-44">可否</td>
                <td class="min-w-52">検索コード</td>
                <td class="min-w-44">ユーザー</td>
                <td class="min-w-52">チェック日</td>
                <td v-if="auth.role !== '2'">削除</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="keyword in keywords?.result" :key="keyword?.id">
                <td class="tl">
                  <NuxtLink :to="`${props.routePath}/result/${keyword.id}`">{{
                    keyword.target_keyword
                  }}</NuxtLink>
                </td>
                <td class="tl">
                  <NuxtLink :to="`${props.routePath}/result/${keyword.id}`">{{
                    keyword.suggestion
                  }}</NuxtLink>
                </td>
                <td v-if="auth.role !== '2' && auth.role !== '3'" class="tc">
                  <span>{{ keyword.score }}</span>
                </td>
                <td class="tc">
                  <span :class="keyword.score < 300 ? 'ok' : 'ng'">{{
                    keyword.score < 300 ? "対応可能" : "対応不可"
                  }}</span>
                </td>
                <td class="tc">
                  {{ keyword.score < 300 ? keyword.id : "--" }}
                </td>
                <td class="tc">{{ keyword.createdBy }}</td>
                <td class="tc">{{ formatDate(keyword.createdAt) }}</td>
                <td v-if="auth.role !== '2'" class="tc">
                  <div class="btn-danger">
                    <a
                      @click="
                        isDeleteDialogShow = true;
                        deleteTargetKeywordId = keyword.id;
                      "
                      data-modal="delete"
                      >削除</a
                    >
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pager mt-2 text-center">
          <nav aria-label="Page navigation">
            <ul class="inline-flex space-x-1">
              <li v-for="page in totalPages" :key="page">
                <button
                  @click="changePage(page)"
                  :class="[
                    'px-3 py-1 border border-gray-300',
                    page === selector.page
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100',
                  ]"
                >
                  {{ page }}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </section>
    </div>
  </main>

  <ModalNotifyDialog
    :card-text="cardText"
    :model-value="showDialog"
    @close="
      showDialog = false;
      showNotifyDialog = false;
    "
    :button-text="'OK'"
  />

  <ModalConfirmDuplicateDialog
    :card-text="cardText"
    :model-value="showNotifyDialog"
    @confirmed="
      showNotifyDialog = false;
      showDialog = false;
      searchKeywords();
    "
    :button-text="'OK'"
    @cancel="
      showNotifyDialog = false;
      showDialog = false;
    "
  />

  <ModalConfirmDialog
    :card-text="'チェック履歴を削除します。\n一度削除すると復元できません。本当に実行しますか?'"
    :model-value="isDeleteDialogShow"
    @confirmed="
      isDeleteDialogShow = false;
      deleteTargetKeyword();
    "
    :button-text="'OK'"
    @cancel="isDeleteDialogShow = false"
  />
</template>

<script lang="ts" setup>
import { keywordStore } from "~/store/keywordStore";
import { KeywordSelector, type Keyword } from "~/types/keyword";
import type { ListResponse } from "~/types/listResponse";
import { authStore } from "~/store/authStore";

const props = defineProps(["routePath"]);
const targetKeyword = ref("");
const suggestion = ref("");
const store = keywordStore();
const auth = authStore();
const keywords = ref<ListResponse<Keyword>>();
const selector = ref<KeywordSelector>(
  new KeywordSelector({ page: 1, limit: 10 } as KeywordSelector),
);
const showDialog = ref(false);
const showNotifyDialog = ref(false);
const isDeleteDialogShow = ref(false);
const deleteTargetKeywordId = ref<string>("");
const cardText = ref("");
const router = useRouter();
const getCopetetorsError = ref<string>("");

const isValidateLoading = ref(false);
const isSearchLoading = ref(false);

onMounted(async () => {
  await store.getKeywords(selector.value);
  keywords.value = store.data;
});

const deleteTargetKeyword = async () => {
  await store.deleteTargetKeyword(deleteTargetKeywordId.value);
  if (!store.deleteTargetKeywordErrorMessage) {
    await store.getKeywords(selector.value);
    keywords.value = store.data;
  }
  setTimeout(() => store.resetDeleteTargetKeywordErrorMessage(), 10000);
};

const searchKeywordsData = async () => {
  selector.value = {
    ...selector.value,
    page: 1,
  };
  await store.getKeywords(selector.value);
};

const handleSubmit = async () => {
  isValidateLoading.value = true;
  const result = await store.validateKeywords(
    targetKeyword.value,
    suggestion.value,
  );
  isValidateLoading.value = false;
  if(result?.error) {
    console.log("empty: ", result.error);
    
    getCopetetorsError.value = result.error
  } else if (!result.isKeywordExist) {
    await searchKeywords();
  } else if (result.isKeywordExist && result.isKeywordInOperation) {
    cardText.value = "すでに契約済みのワードです。";
    showDialog.value = true;
  } else {
    cardText.value =
      "過去にチェックされた履歴があります。継続してチェックしますか?";
    showNotifyDialog.value = true;
  }
  setTimeout(() => (getCopetetorsError.value = ""), 5000);
};

const searchKeywords = async () => {
  isSearchLoading.value = true;
  getCopetetorsError.value = "";
  const { id, error } = await store.submitKeywords(
    targetKeyword.value,
    suggestion.value,
  );
  isSearchLoading.value = false;

  if (id) {
    router.push(`${props.routePath}/result/${id}`);
  }
  getCopetetorsError.value = String(error);
  setTimeout(() => (getCopetetorsError.value = ""), 5000);
};

const formatDate = (date: string | Date | undefined) => {
  if (!date) {
    return "Invalid Date";
  }

  const dateFormat = new Date(date);
  const year = dateFormat.getFullYear();
  const month = String(dateFormat.getMonth() + 1).padStart(2, "0");
  const day = String(dateFormat.getDate()).padStart(2, "0");

  return `${year}/${month}/${day}`;
};

watch(
  [store],
  () => {
    keywords.value = store.data;
  },
  { deep: true },
);

const totalPages = computed(() =>
  Math.ceil(Number(store?.data?.total || 0) / selector.value.limit),
);

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    selector.value.page = page;
    store.getKeywords(selector.value);
  }
};
</script>
