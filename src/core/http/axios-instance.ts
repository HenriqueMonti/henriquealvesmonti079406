/**
 * Instância centralizada do axios
 * Configuração base para requisições HTTP
 */

import axios, { type AxiosInstance, type AxiosError, type AxiosResponse } from 'axios';
import { HTTP_CONFIG } from './constants';
import { tokenService } from '../auth/token.service';

// Flag para evitar loop infinito de refresh
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });

  failedQueue = [];
};

export const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: HTTP_CONFIG.BASE_URL,
    timeout: HTTP_CONFIG.TIMEOUT,
    headers: HTTP_CONFIG.HEADERS,
  });

  // Interceptor de requisição: injeta token de autenticação
  instance.interceptors.request.use(
    (config) => {
      const token = tokenService.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Interceptor de resposta: trata erros e renovação de token
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as any;

      // Se for erro de autenticação no endpoint de refresh, limpa tudo
      if (error.response?.status === 401 && originalRequest.url?.includes('/autenticacao/refresh')) {
        tokenService.clearTokens();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      // Se for 401 em outras requisições, tenta renovar token uma única vez
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        // Se já está fazendo refresh, espera a fila
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(instance(originalRequest));
              },
              reject: (err) => reject(err),
            });
          });
        }

        isRefreshing = true;

        try {
          await tokenService.refreshAccessToken();
          const token = tokenService.getAccessToken();
          processQueue(null, token || undefined);

          if (token && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return instance(originalRequest);
        } catch (refreshError) {
          // Se refresh falhar, limpa tokens e redireciona para login
          processQueue(refreshError, null);
          tokenService.clearTokens();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const httpClient = createAxiosInstance();
