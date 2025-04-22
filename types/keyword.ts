import { BaseSelector } from "./baseSelector";
import type { ListResponse } from "./listResponse";

export type KeywordSummary = {
  caseName: string;
  keywords: Keyword[];
};
export type Keyword = {
  id: string;
  target_keyword: string;
  suggestion: string;
  score: number;
  createdBy: string;
  createdAt: string;
  targetDomain: string;
};

export type State = {
  data: ListResponse<Keyword>;
  keywordSummary: KeywordSummary;
  summary: Summary;
  getUnAssociatedKeywordErrorMessage: string;
  keyword: Keyword;
  deleteTargetKeywordErrorMessage: string;
  isGettingKeywords: boolean;
};
export class KeywordSelector extends BaseSelector {
  searchCode?: string;
  targetKeyword?: string;
  suggestion?: string;

  constructor(init: KeywordSelector) {
    super(init);
    this.searchCode = init.searchCode;
    this.targetKeyword = init.targetKeyword;
    this.suggestion = init.suggestion;
  }
}

export type Summary = {
  month: number;
  year: number;
  startSearch: string;
  days: DaysSummary[];
};

export type DaysSummary = {
  day: string;
  googleAutoComplete: GoogleAutoCompleteSummary;
};

export type GoogleAutoCompleteSummary = {
  id: number;
  autocomplete_keywords: string;
  is_suggested: boolean;
  createdAt: string;
  keyword_id: number;
  keyword: keywordSummary;
};

export type keywordSummary = {
  id: number;
  target_keyword: string;
  suggestion: string;
  case_keywords: CaseKeywordsSummary[];
};

export type CaseKeywordsSummary = {
  id: number;
  isInOperation: boolean;
  createdAt: string;
  updatedAt: string;
  caseId: number;
  keywordId: number;
};
