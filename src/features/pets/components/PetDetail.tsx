/**
 * PetDetail Component
 * Exibe detalhes completos de um pet
 */

import type { PetResponseCompletoDto } from '@/shared/types/dtos';
import { TutorCard } from '@/shared/components/TutorCard';

interface PetDetailProps {
  pet: PetResponseCompletoDto;
  onBack: () => void;
  onViewTutor?: (tutorId: number) => void;
  onEdit?: (petId: number) => void;
  onDelete?: (petId: number) => void;
}

export function PetDetail({ pet, onBack, onViewTutor, onEdit, onDelete }: PetDetailProps) {
  const hasTutores = pet.tutores && pet.tutores.length > 0;

  return (
    <div className="space-y-6">
      {/* Botão de voltar */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
      >
        ← Voltar para Pets
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Esquerda - Foto */}
        <div className="lg:col-span-1">
          <div className="rounded-lg overflow-hidden shadow-lg">
            {pet.foto ? (
              <img
                src={pet.foto.url}
                alt={pet.nome}
                className="w-full h-80 object-cover"
              />
            ) : (
              <div className="w-full h-80 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <span className="text-blue-500 text-7xl">🐾</span>
              </div>
            )}
          </div>
        </div>

        {/* Coluna Direita - Informações */}
        <div className="lg:col-span-2 space-y-6">
          {/* Nome destaque */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{pet.nome}</h1>
            <p className="text-gray-500 text-sm">ID: {pet.id}</p>
          </div>

          {/* Card de informações */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Raça
                </h3>
                <p className="text-lg text-gray-900 mt-1">{pet.raca}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Idade
                </h3>
                <p className="text-lg text-gray-900 mt-1">
                  {pet.idade} {pet.idade === 1 ? 'ano' : 'anos'}
                </p>
              </div>
            </div>
          </div>

          {/* Seção de Tutores */}
          {hasTutores ? (
            <div className="bg-green-50 rounded-lg shadow p-6 border border-green-200">
              <h2 className="text-xl font-semibold text-green-900 mb-4">
                👥 Tutor(es) Responsável(is)
              </h2>
              <div className="space-y-4">
                {pet.tutores.map((tutor) => (
                  <TutorCard
                    key={tutor.id}
                    tutor={tutor}
                    onViewProfile={onViewTutor}
                    showButton={!!onViewTutor}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 rounded-lg shadow p-6 border border-yellow-200">
              <p className="text-yellow-900">
                ℹ️ Este pet ainda não tem tutor cadastrado.
              </p>
            </div>
          )}

          {/* Botões de ação */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => onEdit?.(pet.id)}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded transition-colors"
            >
              ✏️ Editar Pet
            </button>
            <button
              onClick={() => onDelete?.(pet.id)}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded transition-colors"
            >
              🗑️ Deletar Pet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
