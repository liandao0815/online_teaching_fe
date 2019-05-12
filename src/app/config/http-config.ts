// http请求响应数据code值
export const SUCCESS_CODE = 0;
export const ERROR_CODE = 1;

// http请求响应数据类型
export interface ResponseData<T> {
  code: number;
  message: string;
  data: T;
}
