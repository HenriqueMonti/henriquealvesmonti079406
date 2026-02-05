/**
 * PetsPage
 * Página principal de listagem de pets
 * Requisitos atendidos:
 * - GET /v1/pets
 * - Cards com foto (se existir), nome, raça, idade
 * - Paginação (10 por página)
 * - Busca por nome
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PetsList, SearchBar } from './components';

export function PetsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectPet = (petId: number) => {
    navigate(`/pets/${petId}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Nossos Pets</h1>
              <p className="text-gray-600">
                Conheça todos os pets disponíveis para adoção
              </p>
            </div>
            <button
              onClick={() => navigate('/pets/new')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded transition-colors"
            >
              ➕ Novo Pet
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />

        {/* Pets List com paginação */}
        <PetsList onSelectPet={handleSelectPet} searchQuery={searchQuery} />
      </div>
    </div>
  );
}
