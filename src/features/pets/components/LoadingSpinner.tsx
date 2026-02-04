/**
 * Loading Spinner Component
 * Exibido durante carregamento de dados
 */

export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin">
        <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
      <span className="ml-4 text-gray-600">Carregando pets...</span>
    </div>
  );
}
