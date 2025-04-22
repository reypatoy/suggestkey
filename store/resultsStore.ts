import { defineStore } from "pinia";
import { apiClient } from "~/api/apiClient";
import type { Results, State } from "~/types/results";

export const resultsStore = defineStore("result", {
  state: (): State => ({
    data: {} as Results,
  }),
  getters: {},
  actions: {
    async getKeywordByID(keyword_id: string) {
      const config = useRuntimeConfig();
      const { getToken } = useAuth();
      try {
        const header = {
          authorization: "Bearer " + getToken?.(),
        };
        const response = await apiClient(
          String(config.public.baseApi),
          header,
        ).post("/competitors/keywords", { keyword_id });
        this.data = response?.data;
      } catch (e) {
        return e;
      }
    },
    async getSearchKeyword(keyword_id: string) {
      const config = useRuntimeConfig();
      const { getToken } = useAuth();
      try {
        const header = {
          authorization: "Bearer " + getToken?.(),
        };
        const response = await apiClient(
          String(config.public.baseApi),
          header,
        ).post("/competitors/keywords/for-generate-search-schedule", { keyword_id });
        this.data = response?.data;
      } catch (e) {
        return e;
      }
    },
  },
});
