/**
 * PetDetailsPage
 * Página de detalhamento de um pet específico
 */

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { PetResponseCompletoDto } from '@/shared/types/dtos';
import { petsFacade } from '@/features/pets/facades';
import { PetDetail } from './components/PetDetail';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorAlert } from './components/ErrorAlert';

export function PetDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pet, setPet] = useState<PetResponseCompletoDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const petId = id ? parseInt(id, 10) : null;

  // Carrega detalhes do pet ao montar o componente
  useEffect(() => {
    if (!petId) {
      setError('ID do pet inválido');
      return;
    }

    const loadPetDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        await petsFacade.loadPetById(petId);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Erro ao carregar detalhes do pet'
        );
      } finally {
        setLoading(false);
      }
    };

    loadPetDetails();
  }, [petId]);

  // Subscribe ao pet selecionado
  useEffect(() => {
    const selectedPetSub = petsFacade.selectedPet$.subscribe((selectedPet) => {
      if (selectedPet) {
        setPet(selectedPet as PetResponseCompletoDto);
      }
    });

    const errorSub = petsFacade.error$.subscribe((err) => {
      if (err) {
        const message = typeof err === 'string' ? err : (err instanceof Error ? err.message : 'Erro ao carregar pet');
        setError(message);
      }
    });

    const loadingSub = petsFacade.loading$.subscribe((isLoading) => {
      setLoading(Boolean(isLoading));
    });

    return () => {
      selectedPetSub.unsubscribe();
      errorSub.unsubscribe();
      loadingSub.unsubscribe();
    };
  }, []);

  const handleBack = () => {
    petsFacade.reset();
    navigate('/pets');
  };

  const handleDismissError = () => {
    petsFacade.clearError();
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Alerta de erro */}
        <ErrorAlert error={error} onDismiss={handleDismissError} />

        {/* Loading */}
        {loading && !pet ? (
          <LoadingSpinner />
        ) : pet ? (
          <PetDetail pet={pet} onBack={handleBack} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Pet não encontrado</p>
            <button
              onClick={handleBack}
              className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              Voltar para Pets
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
