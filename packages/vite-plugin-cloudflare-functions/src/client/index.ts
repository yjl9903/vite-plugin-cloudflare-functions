import type { AxiosRequestConfig, AxiosResponse } from 'axios';

import axios from 'axios';

import type { PagesResponseBody, TypedResponse } from './types';

export { type PagesResponseBody, type TypedResponse };

export function useFunctions(config: AxiosRequestConfig<any> = {}) {
  const api = axios.create(config);

  return {
    async get<T = unknown, D = any, Route extends string = string>(
      url: Route,
      config?: AxiosRequestConfig<D>
    ): Promise<TypedResponse<Route, 'GET', T>> {
      return (await api.get(url, config)).data;
    },

    async post<T = unknown, D = any, Route extends string = string>(
      url: Route,
      data?: D,
      config?: AxiosRequestConfig<D>
    ): Promise<TypedResponse<Route, 'POST', T>> {
      return (await api.post(url, data, config)).data;
    },

    async put<T = unknown, D = any, Route extends string = string>(
      url: Route,
      data?: D,
      config?: AxiosRequestConfig<D>
    ): Promise<TypedResponse<Route, 'PUT', T>> {
      return (await api.put(url, data, config)).data;
    },

    async patch<T = unknown, D = any, Route extends string = string>(
      url: Route,
      data?: D,
      config?: AxiosRequestConfig<D>
    ): Promise<TypedResponse<Route, 'PATCH', T>> {
      return (await api.patch(url, data, config)).data;
    },

    async delete<T = unknown, D = any, Route extends string = string>(
      url: Route,
      config?: AxiosRequestConfig<D>
    ): Promise<TypedResponse<Route, 'DELETE', T>> {
      return (await api.delete(url, config)).data;
    },

    async head<T = unknown, D = any, Route extends string = string>(
      url: Route,
      config?: AxiosRequestConfig<D>
    ): Promise<TypedResponse<Route, 'HEAD', T>> {
      return (await api.head(url, config)).data;
    },

    async options<T = unknown, D = any, Route extends string = string>(
      url: Route,
      config?: AxiosRequestConfig<D>
    ): Promise<TypedResponse<Route, 'OPTIONS', T>> {
      return (await api.options(url, config)).data;
    },

    raw: {
      async get<T = unknown, D = any, Route extends string = string>(
        url: Route,
        config?: AxiosRequestConfig<D>
      ): Promise<AxiosResponse<TypedResponse<Route, 'GET', T>, D>> {
        return api.get(url, config);
      },

      async post<T = unknown, D = any, Route extends string = string>(
        url: Route,
        data?: D,
        config?: AxiosRequestConfig<D>
      ): Promise<AxiosResponse<TypedResponse<Route, 'POST', T>, D>> {
        return api.post(url, data, config);
      },

      async put<T = unknown, D = any, Route extends string = string>(
        url: Route,
        data?: D,
        config?: AxiosRequestConfig<D>
      ): Promise<AxiosResponse<TypedResponse<Route, 'PUT', T>, D>> {
        return api.put(url, data, config);
      },

      async patch<T = unknown, D = any, Route extends string = string>(
        url: Route,
        data?: D,
        config?: AxiosRequestConfig<D>
      ): Promise<AxiosResponse<TypedResponse<Route, 'PATCH', T>, D>> {
        return api.patch(url, data, config);
      },

      async delete<T = unknown, D = any, Route extends string = string>(
        url: Route,
        config?: AxiosRequestConfig<D>
      ): Promise<AxiosResponse<TypedResponse<Route, 'DELETE', T>, D>> {
        return api.delete(url, config);
      },

      async head<T = unknown, D = any, Route extends string = string>(
        url: Route,
        config?: AxiosRequestConfig<D>
      ): Promise<AxiosResponse<TypedResponse<Route, 'HEAD', T>, D>> {
        return api.head(url, config);
      },

      async options<T = unknown, D = any, Route extends string = string>(
        url: Route,
        config?: AxiosRequestConfig<D>
      ): Promise<AxiosResponse<TypedResponse<Route, 'OPTIONS', T>, D>> {
        return api.options(url, config);
      }
    }
  };
}
