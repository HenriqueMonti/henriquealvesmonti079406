import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TutoresList } from './components/TutoresList';

export const TutoresPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectTutor = (tutorId: number) => {
    navigate(`/tutores/${tutorId}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Tutores</h1>
              <p className="text-gray-600">
                Gerencie todos os tutores cadastrados no sistema
              </p>
            </div>
            <button
              onClick={() => navigate('/tutores/new')}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded transition-colors"
            >
              ➕ Novo Tutor
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Buscar por nome do tutor..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Tutores List com paginação */}
        <TutoresList onSelectTutor={handleSelectTutor} searchQuery={searchQuery} />
      </div>
    </div>
  );
};
