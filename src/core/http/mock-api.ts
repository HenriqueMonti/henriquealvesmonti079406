/**
 * Mock API Service
 * Fornece dados mock da API quando em modo desenvolvimento
 * Para ser removido quando autenticação real for implementada
 */

import type { PagedPetResponseDto, PetResponseCompletoDto, PetResponseDto } from '@/shared/types/dtos';

const MOCK_PETS: PetResponseDto[] = [
  {
    id: 1,
    nome: 'Rex',
    raca: 'Labrador Retriever',
    idade: 3,
    foto: {
      id: 1,
      nome: 'rex.jpg',
      contentType: 'image/jpeg',
      url: null!,
    },
  },
  {
    id: 2,
    nome: 'Luna',
    raca: 'Golden Retriever',
    idade: 2,
    foto: {
      id: 2,
      nome: 'luna.jpg',
      contentType: 'image/jpeg',
      url: null!,
    },
  },
  {
    id: 3,
    nome: 'Max',
    raca: 'Pastor Alemão',
    idade: 4,
  },
  {
    id: 4,
    nome: 'Bella',
    raca: 'Bulldog Francês',
    idade: 1,
    foto: {
      id: 4,
      nome: 'bella.jpg',
      contentType: 'image/jpeg',
      url: null!,
    },
  },
  {
    id: 5,
    nome: 'Charlie',
    raca: 'Poodle',
    idade: 2,
  },
  {
    id: 6,
    nome: 'Daisy',
    raca: 'Beagle',
    idade: 3,
    foto: {
      id: 6,
      nome: 'daisy.jpg',
      contentType: 'image/jpeg',
      url: null!,
    },
  },
  {
    id: 7,
    nome: 'Rocky',
    raca: 'Rottweiler',
    idade: 5,
  },
  {
    id: 8,
    nome: 'Sophie',
    raca: 'Shih Tzu',
    idade: 1,
    foto: {
      id: 8,
      nome: 'sophie.jpg',
      contentType: 'image/jpeg',
      url: null!,
    },
  },
  {
    id: 9,
    nome: 'Lucky',
    raca: 'Husky Siberiano',
    idade: 2,
  },
  {
    id: 10,
    nome: 'Milo',
    raca: 'Dachshund',
    idade: 4,
    foto: {
      id: 10,
      nome: 'milo.jpg',
      contentType: 'image/jpeg',
      url: null!,
    },
  },
  {
    id: 11,
    nome: 'Lucy',
    raca: 'Cocker Spaniel',
    idade: 3,
  },
  {
    id: 12,
    nome: 'Duke',
    raca: 'Boxer',
    idade: 6,
    foto: {
      id: 12,
      nome: 'duke.jpg',
      contentType: 'image/jpeg',
      url: null!,
    },
  },
];

/**
 * Mock de GET /v1/pets
 * Retorna dados paginados
 */
export async function mockGetPets(
  page: number = 1,
  size: number = 10
): Promise<PagedPetResponseDto> {
  // Simula delay de rede
  await new Promise((resolve) => setTimeout(resolve, 500));

  const start = (page - 1) * size;
  const end = start + size;
  const content = MOCK_PETS.slice(start, end);
  const total = MOCK_PETS.length;
  const pageCount = Math.ceil(total / size);

  return {
    page,
    size,
    total,
    pageCount,
    content,
  };
}

/**
 * Mock de GET /v1/pets/{id}
 * Retorna detalhes completos do pet
 */
export async function mockGetPetById(id: number): Promise<PetResponseCompletoDto> {
  // Simula delay de rede
  await new Promise((resolve) => setTimeout(resolve, 300));

  const pet = MOCK_PETS.find((p) => p.id === id);
  if (!pet) {
    throw new Error(`Pet com ID ${id} não encontrado`);
  }

  return {
    ...pet,
    tutores: [],
  };
}

/**
 * Habilita mocks globalmente
 */
export function enableMockApi() {
  // Set token padrão para bypass de autenticação
  localStorage.setItem('@pet-app:access_token', 'mock-token-12345');
  console.log('✓ Mock API habilitado. Token padrão setado.');
}
