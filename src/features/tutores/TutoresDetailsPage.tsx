/**
 * TutoresDetailsPage
 * Página de detalhamento de um tutor específico
 */

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { ProprietarioResponseDto } from '@/shared/types/dtos';
import { tutorService } from '@/features/tutores/services';
import { TutorDetail } from './components/TutorDetail';
import { LoadingSpinner } from '@/features/pets/components/LoadingSpinner';
import { ErrorAlert } from '@/features/pets/components/ErrorAlert';

export function TutoresDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState<ProprietarioResponseDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tutorId = id ? parseInt(id, 10) : null;

  // Carrega detalhes do tutor ao montar o componente
  useEffect(() => {
    if (!tutorId) {
      setError('ID do tutor inválido');
      return;
    }

    const loadTutorDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await tutorService.getTutorById(tutorId);
        setTutor(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Erro ao carregar detalhes do tutor'
        );
      } finally {
        setLoading(false);
      }
    };

    loadTutorDetails();
  }, [tutorId]);

  const handleBack = () => {
    navigate('/tutores');
  };

  const handleDismissError = () => {
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Alerta de erro */}
        <ErrorAlert error={error} onDismiss={handleDismissError} />

        {/* Loading */}
        {loading && !tutor ? (
          <LoadingSpinner />
        ) : tutor ? (
          <TutorDetail tutor={tutor} onBack={handleBack} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Tutor não encontrado</p>
            <button
              onClick={handleBack}
              className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              Voltar para Tutores
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
