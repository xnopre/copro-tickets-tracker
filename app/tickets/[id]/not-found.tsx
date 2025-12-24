import Link from '@/presentation/components/ui/Link';

export default function NotFound() {
  return (
    <main
      className="flex min-h-screen items-center justify-center bg-gray-50 p-8"
      role="alert"
      aria-labelledby="not-found-heading"
    >
      <div className="text-center">
        <p className="mb-4 text-6xl font-bold text-gray-800" aria-hidden="true">
          404
        </p>
        <h1 id="not-found-heading" className="mb-4 text-2xl font-semibold text-gray-700">
          Ticket non trouvé
        </h1>
        <p className="mb-8 text-gray-600">
          Le ticket que vous recherchez n'existe pas ou a été supprimé.
        </p>
        <Link
          href="/"
          variant="button"
          size="lg"
          className="inline-block"
          aria-label="Retour à la liste des tickets"
        >
          Retour à la liste
        </Link>
      </div>
    </main>
  );
}
