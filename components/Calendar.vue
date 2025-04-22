<template>
  <div>
    <div class="banner_title text-white text-4xl">
      <h1 class="text-white text-4xl">{{ props?.caseName }}</h1>
      <h1 class="text-white text-2xl pt-8">
        検索開始日：{{ formattedDateStart }}
      </h1>
      <div class="relative place-items-center pt-8">
        <select
          v-model="selectedOption"
          @change="fetchKeywords"
          class="block w-2/5 appearance-none bg-transparent border border-white text-white rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-no-repeat bg-[length:1.5rem_1.5rem] cursor-pointer text-center"
          :style="{
            backgroundImage: `url('data:image/svg+xml,${dropdownIcon}')`,
            backgroundPosition: 'calc(100% - 6px) center',
          }"
        >
          <option
            v-for="keyword in keywords"
            :key="keyword.id"
            :value="keyword.id"
            class="text-black"
          >
            {{ keyword.target_keyword }} × {{ keyword.suggestion }}
          </option>

          <option
            v-if="!keywords?.length"
            disabled
            class="text-black text-center"
          >
            データがありません
          </option>
        </select>
      </div>
      <h1 class="text-white text-2xl pt-8">
        ターゲットワード × サジェストワード
      </h1>
    </div>
    <main>
      <div
        class="wrapper absolute inset-x-0 -top-20"
        v-if="store.summary.startSearch !== undefined && keywords?.length"
      >
        <div class="p-6 bg-white rounded-3xl shadow-md max-w-8xl mx-auto">
          <div class="flex">
            <div
              class="w-2 h-12 bg-gradient-to-b from-[#88d3ce] to-[#6e45e2] rounded-full"
            ></div>
            <h1 class="text-4xl ml-2">表示結果</h1>
            <div
              class="block appearance-none w-1/6 absolute right-60 top-0 bg-transparent rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent bg-no-repeat bg-[length:1.5rem_1.5rem] cursor-pointer text-center"
            >
              <v-switch
                v-model="selectedOptionSearchEngine"
                :value="'google'"
                :false-value="'yahoo'"
                :label="
                  selectedOptionSearchEngine === 'google' ? 'Google' : 'Yahoo'
                "
                inset
                color="#2053a2"
                class="mr-2 custom-switch"
                @change="toggleSearchEngine(selectedOptionSearchEngine)"
                style="
                  font-family: 'Google Sans', sans-serif;
                  font-weight: bold;
                "
              >
                <template #thumb>
                  <svg
                    v-if="selectedOptionSearchEngine === 'google'"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="30"
                    height="30"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#fbc02d"
                      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                    ></path>
                    <path
                      fill="#e53935"
                      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                    ></path>
                    <path
                      fill="#4caf50"
                      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                    ></path>
                    <path
                      fill="#1565c0"
                      d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                    ></path>
                  </svg>
                  <svg
                    v-if="selectedOptionSearchEngine === 'yahoo'"
                    xmlns="http://www.w3.org/2000/svg"
                    enable-background="new 0 0 100 100"
                    height="50px"
                    id="Layer_1"
                    version="1.1"
                    viewBox="0 0 100 100"
                    width="50px"
                    xml:space="preserve"
                  >
                    <g>
                      <defs>
                        <rect height="100" id="SVGID_1_" width="100" />
                      </defs>
                      <path
                        d="M77.495,36.349c-2.203,0.594-22.353,16.219-23.681,20.053   c-0.293,1.324,0.029,14.166,0.322,16.092c1.328,0.295,10.913,0.038,12.672,0.332l-0.211,3.97   c-1.723-0.134-13.902-0.103-20.852-0.103c-3.532,0-14.885,0.391-18.372,0.289l0.659-3.778c1.914-0.141,9.831,0.353,11.566-1.497   c0.863-0.92,0.592-13.124,0.299-15.188c-0.733-2.206-18.391-24.333-23.005-27.958H5V23h40.109v0.384   c0.035,0,0.102,0.006,0.136,0.013l-0.136,0.94v4.225H33.014c5.391,7.883,13.12,17.4,16.416,21.973l16.155-14.64h-9.603   l-1.353-5.556h35.175l-0.26,0.396c0.028,0,0.086,0.006,0.124,0.006l-2.513,3.645c-0.022,0-0.061,0.006-0.08,0.012l-1.015,1.497   h-6.487C78.734,36.08,77.995,36.245,77.495,36.349 M88.973,71.184l-3.105-0.154l-3.465-0.422l0.029,5.939l2.732,0.235L88.109,77   L88.973,71.184z M95,42.792c-1.048-0.037-10.576-0.939-11.814-1.184L83.332,66.7l5.393,0.436L95,42.792z"
                      />
                    </g>
                  </svg>
                </template>
              </v-switch>
            </div>

            <div
              v-if="authstore.role !== '1' && authstore.role !== '2'"
              class="btn-primary absolute inset-y-0 right-14 top-4 h-fit"
            >
              <a href="#" data-modal="add" @click="downloadAsCsv"
                >CSVでダウロード</a
              >
            </div>
          </div>

          <div class="flex place-self-center">
            <button
              @click="prevMonth"
              :disabled="prevMonthDisabled"
              :class="prevMonthDisabled ? 'cursor-not-allowed opacity-50' : ''"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#1E3A8A"
                class="size-12"
              >
                <path
                  fill-rule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-4.28 9.22a.75.75 0 0 0 0 1.06l3 3a.75.75 0 1 0 1.06-1.06l-1.72-1.72h5.69a.75.75 0 0 0 0-1.5h-5.69l1.72-1.72a.75.75 0 0 0-1.06-1.06l-3 3Z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
            <h1 class="text-4xl px-8">{{ formattedDate }}</h1>
            <button
              @click="nextMonth"
              :disabled="nextMonthDisabled"
              :class="nextMonthDisabled ? 'cursor-not-allowed opacity-50' : ''"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#1E3A8A"
                class="size-12"
              >
                <path
                  fill-rule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div
            v-if="store.summary.days?.length"
            class="max-w-full mx-auto bg-gray-100 rounded-3xl shadow-lg mt-4"
          >
            <div
              class="grid grid-cols-7 p-4 bg-gray-200 text-gray-700 font-semibold rounded-t-3xl py-12"
            >
              <span class="text-red-500 text-center">日</span>
              <span class="text-center">月</span>
              <span class="text-center">火</span>
              <span class="text-center">水</span>
              <span class="text-center">木</span>
              <span class="text-center">金</span>
              <span class="text-blue-400 text-center">土</span>
            </div>

            <div class="grid grid-cols-7 border border-gray-200 rounded-b-3xl">
              <template
                v-for="(day, index) in generateCalendarDays"
                :key="day.id"
              >
                <div
                  :class="[
                    'border border-gray-200 py-6',
                    index >= generateCalendarDays.length - 7 && index % 7 === 0
                      ? 'rounded-bl-3xl'
                      : '',
                    index >= generateCalendarDays.length - 7 &&
                    (index + 1) % 7 === 0
                      ? 'rounded-br-3xl'
                      : '',
                  ]"
                >
                  <div
                    :class="day.highlight"
                    class="text-grey-600 rounded-full w-20 h-20 text-center place-self-center pt-4 hover:cursor-pointer"
                    @click="showTooltip($event, day.completionResults)"
                  >
                    {{ day.date }}
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div v-else class="text-center mt-20 pt-8">
            データが見つかりません
          </div>
        </div>
      </div>
      <div v-else class="text-center mt-20 pt-8">データが見つかりません</div>

      <div
        v-if="tooltipVisible"
        :style="tooltipStyles"
        class="absolute bg-gray-300 text-black rounded-md shadow-lg z-50 h-fit text-xl"
      >
        <span v-if="tooltipContent && tooltipContent.length > 0">
          <pre class="p-6">{{ tooltipContent.join("\n") }}</pre>
        </span>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { Keyword } from "~/types/keyword";
import { keywordStore } from "~/store/keywordStore";
import { getDaysInMonth } from "date-fns";
import { authStore } from "~/store/authStore";

definePageMeta({
  layout: "layout",
});

useHead({
  title: "Suggest Optimize",
});

const authstore = authStore();
const store = keywordStore();
const selectedOption = ref<string>("");
const selectedOptionSearchEngine = ref<"google" | "yahoo">("google");
const today = ref(new Date());
const keywordSummaryData = ref();

const props = defineProps(["keywords", "caseName"]);
const keywords = ref<Keyword[]>(props.keywords);

const formattedDateStart = computed(() => {
  if (store?.summary?.startSearch) {
    const startDate = new Date(store.summary.startSearch);
    return `${startDate.getFullYear()}年${
      startDate.getMonth() + 1
    }月${startDate.getDate()}日`;
  }
  return "";
});

const formattedDate = computed(() => {
  return `${store.summary.year}年${store.summary.month}月`;
});

onMounted(async () => {
  if (keywords.value.length > 0) {
    selectedOption.value = keywords.value?.[0].id;
    await fetchKeywords();
    keywordSummaryData.value = store.summary;
  }
  if (!selectedOptionSearchEngine.value) {
    selectedOptionSearchEngine.value = "google";
  }

  generateCalendarDays.value = generateCalendar();
  updateButtonStates();
});

const fetchKeywords = async () => {
  await store.getGoogleSearchSummary(
    selectedOption.value,
    today.value.toString(),
    selectedOptionSearchEngine.value
  );

  keywordSummaryData.value = store.summary;
  generateCalendarDays.value = generateCalendar();
  updateButtonStates();
};

const fetchKeywordsBySearchEngine = async () => {
  await fetchKeywords();
};

const prevMonthDisabled = ref(false);
const nextMonthDisabled = ref(false);

const updateButtonStates = () => {
  const nextMonthDate = new Date(today.value);
  nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);

  nextMonthDisabled.value = !keywordSummaryData.value.isNextDate;

  prevMonthDisabled.value = !keywordSummaryData.value.isPrevDate;
};

const downloadAsCsv = async () => {
  await store?.downloadCsv(selectedOption.value, today.value.toString());
  console.log("CSV: ", selectedOption.value, today.value.toString());
};

const prevMonth = async () => {
  if (prevMonthDisabled.value) return;

  const newDate = new Date(store.summary.year, store.summary.month - 2, 10);
  await store.getGoogleSearchSummary(
    selectedOption.value,
    newDate.toString(),
    selectedOptionSearchEngine.value
  );
  keywordSummaryData.value = store.summary;
  today.value = newDate;
  generateCalendarDays.value = generateCalendar();
  updateButtonStates();
};

const nextMonth = async () => {
  if (nextMonthDisabled.value) return;

  const newDate = new Date(store.summary.year, store.summary.month, 10);

  await store.getGoogleSearchSummary(
    selectedOption.value,
    newDate.toString(),
    selectedOptionSearchEngine.value
  );
  keywordSummaryData.value = store.summary;
  today.value = newDate;
  generateCalendarDays.value = generateCalendar();
  updateButtonStates();
};
const generateCalendarDays = ref();

const generateCalendar = () => {
  const days = [];
  const currentYear = today.value.getFullYear();
  const currentMonth = today.value.getMonth();
  const tempDate = new Date(currentYear, currentMonth);
  const daysInMonth = getDaysInMonth(tempDate);

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push({
      id: `empty-${i}`,
      date: "",
      highlight: false,
    });
  }

  for (let i = 0; i < daysInMonth; i++) {
    const data = keywordSummaryData.value.days?.[i];
    if (data?.googleAutoComplete?.autocomplete_keywords) {
      days.push({
        id: i,
        date: i + 1,
        highlight: data.googleAutoComplete.is_suggested
          ? "bg-cyan-300 text-white"
          : "bg-gray-600 text-white",
        completionResults:
          data?.googleAutoComplete?.autocomplete_keywords?.split(","),
      });
    } else {
      days.push({
        id: i,
        date: i + 1,
        highlight: "",
      });
    }
  }

  const lastDayOfMonth = (firstDayOfMonth + totalDaysInMonth - 1) % 7;
  const remainingDaysToSaturday = (5 - lastDayOfMonth + 1) % 7;

  for (let i = 0; i < remainingDaysToSaturday; i++) {
    days.push({
      id: `empty-end-${i}`,
      date: "",
      highlight: false,
    });
  }

  return days;
};

const tooltipVisible = ref(false);
const tooltipContent = ref<string[] | null>(null);
const tooltipStyles = ref<{ top: string; left: string }>({
  top: "0px",
  left: "0px",
});

const showTooltip = (
  event: MouseEvent,
  completionResults: string[] | undefined
) => {
  if (!completionResults || completionResults.length === 0) {
    tooltipContent.value = null;
  } else {
    tooltipContent.value = completionResults;
  }

  tooltipVisible.value = true;
  tooltipStyles.value = {
    top: `200px`,
    left: `${event.clientX}px`,
  };

  setTimeout(() => {
    tooltipVisible.value = false;
  }, 7000);

  document.addEventListener("mousedown", handleOutsideClick);
};

const handleOutsideClick = () => {
  tooltipVisible.value = false;
};

const toggleSearchEngine = (engine: "google" | "yahoo") => {
  selectedOptionSearchEngine.value = engine;
  fetchKeywordsBySearchEngine();
};

const dropdownIcon = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white"><path d="M5.516 7.548L10 12.032l4.484-4.484a1 1 0 0 1 1.415 1.415l-5.192 5.193a1 1 0 0 1-1.415 0L4.1 8.963a1 1 0 0 1 1.415-1.415z"/></svg>`
);
</script>
