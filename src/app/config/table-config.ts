// 表格信息类型
export interface TableInfo<T> {
  loading: boolean;
  total: number;
  data: T[];
  pageNum: number;
  pageSize: number;
}

// 表格数据请求响应数据类型
export interface ResponseDataOfTable<T> {
  code: number;
  data: { list: T[]; total: number };
  message: string;
}

// 表格数据请求参数类型
export interface RequestParamOfTable {
  pageNum: number;
  pageSize: number;
  [key: string]: any;
}
