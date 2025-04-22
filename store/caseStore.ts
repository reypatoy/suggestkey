import { defineStore } from "pinia";
import { apiClient } from "~/api/apiClient";
import type {
  AddCase,
  Case,
  CaseSelector,
  State,
  Suggestion,
} from "~/types/case";
import type { ListResponse } from "~/types/listResponse";
import type { Competitors_Keywords } from "~/types/results";

const baseApi = "case/";
export const caseStore = defineStore("case", {
  state: (): State => ({
    data: {} as ListResponse<Case>,
    saveCaseMessage: "",
    caseData: {} as Case,
    updateCaseMessage: "",
    getLatestIdError: false,
    deleteCaseErrorMessage: "",
    addsSearchScheduleErrorMessage: "",
    keywordList: []
  }),
  getters: {},
  actions: {
    async list(selector: CaseSelector): Promise<void> {
      const config = useRuntimeConfig();
      const { getToken } = useAuth();
      try {
        const header = {
          authorization: "Bearer " + getToken?.(),
        };
        const response = await apiClient(
          String(config.public.baseApi),
          header,
        ).post(baseApi + "list", selector);
        this.data = response?.data;
      } catch (e: any) {
        this.data = e?.response?.data;
      }
    },
    async add(newCase: Case): Promise<boolean> {
      const config = useRuntimeConfig();
      const { getToken } = useAuth();
      try {
        const header = {
          authorization: "Bearer " + getToken?.(),
        };
        const newCaseParams: AddCase = {
          ...newCase,
          keywords: newCase?.suggestions?.map((suggestion: Suggestion) => {
            return {
              keywordId: suggestion.id,
              targetDomain: suggestion.targetDomain,
            };
          }),
        };
        await apiClient(String(config.public.baseApi), header).post(
          baseApi + `add`,
          newCaseParams,
        );
        this.saveCaseMessage = "";
        return true;
      } catch (e: any) {
        if (e.status === 400) {
          this.saveCaseMessage = "入力欄は空にできません";
        } else {
          this.saveCaseMessage = e.response.data;
        }
        return false;
      }
    },
    async get(id: string): Promise<void> {
      const config = useRuntimeConfig();
      const { getToken } = useAuth();
      try {
        const header = {
          authorization: "Bearer " + getToken?.(),
        };
        const response = await apiClient(
          String(config.public.baseApi),
          header,
        ).get(baseApi + `get?id=${id}`);
        this.caseData = response?.data;
      } catch (e: any) {
        this.caseData = {} as Case;
      }
    },
    async edit(caseData: Case): Promise<boolean> {
      this.deleteCaseErrorMessage = "";
      const config = useRuntimeConfig();
      const { getToken } = useAuth();
      try {
        const header = {
          authorization: "Bearer " + getToken?.(),
        };
        await apiClient(String(config.public.baseApi), header).post(
          baseApi + `edit`,
          caseData,
        );
        this.updateCaseMessage = "";
        return true;
      } catch (e: any) {
        if (typeof e.response.data == "string") {
          this.updateCaseMessage = e.response.data;
        }
        return false;
      }
    },
    async getLatestId(): Promise<string> {
      const config = useRuntimeConfig();
      const { getToken } = useAuth();
      try {
        const header = {
          authorization: "Bearer " + getToken?.(),
        };
        this.getLatestIdError = false;
        return (
          await apiClient(String(config.public.baseApi), header).get(
            baseApi + "get-latest-id",
          )
        )?.data?.id;
      } catch (e: any) {
        this.getLatestIdError = true;
        return "";
      }
    },
    async getLatestKeywords(): Promise<void> {
      const config = useRuntimeConfig();
      const { getToken } = useAuth();
      try {
        const header = {
          authorization: "Bearer " + getToken?.(),
        };
        this.keywordList = (await apiClient(String(config.public.baseApi), header).get(
            "keyword/" + "get-list-unassociated-keyword",
          )).data
      } catch (e: any) {
        this.keywordList = [];
      }
    },
    async delete(id: string): Promise<void> {
      this.updateCaseMessage = "";
      const config = useRuntimeConfig();
      const { getToken } = useAuth();
      try {
        const header = {
          authorization: "Bearer " + getToken?.(),
        };
        this.getLatestIdError = false;
        await apiClient(String(config.public.baseApi), header).get(
          baseApi + `delete?id=${id}`,
        );
        this.deleteCaseErrorMessage = "";
      } catch (e: any) {
        this.deleteCaseErrorMessage = e?.response?.data;
      }
    },

    checkDomain(suggestions: Suggestion[]): boolean {
      const isValidDomain = (domain: string): boolean => {
        
        const pattern = new RegExp(
          /^(https?:\/\/)?([a-zA-Z\d-]{1,63}\.)+[a-zA-Z]{2,6}(\.[a-zA-Z]{2,})*(\/)?$/,
        );
        if (!domain) {
          return true;
        }
        return pattern.test(domain);
      };
    
      const data = suggestions.every((suggestion) => {
        return isValidDomain(String(suggestion.targetDomain).trim());
      });
      return data;
    },    
    async sendSelectedKeywords(
      targetKeywordId: string,
      totalMonthlySearch: number,
      competetorsKeywords: Competitors_Keywords,
    ): Promise<void> {
      const config = useRuntimeConfig();
      const { getToken } = useAuth();
      try {
        const header = {
          authorization: "Bearer " + getToken?.(),
        };
        await apiClient(String(config.public.baseApi), header).post(
          `competitors/keywords/generate-search-schedule`,
          { targetKeywordId, totalMonthlySearch, competetorsKeywords },
        );
        this.addsSearchScheduleErrorMessage = "";
      } catch (e: any) {
        this.addsSearchScheduleErrorMessage = e?.response?.data;
      }
    },
  },
});
