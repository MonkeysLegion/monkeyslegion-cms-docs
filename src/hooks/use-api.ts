'use client';
import { useState } from 'react';
import axiosInstance from '@/config/axios';
import type { AxiosError, AxiosResponse } from 'axios';
import { SafeString } from '@/utils/safe-string';

export interface ApiOptions {
  method?: string;
  data?: unknown;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  status?: number;
  error?: AxiosError;
}

export interface UseApiReturn {
  trigger: <T = unknown>(url: string, options?: ApiOptions) => Promise<ApiResponse<T>>;
  data: unknown;
  error: AxiosError | null;
  status: number | null;
}

const useApi = (): UseApiReturn => {
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState<AxiosError | null>(null);
  const [status, setStatus] = useState<number | null>(null);

  const trigger = async <T = unknown>(
    url: string,
    options: ApiOptions = {}
  ): Promise<ApiResponse<T>> => {
    setError(null);
    setData(null);

    const method = SafeString(options?.method?.toLowerCase(), 'get');

    try {
      let response: AxiosResponse<T>;

      if (method === 'get') {
        response = await axiosInstance.get<T>(url, {
          params: options.params ?? options.data,
          headers: options.headers as Record<string, string>,
        });
      } else if (method === 'delete') {
        response = await axiosInstance.delete<T>(url, {
          data: options.data,
          headers: options.headers as Record<string, string>,
        });
      } else {
        response = await axiosInstance[method as 'post' | 'put' | 'patch']<T>(
          url,
          options.data,
          { headers: options.headers as Record<string, string> }
        );
      }

      setStatus(response?.status ?? null);
      setData(response?.data);
      return { data: response.data, status: response.status };
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError);
      setStatus(axiosError?.response?.status ?? null);
      return { error: axiosError };
    }
  };

  return { trigger, data, error, status };
};

export default useApi;
