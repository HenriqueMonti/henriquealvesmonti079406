/**
 * TutorCard Component
 * Card para exibir informações de um tutor
 * Reutilizável em múltiplos contextos
 */

import type { ProprietarioResponseDto } from '@/shared/types/dtos';

interface TutorCardProps {
  tutor: ProprietarioResponseDto;
  onViewProfile?: (tutorId: number) => void;
  showButton?: boolean;
}

export function TutorCard({
  tutor,
  onViewProfile,
  showButton = true,
}: TutorCardProps) {
  return (
    <div className="bg-white rounded-lg p-4 border border-green-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg mb-3">
            {tutor.nome}
          </h3>

          <div className="space-y-2 text-sm text-gray-600">
            {tutor.email && (
              <div className="flex items-center gap-2">
                <span className="text-blue-600">✉️</span>
                <a
                  href={`mailto:${tutor.email}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                >
                  {tutor.email}
                </a>
              </div>
            )}

            {tutor.telefone && (
              <div className="flex items-center gap-2">
                <span className="text-green-600">📱</span>
                <a
                  href={`tel:${tutor.telefone}`}
                  className="text-green-600 hover:text-green-800 hover:underline"
                >
                  {tutor.telefone}
                </a>
              </div>
            )}

            {tutor.endereco && (
              <div className="flex items-start gap-2">
                <span className="text-orange-600 mt-0.5">📍</span>
                <span className="break-words">{tutor.endereco}</span>
              </div>
            )}
          </div>
        </div>

        {showButton && onViewProfile && (
          <button
            onClick={() => onViewProfile(tutor.id)}
            className="ml-4 px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors whitespace-nowrap"
          >
            Ver Perfil
          </button>
        )}
      </div>
    </div>
  );
}
