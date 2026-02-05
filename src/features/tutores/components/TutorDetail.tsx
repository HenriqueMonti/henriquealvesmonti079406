/**
 * TutorDetail Component
 * Exibe detalhes de um tutor
 */

import type { ProprietarioResponseDto } from '@/shared/types/dtos';

interface TutorDetailProps {
  tutor: ProprietarioResponseDto;
  onBack: () => void;
}

export function TutorDetail({ tutor, onBack }: TutorDetailProps) {
  return (
    <div className="space-y-6">
      {/* Botão de voltar */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
      >
        ← Voltar
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Esquerda - Avatar/Ícone */}
        <div className="lg:col-span-1">
          <div className="rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center h-80">
            <span className="text-purple-500 text-7xl">👤</span>
          </div>
        </div>

        {/* Coluna Direita - Informações */}
        <div className="lg:col-span-2 space-y-6">
          {/* Nome destaque */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{tutor.nome}</h1>
            <p className="text-gray-500 text-sm">ID: {tutor.id}</p>
          </div>

          {/* Card de Informações de Contato */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Informações de Contato
            </h2>

            <div className="space-y-4">
              {tutor.email && (
                <div className="flex items-center gap-3">
                  <span className="text-blue-600 text-2xl">✉️</span>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <a
                      href={`mailto:${tutor.email}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                    >
                      {tutor.email}
                    </a>
                  </div>
                </div>
              )}

              {tutor.telefone && (
                <div className="flex items-center gap-3">
                  <span className="text-green-600 text-2xl">📱</span>
                  <div>
                    <p className="text-sm text-gray-600">Telefone</p>
                    <a
                      href={`tel:${tutor.telefone}`}
                      className="text-green-600 hover:text-green-800 hover:underline"
                    >
                      {tutor.telefone}
                    </a>
                  </div>
                </div>
              )}

              {tutor.endereco && (
                <div className="flex items-start gap-3">
                  <span className="text-orange-600 text-2xl">📍</span>
                  <div>
                    <p className="text-sm text-gray-600">Endereço</p>
                    <p className="text-gray-900">{tutor.endereco}</p>
                  </div>
                </div>
              )}

              {tutor.cpf && (
                <div className="flex items-center gap-3">
                  <span className="text-red-600 text-2xl">🆔</span>
                  <div>
                    <p className="text-sm text-gray-600">CPF</p>
                    <p className="text-gray-900 font-mono">{tutor.cpf}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Seção de Pets (vazia por enquanto) */}
          <div className="bg-blue-50 rounded-lg shadow p-6 border border-blue-200">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">
              🐾 Pets Vinculados
            </h2>
            <p className="text-blue-700">
              Pets do tutor serão exibidos aqui em breve.
            </p>
          </div>

          {/* Botões de ação */}
          <div className="flex gap-3 pt-4">
            <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded transition-colors">
              ✏️ Editar Tutor
            </button>
            <button className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded transition-colors">
              🗑️ Deletar Tutor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
