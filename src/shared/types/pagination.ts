export interface Pagination<T> {
  data: T[];
  total: number;
  currentPage: number;
  perPage: number;
  limit: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
