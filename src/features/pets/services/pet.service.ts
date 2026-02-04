import { HttpService } from '../../../core/http/http.service';
import type {
  PetRequestDto,
  PetResponseDto,
  PetResponseCompletoDto,
  PagedPetResponseDto,
  AnexoResponseDto,
} from '../../../shared/types/dtos';

class PetService extends HttpService {
  /**
   * Lista pets com paginação
   * GET /v1/pets?page={page}&size={size}
   */
  async getPets(page: number = 1, size: number = 10): Promise<PagedPetResponseDto> {
    return this.get<PagedPetResponseDto>('/v1/pets', {
      params: { page, size },
    });
  }

  /**
   * Busca pet por ID
   * GET /v1/pets/{id}
   */
  async getPetById(id: number): Promise<PetResponseCompletoDto> {
    return this.get<PetResponseCompletoDto>(`/v1/pets/${id}`);
  }

  /**
   * Cria novo pet
   * POST /v1/pets
   */
  async createPet(data: PetRequestDto): Promise<PetResponseDto> {
    return this.post<PetResponseDto>('/v1/pets', data);
  }

  /**
   * Atualiza pet existente
   * PUT /v1/pets/{id}
   */
  async updatePet(id: number, data: PetRequestDto): Promise<PetResponseDto> {
    return this.put<PetResponseDto>(`/v1/pets/${id}`, data);
  }

  /**
   * Deleta pet
   * DELETE /v1/pets/{id}
   */
  async deletePet(id: number): Promise<void> {
    return this.delete(`/v1/pets/${id}`);
  }

  /**
   * Upload de foto do pet
   * POST /v1/pets/{id}/fotos
   */
  async uploadPetPhoto(petId: number, file: File): Promise<AnexoResponseDto> {
    return this.uploadFile<AnexoResponseDto>(`/v1/pets/${petId}/fotos`, file);
  }

  /**
   * Deleta foto do pet
   * DELETE /v1/pets/{id}/fotos/{fotoId}
   */
  async deletePetPhoto(petId: number, fotoId: number): Promise<void> {
    return this.delete(`/v1/pets/${petId}/fotos/${fotoId}`);
  }
}

export const petService = new PetService();
