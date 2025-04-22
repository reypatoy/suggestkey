<template>
  <div class="banner_title text-white text-4xl">案件一覧</div>
  <main>
    <transition name="fade">
      <div v-if="isSearchLoading" class="loading-overlay">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
      </div>
    </transition>
    <div class="wrapper absolute inset-x-0 -top-20">
      <section id="container_casedetail">
        <h2 class="h2 mb-1">
          案件詳細
          <div
            class="btn-danger"
            v-if="storeAuth.role !== '2' && storeAuth.role !== '3'"
          >
            <a data-modal="delete" @click="isDeleteDialogShow = true"
              >この案件を削除</a
            >
          </div>
        </h2>
        <span class="pl-6 text-green-500">{{ updateCaseMessage }}</span>
        <span class="pl-6 text-red-500">{{
          store.deleteCaseErrorMessage
        }}</span>
        <form>
          <div>
            <table class="t2">
              <tbody>
                <tr>
                  <th>案件No.</th>
                  <td>
                    <div class="form_input">
                      <input type="text" v-model="caseData.id" readonly />
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>案件名</th>
                  <td>
                    <div class="form_input">
                      <input
                        type="text"
                        v-model="caseData.projectName"
                        required
                      />
                    </div>
                  </td>
                </tr>
                <tr v-if="storeAuth.role !== '2' && storeAuth.role !== '3'">
                  <th>顧客名</th>
                  <td>
                    <div class="form_input">
                      <v-autocomplete
                        v-model="caseData.customerId"
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
                                caseData.customerId === item.title
                                  ? 'lightgrey'
                                  : 'white',
                              color:
                                caseData.customerId === item.value
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
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>サジェスト</th>
                  <td>
                    <div class="suggests">
                      <div class="form_input" v-if="storeAuth.role !== '2'">
                        <p>検索コード</p>
                        <span class="text-red-500">{{
                          getUnAssociatedKeywordErrorMessage
                        }}</span>
                        <div class="add !flex !flex-row">
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
                                  transition:
                                    'background-color 0.3s, color 0.3s',
                                }"
                                class="custom-item"
                              >
                                {{ item.title }}
                              </div>
                            </template>
                          </v-autocomplete>
                          <button
                            type="button"
                            class="btn_add w-28 h-24 border border-[#2053a2] text-[#2053a2] rounded ml-4"
                            @click="getSuggestion"
                          >
                            追加
                          </button>
                        </div>
                      </div>
                      <div class="form_input">
                        <p
                          v-if="
                            storeAuth.role !== '2' &&
                            caseData?.suggestions?.length
                          "
                        >
                          サジェスト
                        </p>
                        <div
                          v-for="(
                            suggestion, keywordIndex
                          ) in caseData?.suggestions"
                          class="relative grid grid-cols-[60px_1fr_200px] gap-4 mb-1 py-2 items-center border rounded"
                        >
                          <div
                            v-if="suggestion.deletedAt"
                            class="absolute top-0 left-0 w-full h-full bg-gray-200 z-20 opacity-50"
                          ></div>

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
                              <div class="text-center">
                                <span class="text-gray-400">{{
                                  suggestion.id
                                }}</span>
                              </div>
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
                                v-model="suggestion.targetDomain"
                                placeholder="ターゲットドメイン（sample.com）"
                              />
                            </div>
                            <div
                              class="relative w-full"
                              v-if="
                                storeAuth.role !== '2' && storeAuth.role !== '3'
                              "
                            >
                              <label
                                for=""
                                class="absolute w-fit top-2 left-2 bg-white px-2 text-gray-600 text-sm rounded-full"
                              >
                                月間検索数：
                              </label>
                              <input
                                class="border border-gray-400 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                                v-model="suggestion.totalMonthlySearch"
                                @input="
                                  (event) => limitToNumbers(event, suggestion)
                                "
                              />
                            </div>
                          </div>

                          <div
                            class="suggest_set h-full w-full border-l flex flex-col !items-center !justify-center gap-4"
                          >
                            <div class="flex !items-center !justify-center">
                              <div
                                class="form_input min-w-[100px] !mb-0"
                                v-if="storeAuth.role !== '2'"
                              >
                                <select
                                  class="!h-[48px]"
                                  v-model="suggestion.isInOperation"
                                >
                                  <option :value="1">稼働中</option>
                                  <option :value="0">停止中</option>
                                </select>
                              </div>
                              <NuxtLink
                                :to="`${props.vieCheckerResultRoute}/result/${suggestion.id}`"
                                class="btn_link"
                                target="_blank"
                              ></NuxtLink>
                              <div v-if="storeAuth.role !== '2'">
                                <button
                                  type="button"
                                  v-if="!suggestion.deletedAt"
                                  class="btn_remove"
                                  @click="
                                    softDeleteCaseKeyword(
                                      suggestion.caseKeywordId
                                    )
                                  "
                                ></button>
                                <button
                                  type="button"
                                  v-else="suggestion.deletedAt"
                                  class="btn_add pointer-events-auto relative z-30"
                                  @click="
                                    restoreSoftDeleteCaseKeyword(
                                      suggestion.caseKeywordId
                                    )
                                  "
                                >
                                  <span></span>
                                </button>
                              </div>
                            </div>
                            <div
                              v-if="
                                storeAuth.role !== '2' && storeAuth.role !== '3'
                              "
                            >
                              <button
                                type="button"
                                class="bg-[#2053a2] text-white py-2 px-4 rounded rounded-full"
                                @click="
                                  getKeywordList(suggestion.id, keywordIndex)
                                "
                              >
                                検索ワード選定
                              </button>
                            </div>
                            <div
                              v-if="
                                storeAuth.role !== '2' && storeAuth.role !== '3'
                              "
                            >
                              <NuxtLink
                                class="bg-[#2053a2] text-white py-2 px-4 rounded rounded-full"
                                :to="`${userRoute}/checklist/${suggestion.id}`"
                                target="_blank"
                                >スケジュール表示</NuxtLink
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <span class="pl-6 text-green-500">{{ updateCaseMessage }}</span>
          <span class="pl-6 text-red-500">{{
            store.deleteCaseErrorMessage
          }}</span>
          <div class="submitbtns">
            <div class="btn-cancel">
              <NuxtLink :to="`${props.onBackRoute}`">一覧へ戻る</NuxtLink>
            </div>
            <div class="btn-primary">
              <input
                type="button"
                class="btn_remove"
                @click="saveCase"
                value="保存する"
              />
            </div>
          </div>
        </form>
      </section>
    </div>
  </main>
  <ModalConfirmDialog
    :card-text="cardText"
    :model-value="isDeleteDialogShow"
    @confirmed="
      isDeleteDialogShow = false;
      deleteCase();
    "
    :button-text="'OK'"
    @cancel="isDeleteDialogShow = false"
  />

  <div
    v-if="isKeywordListModalShow"
    class="modal show"
    @click.self="isKeywordListModalShow = false"
  >
    <div class="wrapper !w-[900px]">
      <section>
        <div class="flex !justify-between !items-center mb-2">
          <h2 class="h3">検索ワード選定</h2>
          <div class="flex !items-center gap-6">
            <div>
              <span class="text-gray-500"> 月間総検索数： </span>
              <input
                type="number"
                class="!w-36 !h-3"
                v-model="_resultsStore.data.totalMonthlySearches"
              />
            </div>
          </div>
        </div>

        <p class="text-red-400">{{ store.addsSearchScheduleErrorMessage }}</p>
        <div class="relative">
          <div class="h-[500px] overflow-y-auto">
            <table class="t1">
              <thead>
                <tr>
                  <td class="checkbox">
                    <input
                      type="checkbox"
                      :checked="isAllChecked === true"
                      :indeterminate="isAllChecked === null"
                      @click="toggleCheckAll"
                    />
                  </td>
                  <td class="keyword">検索ワード</td>
                  <td class="volume">参考数</td>
                  <td class="volume">月間検索数</td>
                  <td class="percentage">比率</td>
                  <td class="remove"></td>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-if="
                    !displayedKeywords?.some(
                      (k) =>
                        k.competitors_keyword ===
                        _resultsStore?.data?.target_keyword
                    )
                  "
                >
                  <td></td>
                  <td>
                    <span class="opacity-50 pointer-events-none">
                      {{ _resultsStore?.data?.target_keyword }}
                    </span>
                  </td>
                  <td class="text-center">
                    <span class="opacity-50 pointer-events-none text-center">
                      0
                    </span>
                  </td>

                  <td class="text-center">
                    <span class="opacity-50 pointer-events-none text-center">
                      0
                    </span>
                  </td>
                  <td
                    class="case_edit flex !items-center gap-2 opacity-50 pointer-events-none"
                  >
                    <input type="text" class="!w-16" disabled />
                    <span>%</span>
                  </td>
                  <td></td>
                </tr>
                <tr
                  v-for="keywordData in displayedKeywords"
                  :key="keywordData.id"
                >
                  <td class="case_no">
                    <input
                      v-if="!shouldHideCheckbox(keywordData)"
                      type="checkbox"
                      v-model="keywordData.isChecked"
                    />
                  </td>
                  <td
                    class="case_name w-[50%] text-left"
                    :class="{
                      'opacity-50 pointer-events-none': !keywordData.isChecked,
                    }"
                  >
                    {{ keywordData.competitors_keyword }}
                  </td>
                  <td
                    class="case_contract text-center"
                    :disabled="!keywordData.isChecked"
                    :class="{
                      'opacity-50 pointer-events-none': !keywordData.isChecked,
                    }"
                  >
                    {{ keywordData.volume }}
                  </td>
                  <td
                    class="text-center"
                    :disabled="!keywordData.isChecked"
                    :class="{
                      'opacity-50 pointer-events-none': !keywordData.isChecked,
                    }"
                  >
                    {{
                      calculateVolume(
                        _resultsStore.data.totalMonthlySearches,
                        keywordData.percentage
                      )
                    }}
                  </td>
                  <td
                    class="case_edit flex !items-center gap-2"
                    :class="{
                      'opacity-50 pointer-events-none': !keywordData.isChecked,
                    }"
                  >
                    <input
                      type="text"
                      class="!w-16"
                      @input="(event) => limitTo3Numbers(event, keywordData)"
                      v-model="keywordData.percentage"
                      :disabled="!keywordData.isChecked"
                    />
                    <span>%</span>
                  </td>
                  <td
                    class="case_remove"
                    :class="{
                      'opacity-50 pointer-events-none': !keywordData.isChecked,
                    }"
                  ></td>
                </tr>
                <tr
                  v-for="(keywordData, index) in additionalKeyword[
                    currentKeywordIndex
                  ]"
                  :key="keywordData.id"
                  :id="'row-' + keywordData.id"
                >
                  <td class="case_no">
                    <input type="checkbox" v-model="keywordData.isChecked" />
                  </td>
                  <td
                    class="case_name w-[50%] text-left"
                    :class="{
                      'opacity-50 pointer-events-none': !keywordData.isChecked,
                    }"
                  >
                    <input
                      type="text"
                      v-model="keywordData.competitors_keyword"
                      :disabled="!keywordData.isChecked"
                      :class="{
                        'opacity-50 pointer-events-none':
                          !keywordData.isChecked,
                      }"
                    />
                  </td>
                  <td class="case_contract text-center">
                    <input
                      @input="(event) => limitToNumbers(event, keywordData)"
                      v-model="keywordData.volume"
                      :disabled="!keywordData.isChecked"
                      :class="{
                        'opacity-50 pointer-events-none':
                          !keywordData.isChecked,
                      }"
                    />
                  </td>

                  <td
                    class="text-center"
                    :disabled="!keywordData.isChecked"
                    :class="{
                      'opacity-50 pointer-events-none': !keywordData.isChecked,
                    }"
                  >
                    {{
                      calculateVolume(
                        _resultsStore.data.totalMonthlySearches,
                        keywordData.percentage
                      )
                    }}
                  </td>
                  <td
                    class="case_edit flex !items-center gap-2"
                    :class="{
                      'opacity-50 pointer-events-none': !keywordData.isChecked,
                    }"
                  >
                    <input
                      type="text"
                      class="!w-16"
                      @input="(event) => limitTo3Numbers(event, keywordData)"
                      v-model="keywordData.percentage"
                      :disabled="!keywordData.isChecked"
                    />
                    <span>%</span>
                  </td>
                  <td
                    class="case_remove"
                    :class="{
                      'opacity-50 pointer-events-none': !keywordData.isChecked,
                    }"
                  >
                    <button
                      @click="removeAdditionalKeyword(index)"
                      :disabled="!keywordData.isChecked"
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
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="absolute left-1/2 -translate-x-1/2 -bottom-7">
            <button @click="addKeywordRow()">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#4cb4c6"
                class="size-8"
              >
                <path
                  fill-rule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
        <div class="form_input mt-1 tc">
          <div class="btn-primary">
            <input
              @click="updateSelection"
              type="button"
              value="保存"
              :disabled="store.getLatestIdError"
            />
          </div>
          <div class="btn-cancel">
            <input
              type="button"
              value="キャンセル"
              @click="isKeywordListModalShow = false"
            />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick } from "vue";
import { caseStore } from "~/store/caseStore";
import { keywordStore } from "~/store/keywordStore";
import { resultsStore } from "~/store/resultsStore";
import { useMyUserStore } from "~/store/user";
import { Case, type Suggestion } from "~/types/case";
import type { Competitors_Keywords } from "~/types/results";
import { v4 as uuidv4 } from "uuid";
import { routeRoles } from "~/middleware/route.global";
import { authStore } from "~/store/authStore";
import _ from 'lodash';
import isEqual from 'lodash/isEqual';

const props = defineProps(["id", "onBackRoute", "vieCheckerResultRoute"]);
const router = useRouter();
const caseId = String(props.id);
const store = caseStore();

const caseData = ref<Case>(new Case({} as Case));
const suggestionSearchCode = ref<string>("");
const getUnAssociatedKeywordErrorMessage = ref<string>("");
const updateCaseMessage = ref<string>("");
const _keywordStore = keywordStore();
const _resultsStore = resultsStore();
const isDeleteDialogShow = ref<boolean>(false);
const customerStore = useMyUserStore();
const cardText = ref<string>(
  "この案件を削除します。\n一度削除すると復元できません。本当に実行しますか?"
);
const isKeywordListModalShow = ref<boolean>(false);

const storeAuth = authStore();

const userRoute = ref<string>(
  routeRoles[storeAuth.role as keyof typeof routeRoles]
);
const currentKeywordIndex = ref<number>(0);
const isSearchLoading = ref(false);

onMounted(async () => {
  await store.get(caseId);
  await customerStore.getCustomersForEditCase(caseId);
  await store.getLatestKeywords();
});

const getSuggestion = async () => {
  await _keywordStore.getUnAssociatedKeyword(suggestionSearchCode.value);
  suggestionSearchCode.value = ""
};

watch([store], () => {
  caseData.value = _.cloneDeep(store.caseData);
});

const softDeleteCaseKeyword = async (id: string) => {
  caseData.value.suggestions = caseData.value.suggestions?.map((suggestion) =>
    suggestion.caseKeywordId === id
      ? Object.assign({}, suggestion, { deletedAt: new Date().toISOString() })
      : suggestion
  );
};

const restoreSoftDeleteCaseKeyword = async (id: string) => {
  caseData.value = {
    ...caseData.value,
    suggestions: caseData.value.suggestions?.map((suggestion: Suggestion) =>
      suggestion.caseKeywordId === id
        ? { ...suggestion, deletedAt: null }
        : suggestion
    ),
  };
};

const saveCase = async () => {
  isSearchLoading.value = true;
  console.log("5");
  if (!store.checkDomain(caseData.value?.suggestions ?? [])) {
    console.log("6");
    store.deleteCaseErrorMessage =
      "無効なドメインが含まれています。正しい形式で入力してください (例: example.com)";
    isSearchLoading.value = false;
    return;
  }

  const isUpdateCaseSuccess = await store.edit(caseData.value);

  setTimeout(() => {
    if (isUpdateCaseSuccess) {
      updateCaseMessage.value = "正常に保存されました";
    } else {
      updateCaseMessage.value = store.updateCaseMessage;
    }

    isSearchLoading.value = false;

    setTimeout(() => {
      updateCaseMessage.value = "";
    }, 3000);
  }, 3000);
};

const deleteCase = async () => {
  await store.delete(String(caseData.value.id));
  if (store.deleteCaseErrorMessage == "") {
    router.push(props.onBackRoute);
  }
};

watch(
  () => store.deleteCaseErrorMessage,
  (newValue) => {
    if (newValue) {
      setTimeout(() => {
        store.deleteCaseErrorMessage = "";
      }, 10000);
    }
  }
);

watch([_keywordStore], () => {
  if (_keywordStore.getUnAssociatedKeywordErrorMessage == "") {
    if (
      !caseData.value?.suggestions ||
      !caseData.value.suggestions
        ?.map((suggestion: Suggestion) => suggestion.id)
        .includes(_keywordStore.keyword.id)
    ) {
      const suggestions = caseData.value?.suggestions ?? ([] as Suggestion[]);
      suggestions?.push({
        ..._keywordStore.keyword,
        isInOperation: 0,
      } as unknown as Suggestion);
      caseData.value = {
        ...caseData.value,
        suggestions,
      };
    }
  }
  getUnAssociatedKeywordErrorMessage.value =
    _keywordStore.getUnAssociatedKeywordErrorMessage;
});

const getKeywordList = async (keywordId: string, keywordIndex: number) => {
  isKeywordListModalShow.value = true;
  currentKeywordIndex.value = keywordIndex;

  await _resultsStore.getSearchKeyword(keywordId);

  displayedKeywords.value.forEach((keywordData) => {
    if (keywordData.percentage) {
      keywordData.isChecked = true;
    }
  });
};

const removedKeywordIds = ref(new Set());

const additionalKeyword = ref<[Competitors_Keywords[]]>([[]]);

const displayedKeywords = computed(() => {
  return _resultsStore.data.competitors_keywords?.filter(
    (keyword) => !removedKeywordIds.value.has(keyword.id)
  );
});

const removeKeyword = (id: any) => {
  removedKeywordIds.value.add(id);
};

const removeAdditionalKeyword = (deletedIndex: number) => {
  additionalKeyword.value[currentKeywordIndex.value] = additionalKeyword.value[
    currentKeywordIndex.value
  ]?.filter((_, index) => deletedIndex != index);
};

const updateSelection = async () => {
  const targetKeywordId = _resultsStore.data.id;
  const totalMonthlySearch = _resultsStore.data.totalMonthlySearches;

  const existingKeywords = new Set(
    displayedKeywords.value.map((keyword) =>
      keyword.competitors_keyword.trim().toLowerCase()
    )
  );

  let duplicateKeywords: any = [];

  const checkedAdditionalKeywords = additionalKeyword.value[
    currentKeywordIndex.value
  ]
    ?.filter((keyword) => {
      const keywordLower = keyword.competitors_keyword.trim().toLowerCase();

      if (existingKeywords.has(keywordLower)) {
        duplicateKeywords.push(keyword.competitors_keyword);
        return false;
      }

      existingKeywords.add(keywordLower);
      return keyword.isChecked;
    })
    .map((keyword) => ({
      keyword: keyword.competitors_keyword,
      volume: Number(keyword.volume),
      percentage: Number(keyword.percentage),
    }));

  if (duplicateKeywords.length > 0) {
    store.addsSearchScheduleErrorMessage = `重複するキーワードが検出されました: ${duplicateKeywords.join(
      ", "
    )}`;
    return;
  } else {
    store.addsSearchScheduleErrorMessage = "";
  }

  const checkedResultKeywords = displayedKeywords.value
    ?.filter((keyword) => keyword.isChecked)
    .map((keyword) => ({
      keyword: keyword.competitors_keyword,
      volume: keyword.volume,
      percentage: Number(keyword.percentage),
    }));

  if (
    checkedResultKeywords?.length === 0 &&
    checkedAdditionalKeywords?.length === 0
  ) {
    store.addsSearchScheduleErrorMessage = "キーワードが選択されていません";
    return;
  }

  const oldKeywords = checkedResultKeywords ?? []
  const additionalKeywords = checkedAdditionalKeywords ?? []
  await store.sendSelectedKeywords(
    targetKeywordId,
    Number(totalMonthlySearch),
    [
      ...oldKeywords,
      ...additionalKeywords,
    ] as unknown as Competitors_Keywords
  );

  if (!store.addsSearchScheduleErrorMessage) {
    isKeywordListModalShow.value = false;
  }
  additionalKeyword.value[currentKeywordIndex.value] = [];
  await store.get(caseId);
};

const addKeywordRow = () => {
  if (!caseData.value.suggestions || caseData.value.suggestions.length === 0) {
    return;
  }

  caseData.value.suggestions.forEach((suggestion, index) => {
    if (currentKeywordIndex.value == index) {
      const newId = uuidv4();
      const tempAddiditionalKeywords =
        additionalKeyword.value[currentKeywordIndex.value] ?? [];
      tempAddiditionalKeywords.push({
        id: newId,
        competitors_keyword: `${suggestion.target_keyword} ${suggestion.suggestion} `,
        volume: 0,
        percentage: 0,
        isChecked: true,
        createdAt: "",
        updatedAt: "",
        keyword_id: "",
        deleted: false,
      });
      additionalKeyword.value[currentKeywordIndex.value] =
        tempAddiditionalKeywords;
    }
  });

  nextTick(() => {
    setTimeout(() => {
      const lastRow = document.getElementById(
        `row-${
          additionalKeyword.value[currentKeywordIndex.value][
            additionalKeyword.value[currentKeywordIndex.value].length - 1
          ].id
        }`
      );
      if (lastRow) {
        lastRow.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 100);
  });
};

const limitToNumbers = (event: Event, keywordData: any) => {
  const input = (event.target as HTMLInputElement).value;
  const numericValue = input.replace(/\D/g, "").slice(0, 10);
  keywordData.volume = numericValue;
  keywordData.totalMonthlySearch = numericValue;
  keywordData.totalMonthlySearches = numericValue;
};

const limitTo3Numbers = (event: Event, keywordData: any) => {
  const input = (event.target as HTMLInputElement).value;
  const numericValue = input.replace(/\D/g, "").slice(0, 3);
  keywordData.percentage = numericValue;
};

const isAllChecked = computed(() => {
  const tempDisplayKeywords =
    displayedKeywords.value?.filter(
      (keyword) => !shouldHideCheckbox(keyword)
    ) ?? [];
  const tempAdditionalyKeywords =
    additionalKeyword.value[currentKeywordIndex.value]?.filter(
      (keyword) => !shouldHideCheckbox(keyword)
    ) ?? [];
  const allVisibleKeywords = [
    ...tempDisplayKeywords,
    ...tempAdditionalyKeywords,
  ];

  if (allVisibleKeywords.length === 0) return false;

  const checkedCount = allVisibleKeywords?.filter((k) => k.isChecked).length;

  return checkedCount === allVisibleKeywords.length;
});

const toggleCheckAll = () => {
  const tempDisplayKeywords =
    displayedKeywords.value?.filter(
      (keyword) => !shouldHideCheckbox(keyword)
    ) ?? [];
  const tempAdditionalyKeywords =
    additionalKeyword.value[currentKeywordIndex.value]?.filter(
      (keyword) => !shouldHideCheckbox(keyword)
    ) ?? [];
  const allVisibleKeywords = [
    ...tempDisplayKeywords,
    ...tempAdditionalyKeywords,
  ];

  const newState = isAllChecked.value !== true;

  allVisibleKeywords.forEach((keyword) => {
    keyword.isChecked = newState;
  });
};

const calculateVolume = (totalSearches: any, percentage: any) => {
  if (!totalSearches || !percentage) return 0;
  return Math.round((totalSearches * percentage) / 100);
};

const shouldHideCheckbox = (keywordData: any) => {
  return caseData?.value?.suggestions?.some(
    (suggestion) =>
      keywordData.competitors_keyword === suggestion.target_keyword
  );
};
watch(isKeywordListModalShow, (newValue) => {
  document.body.style.overflow = newValue ? "hidden" : "";
});

onBeforeUnmount(() => {
  document.body.style.overflow = "";
});

onMounted(() => {
  if (isKeywordListModalShow.value) {
    document.body.style.overflow = "hidden";
  }
});

const isCaseDataEdited = () => {
  if(caseData.value.projectName === store.caseData.projectName && caseData.value.customerId === store.caseData.customerId) {
    return false
  }

  return true
}

const isSuggestionHasChanges = (): boolean => {
  const existingSuggestions = store.caseData?.suggestions || [];
  const newSuggestions = caseData.value?.suggestions || [];

  if (existingSuggestions.length !== newSuggestions.length) {
    return true;
  }

  return !newSuggestions.every((s, i) => isEqual(s, existingSuggestions[i]));
}

const isDataChanges = () => {
  if(isCaseDataEdited()) {
    return true
  }
  if(isSuggestionHasChanges()){
    return true
  }

  return false
}

onBeforeRouteLeave((to, from, next) => {
  
  if (isDataChanges()) {
    if (window.confirm("保存されていない変更があります。本当に移動しますか？")) {
      next();
    } else {
      next(false);
    }
  } else {
    next();
  }
});
</script>
