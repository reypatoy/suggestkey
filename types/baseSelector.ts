export class BaseSelector {
  page: number;
  limit: number = 10;
  constructor(init: BaseSelector) {
    this.page = init.page;
    this.limit = init.limit ?? this.limit;
  }
}
