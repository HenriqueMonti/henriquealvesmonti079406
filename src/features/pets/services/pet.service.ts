import { HttpService } from '@/core/http/http.service';
import type {
  PetRequestDto,
  PetResponseDto,
  PetResponseCompletoDto,
  PagedPetResponseDto,
  AnexoResponseDto,
} from '@/shared/types/dtos';

class PetService extends HttpService {

  async getPets(page: number = 1, size: number = 10): Promise<PagedPetResponseDto> {
    return this.get<PagedPetResponseDto>('/v1/pets', {
      params: { page, size },
    });
  }

  async getPetById(id: number): Promise<PetResponseCompletoDto> {
    return this.get<PetResponseCompletoDto>(`/v1/pets/${id}`);
  }

  async createPet(data: PetRequestDto): Promise<PetResponseDto> {
    return this.post<PetResponseDto>('/v1/pets', data);
  }

  async updatePet(id: number, data: PetRequestDto): Promise<PetResponseDto> {
    return this.put<PetResponseDto>(`/v1/pets/${id}`, data);
  }

  async deletePet(id: number): Promise<void> {
    return this.delete(`/v1/pets/${id}`);
  }

  async uploadPetPhoto(petId: number, file: File): Promise<AnexoResponseDto> {
    return this.uploadFile<AnexoResponseDto>(`/v1/pets/${petId}/fotos`, file);
  }

  async deletePetPhoto(petId: number, fotoId: number): Promise<void> {
    return this.delete(`/v1/pets/${petId}/fotos/${fotoId}`);
  }
}

export const petService = new PetService();
