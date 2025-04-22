<template>
  <div class="banner_title text-white text-4xl">マスタ設定</div>
  <main>
    <div class="wrapper absolute inset-x-0 -top-20">
      <section class="bg-white p-6 rounded-xl shadow-md">
        <h2 class="h2 mb-1">表示数</h2>
        <div class="grid grid-cols-3 gap-4">
          <div class="p-6 border rounded-xl text-center">
            <p class="text-9xl font-bold text-[#6e45e2]">
              {{ results?.datacount }}
            </p>
            <p class="text-gray-500 text-sm">検索エンジン</p>
          </div>
          <div class="p-6 border rounded-xl text-center">
            <p class="text-9xl font-bold text-[#6e45e2]">
              {{ storeValue?.deviceData?.smartphone?.count }}
            </p>
            <p class="text-gray-500 text-sm">Smartphone</p>
          </div>
          <div class="p-6 border rounded-xl text-center">
            <p class="text-9xl font-bold text-[#6e45e2]">
              {{ storeValue?.deviceData?.pc?.count }}
            </p>
            <p class="text-gray-500 text-sm">PC</p>
          </div>
        </div>
      </section>
      <section class="bg-white p-6 rounded-xl shadow-md">
        <div class="flex items-center gap-2">
          <h2 class="h2 mb-1">検索エンジン</h2>
          <button @click="toggleEditMode">
            <svg
              v-if="isEditMode"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#2053a2"
              class="size-8"
            >
              <path
                fill-rule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                clip-rule="evenodd"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#4cb4c6"
              class="size-8"
            >
              <path
                d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z"
              />
              <path
                d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z"
              />
            </svg>
          </button>

          <button v-if="isEditMode" @click="cancelEditMode">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#e55352"
              class="size-8"
            >
              <path
                fill-rule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div class="relative">
          <p v-if="errorMessage" class="text-red-500 font-semibold mt-2">
            {{ errorMessage }}
          </p>
          <table class="t1">
            <thead>
              <tr>
                <td class="text-center">検索エンジン</td>
                <td class="text-center w-28">比率</td>
                <td class="text-center w-28" v-if="isEditMode"></td>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(values, index) in storeValue.data.searchEngines"
                :key="index"
              >
                <td class="text-center">
                  <input
                    type="text"
                    variant="outlined"
                    :readonly="!isEditMode"
                    v-model="values.engine"
                  />
                </td>
                <td class="flex justify-center !items-center gap-2">
                  <input
                    type="text"
                    class="!w-20"
                    @input="(event) => limitToNumbers(event, values)"
                    variant="outlined"
                    :readonly="!isEditMode"
                    v-model="values.percentage"
                  />
                  <span>%</span>
                </td>
                <td v-if="isEditMode">
                  <button @click="removeRow(index)">
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
          <div class="absolute left-1/2 -translate-x-1/2 -bottom-7">
            <button v-if="isEditMode" @click="addNewRow">
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
      </section>
      <section class="bg-white p-6 rounded-xl shadow-md">
        <div class="flex !justify-between">
          <div class="flex items-center gap-2">
            <h2 class="h2 mb-1">デバイス</h2>
            <button @click="toggleDeviceEditMode">
              <svg
                v-if="isDeviceEditMode"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#2053a2"
                class="size-8"
              >
                <path
                  fill-rule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#4cb4c6"
                class="size-8"
              >
                <path
                  d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z"
                />
                <path
                  d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z"
                />
              </svg>
            </button>

            <button v-if="isDeviceEditMode" @click="cancelDeviceEditMode">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#e55352"
                class="size-8"
              >
                <path
                  fill-rule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div class="flex gap-2 items-center">
            <span>Smartphone:</span>
            <input
              type="text"
              class="!w-28 border p-1 rounded"
              :readonly="!isDeviceEditMode"
              v-model="smartphonePercentage"
            />
            <span class="mr-4">%</span>
            <span>PC:</span>
            <input
              type="text"
              class="!w-28 border p-1 rounded"
              readonly
              v-model="pcPercentage"
            />
            <span class="mr-4">%</span>
            <div class="relative">
              <select
                class="border p-1 rounded text-center w-52 appearance-none bg-white pr-8"
                :disabled="isDeviceEditMode"
                v-model="selectedDeviceType"
                @change="getDevices(selectedDeviceType)"
              >
                <option value="">OSで絞り込み</option>
                <option value="Windows">Windows</option>
                <option value="Mac">Mac</option>
                <option value="IOS">iOS</option>
                <option value="Android">Android</option>
                <option value="その他">その他</option>
              </select>
              <div
                class="absolute inset-y-0 right-4 flex items-center pointer-events-none text-sm"
              >
                ▼
              </div>
            </div>
          </div>
        </div>
        <div class="relative">
          <p v-if="errorMessageDevice" class="text-red-500 font-semibold mt-2">
            {{ errorMessageDevice }}
          </p>
          <table class="t1 mt-6 w-full border">
            <thead>
              <tr class="bg-gray-200">
                <td class="text-center p-2">デバイス</td>
                <td class="w-[60%] text-center p-2">デバイスID</td>
                <td class="text-center p-2">OS</td>
                <td v-if="isDeviceEditMode"></td>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(devices, index) in storeValue.deviceData.data"
                :key="index"
              >
                <td class="text-center p-2">
                  <div class="relative">
                    <select
                      class="border p-1 rounded text-center"
                      :disabled="!isDeviceEditMode"
                      v-model="devices.type"
                    >
                      <option>Smartphone</option>
                      <option>PC</option>
                    </select>
                    <div
                      class="absolute inset-y-0 right-4 flex items-center pointer-events-none text-sm"
                    >
                      ▼
                    </div>
                  </div>
                </td>
                <td class="flex items-center p-2">
                  <input
                    type="text"
                    class="w-[60%] border p-1 rounded"
                    :readonly="!isDeviceEditMode"
                    v-model="devices.deviceId"
                  />
                </td>
                <td class="text-center p-2">
                  <div class="relative">
                    <select
                      class="border p-1 rounded text-center"
                      :disabled="!isDeviceEditMode"
                      v-model="devices.os"
                    >
                      <option
                      v-if="devices.type"
                        v-for="os in getOSOptions(devices.type)"
                        :key="os"
                      >
                        {{ os }}
                      </option>
                    </select>
                    <div
                      class="absolute inset-y-0 right-4 flex items-center pointer-events-none text-sm"
                    >
                      ▼
                    </div>
                  </div>
                </td>
                <td v-if="isDeviceEditMode">
                  <button @click="removeDeviceRow(index)">
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
          <div class="absolute left-1/2 -translate-x-1/2 -bottom-7">
            <button v-if="isDeviceEditMode" @click="addNewDeviceRow">
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
      </section>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { valueStore } from "~/store/valueStore";
import type { Values, Devices } from "~/types/value";

const storeValue = valueStore();
const results = ref<Values>();
const devices = ref<Devices>();
const isEditMode = ref(false);
const isDeviceEditMode = ref(false);
const errorMessage = ref("");
const errorMessageDevice = ref("");
const pcPercentage = ref();
const smartphonePercentage = ref();
const selectedDeviceType = ref("");

onMounted(() => {
  getSearchEngines();
  getDevices();
});

const getSearchEngines = async () => {
  await storeValue.getSearchEngine();
  results.value = storeValue.data;
};

const getDevices = async (deviceType: string = "") => {
  await storeValue.getDevice(deviceType);
  devices.value = storeValue.deviceData;

  pcPercentage.value = storeValue.deviceData.pc.percentage;
  smartphonePercentage.value = storeValue.deviceData.smartphone.percentage;
};

const toggleEditMode = async () => {
  if (isEditMode.value) {
    await saveData();

    if (errorMessage.value) {
      return;
    }

    await getSearchEngines();
  }

  isEditMode.value = !isEditMode.value;
};

const cancelEditMode = () => {
  isEditMode.value = false;
  errorMessage.value = "";
  getSearchEngines();
};

const toggleDeviceEditMode = async () => {
  if (isDeviceEditMode.value) {
    await saveDeviceData();

    if (errorMessageDevice.value) {
      return;
    }

    await getDevices();
  }
  isDeviceEditMode.value = !isDeviceEditMode.value;
};

const cancelDeviceEditMode = () => {
  isDeviceEditMode.value = false;
  errorMessageDevice.value = "";
  getDevices();
};

const addNewRow = () => {
  storeValue.data.searchEngines.push({
    engine: "",
    percentage: 0,
  } as any);
};

const addNewDeviceRow = () => {
  storeValue.deviceData.data.push({
    type: "",
    deviceId: "",
    os: "",
  } as any);
};

const removeRow = (index: number) => {
  storeValue.data.searchEngines.splice(index, 1);
};

const removeDeviceRow = (index: number) => {
  storeValue.deviceData.data.splice(index, 1);
};

const saveData = async () => {
  try {
    errorMessage.value = "";

    const requestBody = {
      data: storeValue.data.searchEngines.map(({ engine, percentage }) => ({
        engine,
        percentage: Number(percentage),
      })),
    };

    const errors = [];
    if (requestBody.data.some((item) => item.percentage === 0)) {
      errors.push("比率は0%より大きい値を設定してください");
    }
    if (
      requestBody.data.reduce((sum, item) => sum + item.percentage, 0) !== 100
    ) {
      errors.push("比率の合計が100%になるよう設定してください");
    }
    const hasEmptyFields = storeValue.data.searchEngines.some(
      (values) => !values.engine.trim() || !String(values.percentage).trim()
    );

    if (hasEmptyFields) {
      errorMessage.value = "入力欄は空にできません";
      return;
    }

    if (errors.length > 0) {
      errorMessage.value = errors.join(" | ");
      return;
    }

    await storeValue.editSearchEngine(requestBody);
    await getSearchEngines();
  } catch (error) {
    console.error("Error saving data:", error);
    errorMessage.value = "データの保存中にエラーが発生しました";
  }
};

const saveDeviceData = async () => {
  try {
    errorMessageDevice.value = "";

    const pcPercentageNum = Number(pcPercentage.value);
    const smartphonePercentageNum = Number(smartphonePercentage.value);
    const totalPercentage = pcPercentageNum + smartphonePercentageNum;

    if (totalPercentage !== 100) {
      errorMessageDevice.value =
        "合計パーセンテージは正確に100%である必要があります";
      return;
    }

    const requestBody = {
      pcPercentage: pcPercentageNum,
      smartphonePercentage: smartphonePercentageNum,
      data: storeValue.deviceData.data.map(({ id, type, deviceId, os }) => ({
        id,
        type,
        deviceId,
        os,
      })),
    };
    
    const hasEmptyFields = storeValue.deviceData.data.some(
      (devices) => !devices.deviceId.trim()
    );

    if (hasEmptyFields) {
      errorMessageDevice.value = "入力欄は空にできません";
      return;
    }

    const response = await storeValue.editDevice(requestBody);

    if (
      Array.isArray(response) &&
      response.some(
        ({ code, message }) =>
          code === "custom" &&
          message === "Total percentage must be exactly 100%"
      )
    ) {
      errorMessageDevice.value =
        "API Error: Total percentage must be exactly 100%";
      return;
    }

  } catch (error) {
    console.error("Error saving device data:", error);
    errorMessageDevice.value = "デバイスデータの保存中にエラーが発生しました";
  }
};

const getOSOptions = (os: string): string[] => {
  return os === "Smartphone" ? ["Android", "IOS"] : ["Windows", "MAC"];
};

watch(smartphonePercentage, (newVal) => {
  const numValue = parseFloat(newVal);
  if (!isNaN(numValue)) {
    pcPercentage.value = parseFloat((100 - numValue).toFixed(2));
  }
});

const limitToNumbers = (event: Event, values: any) => {
  const input = (event.target as HTMLInputElement).value;
  const numericValue = input.replace(/\D/g, "").slice(0, 2);
  values.percentage = numericValue;
};
</script>
