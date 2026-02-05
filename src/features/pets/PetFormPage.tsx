/**
 * PetFormPage
 * Página para criar ou editar um pet
 */

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { PetRequestDto, PetResponseDto } from '@/shared/types/dtos';
import { petsFacade } from '@/features/pets/facades';
import { PetForm } from './components/PetForm';
import { LoadingSpinner } from './components/LoadingSpinner';

export function PetFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pet, setPet] = useState<PetResponseDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const petId = id ? parseInt(id, 10) : null;
  const isEditing = !!petId;

  // Carrega pet se for edição
  useEffect(() => {
    if (!isEditing) return;

    const loadPet = async () => {
      setLoading(true);
      setError(null);

      try {
        const state = petsFacade.getState();
        // Se já temos o pet no estado, usa ele
        if (state.selectedPet && state.selectedPet.id === petId) {
          setPet(state.selectedPet);
        } else {
          // Senão, carrega
          await petsFacade.loadPetById(petId);
          const updatedState = petsFacade.getState();
          if (updatedState.selectedPet) {
            setPet(updatedState.selectedPet);
          }
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Erro ao carregar pet'
        );
      } finally {
        setLoading(false);
      }
    };

    loadPet();
  }, [petId, isEditing]);

  const handleSubmit = async (data: PetRequestDto, file?: File) => {
    setSubmitting(true);
    setError(null);

    try {
      if (isEditing && petId) {
        // Editar pet
        const result = await petsFacade.updatePet(petId, data);
        if (result) {
          // Upload de foto se fornecida
          if (file) {
            await petsFacade.uploadPetPhoto(petId, file);
          }
          navigate(`/pets/${petId}`);
        } else {
          setError('Erro ao atualizar pet');
        }
      } else {
        // Criar novo pet
        const result = await petsFacade.createPet(data);
        if (result && file) {
          // Upload de foto para o novo pet
          await petsFacade.uploadPetPhoto(result.id, file);
          navigate(`/pets/${result.id}`);
        } else if (result) {
          navigate(`/pets/${result.id}`);
        } else {
          setError('Erro ao criar pet');
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao salvar pet'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(isEditing ? `/pets/${petId}` : '/pets')}
            className="text-blue-600 hover:text-blue-800 font-medium mb-4"
          >
            ← Voltar
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? '✏️ Editar Pet' : '➕ Novo Pet'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditing
              ? 'Atualize as informações do pet'
              : 'Cadastre um novo pet no sistema'}
          </p>
        </div>

        {/* Loading */}
        {loading && isEditing ? (
          <LoadingSpinner />
        ) : (
          <PetForm
            pet={pet || undefined}
            onSubmit={handleSubmit}
            isLoading={submitting}
            error={error || (loading ? null : undefined)}
            onError={setError}
          />
        )}
      </div>
    </div>
  );
}
