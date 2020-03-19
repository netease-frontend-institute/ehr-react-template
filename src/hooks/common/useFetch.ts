/**
 * 数据请求hooks
 * @author 施阳 2019-9-20
 * @return {data, isLoading, dispatch}
 * data： 请求结果
 * isLoading：true-请求中 false-请求结束
 * dispatch：手动触发请求
 */
import { useState, useEffect, useCallback } from 'react';
import { RequestConfig, ResponseConfig } from '@/axios/interface';

interface UseFetchResult<R> {
    data: R | undefined;
    isLoading: boolean;
    dispatch: (params?: any) => Promise<R>;
}
/**
 * @param {fuction} url 请求方法
 * @param {obj}} params 请求参数
 * @param {bool} isImmediately 是否立即执行
 */
function useFetch<R>(url: (req: RequestConfig) => Promise<R>, params?: any, isImmediately = true): UseFetchResult<R> {
    const [data, setData] = useState<R | undefined>();
    const [isLoading, setIsLoading] = useState(false);

    // 接口请求
    const fetch = (url: (req: RequestConfig) => Promise<R>, params?: any): Promise<R> => {
        setIsLoading(true);
        return new Promise((resolve, reject) => {
            url(params)
                .then((data: R) => {
                    setData(data);
                    resolve(data);
                })
                .catch((err: ResponseConfig<R>) => {
                    // setData(err);
                    reject(err);
                })
                .finally(() => setIsLoading(false));
        });
    };

    /**
     * 手动触发接口请求
     * @param {obj} value 手动触发请求时可直接传入请求参数，否则取默认参数
     */
    const dispatch = useCallback((value = params) => fetch(url, value), [params, url]);

    useEffect(() => {
        isImmediately && fetch(url, params);
    }, [params, url, isImmediately]);

    return { data, isLoading, dispatch };
    // return [ data, isLoading, dispatch ];
}

export default useFetch;
