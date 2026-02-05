/**
 * PetsList Component
 * Lista de cards de pets com paginação
 */

import { useEffect, useState } from 'react';
import type { PetResponseDto } from '@/shared/types/dtos';
import { petsFacade } from '@/features/pets/facades';
import { PetCard } from './PetCard';
import { Pagination } from './Pagination';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorAlert } from './ErrorAlert';

interface PetsListProps {
  onSelectPet: (petId: number) => void;
  searchQuery?: string;
}

export function PetsList({ onSelectPet, searchQuery = '' }: PetsListProps) {
  const [pets, setPets] = useState<PetResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const pageSize = 10;

  // Filtra pets localmente baseado na query
  const filteredPets = pets.filter((pet) =>
    pet.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reseta para página 1 quando a busca muda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Carrega pets quando página muda
  useEffect(() => {
    const loadPets = async () => {
      setLoading(true);
      setError(null);

      try {
        await petsFacade.loadPets(currentPage, pageSize);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Erro ao carregar pets'
        );
      } finally {
        setLoading(false);
      }
    };

    loadPets();
  }, [currentPage]);

  // Subscribe aos observables do facade
  useEffect(() => {
    const petsSub = petsFacade.pets$.subscribe((data) => {
      setPets(Array.isArray(data) ? data : []);
    });

    const loadingSub = petsFacade.loading$.subscribe((isLoading) => {
      setLoading(Boolean(isLoading));
    });

    const errorSub = petsFacade.error$.subscribe((err) => {
      if (err) {
        const message = typeof err === 'string' ? err : (err instanceof Error ? err.message : 'Erro ao carregar pets');
        setError(message);
      } else {
        setError(null);
      }
    });

    const paginationSub = petsFacade.pagination$.subscribe((pagination) => {
      if (pagination && typeof pagination === 'object' && 'pageCount' in pagination) {
        setTotalPages((pagination as { pageCount: number }).pageCount);
      }
    });

    return () => {
      petsSub.unsubscribe();
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
    petsFacade.clearError();
    setError(null);
  };

  return (
    <div>
      {/* Alerta de erro */}
      <ErrorAlert error={error} onDismiss={handleDismissError} />

      {/* Loading spinner */}
      {loading && pets.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Grid de cards */}
          {filteredPets.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPets.map((pet) => (
                  <PetCard
                    key={pet.id}
                    pet={pet}
                    onSelect={onSelectPet}
                  />
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
                {searchQuery ? `Nenhum pet encontrado com o nome "${searchQuery}"` : 'Nenhum pet encontrado'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
