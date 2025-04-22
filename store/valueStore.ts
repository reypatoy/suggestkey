import { defineStore } from "pinia";
import { apiClient } from "~/api/apiClient";
import type { State, Values, Devices } from "~/types/value";

const baseApi = "search-engine/";
const baseDeviceApi = "device/";
export const valueStore = defineStore("value", {
  state: (): State => ({
    data: {} as Values,
    deviceData: {} as Devices,
  }),
  getters: {},
  actions: {
    async getSearchEngine() {
      const config = useRuntimeConfig();
      const { getToken } = useAuth();
      try {
        const header = {
          authorization: "Bearer " + getToken?.(),
        };
        const response = await apiClient(
          String(config.public.baseApi),
          header,
        ).get(baseApi + `list`);
        this.data = response?.data;
      } catch (e) {
        return e;
      }
    },
    async editSearchEngine(requestBody: {
      data: { engine: string; percentage: number }[];
    }): Promise<boolean> {
      const config = useRuntimeConfig();
      const { getToken } = useAuth();

      try {
        const header = {
          authorization: "Bearer " + getToken?.(),
        };

        await apiClient(String(config.public.baseApi), header).post(
          baseApi + `save`,
          requestBody,
        );

        return true;
      } catch (e: any) {
        console.error("Error in editSearchEngine:", e);
        return false;
      }
    },
    async getDevice(os: string = "") {
      const config = useRuntimeConfig();
      const { getToken } = useAuth();
      try {
        const header = {
          authorization: "Bearer " + getToken?.(),
        };

        const response = await apiClient(
          String(config.public.baseApi),
          header,
        ).post(baseDeviceApi + `list`, os ? { os } : {});

        this.deviceData = response?.data;
      } catch (e) {
        return e;
      }
    },

    async editDevice(requestBody: {
      pcPercentage: number;
      smartphonePercentage: number;
      data: {
        id?: number;
        type: string;
        deviceId: string;
        os: string;
      }[];
    }): Promise<boolean> {
      const config = useRuntimeConfig();
      const { getToken } = useAuth();

      try {
        const header = {
          authorization: "Bearer " + getToken?.(),
        };

        await apiClient(String(config.public.baseApi), header).post(
          baseDeviceApi + `save`,
          requestBody,
        );

        return true;
      } catch (e: any) {
        console.error("Error in editDevice:", e);
        return false;
      }
    },
  },
});
