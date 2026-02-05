/**
 * Auth Service (Facade Pattern)
 * Gerencia autenticação e login
 * Usa padrão Facade para simplificar interações com HTTP e TokenService
 */

import { HttpService } from '../http/http.service';
import { tokenService } from '../auth/token.service';
import type { AuthRequestDto, AuthResponseDto } from '../../shared/types/dtos';

class AuthService extends HttpService {
  /**
   * Realiza login e armazena tokens
   * POST /autenticacao/login
   */
  async login(credentials: AuthRequestDto): Promise<AuthResponseDto> {
    const response = await this.post<AuthResponseDto>(
      '/autenticacao/login',
      credentials
    );

    tokenService.setTokens(response);
    return response;
  }

  /**
   * Logout: limpa tokens locais
   */
  logout(): void {
    tokenService.clearTokens();
  }

  /**
   * Verifica se há sessão válida
   */
  isAuthenticated(): boolean {
    return tokenService.hasValidToken();
  }

  /**
   * Retorna o token atual
   */
  getToken(): string | null {
    return tokenService.getAccessToken();
  }
}

export const authService = new AuthService();
