export interface IApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface IPagination {
  page?: number;
  pageSize?: number;
}

export interface ISearchParams extends IPagination {
  keyword?: string;
  startTime?: Date;
  endTime?: Date;
}
