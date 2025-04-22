import axios from "axios";
export const apiClient = (url: string, headers?: any) => {
  const default_headers = {
    "content-type": "application/json",
  };
  return axios.create({
    baseURL: url + "api/",
    headers: { ...default_headers, ...headers },
  });
};
