export type ChecklistData = {
  total: number;
  start: number;
  result: Checklist[];
};
export type Checklist = {
  id: string;
  searchKeyword: string;
  clickUrl: string;
  searchDate: string;
  searchEngine: string;
  deviceType: string;
  deviceId: string;
  worker: string;
  createdAt: string;
  targetDomain: string;
};
