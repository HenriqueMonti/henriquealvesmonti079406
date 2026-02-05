/**
 * PetForm Component
 * Formulário reutilizável para criar/editar pets
 */

import { useState } from 'react';
import type { PetRequestDto, PetResponseDto } from '@/shared/types/dtos';

interface PetFormProps {
  pet?: PetResponseDto;
  onSubmit: (data: PetRequestDto, file?: File) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  onError?: (error: string) => void;
}

export function PetForm({
  pet,
  onSubmit,
  isLoading = false,
  error,
  onError,
}: PetFormProps) {
  const [formData, setFormData] = useState<PetRequestDto>({
    nome: pet?.nome || '',
    raca: pet?.raca || '',
    idade: pet?.idade || 1,
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    pet?.foto?.url || null
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      errors.nome = 'Nome é obrigatório';
    } else if (formData.nome.length > 100) {
      errors.nome = 'Nome deve ter no máximo 100 caracteres';
    }

    if (!formData.raca.trim()) {
      errors.raca = 'Raça é obrigatória';
    } else if (formData.raca.length > 100) {
      errors.raca = 'Raça deve ter no máximo 100 caracteres';
    }

    if (formData.idade < 0) {
      errors.idade = 'Idade não pode ser negativa';
    } else if (formData.idade > 100) {
      errors.idade = 'Idade deve ser menor que 100';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field: keyof PetRequestDto, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpar erro do campo
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      onError?.('Por favor, selecione um arquivo de imagem válido');
      return;
    }

    // Validar tamanho (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      onError?.('A imagem não pode exceder 5MB');
      return;
    }

    setPhotoFile(file);

    // Preview da imagem
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];

    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      onError?.('Por favor, solte um arquivo de imagem válido');
      return;
    }

    // Validar tamanho (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      onError?.('A imagem não pode exceder 5MB');
      return;
    }

    setPhotoFile(file);

    // Preview da imagem
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData, photoFile || undefined);
    } catch (err) {
      console.error('Erro ao submeter formulário:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormDisabled = isLoading || isSubmitting;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      {/* Alerta de erro global */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Seção de Foto */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Foto do Pet</h2>

        <div className="space-y-4">
          {/* Preview */}
          {photoPreview && (
            <div className="relative">
              <img
                src={photoPreview}
                alt="Preview do pet"
                className="w-full max-w-sm h-64 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  setPhotoFile(null);
                  setPhotoPreview(pet?.foto?.url || null);
                }}
                className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Remover Foto
              </button>
            </div>
          )}

          {/* Input de upload */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              disabled={isFormDisabled}
              className="hidden"
              id="photo-input"
            />
            <label
              htmlFor="photo-input"
              className="cursor-pointer block"
            >
              <div className="text-4xl mb-2">📷</div>
              <p className="text-gray-700 font-medium">Clique para selecionar uma foto</p>
              <p className="text-gray-500 text-sm">ou arraste uma imagem aqui</p>
              <p className="text-gray-400 text-xs mt-2">Máximo 5MB, PNG ou JPG</p>
            </label>
          </div>
        </div>
      </div>

      {/* Seção de Informações */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Informações do Pet
        </h2>

        {/* Campo Nome */}
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
            Nome *
          </label>
          <input
            id="nome"
            type="text"
            value={formData.nome}
            onChange={(e) => handleChange('nome', e.target.value)}
            disabled={isFormDisabled}
            maxLength={100}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Ex: Rex"
          />
          {fieldErrors.nome && (
            <p className="text-red-600 text-sm mt-1">{fieldErrors.nome}</p>
          )}
        </div>

        {/* Campo Raça */}
        <div>
          <label htmlFor="raca" className="block text-sm font-medium text-gray-700 mb-1">
            Raça *
          </label>
          <input
            id="raca"
            type="text"
            value={formData.raca}
            onChange={(e) => handleChange('raca', e.target.value)}
            disabled={isFormDisabled}
            maxLength={100}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Ex: Labrador Retriever"
          />
          {fieldErrors.raca && (
            <p className="text-red-600 text-sm mt-1">{fieldErrors.raca}</p>
          )}
        </div>

        {/* Campo Idade */}
        <div>
          <label htmlFor="idade" className="block text-sm font-medium text-gray-700 mb-1">
            Idade (em anos) *
          </label>
          <input
            id="idade"
            type="number"
            value={formData.idade}
            onChange={(e) => handleChange('idade', parseInt(e.target.value, 10))}
            disabled={isFormDisabled}
            min="0"
            max="100"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Ex: 3"
          />
          {fieldErrors.idade && (
            <p className="text-red-600 text-sm mt-1">{fieldErrors.idade}</p>
          )}
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isFormDisabled}
          className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded transition-colors disabled:cursor-not-allowed"
        >
          {isSubmitting ? '⏳ Salvando...' : pet ? '💾 Atualizar Pet' : '➕ Criar Pet'}
        </button>
        <button
          type="reset"
          disabled={isFormDisabled}
          className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-300 text-gray-900 font-semibold py-3 px-4 rounded transition-colors disabled:cursor-not-allowed"
          onClick={() => {
            setFormData({
              nome: pet?.nome || '',
              raca: pet?.raca || '',
              idade: pet?.idade || 1,
            });
            setPhotoFile(null);
            setPhotoPreview(pet?.foto?.url || null);
            setFieldErrors({});
          }}
        >
          🔄 Limpar
        </button>
      </div>

      <p className="text-gray-500 text-sm">* Campos obrigatórios</p>
    </form>
  );
}
