/**
 * Mock API Service
 * Fornece dados mock da API quando em modo desenvolvimento
 * Para ser removido quando autenticação real for implementada
 */

import type {
  PagedPetResponseDto,
  PetResponseCompletoDto,
  PetResponseDto,
  ProprietarioResponseDto,
} from '@/shared/types/dtos';

const MOCK_TUTORES: ProprietarioResponseDto[] = [
  {
    id: 1,
    nome: 'João Silva',
    email: 'joao@example.com',
    telefone: '(11) 98765-4321',
    endereco: 'Rua A, 123 - São Paulo, SP',
    cpf: 12345678901,
  },
  {
    id: 2,
    nome: 'Maria Santos',
    email: 'maria@example.com',
    telefone: '(21) 99876-5432',
    endereco: 'Avenida B, 456 - Rio de Janeiro, RJ',
    cpf: 98765432101,
  },
  {
    id: 3,
    nome: 'Carlos Oliveira',
    email: 'carlos@example.com',
    telefone: '(31) 97654-3210',
    endereco: 'Rua C, 789 - Belo Horizonte, MG',
    cpf: 55555555555,
  },
];

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
 * Retorna detalhes completos do pet com tutores
 */
export async function mockGetPetById(id: number): Promise<PetResponseCompletoDto> {
  // Simula delay de rede
  await new Promise((resolve) => setTimeout(resolve, 300));

  const pet = MOCK_PETS.find((p) => p.id === id);
  if (!pet) {
    throw new Error(`Pet com ID ${id} não encontrado`);
  }

  // Atribui tutores baseado no ID (alguns pets têm, outros não)
  const tutorIds = {
    1: [1],
    2: [2],
    3: [1, 2],
    4: [3],
    5: [],
    6: [1],
    7: [2],
    8: [],
    9: [3],
    10: [1, 2],
    11: [],
    12: [2],
  };

  const petTutorIds = tutorIds[id as keyof typeof tutorIds] || [];
  const tutores = petTutorIds.map((tutorId) =>
    MOCK_TUTORES.find((t) => t.id === tutorId)
  ).filter((t) => t !== undefined) as ProprietarioResponseDto[];

  return {
    ...pet,
    tutores,
  };
}

/**
 * Mock de GET /v1/tutores/{id}
 * Retorna detalhes do tutor
 */
export async function mockGetTutorById(id: number): Promise<ProprietarioResponseDto> {
  // Simula delay de rede
  await new Promise((resolve) => setTimeout(resolve, 300));

  const tutor = MOCK_TUTORES.find((t) => t.id === id);
  if (!tutor) {
    throw new Error(`Tutor com ID ${id} não encontrado`);
  }

  return tutor;
}

/**
 * Habilita mocks globalmente
 */
export function enableMockApi() {
  // Set token padrão para bypass de autenticação
  localStorage.setItem('@pet-app:access_token', 'mock-token-12345');
  console.log('✓ Mock API habilitado. Token padrão setado.');
}
