/**
 * PetCard Component
 * Card individual para exibir um pet
 * Mostra: foto (se existir), nome, raça, idade
 */

import type { PetResponseDto } from '@/shared/types/dtos';

interface PetCardProps {
  pet: PetResponseDto;
  onSelect: (petId: number) => void;
}

export function PetCard({ pet, onSelect }: PetCardProps) {
  const handleClick = () => {
    onSelect(pet.id);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
      onClick={handleClick}
    >
      {/* Container da imagem */}
      <div className="h-48 bg-gray-200 overflow-hidden">
        {pet.foto ? (
          <img
            src={pet.foto.url}
            alt={pet.nome}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
            <span className="text-blue-500 text-4xl">🐾</span>
          </div>
        )}
      </div>

      {/* Conteúdo do card */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate mb-2">
          {pet.nome}
        </h3>

        <div className="space-y-1 text-sm text-gray-600">
          <p>
            <span className="font-medium">Raça:</span> {pet.raca}
          </p>
          <p>
            <span className="font-medium">Idade:</span> {pet.idade}{' '}
            {pet.idade === 1 ? 'ano' : 'anos'}
          </p>
        </div>

        {/* CTA Button */}
        <button
          className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          Ver Detalhes
        </button>
      </div>
    </div>
  );
}
