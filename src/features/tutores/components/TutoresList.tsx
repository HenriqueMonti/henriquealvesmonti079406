/**
 * TutoresList Component
 * Lista de cards de tutores com paginação
 */

import { useEffect, useState } from 'react';
import type { ProprietarioResponseDto } from '@/shared/types/dtos';
import { tutoresFacade } from '@/features/tutores/facades';
import { TutorCard } from '@/shared/components/TutorCard';
import { Pagination } from '@/features/pets/components/Pagination';
import { LoadingSpinner } from '@/features/pets/components/LoadingSpinner';
import { ErrorAlert } from '@/features/pets/components/ErrorAlert';

interface TutoresListProps {
  onSelectTutor?: (tutorId: number) => void;
  searchQuery?: string;
}

export function TutoresList({ onSelectTutor, searchQuery = '' }: TutoresListProps) {
  const [tutores, setTutores] = useState<ProprietarioResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const pageSize = 10;

  // Filtra tutores localmente baseado na query
  const filteredTutores = tutores.filter((tutor) =>
    tutor.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reseta para página 1 quando a busca muda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Carrega tutores quando página muda
  useEffect(() => {
    const loadTutores = async () => {
      setLoading(true);
      setError(null);

      try {
        await tutoresFacade.loadTutores(currentPage, pageSize);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Erro ao carregar tutores'
        );
      } finally {
        setLoading(false);
      }
    };

    loadTutores();
  }, [currentPage]);

  // Subscribe aos observables do facade
  useEffect(() => {
    const tutoresSub = tutoresFacade.tutores$.subscribe((data) => {
      setTutores(Array.isArray(data) ? data : []);
    });

    const loadingSub = tutoresFacade.loading$.subscribe((isLoading) => {
      setLoading(Boolean(isLoading));
    });

    const errorSub = tutoresFacade.error$.subscribe((err) => {
      if (err) {
        const message = typeof err === 'string' ? err : (err instanceof Error ? err.message : 'Erro ao carregar tutores');
        setError(message);
      } else {
        setError(null);
      }
    });

    const paginationSub = tutoresFacade.pagination$.subscribe((pagination) => {
      if (pagination && typeof pagination === 'object' && 'pageCount' in pagination) {
        setTotalPages((pagination as { pageCount: number }).pageCount);
      }
    });

    return () => {
      tutoresSub.unsubscribe();
      loadingSub.unsubscribe();
      errorSub.unsubscribe();
      paginationSub.unsubscribe();
    };
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDismissError = () => {
    tutoresFacade.clearError();
    setError(null);
  };

  return (
    <div>
      {/* Alerta de erro */}
      <ErrorAlert error={error} onDismiss={handleDismissError} />

      {/* Loading spinner */}
      {loading && tutores.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Grid de cards */}
          {filteredTutores.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTutores.map((tutor) => (
                  <div
                    key={tutor.id}
                    onClick={() => onSelectTutor?.(tutor.id)}
                    className="cursor-pointer"
                  >
                    <TutorCard
                      tutor={tutor}
                      showButton={true}
                    />
                  </div>
                ))}
              </div>

              {/* Paginação */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                isLoading={loading}
              />
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchQuery ? `Nenhum tutor encontrado com o nome "${searchQuery}"` : 'Nenhum tutor encontrado'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
