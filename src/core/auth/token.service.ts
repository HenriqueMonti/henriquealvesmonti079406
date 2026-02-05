/**
 * Token Service
 * Gerencia armazenamento e renovação de tokens JWT
 * Usa localStorage para persistência
 */

import { STORAGE_KEYS } from '../http/constants';
import { httpClient } from '../http/axios-instance';
import type { AuthResponseDto } from '../../shared/types/dtos';

class TokenService {
  /**
   * Armazena tokens no localStorage
   */
  setTokens(response: AuthResponseDto): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.access_token);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refresh_token);

    // Calcula tempo de expiração: agora + expires_in (em segundos)
    const expiresAt = Date.now() + response.expires_in * 1000;
    localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRES_IN, expiresAt.toString());
  }

  /**
   * Retorna o access token do localStorage
   */
  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  /**
   * Retorna o refresh token do localStorage
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * Remove todos os tokens do localStorage
   */
  clearTokens(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRES_IN);
  }

  /**
   * Verifica se o token expirou
   */
  isTokenExpired(): boolean {
    const expiresAt = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRES_IN);
    if (!expiresAt) return true;

    return Date.now() >= parseInt(expiresAt, 10);
  }

  /**
   * Verifica se há token válido armazenado
   */
  hasValidToken(): boolean {
    const token = this.getAccessToken();
    return !!token && !this.isTokenExpired();
  }

  /**
   * Renovar access token usando refresh token
   * Chama: PUT /autenticacao/refresh
   */
  async refreshAccessToken(): Promise<AuthResponseDto> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await httpClient.put<AuthResponseDto>(
        '/autenticacao/refresh',
        {}
      );

      this.setTokens(response.data);
      return response.data;
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }
}

export const tokenService = new TokenService();
