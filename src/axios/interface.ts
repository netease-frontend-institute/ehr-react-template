import { AxiosResponse } from 'axios';

export * from './api/common/interface'; // 通用部分

export type RecordStatus = 1 | 2 | 3 | 4;

export interface RequestConfig {
    url: string;
    data?: any;
    headers?: any;
}

export interface ResponseConfig<T> {
    code: number;
    data: T;
    msg: string;
}

export interface ResponseError<T> {
    data: ResponseConfig<T>;
    response: AxiosResponse<ResponseConfig<T>>;
}
