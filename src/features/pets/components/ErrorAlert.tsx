/**
 * ErrorAlert Component
 * Exibe mensagens de erro
 */

interface ErrorAlertProps {
  error: string | null;
  onDismiss: () => void;
}

export function ErrorAlert({ error, onDismiss }: ErrorAlertProps) {
  if (!error) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start justify-between">
      <div>
        <h3 className="font-semibold text-red-800">Erro ao carregar pets</h3>
        <p className="text-red-700 text-sm mt-1">{error}</p>
      </div>
      <button
        onClick={onDismiss}
        className="text-red-500 hover:text-red-700 font-semibold"
      >
        ✕
      </button>
    </div>
  );
}
