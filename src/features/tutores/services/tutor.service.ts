import { HttpService } from '@/core/http/http.service';
import type {
  ProprietarioRequestDto,
  ProprietarioResponseDto,
  //ProprietarioResponseComPetsDto,
  PagedProprietarioResponseDto,
  AnexoResponseDto,
} from '@/shared/types/dtos';
import { mockGetTutorById } from '@/core/http/mock-api';

class TutorService extends HttpService {
  async getTutores(page: number = 1, size: number = 10): Promise<PagedProprietarioResponseDto> {
    return this.get<PagedProprietarioResponseDto>('/v1/tutores', {
      params: { page, size },
    });
  }

  // TODO: Remover mock após implementar autenticação real
  async getTutorById(id: number): Promise<ProprietarioResponseDto> {
    //return this.get<ProprietarioResponseComPetsDto>(`/v1/tutores/${id}`);
    return mockGetTutorById(id);
  }

  async createTutor(data: ProprietarioRequestDto): Promise<ProprietarioResponseDto> {
    return this.post<ProprietarioResponseDto>('/v1/tutores', data);
  }

  async updateTutor(id: number, data: ProprietarioRequestDto): Promise<ProprietarioResponseDto> {
    return this.put<ProprietarioResponseDto>(`/v1/tutores/${id}`, data);
  }

  async deleteTutor(id: number): Promise<void> {
    return this.delete(`/v1/tutores/${id}`);
  }

  async uploadTutorPhoto(tutorId: number, file: File): Promise<AnexoResponseDto> {
    return this.uploadFile<AnexoResponseDto>(`/v1/tutores/${tutorId}/fotos`, file);
  }

  async deleteTutorPhoto(tutorId: number, fotoId: number): Promise<void> {
    return this.delete(`/v1/tutores/${tutorId}/fotos/${fotoId}`);
  }

  async linkPetToTutor(tutorId: number, petId: number): Promise<void> {
    return this.post(`/v1/tutores/${tutorId}/pets/${petId}`);
  }

  async unlinkPetFromTutor(tutorId: number, petId: number): Promise<void> {
    return this.delete(`/v1/tutores/${tutorId}/pets/${petId}`);
  }
}

export const tutorService = new TutorService();
