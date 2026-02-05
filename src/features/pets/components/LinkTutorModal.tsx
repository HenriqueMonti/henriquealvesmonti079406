/**
 * LinkTutorModal Component
 * Modal para vincular tutores a um pet
 */

import { useEffect, useState } from 'react';
import type { ProprietarioResponseDto } from '@/shared/types/dtos';
import { tutoresFacade } from '@/features/tutores/facades';

interface LinkTutorModalProps {
  petId: number;
  currentTutorIds?: number[];
  onLink: (tutorId: number) => Promise<void>;
  onClose: () => void;
}

export function LinkTutorModal({
  //petId,
  currentTutorIds = [],
  onLink,
  onClose,
}: LinkTutorModalProps) {
  const [tutores, setTutores] = useState<ProprietarioResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [linking, setLinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carrega todos os tutores
  useEffect(() => {
    const loadTutores = async () => {
      setLoading(true);
      setError(null);

      try {
        // Carrega primeira página com muitos resultados
        await tutoresFacade.loadTutores(1, 100);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Erro ao carregar tutores'
        );
      } finally {
        setLoading(false);
      }
    };

    loadTutores();
  }, []);

  // Subscribe aos tutores do facade
  useEffect(() => {
    const tutoresSub = tutoresFacade.tutores$.subscribe((data) => {
      setTutores(Array.isArray(data) ? data : []);
    });

    return () => {
      tutoresSub.unsubscribe();
    };
  }, []);

  const availableTutores = tutores.filter(
    (tutor) => !currentTutorIds.includes(tutor.id)
  );

  const handleLinkTutor = async (tutorId: number) => {
    setLinking(true);
    setError(null);

    try {
      await onLink(tutorId);
      // Recarrega tutores para atualizar a lista de disponíveis
      await tutoresFacade.loadTutores(1, 100);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao vincular tutor'
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
              Vincular Tutor ao Pet
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
              <p className="text-gray-600">Carregando tutores...</p>
            </div>
          ) : availableTutores.length > 0 ? (
            <div className="space-y-3">
              {availableTutores.map((tutor) => (
                <div
                  key={tutor.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">{tutor.nome}</h3>
                    <p className="text-sm text-gray-600">{tutor.email}</p>
                    <p className="text-sm text-gray-600">{tutor.telefone}</p>
                  </div>
                  <button
                    onClick={() => handleLinkTutor(tutor.id)}
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
                {currentTutorIds.length > 0
                  ? 'Todos os tutores já estão vinculados'
                  : 'Nenhum tutor disponível'}
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
