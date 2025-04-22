<template>
  <div class="banner_title text-white text-4xl">案件一覧</div>
  <main>
    <div class="wrapper absolute inset-x-0 -top-20">
      <section id="container_case">
        <h2 class="h2 mb-2">案件一覧</h2>
        <div class="context">
          <a href="#" class="tgl"></a>
          <form @submit.prevent="store.list(selector)">
            <div class="searchform">
              <input
                placeholder="案件名で検索"
                type="text"
                v-model="selector.caseName"
              />
              <button type="submit">search</button>
            </div>
          </form>
          <div class="btn-primary">
            <a href="#" data-modal="add" @click="getLatestId">新規案件追加</a>
          </div>
        </div>
        <div>
          <table class="t1">
            <thead>
              <tr>
                <td class="case_no">案件No.</td>
                <td class="case_name">案件名</td>
                <td class="case_contract">稼働中/契約数</td>
                <td class="case_view">View</td>
                <td class="case_edit">編集</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="caseData in store?.data?.result">
                <td class="case_no">
                  {{ caseData.id }}
                </td>
                <td class="case_name w-[50%] text-left">
                  {{
                    caseData.projectName
                  }}
                </td>
                <td class="case_contract text-center">
                  {{ caseData.inOperation }} / {{ caseData.contracts }}
                </td>
                <td class="case_view flex !justify-center">
                  <div class="btn-primary">
                    <NuxtLink :to="`${userRoute}/calendar/${caseData.id}`">表示結果</NuxtLink>
                  </div>
                </td>
                <td class="case_edit !justify-center">
                  <div class="btn-primary">
                    <NuxtLink
                      :to="`${props.editRoute}/case/${caseData.id}`"
                      class="btnAction text-primary"
                      >編集</NuxtLink
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

  <div v-if="isAddUserModalShow" id="modal_add h-fit" class="modal show">
    <div class="wrapper">
      <section>
        <h2 class="h3 mb-2">案件追加</h2>
        <span class="pl-6 text-red-500">{{ saveCaseMessage }}</span>
        <form>
          <div class="form_input">
            <p>案件No.</p>
            <input type="text" :value="newCase.id" readonly />
            <span v-if="store.getLatestIdError" class="text-red-500 pl-2"
              >An error uccored while getting latest id, please try again</span
            >
          </div>

          <div class="form_input">
            <p>案件名</p>
            <input type="text" v-model="newCase.projectName" required />
          </div>
          <div
            class="form_input"
            v-if="userStore.role !== '2' && userStore.role !== '3'"
          >
            <p>顧客名</p>
            <v-autocomplete
              v-model="newCase.customerId"
              clearable
              :items="customerStore.customers"
              variant="outlined"
              item-value="id"
              item-title="username"
            >
              <template #item="{ item, index, props }">
                <div
                  v-bind="props"
                  :style="{
                    backgroundColor:
                      newCase.customerId === item.title ? 'lightgrey' : 'white',
                    color:
                      newCase.customerId === item.value ? '#000' : '#979797',
                    padding: '10px 15px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    transition: 'background-color 0.3s, color 0.3s',
                  }"
                  class="custom-item"
                >
                  {{ item.title }}
                </div>
              </template>
            </v-autocomplete>
          </div>
          <div class="suggests" v-if="userStore.role !== '2'">
            <div class="form_input">
              <p>検索コード</p>
              <span class="text-red-500">{{
                getUnAssociatedKeywordErrorMessage
              }}</span>
              <div class="add !flex !flex-row gap-x-2">
                <v-autocomplete
                  v-model="suggestionSearchCode"
                  clearable
                  :items="store.keywordList"
                  variant="outlined"
                  item-value="id"
                  item-title="keyword"
                >
                  <template #item="{ item, index, props }">
                    <div
                      v-bind="props"
                      :style="{
                        backgroundColor:
                          suggestionSearchCode === item.title
                            ? 'lightgrey'
                            : 'white',
                        color:
                          suggestionSearchCode === item.value
                            ? '#000'
                            : '#979797',
                        padding: '10px 15px',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        transition: 'background-color 0.3s, color 0.3s',
                      }"
                      class="custom-item"
                    >
                      {{ item.title }}
                    </div>
                  </template>
                </v-autocomplete>
                <button
                  type="button"
                  class="w-28 mt-1 text-[#2053a2] border border-blue-500 rounded text-center h-16"
                  @click="getSuggestion"
                >
                  追加
                </button>
              </div>
            </div>
            <div class="form_input">
              <p v-if="newCase.suggestions?.length">サジェスト</p>
              <div
                v-for="suggestion in newCase?.suggestions"
                class="grid grid-cols-[60px_1fr_60px] gap-4 mb-1 py-2 items-center border rounded"
              >
                <div
                  class="h-full w-full border-r flex !items-center !justify-center"
                >
                  <span
                    class="flex !items-center !justify-center rounded-full text-white bg-[#4cb4c6] w-10 min-w-10 aspect-square text-sm sm:text-base"
                  >
                    {{ suggestion.score }}
                  </span>
                </div>

                <div class="grid gap-2 w-full">
                  <div class="relative w-full">
                    <label
                      for=""
                      class="absolute w-fit top-2 left-2 bg-white px-2 text-gray-600 text-sm rounded-full"
                    >
                      ターゲットワード：
                    </label>
                    <input
                      type="text"
                      class="border border-gray-400 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      :value="suggestion.target_keyword"
                      readonly
                    />
                  </div>
                  <div class="relative w-full">
                    <label
                      for=""
                      class="absolute w-fit top-2 left-2 bg-white px-2 text-gray-600 text-sm rounded-full"
                    >
                      サジェスト：
                    </label>
                    <input
                      type="text"
                      class="border border-gray-400 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      :value="suggestion.suggestion"
                      readonly
                    />
                  </div>

                  <div class="relative w-full">
                    <label
                      for=""
                      class="absolute w-fit top-2 left-2 bg-white px-2 text-gray-600 text-sm rounded-full"
                    >
                      ターゲットドメイン：
                    </label>
                    <input
                      type="text"
                      class="border border-gray-400 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      :value="suggestion.targetDomain"
                      placeholder="ターゲットドメイン（sample.com）"
                    />
                  </div>
                </div>

                <div
                  class="h-full w-full border-l flex !justify-center items-center gap-2"
                >
                  <NuxtLink
                    v-if="suggestion.id"
                    :to="`${userRoute}/result/${suggestion.id}`"
                    target="_blank"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      class="size-8 hover:bg-[#2053a2] hover:rounded"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M15.75 2.25H21a.75.75 0 0 1 .75.75v5.25a.75.75 0 0 1-1.5 0V4.81L8.03 17.03a.75.75 0 0 1-1.06-1.06L19.19 3.75h-3.44a.75.75 0 0 1 0-1.5Zm-10.5 4.5a1.5 1.5 0 0 0-1.5 1.5v10.5a1.5 1.5 0 0 0 1.5 1.5h10.5a1.5 1.5 0 0 0 1.5-1.5V10.5a.75.75 0 0 1 1.5 0v8.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V8.25a3 3 0 0 1 3-3h8.25a.75.75 0 0 1 0 1.5H5.25Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </NuxtLink>
                  <button
                    v-if="suggestion.id"
                    @click="removeSuggection(suggestion.id)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="#ff7373"
                      class="size-8"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3 10.5a.75.75 0 0 0 0-1.5H9a.75.75 0 0 0 0 1.5h6Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="form_input mt-1 tc">
            <div class="btn-primary">
              <input
                @click="saveCase"
                type="button"
                value="保存"
                :disabled="store.getLatestIdError"
              />
            </div>
            <div class="btn-cancel">
              <input
                type="button"
                value="キャンセル"
                @click="isAddUserModalShow = false"
              />
            </div>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Case, CaseSelector, type Suggestion } from "~/types/case";
import { caseStore } from "~/store/caseStore";
import { keywordStore } from "~/store/keywordStore";
import { routeRoles } from "~/middleware/route.global";
import { authStore } from "~/store/authStore";
import { useMyUserStore } from "~/store/user";

const props = defineProps(["editRoute"]);
const store = caseStore();
const customerStore = useMyUserStore();
const userStore = authStore();
const _keywordStore = keywordStore();
const selector = ref<CaseSelector>(new CaseSelector({ page: 1, limit: 10 }));
const isAddUserModalShow = ref<boolean>(false);
const newCase = ref<Case>(new Case({} as Case));
const suggestionSearchCode = ref<string>("");
const getUnAssociatedKeywordErrorMessage = ref<string>("");
const saveCaseMessage = ref<string>("");
const updateCaseMessage = ref<string>("");
const userRoute = ref<string>(
  routeRoles[userStore.role as keyof typeof routeRoles]
);

onMounted(async () => {
  await store.list(selector.value);
  await customerStore.getCustomers();
  await store.getLatestKeywords();
});

const getLatestId = async () => {
  const latestId = await store.getLatestId();
  newCase.value = new Case({ ...newCase.value, id: latestId, suggestions: [] });
  isAddUserModalShow.value = true;
};

const getSuggestion = async () => {
  await _keywordStore.getUnAssociatedKeyword(suggestionSearchCode.value);

  if (String(_keywordStore.getUnAssociatedKeywordErrorMessage) !== "") {
    return;
  }
  console.log("nilahos diri");

  if (_keywordStore.keyword?.targetDomain) {
    const isValidDomain = store.checkDomain([
      _keywordStore.keyword,
    ] as unknown as Suggestion[]);
    if (!isValidDomain) {
      updateCaseMessage.value =
        "無効なドメインが含まれています。正しい形式で入力してください (例: example.com)";

      return;
    }
  }

  if (
    !newCase.value?.suggestions ||
    !newCase.value.suggestions
      ?.map((suggestion: Suggestion) => suggestion.id)
      .includes(_keywordStore.keyword.id)
  ) {
    const suggestions = newCase.value?.suggestions ?? ([] as Suggestion[]);
    suggestions?.push(_keywordStore.keyword as unknown as Suggestion);
    newCase.value = {
      ...newCase.value,
      suggestions,
    };
    suggestionSearchCode.value = "";
  }
};

const removeSuggection = (id: string) => {
  newCase.value = {
    ...newCase.value,
    suggestions: newCase.value.suggestions?.filter(
      (suggestion: Suggestion) => suggestion.id != id
    ),
  };
};

const saveCase = async () => {
  const isAddCaseSuccess = await store.add(newCase.value);
  if (isAddCaseSuccess) {
    const newCaseId = newCase.value.id;
    
    saveCaseMessage.value = "";
    isAddUserModalShow.value = false;
    
    await store.list(selector.value);
    
    newCase.value = new Case({} as unknown as Case);
    suggestionSearchCode.value = "";
    
    return navigateTo(`case/${newCaseId}`);
  } else {
    saveCaseMessage.value = store.saveCaseMessage;
  }
};

watch([_keywordStore], () => {
  getUnAssociatedKeywordErrorMessage.value =
    _keywordStore.getUnAssociatedKeywordErrorMessage;
});

const totalPages = computed(() =>
  Math.ceil(Number(store?.data?.total || 0) / selector.value.limit)
);

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    selector.value.page = page;
    store.list(selector.value);
  }
};

onMounted(async () => {
  await store.list(selector.value);
});

watch(isAddUserModalShow, (newValue) => {
  document.body.style.overflow = newValue ? "hidden" : "";
});

onBeforeUnmount(() => {
  document.body.style.overflow = "";
});

onMounted(() => {
  if (isAddUserModalShow.value) {
    document.body.style.overflow = "hidden";
  }
});
</script>
