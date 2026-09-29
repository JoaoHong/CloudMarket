import { errorMessage } from '../api/client';

export default function ErrorBox({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  return (
    <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
      <p>{errorMessage(error)}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-2 font-semibold text-red-900 underline">
          Tentar novamente
        </button>
      )}
    </div>
  );
}
