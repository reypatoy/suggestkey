<template>
  <div class="flex items-center justify-center w-full h-screen bg-gray-100">
    <div class="text-center bg-white p-8 shadow-lg rounded-lg">
      <h1 class="text-2xl font-bold text-red-600 mb-4">無許可の</h1>
      <p class="text-gray-600 mb-6">このページを表示する権限がありません。</p>

      <div class="space-x-4">
        <button
          class="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          @click="goBack"
        >
          戻る
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goBack = () => {
  router.back();
};
</script>
