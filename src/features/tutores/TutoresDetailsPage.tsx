import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { ProprietarioResponseDto } from '@/shared/types/dtos';
import { tutoresFacade } from '@/features/tutores/facades';
import { petsFacade } from '@/features/pets/facades';
import { TutorDetail } from './components/TutorDetail';
import { LinkPetModal } from './components/LinkPetModal';
import { LoadingSpinner } from '@/features/pets/components/LoadingSpinner';
import { ErrorAlert } from '@/features/pets/components/ErrorAlert';

export function TutoresDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState<ProprietarioResponseDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLinkPetModal, setShowLinkPetModal] = useState(false);

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
        await tutoresFacade.loadTutorById(tutorId);
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

  // Subscribe ao tutor selecionado
  useEffect(() => {
    const selectedTutorSub = tutoresFacade.selectedTutor$.subscribe((selectedTutor) => {
      if (selectedTutor) {
        setTutor(selectedTutor as ProprietarioResponseDto);
      }
    });

    const errorSub = tutoresFacade.error$.subscribe((err) => {
      if (err) {
        const message = typeof err === 'string' ? err : (err instanceof Error ? err.message : 'Erro ao carregar tutor');
        setError(message);
      }
    });

    const loadingSub = tutoresFacade.loading$.subscribe((isLoading) => {
      setLoading(Boolean(isLoading));
    });

    return () => {
      selectedTutorSub.unsubscribe();
      errorSub.unsubscribe();
      loadingSub.unsubscribe();
    };
  }, []);

  const handleBack = () => {
    tutoresFacade.reset();
    navigate('/tutores');
  };

  const handleEdit = (tutorId: number) => {
    navigate(`/tutores/${tutorId}/edit`);
  };

  const handleDelete = (tutorId: number) => {
    if (confirm('Tem certeza que deseja deletar este tutor?')) {
      setLoading(true);
      setError(null);

      tutoresFacade.deleteTutor(tutorId)
        .then(() => {
          tutoresFacade.reset();
          navigate('/tutores');
        })
        .catch((err) => {
          setError(
            err instanceof Error ? err.message : 'Erro ao deletar tutor'
          );
          setLoading(false);
        });
    }
  };

  const handleDismissError = () => {
    tutoresFacade.clearError();
    setError(null);
  };

  const handleLinkPet = (tutorId: number) => {
    setShowLinkPetModal(true);
  };

  const handleLinkPetToSel = async (petId: number) => {
    if (!tutorId) return;

    try {
      await petsFacade.linkPetToTutor(tutorId, petId);
      // Recarrega os detalhes do tutor
      await tutoresFacade.loadTutorById(tutorId);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao vincular pet'
      );
    }
  };

  const handleUnlinkPet = (petId: number) => {
    if (!tutorId) return;

    if (confirm('Tem certeza que deseja remover este pet do tutor?')) {
      setLoading(true);
      setError(null);

      petsFacade.unlinkPetFromTutor(tutorId, petId)
        .then(() => {
          // Recarrega os detalhes do tutor
          return tutoresFacade.loadTutorById(tutorId);
        })
        .catch((err) => {
          setError(
            err instanceof Error ? err.message : 'Erro ao remover pet'
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }
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
          <>
            <TutorDetail
              tutor={tutor}
              onBack={handleBack}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onLinkPet={handleLinkPet}
              onUnlinkPet={handleUnlinkPet}
            />

            {/* Modal para vincular pet */}
            {showLinkPetModal && tutorId && (
              <LinkPetModal
                tutorId={tutorId}
                currentPetIds={[]}
                onLink={handleLinkPetToSel}
                onClose={() => setShowLinkPetModal(false)}
              />
            )}
          </>
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
