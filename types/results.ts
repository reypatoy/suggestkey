export type State = {
  data: Results;
};

export type Results = {
  id: string;
  score: number;
  target_keyword: string;
  suggestion: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  competitors_keywords: Competitors_Keywords[];
  totalMonthlySearches: number;
  searchDayCount: number;
  status: string;
};

export type Competitors_Keywords = {
  id: string;
  competitors_keyword: string;
  volume: number;
  createdAt: string;
  updatedAt: string;
  keyword_id: string;
  percentage: number;
  isChecked: boolean;
  deleted: boolean;
};
