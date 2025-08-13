export type Pagination = {
  total: number
  perPage: number
  currentPage: number
  totalPages: number
}

type ConfigRequest = {
  method: "post" | "get" | "put" | "delete";
  [key: string]: any;
};

export type BaseResponse<T = any> = {
  config: ConfigRequest;
  data: {
    status: number;
    success?: boolean;
    data: T;
    code?: number;
    url_return?: string;
  };
  status: number;
};

export type ResponseError = {
  code: string | number;
  message: string;
  config: ConfigRequest;
  response: BaseResponse;
};

export type EnumTypeName = {
  [key: string]: string;
};

export type OptionSelect = {
  value: number | string;
  label?: string;
  disabled?: boolean;
  type?: string;
};