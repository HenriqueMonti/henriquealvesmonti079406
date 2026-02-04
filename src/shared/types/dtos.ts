// ==================== AUTENTICAÇÃO ====================

export interface AuthRequestDto {
  username: string;
  password: string;
}

export interface AuthResponseDto {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
}

// ==================== ANEXO / FOTO ====================

export interface AnexoResponseDto {
  id: number;
  nome: string;
  contentType: string;
  url: string;
}

// ==================== PETS ====================

export interface PetRequestDto {
  nome: string; // ≤ 100 caracteres
  raca: string; // ≤ 100 caracteres
  idade: number; // em anos
}

export interface PetResponseDto {
  id: number;
  nome: string;
  raca: string;
  idade: number;
  foto?: AnexoResponseDto;
}

export interface PetResponseCompletoDto {
  id: number;
  nome: string;
  raca: string;
  idade: number;
  foto?: AnexoResponseDto;
  tutores: ProprietarioResponseDto[];
}

export interface PagedPetResponseDto {
  page: number;
  size: number;
  total: number;
  pageCount: number;
  content: PetResponseDto[];
}

// ==================== PROPRIETÁRIOS (TUTORES) ====================

export interface ProprietarioRequestDto {
  nome: string; // ≤ 100 caracteres
  email: string; // ≤ 150 caracteres
  telefone: string; // ≤ 20 caracteres
  endereco: string; // ≤ 200 caracteres
  cpf: number; // apenas dígitos
}

export interface ProprietarioResponseDto {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cpf: number;
  foto?: AnexoResponseDto;
}

export interface ProprietarioResponseComPetsDto {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cpf: number;
  foto?: AnexoResponseDto;
  pets: PetResponseDto[];
}

export interface PagedProprietarioResponseDto {
  page: number;
  size: number;
  total: number;
  pageCount: number;
  content: ProprietarioResponseDto[];
}
