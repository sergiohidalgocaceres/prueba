export class ResultPaginatedDto<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
}
