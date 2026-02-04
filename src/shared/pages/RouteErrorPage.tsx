/**
 * Route Error Page
 * Página exibida quando há erros em rotas (React Router)
 */

import { useRouteError } from 'react-router-dom';

export function RouteErrorPage() {
  const error = useRouteError() as { message?: string; status?: number } | null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-red-500 text-5xl mb-4">❌</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Erro ao Carregar a Página
        </h1>
        <p className="text-gray-600 mb-4">
          Desculpe, ocorreu um erro ao processar sua requisição.
        </p>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3 mb-6">
            <p className="text-sm text-red-700 font-mono break-words">
              {error.message || 'Erro desconhecido'}
              {error.status && ` (${error.status})`}
            </p>
          </div>
        )}
        <a
          href="/"
          className="w-full block text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors"
        >
          Voltar para Início
        </a>
      </div>
    </div>
  );
}
