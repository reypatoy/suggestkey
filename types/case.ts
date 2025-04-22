import { BaseSelector } from "./baseSelector";
import type { ListResponse } from "./listResponse";

export type State = {
  data: ListResponse<Case>;
  saveCaseMessage: string;
  caseData: Case;
  updateCaseMessage: string;
  getLatestIdError: boolean;
  deleteCaseErrorMessage: string;
  addsSearchScheduleErrorMessage: string;
  keywordList: KeywordList[]
};

export type KeywordList = {
  id: string;
  keyword: string;
}

export class CaseSelector extends BaseSelector {
  caseName?: string;

  constructor(init: CaseSelector) {
    super(init);
    this.caseName = init.caseName;
  }
}

export class Case {
  id?: string;
  projectName?: string;
  contracts?: number;
  inOperation?: number;
  suggestions?: Suggestion[];
  customerId: string;

  constructor(init: Case) {
    this.id = init.id;
    this.projectName = init.projectName;
    this.contracts = init.contracts;
    this.inOperation = init.inOperation;
    this.suggestions = init.suggestions;
    this.customerId = init.customerId;
  }
}

export type Suggestion = {
  id: string;
  score: number;
  suggestion: string;
  target_keyword: string;
  isInOperation: number;
  targetDomain: string;
  totalMonthlySearch: string;
  caseKeywordId: string;
  deletedAt: any;
};

type Keyword = {
  keywordId: string;
  targetDomain: string;
};

export interface AddCase
  extends Omit<Case, "suggestions" | "contracts" | "inOperation"> {
  keywords?: Keyword[];
}
