/**
 * Tutores Facade (State Management)
 * Gerencia estado e lógica de negócio para tutores
 * Usa BehaviorSubject para reatividade
 */

import { BehaviorSubject, Observable } from 'rxjs';
import type {
  ProprietarioResponseDto,
  ProprietarioResponseComPetsDto,
  ProprietarioRequestDto,
  AnexoResponseDto,
} from '@/shared/types/dtos';
import { tutorService } from '@/features/tutores/services/tutor.service';
import type { ApiError } from '@/core/http';

interface TutorState {
  tutores: ProprietarioResponseDto[];
  selectedTutor: ProprietarioResponseComPetsDto | null;
  loading: boolean;
  error: ApiError | null;
  pagination: {
    page: number;
    size: number;
    total: number;
    pageCount: number;
  };
}

const initialState: TutorState = {
  tutores: [],
  selectedTutor: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    size: 10,
    total: 0,
    pageCount: 0,
  },
};

class TutoresFacade {
  private stateSubject = new BehaviorSubject<TutorState>(initialState);
  public state$ = this.stateSubject.asObservable();

  public tutores$ = this.state$.pipe(
    (state$) =>
      new Observable((observer) => {
        state$.subscribe((state) => observer.next(state.tutores));
      })
  );
  public selectedTutor$ = this.state$.pipe(
    (state$) =>
      new Observable((observer) => {
        state$.subscribe((state) => observer.next(state.selectedTutor));
      })
  );
  public loading$ = this.state$.pipe(
    (state$) =>
      new Observable((observer) => {
        state$.subscribe((state) => observer.next(state.loading));
      })
  );
  public error$ = this.state$.pipe(
    (state$) =>
      new Observable((observer) => {
        state$.subscribe((state) => observer.next(state.error));
      })
  );
  public pagination$ = this.state$.pipe(
    (state$) =>
      new Observable((observer) => {
        state$.subscribe((state) => observer.next(state.pagination));
      })
  );

  /**
   * Carrega lista de tutores com paginação
   */
  async loadTutores(page: number = 1, size: number = 10): Promise<void> {
    this.updateState({ loading: true, error: null });

    try {
      const response = await tutorService.getTutores(page, size);
      this.updateState({
        tutores: response.content,
        pagination: {
          page: response.page,
          size: response.size,
          total: response.total,
          pageCount: response.pageCount,
        },
      });
    } catch (error) {
      this.updateState({ error: error as ApiError });
    } finally {
      this.updateState({ loading: false });
    }
  }

  /**
   * Carrega detalhes de um tutor específico com seus pets
   */
  async loadTutorById(id: number): Promise<void> {
    this.updateState({ loading: true, error: null });

    try {
      const tutor = await tutorService.getTutorById(id);
      this.updateState({ selectedTutor: tutor });
    } catch (error) {
      this.updateState({ error: error as ApiError });
    } finally {
      this.updateState({ loading: false });
    }
  }

  /**
   * Cria novo tutor
   */
  async createTutor(data: ProprietarioRequestDto): Promise<ProprietarioResponseDto | null> {
    this.updateState({ loading: true, error: null });

    try {
      const newTutor = await tutorService.createTutor(data);
      // Recarrega lista de tutores
      await this.loadTutores();
      return newTutor;
    } catch (error) {
      this.updateState({ error: error as ApiError });
      return null;
    } finally {
      this.updateState({ loading: false });
    }
  }

  /**
   * Atualiza tutor existente
   */
  async updateTutor(id: number, data: ProprietarioRequestDto): Promise<ProprietarioResponseDto | null> {
    this.updateState({ loading: true, error: null });

    try {
      const updatedTutor = await tutorService.updateTutor(id, data);
      // Recarrega lista de tutores
      await this.loadTutores();
      return updatedTutor;
    } catch (error) {
      this.updateState({ error: error as ApiError });
      return null;
    } finally {
      this.updateState({ loading: false });
    }
  }

  /**
   * Deleta tutor
   */
  async deleteTutor(id: number): Promise<boolean> {
    this.updateState({ loading: true, error: null });

    try {
      await tutorService.deleteTutor(id);
      // Recarrega lista de tutores
      await this.loadTutores();
      return true;
    } catch (error) {
      this.updateState({ error: error as ApiError });
      return false;
    } finally {
      this.updateState({ loading: false });
    }
  }

  /**
   * Upload de foto do tutor
   */
  async uploadTutorPhoto(tutorId: number, file: File): Promise<AnexoResponseDto | null> {
    this.updateState({ loading: true, error: null });

    try {
      const photo = await tutorService.uploadTutorPhoto(tutorId, file);
      // Recarrega detalhes do tutor se estiver selecionado
      if (this.stateSubject.getValue().selectedTutor?.id === tutorId) {
        await this.loadTutorById(tutorId);
      }
      return photo;
    } catch (error) {
      this.updateState({ error: error as ApiError });
      return null;
    } finally {
      this.updateState({ loading: false });
    }
  }

  /**
   * Deleta foto do tutor
   */
  async deleteTutorPhoto(tutorId: number, fotoId: number): Promise<boolean> {
    this.updateState({ loading: true, error: null });

    try {
      await tutorService.deleteTutorPhoto(tutorId, fotoId);
      // Recarrega detalhes do tutor
      await this.loadTutorById(tutorId);
      return true;
    } catch (error) {
      this.updateState({ error: error as ApiError });
      return false;
    } finally {
      this.updateState({ loading: false });
    }
  }

  /**
   * Vincula pet ao tutor
   */
  async linkPetToTutor(tutorId: number, petId: number): Promise<boolean> {
    this.updateState({ loading: true, error: null });

    try {
      await tutorService.linkPetToTutor(tutorId, petId);
      // Recarrega detalhes do tutor
      await this.loadTutorById(tutorId);
      return true;
    } catch (error) {
      this.updateState({ error: error as ApiError });
      return false;
    } finally {
      this.updateState({ loading: false });
    }
  }

  /**
   * Remove pet do tutor
   */
  async unlinkPetFromTutor(tutorId: number, petId: number): Promise<boolean> {
    this.updateState({ loading: true, error: null });

    try {
      await tutorService.unlinkPetFromTutor(tutorId, petId);
      // Recarrega detalhes do tutor
      await this.loadTutorById(tutorId);
      return true;
    } catch (error) {
      this.updateState({ error: error as ApiError });
      return false;
    } finally {
      this.updateState({ loading: false });
    }
  }

  /**
   * Limpa estado
   */
  reset(): void {
    this.stateSubject.next(initialState);
  }

  /**
   * Limpa apenas o erro
   */
  clearError(): void {
    this.updateState({ error: null });
  }

  /**
   * Retorna estado atual (snapshot)
   */
  getState(): TutorState {
    return this.stateSubject.getValue();
  }

  /**
   * Atualiza estado (merge parcial)
   */
  private updateState(partial: Partial<TutorState>): void {
    const current = this.stateSubject.getValue();
    this.stateSubject.next({ ...current, ...partial });
  }
}

export const tutoresFacade = new TutoresFacade();
