import { HttpService } from '@/core/http/http.service';
import type {
  PetRequestDto,
  PetResponseDto,
  PetResponseCompletoDto,
  PagedPetResponseDto,
  AnexoResponseDto,
} from '@/shared/types/dtos';
import { mockGetPets, mockGetPetById, mockCreatePet, mockUpdatePet, mockDeletePet, mockUploadPetPhoto } from '@/core/http/mock-api';

class PetService extends HttpService {

  // TODO: Remover mock após implementar autenticação real
  async getPets(page: number = 1, size: number = 10): Promise<PagedPetResponseDto> {
    //return this.get<PagedPetResponseDto>('/v1/pets', {
    //  params: { page, size },
    //});
    return mockGetPets(page, size);
  }

  // TODO: Remover mock após implementar autenticação real
  async getPetById(id: number): Promise<PetResponseCompletoDto> {
    //return this.get<PetResponseCompletoDto>(`/v1/pets/${id}`);
    return mockGetPetById(id);
  }

  // TODO: Remover mock após implementar autenticação real
  async createPet(data: PetRequestDto): Promise<PetResponseDto> {
    //return this.post<PetResponseDto>('/v1/pets', data);
    return mockCreatePet(data);
  }

  // TODO: Remover mock após implementar autenticação real
  async updatePet(id: number, data: PetRequestDto): Promise<PetResponseDto> {
    //return this.put<PetResponseDto>(`/v1/pets/${id}`, data);
    return mockUpdatePet(id, data);
  }

  // TODO: Remover mock após implementar autenticação real
  async deletePet(id: number): Promise<void> {
    //return this.delete(`/v1/pets/${id}`);
    return mockDeletePet(id);
  }

  // TODO: Remover mock após implementar autenticação real
  async uploadPetPhoto(petId: number, file: File): Promise<AnexoResponseDto> {
    //return this.uploadFile<AnexoResponseDto>(`/v1/pets/${petId}/fotos`, file);
    return mockUploadPetPhoto(petId, file);
  }

  async deletePetPhoto(petId: number, fotoId: number): Promise<void> {
    return this.delete(`/v1/pets/${petId}/fotos/${fotoId}`);
  }
}

export const petService = new PetService();
