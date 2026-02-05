/**
 * TutorFormPage
 * Página para criar ou editar um tutor
 */

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { ProprietarioRequestDto, ProprietarioResponseDto } from '@/shared/types/dtos';
import { tutoresFacade } from '@/features/tutores/facades';
import { TutorForm } from './components/TutorForm';
import { LoadingSpinner } from '@/features/pets/components/LoadingSpinner';

export function TutorFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState<ProprietarioResponseDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tutorId = id ? parseInt(id, 10) : null;
  const isEditing = !!tutorId;

  // Carrega tutor se for edição
  useEffect(() => {
    if (!isEditing) return;

    const loadTutor = async () => {
      setLoading(true);
      setError(null);

      try {
        const state = tutoresFacade.getState();
        // Se já temos o tutor no estado, usa ele
        if (state.selectedTutor && state.selectedTutor.id === tutorId) {
          setTutor(state.selectedTutor);
        } else {
          // Senão, carrega
          await tutoresFacade.loadTutorById(tutorId);
          const updatedState = tutoresFacade.getState();
          if (updatedState.selectedTutor) {
            setTutor(updatedState.selectedTutor);
          }
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Erro ao carregar tutor'
        );
      } finally {
        setLoading(false);
      }
    };

    loadTutor();
  }, [tutorId, isEditing]);

  const handleSubmit = async (data: ProprietarioRequestDto, file?: File) => {
    setSubmitting(true);
    setError(null);

    try {
      if (isEditing && tutorId) {
        // Editar tutor
        const result = await tutoresFacade.updateTutor(tutorId, data);
        if (result) {
          // Upload de foto se fornecida
          if (file) {
            await tutoresFacade.uploadTutorPhoto(tutorId, file);
          }
          navigate(`/tutores/${tutorId}`);
        } else {
          setError('Erro ao atualizar tutor');
        }
      } else {
        // Criar novo tutor
        const result = await tutoresFacade.createTutor(data);
        if (result && file) {
          // Upload de foto para o novo tutor
          await tutoresFacade.uploadTutorPhoto(result.id, file);
          navigate(`/tutores/${result.id}`);
        } else if (result) {
          navigate(`/tutores/${result.id}`);
        } else {
          setError('Erro ao criar tutor');
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao salvar tutor'
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
            onClick={() => navigate(isEditing ? `/tutores/${tutorId}` : '/tutores')}
            className="text-blue-600 hover:text-blue-800 font-medium mb-4"
          >
            ← Voltar
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? '✏️ Editar Tutor' : '➕ Novo Tutor'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditing
              ? 'Atualize as informações do tutor'
              : 'Cadastre um novo tutor no sistema'}
          </p>
        </div>

        {/* Loading */}
        {loading && isEditing ? (
          <LoadingSpinner />
        ) : (
          <TutorForm
            tutor={tutor || undefined}
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
