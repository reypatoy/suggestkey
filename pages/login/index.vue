<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="text-center space-y-6">
      <h1 class="text-2xl font-bold text-blue-600 font-sans">SUGGEST OPTIMIZE</h1>

      <div class="flex flex-col space-y-4">
        <input
          v-model="user.email"
          type="email"
          placeholder="メールアドレス"
          aria-label="メールアドレス"
          autocomplete="email"
          required
          @keydown.enter="submit"
          class="w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 hover:border-blue-500 transition duration-300"
        />
        <input
          v-model="user.password"
          type="password"
          placeholder="パスワード"
          aria-label="パスワード"
          autocomplete="current-password"
          required
          @keydown.enter="submit"
          class="w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 hover:border-blue-500 transition duration-300"
        />
      </div>

      <button
        @click="submit"
        :disabled="isSubmitting"
        class="mt-6 w-40 py-2 text-white rounded-lg bg-gradient-to-r from-[#88d3ce] to-[#6e45e2] hover:from-[#a4fff9] hover:to-[#895eff] focus:outline-none shadow-md disabled:opacity-50 transition duration-300"
      >
        ログイン
      </button>

      <p v-if="errorMessage" class="text-red-500 text-sm">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { authStore } from "~/store/authStore";

const store = authStore();
const user = ref({ email: "", password: "" });
const isSubmitting = ref(false);

const submit = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  try {
    await store.login(user.value);
  } finally {
    isSubmitting.value = false;
  }
};

const errorMessage = computed(() => store.errorMessage);
</script>
