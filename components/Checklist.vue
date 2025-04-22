<template>
  <div class="banner_title text-white text-2xl"></div>
  <main>
    <div class="wrapper absolute inset-x-0 -top-20">
      <section class="bg-white p-6 rounded-xl shadow-md">
        <div class="flex justify-between">
          <h2 class="h2 mb-1">チェックリスト</h2>

          <div class="flex gap-4">
            <div class="relative w-52">
              <select
                class="border p-1 rounded text-center w-52 appearance-none bg-white pr-8"
              >
                <option value="">検索者未選択</option>
                <option value="">AAAAA</option>
                <option value="">BBBBB</option>
                <option value="">CCCCC</option>
                <option value="">DDDDD</option>
              </select>
              <div
                class="absolute inset-y-0 right-4 flex items-center pointer-events-none text-sm"
              >
                ▼
              </div>
            </div>

            <div class="relative w-52">
              <select
                v-model="selectedDevice"
                @change="filterDevices"
                class="border p-1 rounded text-center w-52 appearance-none bg-white pr-8"
              >
                <option value="">デバイス未選択</option>
                <option
                  v-for="device in devices?.data"
                  :key="device.id"
                  :value="device.deviceId"
                >
                  {{ device.deviceId }}
                </option>
              </select>
              <div
                class="absolute inset-y-0 right-4 flex items-center pointer-events-none text-sm"
              >
                ▼
              </div>
            </div>
            <div class="flex items-center gap-4">
              <button
                @click="prevDate"
                class="text-5xl font-bold text-blue-700"
              >
                <
              </button>
              <span>{{ formattedDate }}</span>
              <button
                @click="nextDate"
                class="text-5xl font-bold"
                :class="{
                  'text-blue-700':
                    currentDate.toDateString() !== new Date().toDateString(),
                  'text-gray-400':
                    currentDate.toDateString() === new Date().toDateString(),
                }"
                :disabled="
                  currentDate.toDateString() === new Date().toDateString()
                "
              >
                >
              </button>
            </div>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="t1 mt-6 w-full border min-w-[1000px]">
            <thead>
              <tr class="bg-gray-200">
                <td class="w-[60%] text-center p-2">検索ワード</td>
                <td class="text-center p-2">検索エンジン</td>
                <td class="text-center p-2">検索デバイス</td>
                <td class="text-center p-2">作業日・登録日</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="keyword in schedulesData?.result" :key="keyword.id">
                <td>
                  <div>
                    <span class="mr-4">{{ keyword.id }}</span>
                    <span class="font-bold">{{ keyword.searchKeyword }}</span>
                    <button
                      class="bg-blue-800 px-4 text-white rounded-full ml-4"
                      @click="copyKeyword(keyword)"
                    >
                      コピー
                    </button>
                  </div>
                  <div class="flex gap-4 items-center my-2">
                    <span>ターゲットドメイン：</span>
                    <span>{{ keyword.targetDomain }}</span>
                  </div>
                  <div class="flex gap-4 items-center">
                    <span>クリックしたURL：</span>
                    <input
                      type="text"
                      class="!w-[75%]"
                      v-model="keyword.clickUrl"
                    />
                  </div>
                </td>
                <td>
                  <div class="flex flex-col justify-center items-center">
                    <span
                      :class="[
                        'text-white border rounded-2xl px-2 pb-1',
                        keyword.searchEngine === 'Google'
                          ? 'bg-[#4cb4c6]'
                          : keyword.searchEngine === 'Yahoo'
                          ? 'bg-[#e55352]'
                          : 'bg-gray-500',
                      ]"
                    >
                      {{
                        keyword.searchEngine.charAt(0).toUpperCase() +
                        keyword.searchEngine.slice(1)
                      }}
                    </span>
                  </div>
                </td>
                <td>
                  <div class="flex flex-col justify-center items-center">
                    <span>{{ keyword.worker }}</span>
                    <span>{{ keyword.deviceId }}</span>
                  </div>
                </td>
                <td>
                  <div class="flex flex-col justify-center items-center">
                    <span>{{ keyword.createdAt }}</span>
                    <span>{{ keyword.searchDate }}</span>
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

    <v-snackbar v-model="snackbarVisible" :color="snackbarColor" timeout="3000">
      {{ snackbarMessage }}
    </v-snackbar>
  </main>
</template>

<script lang="ts" setup>
import { checklistStore } from "~/store/checklist";
import type { Checklist, ChecklistData } from "~/types/checklist";
import { ScheduleSelector } from "~/types/scheduleSelector";
import { valueStore } from "~/store/valueStore";
import type { Devices } from "~/types/value";

const storeValue = valueStore();

const _checklistStore = checklistStore();
const devices = ref<Devices>();
const selectedDevice = ref("");
const snackbarVisible = ref(false);
const snackbarMessage = ref("");
const snackbarColor = ref("success");
const debounceTimers = ref<{
  [key: string]: ReturnType<typeof setTimeout> | null;
}>({});

const props = defineProps(["id"]);

const currentDate = ref(new Date());

const formattedDate = computed(() => {
  return currentDate.value.toISOString().split("T")[0].replace(/-/g, "/");
});

const selector = ref<ScheduleSelector>(
  new ScheduleSelector({
    keywordId: props.id,
    page: 1,
    limit: 20,
    worker: "",
    deviceId: "",
    searchDate: formattedDate.value,
  })
);

const schedulesData = ref<ChecklistData>();

const getGenereatedSearch = async () => {
  schedulesData.value = await _checklistStore.getGeneratedSearches(
    selector.value
  );
};

const getDevices = async () => {
  await storeValue.getDevice();
  devices.value = storeValue.deviceData;
};

onMounted(() => {
  getGenereatedSearch();
  getDevices();
});

const copyKeyword = (keyword: Checklist) => {
  if (keyword?.searchKeyword) {
    navigator.clipboard
      .writeText(keyword.searchKeyword)
      .then(() => {
        snackbarMessage.value = "キーワードがコピーされました！";
        snackbarColor.value = "success";
        snackbarVisible.value = true;
      })
      .catch(() => {
        snackbarMessage.value = "コピーに失敗しました。";
        snackbarColor.value = "error";
        snackbarVisible.value = true;
      });
  } else {
    snackbarMessage.value = "コピーするキーワードがありません！";
    snackbarColor.value = "error";
    snackbarVisible.value = true;
  }
};

const updateClickUrlDebounced = (id: string, newValue: string) => {
  if (debounceTimers.value[id]) {
    clearTimeout(debounceTimers.value[id]!);
  }

  debounceTimers.value[id] = setTimeout(async () => {
    if (!newValue) return;

    await _checklistStore.updateClickUrl({
      id,
      clickUrl: newValue,
    } as Checklist);
  }, 3000);
};

watch(
  [schedulesData],
  () => {
    schedulesData.value?.result?.forEach((keyword) => {
      watch(
        () => keyword.clickUrl,
        (newValue) => {
          updateClickUrlDebounced(keyword.id, newValue);
        }
      );
    });
  },
  { deep: true }
);

const filterDevices = async (event: Event) => {
  const target = event.target as HTMLSelectElement;
  selectedDevice.value = target.value;
  selector.value.deviceId = target.value;
  await getGenereatedSearch();
};

const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0].replace(/-/g, "/");
};

watch(currentDate, (newDate) => {
  selector.value.searchDate = formatDate(newDate);
});

const prevDate = () => {
  currentDate.value.setDate(currentDate.value.getDate() - 1);
  currentDate.value = new Date(currentDate.value);
  selector.value.searchDate = formattedDate.value;
  getGenereatedSearch();
};

const nextDate = () => {
  const today = new Date();

  if (currentDate.value < today) {
    currentDate.value.setDate(currentDate.value.getDate() + 1);
    currentDate.value = new Date(currentDate.value);
    selector.value.searchDate = formattedDate.value;
    getGenereatedSearch();
  }
};

const totalPages = computed(() =>
  Math.ceil(Number(schedulesData.value?.total || 0) / selector.value.limit)
);

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    selector.value.page = page;
    getGenereatedSearch();
  }
};

const route = useRoute();
const userRoute = "/areus";

const showReturnButton = computed(() => {
  return route.path === `${userRoute}/checklist/${props.id}`;
});
</script>
