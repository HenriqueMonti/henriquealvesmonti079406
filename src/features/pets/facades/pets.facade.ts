/**
 * Pets Facade (State Management)
 * Gerencia estado e lógica de negócio para pets
 * Usa BehaviorSubject para reatividade
 */

import { BehaviorSubject, Observable } from 'rxjs';
import type {
  PetResponseDto,
  PetResponseCompletoDto,
  PetRequestDto,
  AnexoResponseDto,
} from '@/shared/types/dtos';
import { petService } from '@/features/pets/services/pet.service';
import type { ApiError } from '@/core/http';

interface PetState {
  pets: PetResponseDto[];
  selectedPet: PetResponseCompletoDto | null;
  loading: boolean;
  error: ApiError | null;
  pagination: {
    page: number;
    size: number;
    total: number;
    pageCount: number;
  };
}

const initialState: PetState = {
  pets: [],
  selectedPet: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    size: 10,
    total: 0,
    pageCount: 0,
  },
};

class PetsFacade {
  private stateSubject = new BehaviorSubject<PetState>(initialState);
  public state$ = this.stateSubject.asObservable();

  public pets$ = this.state$.pipe(
    (state$) =>
      new Observable((observer) => {
        state$.subscribe((state) => observer.next(state.pets));
      })
  );
  public selectedPet$ = this.state$.pipe(
    (state$) =>
      new Observable((observer) => {
        state$.subscribe((state) => observer.next(state.selectedPet));
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
   * Carrega lista de pets com paginação
   */
  async loadPets(page: number = 1, size: number = 10): Promise<void> {
    this.updateState({ loading: true, error: null });

    try {
      const response = await petService.getPets(page, size);
      this.updateState({
        pets: response.content,
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
   * Carrega detalhes de um pet específico
   */
  async loadPetById(id: number): Promise<void> {
    this.updateState({ loading: true, error: null });

    try {
      const pet = await petService.getPetById(id);
      this.updateState({ selectedPet: pet });
    } catch (error) {
      this.updateState({ error: error as ApiError });
    } finally {
      this.updateState({ loading: false });
    }
  }

  /**
   * Cria novo pet
   */
  async createPet(data: PetRequestDto): Promise<PetResponseDto | null> {
    this.updateState({ loading: true, error: null });

    try {
      const newPet = await petService.createPet(data);
      // Recarrega lista de pets
      await this.loadPets();
      return newPet;
    } catch (error) {
      this.updateState({ error: error as ApiError });
      return null;
    } finally {
      this.updateState({ loading: false });
    }
  }

  /**
   * Atualiza pet existente
   */
  async updatePet(id: number, data: PetRequestDto): Promise<PetResponseDto | null> {
    this.updateState({ loading: true, error: null });

    try {
      const updatedPet = await petService.updatePet(id, data);
      // Recarrega lista de pets
      await this.loadPets();
      return updatedPet;
    } catch (error) {
      this.updateState({ error: error as ApiError });
      return null;
    } finally {
      this.updateState({ loading: false });
    }
  }

  /**
   * Deleta pet
   */
  async deletePet(id: number): Promise<boolean> {
    this.updateState({ loading: true, error: null });

    try {
      await petService.deletePet(id);
      // Recarrega lista de pets
      await this.loadPets();
      return true;
    } catch (error) {
      this.updateState({ error: error as ApiError });
      return false;
    } finally {
      this.updateState({ loading: false });
    }
  }

  /**
   * Upload de foto do pet
   */
  async uploadPetPhoto(petId: number, file: File): Promise<AnexoResponseDto | null> {
    this.updateState({ loading: true, error: null });

    try {
      const photo = await petService.uploadPetPhoto(petId, file);
      // Recarrega detalhes do pet se estiver selecionado
      if (this.stateSubject.getValue().selectedPet?.id === petId) {
        await this.loadPetById(petId);
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
   * Deleta foto do pet
   */
  async deletePetPhoto(petId: number, fotoId: number): Promise<boolean> {
    this.updateState({ loading: true, error: null });

    try {
      await petService.deletePetPhoto(petId, fotoId);
      // Recarrega detalhes do pet
      await this.loadPetById(petId);
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
  getState(): PetState {
    return this.stateSubject.getValue();
  }

  /**
   * Atualiza estado (merge parcial)
   */
  private updateState(partial: Partial<PetState>): void {
    const current = this.stateSubject.getValue();
    this.stateSubject.next({ ...current, ...partial });
  }
}

export const petsFacade = new PetsFacade();
