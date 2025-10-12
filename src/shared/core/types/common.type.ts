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

export type LessonResponse = {
  title?: string;
  grade?: string;
  subject?: string; // "toan" | "ly" | ...
  topic?: string;
  periods?: number;
  objectives?: string[];
  activities?: { step: string; description: string }[];
  assessment?: string;
  raw?: string; // fallback khi AI trả text
};
export interface Question {
  type: string;
  level: string;
  question: string;
  options?: string[];
  answer: string;
}

export interface ExamPreviewProps {
  exam: Question[];
}
export interface Matrix {
  [type: string]: { [level: string]: number };
}
