import { defineStore } from "pinia";
import { apiClient } from "~/api/apiClient";
import type {
  Keyword,
  KeywordSelector,
  KeywordSummary,
  State,
  Summary,
} from "~/types/keyword";
import type { ListResponse } from "~/types/listResponse";

const baseURL = "keyword/";
export const keywordStore = defineStore("keyword", {
  state: (): State => ({
    data: {} as ListResponse<Keyword>,
    keywordSummary: {} as KeywordSummary,
    summary: {} as Summary,
    getUnAssociatedKeywordErrorMessage: "",
    keyword: {} as Keyword,
    deleteTargetKeywordErrorMessage: "",
    isGettingKeywords: false,
  }),
  getters: {},
  actions: {
    async getAllKeywords(caseId?: string) {
      this.isGettingKeywords = true;
      const config = useRuntimeConfig();
      const { getToken } = useAuth();
      try {
        const header = {
          authorization: "Bearer " + getToken?.(),
        };
        const params = caseId ? `?id=${caseId}` : "";
        const response = await apiClient(
          String(config.public.baseApi),
          header,
        ).get(baseURL + `all-list-keyword${params}`);
        this.keywordSummary = response?.data;
      } catch (e) {
        return e;
      } finally {
        this.isGettingKeywords = false;
      }
    },
    async getGoogleSearchSummary(
      keyword_id: string,
      date: string,
      search_engine_type: string,
    ) {
      const config = useRuntimeConfig();
      const { getToken } = useAuth();
      try {
        const header = {
          authorization: "Bearer " + getToken?.(),
        };
        const response = await apiClient(
          String(config.public.baseApi),
          header,
        ).post("google-search/summary", {
          keyword_id,
          date,
          search_engine_type,
        });
        this.summary = response?.data;
      } catch (e) {
        return e;
      }
    },
    async getKeywords(selector: KeywordSelector) {
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
        this.data = response?.data as ListResponse<Keyword>;
      } catch (e) {
        console.log(e);
      }
    },

    async submitKeywords(
      target_keyword: string,
      suggestion: string,
    ): Promise<{ id?: string; error?: string }> {
      this.deleteTargetKeywordErrorMessage = "";
      try {
        const config = useRuntimeConfig();
        const { getToken } = useAuth();
        const payload = {
          target_keyword,
          suggestion,
        };
        const header = {
          authorization: "Bearer " + getToken?.(),
        };

        const response = await apiClient(
          String(config.public.baseApi),
          header,
        ).post(baseURL + "get-competitors", payload);
        return {
          id: response?.data?.id,
        };
      } catch (error: any) {
        console.error("Error submitting keywords:", error);
        return {
          error: error?.response?.data,
        };
      }
    },

    async validateKeywords(target_keyword: string, suggestion: string) {
      try {
        const config = useRuntimeConfig();
        const { getToken } = useAuth();
        const payload = {
          target_keyword,
          suggestion,
        };
        const header = {
          authorization: "Bearer " + getToken?.(),
        };

        return (
          await apiClient(String(config.public.baseApi), header).post(
            baseURL + "validate-keyword-if-exist",
            payload,
          )
        )?.data;
      } catch (error: any) {
        console.error("Error submitting keywords:", error);
        return{
          error: error?.response?.data
        }
      }
    },
    async getUnAssociatedKeyword(id: string) {
      try {
        const config = useRuntimeConfig();
        const { getToken } = useAuth();
        const header = {
          authorization: "Bearer " + getToken?.(),
        };

        const response = await apiClient(
          String(config.public.baseApi),
          header,
        ).get(baseURL + `get-unassociated-keyword?keywordId=${id}`);
        this.keyword = response.data;
        this.getUnAssociatedKeywordErrorMessage = "";
      } catch (error: any) {
          this.getUnAssociatedKeywordErrorMessage = error.response.data;
      }
    },
    async deleteTargetKeyword(id: string) {
      try {
        const config = useRuntimeConfig();
        const { getToken } = useAuth();
        const header = {
          authorization: "Bearer " + getToken?.(),
        };

        await apiClient(String(config.public.baseApi), header).get(
          baseURL + `delete?id=${id}`,
        );
        this.deleteTargetKeywordErrorMessage = "";
      } catch (error: any) {
        this.deleteTargetKeywordErrorMessage =error.response.data;
      }
    },
    resetDeleteTargetKeywordErrorMessage() {
      this.deleteTargetKeywordErrorMessage = "";
    },
    async downloadCsv(keyword_id: string, date: string) {
      try {
        const config = useRuntimeConfig();
        const { getToken } = useAuth();
        const payload = {
          keyword_id,
          date,
        };
        const header = {
          authorization: "Bearer " + getToken?.(),
        };

        const response = await apiClient(
          String(config.public.baseApi),
          header,
        ).post("/csv/download", payload, { responseType: "blob" });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "keywords.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error downloading CSV:", error);
      }
    },
  },
});
