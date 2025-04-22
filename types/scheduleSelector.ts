import { BaseSelector } from "./baseSelector";

export class ScheduleSelector extends BaseSelector {
  keywordId: string;
  worker: string;
  deviceId: string;
  searchDate: string;
  constructor(init: ScheduleSelector) {
    super(init);
    this.keywordId = init.keywordId;
    this.worker = init.worker;
    this.deviceId = init.deviceId;
    this.searchDate = init.searchDate;
  }
}
