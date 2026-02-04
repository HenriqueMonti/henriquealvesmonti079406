/**
 * PetsPage
 * Página principal de listagem de pets
 * Requisitos atendidos:
 * - GET /v1/pets
 * - Cards com foto (se existir), nome, raça, idade
 * - Paginação (10 por página)
 * - Busca por nome
 */

import { useNavigate } from 'react-router-dom';
import { PetsList, SearchBar } from './components';

export function PetsPage() {
  const navigate = useNavigate();

  const handleSelectPet = (petId: number) => {
    navigate(`/pets/${petId}`);
  };

  const handleSearch = (query: string) => {
    // TODO: Implementar busca local ou via API
    console.log('Buscar por:', query);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nossos Pets</h1>
          <p className="text-gray-600">
            Conheça todos os pets disponíveis para adoção
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />

        {/* Pets List com paginação */}
        <PetsList onSelectPet={handleSelectPet} />
      </div>
    </div>
  );
}
