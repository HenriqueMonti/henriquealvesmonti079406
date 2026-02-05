/**
 * TutorForm Component
 * Formulário reutilizável para criar/editar tutores
 */

import { useState } from 'react';
import type { ProprietarioRequestDto, ProprietarioResponseDto } from '@/shared/types/dtos';

interface TutorFormProps {
  tutor?: ProprietarioResponseDto;
  onSubmit: (data: ProprietarioRequestDto, file?: File) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  onError?: (error: string) => void;
}

export function TutorForm({
  tutor,
  onSubmit,
  isLoading = false,
  error,
  onError,
}: TutorFormProps) {
  const [formData, setFormData] = useState<ProprietarioRequestDto>({
    nome: tutor?.nome || '',
    email: tutor?.email || '',
    telefone: tutor?.telefone || '',
    endereco: tutor?.endereco || '',
    cpf: tutor?.cpf || 0,
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    tutor?.foto?.url || null
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

    if (!formData.email.trim()) {
      errors.email = 'Email é obrigatório';
    } else if (formData.email.length > 150) {
      errors.email = 'Email deve ter no máximo 150 caracteres';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email inválido';
    }

    if (!formData.telefone.trim()) {
      errors.telefone = 'Telefone é obrigatório';
    } else if (formData.telefone.length > 20) {
      errors.telefone = 'Telefone deve ter no máximo 20 caracteres';
    }

    if (!formData.endereco.trim()) {
      errors.endereco = 'Endereço é obrigatório';
    } else if (formData.endereco.length > 200) {
      errors.endereco = 'Endereço deve ter no máximo 200 caracteres';
    }

    if (!formData.cpf) {
      errors.cpf = 'CPF é obrigatório';
    } else if (formData.cpf < 0) {
      errors.cpf = 'CPF inválido';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field: keyof ProprietarioRequestDto, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === 'cpf' ? Number(value) : value,
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
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Foto do Tutor</h2>

        <div className="space-y-4">
          {/* Preview */}
          {photoPreview && (
            <div className="relative">
              <img
                src={photoPreview}
                alt="Preview do tutor"
                className="w-full max-w-sm h-64 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  setPhotoFile(null);
                  setPhotoPreview(tutor?.foto?.url || null);
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
          Informações do Tutor
        </h2>

        {/* Campo Nome */}
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
            Nome Completo *
          </label>
          <input
            id="nome"
            type="text"
            value={formData.nome}
            onChange={(e) => handleChange('nome', e.target.value)}
            disabled={isFormDisabled}
            maxLength={100}
            placeholder="Ex: João Silva"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 ${
              fieldErrors.nome ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {fieldErrors.nome && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.nome}</p>
          )}
        </div>

        {/* Campo Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            disabled={isFormDisabled}
            maxLength={150}
            placeholder="Ex: joao@example.com"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 ${
              fieldErrors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {fieldErrors.email && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
          )}
        </div>

        {/* Campo Telefone */}
        <div>
          <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
            Telefone *
          </label>
          <input
            id="telefone"
            type="tel"
            value={formData.telefone}
            onChange={(e) => handleChange('telefone', e.target.value)}
            disabled={isFormDisabled}
            maxLength={20}
            placeholder="Ex: (11) 98765-4321"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 ${
              fieldErrors.telefone ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {fieldErrors.telefone && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.telefone}</p>
          )}
        </div>

        {/* Campo Endereço */}
        <div>
          <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-1">
            Endereço *
          </label>
          <textarea
            id="endereco"
            value={formData.endereco}
            onChange={(e) => handleChange('endereco', e.target.value)}
            disabled={isFormDisabled}
            maxLength={200}
            placeholder="Ex: Rua A, 123 - São Paulo, SP"
            rows={3}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 resize-none ${
              fieldErrors.endereco ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {fieldErrors.endereco && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.endereco}</p>
          )}
        </div>

        {/* Campo CPF */}
        <div>
          <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
            CPF *
          </label>
          <input
            id="cpf"
            type="number"
            value={formData.cpf || ''}
            onChange={(e) => handleChange('cpf', e.target.value)}
            disabled={isFormDisabled}
            placeholder="Ex: 12345678901"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 ${
              fieldErrors.cpf ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {fieldErrors.cpf && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.cpf}</p>
          )}
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isFormDisabled}
          className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded transition-colors"
        >
          {isFormDisabled ? '⏳ Salvando...' : '💾 Salvar Tutor'}
        </button>
        <button
          type="reset"
          disabled={isFormDisabled}
          className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded transition-colors"
        >
          🔄 Limpar
        </button>
      </div>
    </form>
  );
}
