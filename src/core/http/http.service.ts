/**
 * HTTP Service (Base Service)
 * Wrapper centralizado do httpClient para operações comuns
 * Encapsula lógica de requisições e tratamento de erros
 *
 * Será herdado por serviços específicos (PetService, TutorService, etc)
 */

import {
  type AxiosInstance,
  AxiosError,
  type AxiosRequestConfig,
  //type AxiosResponse,
} from 'axios';
import { httpClient } from './axios-instance';

export interface ApiError {
  message: string;
  status?: number;
  data?: unknown;
}

export abstract class HttpService {
  protected http: AxiosInstance;

  constructor(http: AxiosInstance = httpClient) {
    this.http = http;
  }

  /**
   * GET genérico com tratamento de erro
   */
  protected async get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.http.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * POST genérico com tratamento de erro
   */
  protected async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.http.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * PUT genérico com tratamento de erro
   */
  protected async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.http.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * DELETE genérico com tratamento de erro
   */
  protected async delete<T = void>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.http.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Upload de arquivo (multipart/form-data)
   */
  protected async uploadFile<T>(
    url: string,
    file: File,
    additionalData?: Record<string, string>
  ): Promise<T> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Adicionar dados adicionais se fornecidos
      if (additionalData) {
        Object.entries(additionalData).forEach(([key, value]) => {
          formData.append(key, value);
        });
      }

      const response = await this.http.post<T>(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Trata erros do axios e os padroniza
   */
  protected handleError(error: unknown): ApiError {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const message =
        error.response?.data?.message ||
        error.message ||
        'Unknown error occurred';

      return {
        message,
        status,
        data: error.response?.data,
      };
    }

    return {
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
