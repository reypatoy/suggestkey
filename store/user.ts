import { defineStore } from "pinia";
import { apiClient } from "~/api/apiClient";
import type { ListResponse } from "~/types/listResponse";
import type { Customer, State, User, UserSelector } from "~/types/user";

const baseURL = "user/";

export const useMyUserStore = defineStore({
  id: "myUserStore",
  state: (): State => ({
    listResponse: {} as ListResponse<User>,
    saveUserMessage: null as unknown as string,
    isSaveUserSuccess: true,
    deleteUserMessage: null as unknown as string,
    deleteNotifMessage: null as unknown as string,
    isDeleteUserSuccess: true,
    customers: [] as Customer[],
  }),
  actions: {
    async getUserList(selector: UserSelector): Promise<void> {
      const config = useRuntimeConfig();
      const { getToken } = useAuth();
      try {
        const header = {
          authorization: "Bearer " + getToken?.(),
        };
        const response = await apiClient(
          String(config.public.baseApi),
          header,
        ).post(baseURL + "list", selector);
        this.listResponse = response.data as ListResponse<User>;
      } catch (e) {
        this.listResponse = {} as ListResponse<User>;
      }
    },
    async addUser(user: User): Promise<void> {
      const config = useRuntimeConfig();
      const { getToken } = useAuth();
      try {
        const header = {
          authorization: "Bearer " + getToken?.(),
        };
        const response = await apiClient(
          String(config.public.baseApi),
          header,
        ).post(baseURL + "add", user);
        this.saveUserMessage = response.data;
        this.isSaveUserSuccess = true;
      } catch (e: any) {
        this.isSaveUserSuccess = false;
        if (e.status === 400) {
          this.saveUserMessage = "入力欄は空にできません";
        } else {
          this.saveUserMessage = e.response.data;
        }
      }
    },
    async edit(user: User): Promise<void> {
      const config = useRuntimeConfig();
      const { getToken } = useAuth();
      try {
        const header = {
          authorization: "Bearer " + getToken?.(),
        };
        const response = await apiClient(
          String(config.public.baseApi),
          header,
        ).post(baseURL + "edit", user);
        this.saveUserMessage = response.data;
        this.isSaveUserSuccess = true;
      } catch (e: any) {
        this.isSaveUserSuccess = false;
        if (e.status === 400) {
          this.saveUserMessage = "ユーザー情報の更新に失敗しました";
        } else {
          this.saveUserMessage = e.response.data;
        }
      }
    },
    async delete(id: string): Promise<void> {
      const config = useRuntimeConfig();
      const { getToken } = useAuth();
      try {
        const header = {
          authorization: "Bearer " + getToken?.(),
        };
        const response = await apiClient(
          String(config.public.baseApi),
          header,
        ).post(baseURL + "delete", { id });
        this.deleteUserMessage = response.data;
        this.isDeleteUserSuccess = true;
      } catch (e: any) {
        this.isDeleteUserSuccess = false;
        if (e.status === 400) {
          this.deleteUserMessage = e.response.data;
        } else {
          this.deleteUserMessage = "ユーザーの削除に失敗しました";
        }
      }
    },
    resetDeleteUserMessage() {
      this.deleteUserMessage = null as unknown as string;
    },
    async getCustomers(): Promise<void> {
      const config = useRuntimeConfig();
      const { getToken } = useAuth();
      try {
        const header = {
          authorization: "Bearer " + getToken?.(),
        };
        const response = await apiClient(
          String(config.public.baseApi),
          header,
        ).get(baseURL + "customers");
        this.customers = response?.data;
      } catch (e: any) {
        this.customers = [];
      }
    },
    async getCustomersForEditCase(caseId: string): Promise<void> {
      const config = useRuntimeConfig();
      const { getToken } = useAuth();
      try {
        const header = {
          authorization: "Bearer " + getToken?.(),
        };
        const response = await apiClient(
          String(config.public.baseApi),
          header,
        ).get(baseURL + `customers-for-edit-case?caseId=${caseId}`);
        this.customers = response?.data;
      } catch (e: any) {
        this.customers = [];
      }
    },
    async checkCustomerCase(id: string): Promise<void> {
      const config = useRuntimeConfig();
      const { getToken } = useAuth();
      try {
        const header = {
          authorization: "Bearer " + getToken?.(),
        };
        const response = await apiClient(
          String(config.public.baseApi),
          header,
        ).get(baseURL + `check-customer-case?id=${id}`);
        this.deleteNotifMessage = response.data;
      } catch (e: any) {}
    },
  },
});
