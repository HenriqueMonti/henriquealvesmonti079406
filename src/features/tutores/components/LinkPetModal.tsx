/**
 * LinkPetModal Component
 * Modal para vincular pets a um tutor
 */

import { useEffect, useState } from 'react';
import type { PetResponseDto } from '@/shared/types/dtos';
import { petsFacade } from '@/features/pets/facades';

interface LinkPetModalProps {
  tutorId: number;
  currentPetIds?: number[];
  onLink: (petId: number) => Promise<void>;
  onClose: () => void;
}

export function LinkPetModal({
  tutorId,
  currentPetIds = [],
  onLink,
  onClose,
}: LinkPetModalProps) {
  const [pets, setPets] = useState<PetResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [linking, setLinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carrega todos os pets
  useEffect(() => {
    const loadPets = async () => {
      setLoading(true);
      setError(null);

      try {
        // Carrega primeira página com muitos resultados
        await petsFacade.loadPets(1, 100);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Erro ao carregar pets'
        );
      } finally {
        setLoading(false);
      }
    };

    loadPets();
  }, []);

  // Subscribe aos pets do facade
  useEffect(() => {
    const petsSub = petsFacade.pets$.subscribe((data) => {
      setPets(Array.isArray(data) ? data : []);
    });

    return () => {
      petsSub.unsubscribe();
    };
  }, []);

  const availablePets = pets.filter(
    (pet) => !currentPetIds.includes(pet.id)
  );

  const handleLinkPet = async (petId: number) => {
    setLinking(true);
    setError(null);

    try {
      await onLink(petId);
      // Recarrega pets para atualizar a lista de disponíveis
      await petsFacade.loadPets(1, 100);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao vincular pet'
      );
    } finally {
      setLinking(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Vincular Pet ao Tutor
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Carregando pets...</p>
            </div>
          ) : availablePets.length > 0 ? (
            <div className="space-y-3">
              {availablePets.map((pet) => (
                <div
                  key={pet.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">{pet.nome}</h3>
                    {pet.raca && (
                      <p className="text-sm text-gray-600">{pet.raca}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleLinkPet(pet.id)}
                    disabled={linking}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded transition-colors whitespace-nowrap"
                  >
                    {linking ? '⏳' : '➕'} Vincular
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">
                {currentPetIds.length > 0
                  ? 'Todos os pets já estão vinculados'
                  : 'Nenhum pet disponível'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6">
          <button
            onClick={onClose}
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
