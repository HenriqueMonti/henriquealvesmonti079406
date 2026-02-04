import { HttpService } from '@/core/http/http.service';
import type {
  ProprietarioRequestDto,
  ProprietarioResponseDto,
  ProprietarioResponseComPetsDto,
  PagedProprietarioResponseDto,
  AnexoResponseDto,
} from '@/shared/types/dtos';

class TutorService extends HttpService {
  /**
   * Lista tutores com paginação
   * GET /v1/tutores?page={page}&size={size}
   */
  async getTutores(page: number = 1, size: number = 10): Promise<PagedProprietarioResponseDto> {
    return this.get<PagedProprietarioResponseDto>('/v1/tutores', {
      params: { page, size },
    });
  }

  /**
   * Busca tutor por ID com pets vinculados
   * GET /v1/tutores/{id}
   */
  async getTutorById(id: number): Promise<ProprietarioResponseComPetsDto> {
    return this.get<ProprietarioResponseComPetsDto>(`/v1/tutores/${id}`);
  }

  /**
   * Cria novo tutor
   * POST /v1/tutores
   */
  async createTutor(data: ProprietarioRequestDto): Promise<ProprietarioResponseDto> {
    return this.post<ProprietarioResponseDto>('/v1/tutores', data);
  }

  /**
   * Atualiza tutor existente
   * PUT /v1/tutores/{id}
   */
  async updateTutor(id: number, data: ProprietarioRequestDto): Promise<ProprietarioResponseDto> {
    return this.put<ProprietarioResponseDto>(`/v1/tutores/${id}`, data);
  }

  /**
   * Deleta tutor
   * DELETE /v1/tutores/{id}
   */
  async deleteTutor(id: number): Promise<void> {
    return this.delete(`/v1/tutores/${id}`);
  }

  /**
   * Upload de foto do tutor
   * POST /v1/tutores/{id}/fotos
   */
  async uploadTutorPhoto(tutorId: number, file: File): Promise<AnexoResponseDto> {
    return this.uploadFile<AnexoResponseDto>(`/v1/tutores/${tutorId}/fotos`, file);
  }

  /**
   * Deleta foto do tutor
   * DELETE /v1/tutores/{id}/fotos/{fotoId}
   */
  async deleteTutorPhoto(tutorId: number, fotoId: number): Promise<void> {
    return this.delete(`/v1/tutores/${tutorId}/fotos/${fotoId}`);
  }

  /**
   * Vincula pet ao tutor
   * POST /v1/tutores/{id}/pets/{petId}
   */
  async linkPetToTutor(tutorId: number, petId: number): Promise<void> {
    return this.post(`/v1/tutores/${tutorId}/pets/${petId}`);
  }

  /**
   * Remove pet do tutor
   * DELETE /v1/tutores/{id}/pets/{petId}
   */
  async unlinkPetFromTutor(tutorId: number, petId: number): Promise<void> {
    return this.delete(`/v1/tutores/${tutorId}/pets/${petId}`);
  }
}

export const tutorService = new TutorService();
