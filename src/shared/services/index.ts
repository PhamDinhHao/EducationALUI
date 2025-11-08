import { client } from "@/plugins/axios/request";

export const ApiService = {
  get(url: string, params = {}, headers = {}, options = {}) {
    return client.get(`${url}`, { params, headers, ...options, withCredentials: true });
  },

  post(url: string, body: any, config = {}) {
    return client.post(`${url}`, body, { ...config, withCredentials: true });
  },

  put(url: string, body: any, params = {}) {
    return client.put(`${url}`, body, { params, withCredentials: true });
  },

  delete(url: string, body: any = {}, params = {}) {
    return client.delete(`${url}`, { data: body, params, withCredentials: true });
  },
  upload(url: string, body: any, params = {}) {
    return client.post(`${url}`, body, {
      params,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
  },
  putUpload(url: string, body: any, params = {}) {
    return client.put(`${url}`, body, {
      params,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
  },
};