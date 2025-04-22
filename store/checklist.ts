import { defineStore } from "pinia";
import { apiClient } from "~/api/apiClient";
import type { Checklist } from "~/types/checklist";
import type { ScheduleSelector } from "~/types/scheduleSelector";

const baseApi = "competitors/keywords/";
export const checklistStore = defineStore("checklist", {
  getters: {},
  actions: {
    async getGeneratedSearches(req: ScheduleSelector) {
      const config = useRuntimeConfig();
      const { getToken } = useAuth();
      try {
        const header = {
          authorization: "Bearer " + getToken?.(),
        };
        const response = await apiClient(
          String(config.public.baseApi),
          header,
        ).post(baseApi + "schedules", req);
        return response?.data;
      } catch (e) {
        console.log(e);
      }
    },
    async updateClickUrl(req: Checklist) {
      const config = useRuntimeConfig();
      const { getToken } = useAuth();
      try {
        const header = {
          authorization: "Bearer " + getToken?.(),
        };
        const response = await apiClient(
          String(config.public.baseApi),
          header,
        ).post(baseApi + "schedule/update", req);
        return response?.data;
      } catch (e) {
        console.log(e);
      }
    },
  },
});
