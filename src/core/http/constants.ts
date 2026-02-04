/**
 * Constantes de configuração HTTP
 * Define a base URL e timeouts para requisições
 */

export const HTTP_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  TIMEOUT: 30000, // 30 segundos
  HEADERS: {
    'Content-Type': 'application/json',
  },
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: '@pet-app:access_token',
  REFRESH_TOKEN: '@pet-app:refresh_token',
  TOKEN_EXPIRES_IN: '@pet-app:token_expires_in',
} as const;
