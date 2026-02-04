/**
 * Instância centralizada do axios
 * Configuração base para requisições HTTP
 */

import axios, { type AxiosInstance, type AxiosError, type AxiosResponse } from 'axios';
import { HTTP_CONFIG } from './constants';

export const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: HTTP_CONFIG.BASE_URL,
    timeout: HTTP_CONFIG.TIMEOUT,
    headers: HTTP_CONFIG.HEADERS,
  });

  // Interceptor de requisição: configurações padrão
  instance.interceptors.request.use(
    (config) => {
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Interceptor de resposta: trata erros
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  return instance;
};

export const httpClient = createAxiosInstance();
