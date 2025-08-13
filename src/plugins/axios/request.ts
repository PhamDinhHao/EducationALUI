import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { camelizeKeys, decamelizeKeys } from 'humps';
import toast from 'react-hot-toast';
import env from '@/shared/core/constants/env';
import { HttpErrorCodeEnum } from '@/shared/core/enum/http-error-code.enum';
import { ResponseError } from '@/shared/core/types/common.type';
import { useBoundStore } from '@/shared/stores';
import { globalNavigate } from '@/shared/components/GlobalHistory/GlobalHistory';
import { handleServerError, handleServerSuccess } from '@/shared/utils/handle-response-server';
import { refreshToken } from '@/shared/services/auth.service';

let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

export const client = (() => {
  return axios.create({
    baseURL: env.VITE_HOST_API,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });
})();

client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    useBoundStore.getState().incrementCountRequest();
    useBoundStore.getState().setStatusLoading(true);

    if (config.data) {
      if (config.headers['Content-Type'] === 'multipart/form-data') {
        config.data = config.data;
      } else {
        config.data = decamelizeKeys(config.data);
      }
    }

    if (config.params) {
      config.params = decamelizeKeys(config.params);
    }

    return config;
  },
  (error: AxiosError) => {
    useBoundStore.getState().decrementCountRequest();
    if (useBoundStore.getState().countRequest <= 0) {
      useBoundStore.getState().setStatusLoading(false);
      useBoundStore.getState().resetCountRequest();
    }

    return Promise.reject(error);
  }
);

client.interceptors.response.use(
  (res: AxiosResponse) => {
    useBoundStore.getState().decrementCountRequest();
    if (useBoundStore.getState().countRequest <= 0) {
      useBoundStore.getState().setStatusLoading(false);
      useBoundStore.getState().resetCountRequest();
    }
    if (res.data?.data) {
      const { data } = res.data;
      res.data.data = camelizeKeys(data);
    }
    let message = res?.data?.message;
    if (res?.config?.method === 'post' && res?.config?.url?.includes('import')) {
      message =
        'Reader registration has started\n • Bulk processing of email delivery and reservation is pending\n • Check the processing progress and results in the bulk processing status';
    }
    if (res?.config?.method === 'post' && res?.config?.url?.includes('export') && res?.config?.url?.includes('recipients')) {
      message =
        'CSV download has started\n • Bulk processing of email delivery and reservation is pending\n • CSV download is available in the bulk processing status';
    }

    if (!useBoundStore.getState().isLoading && res?.config?.method) {
      handleServerSuccess(res.config.method as 'post' | 'get' | 'put' | 'delete', message);
    }

    return res;
  },
  async (err: ResponseError) => {
    try {
      if (!err.response) return Promise.reject(err);

      const { status, config } = err.response;

      if (status === HttpErrorCodeEnum.UNAUTHORIZED) {
        if (config.url?.includes('/refresh-tokens')) {
          useBoundStore.getState().resetProfile();
          globalNavigate('/login');
          handleServerError(config.method, 'Session expired, please log in again');
          return Promise.reject(err);
        }

        if (!window.location.pathname.includes('/login')) {
          try {
            if (!isRefreshing) {
              isRefreshing = true;
              refreshPromise = refreshToken().then((response) => {
                isRefreshing = false;
                refreshPromise = null;
                return response;
              }).catch((refreshError) => {
                isRefreshing = false;
                refreshPromise = null;
                throw refreshError;
              });
            }

            await refreshPromise;
            return client(config);
          } catch (refreshError) {
            useBoundStore.getState().resetProfile();
            globalNavigate('/login');
            handleServerError(config.method, 'Session expired, please log in again');
            return Promise.reject(refreshError);
          }
        }
        handleServerError(config.method, 'Email or password is incorrect');
        return Promise.reject(err);
      }

      if (status === HttpErrorCodeEnum.NOT_FOUND) {
        globalNavigate('/not-found');
      }

      if (status === HttpErrorCodeEnum.FORBIDDEN || Math.floor(status / 100) === 5) {
        toast.error('Access denied or server error');
      }

      if (status === HttpErrorCodeEnum.UNPROCESSABLE_CONTENT) {
        const { data: errors } = err.response || {};
        return Promise.reject(errors);
      }

      if (status === HttpErrorCodeEnum.SERVER_ERROR) {
        toast.error('System error');
      }

      if (status === HttpErrorCodeEnum.BAD_REQUEST) {
        const { data: errors } = err.response || {};
        const errorMessage = (errors as any)?.error?.message || 'System error';
        toast.error(errorMessage);
      }

      return Promise.reject(err);
    } finally {
      useBoundStore.getState().decrementCountRequest();
      if (useBoundStore.getState().countRequest <= 0) {
        useBoundStore.getState().setStatusLoading(false);
        useBoundStore.getState().resetCountRequest();
      }
    }
  }
);

const request = async (options: AxiosRequestConfig) => {
  const onSuccess = (response: AxiosResponse) => {
    const { data } = response;
    return Promise.resolve(data);
  };

  const onError = (error: any) => {
    if (axios.isAxiosError(error)) {
      return Promise.reject(error.response?.data || error);
    }
    return Promise.reject(error);
  };

  return client(options).then(onSuccess).catch(onError);
};

export default request;