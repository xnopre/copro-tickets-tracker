import Link from 'next/link';

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
          className="inline-block rounded-md bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          aria-label="Retour à la liste des tickets"
        >
          Retour à la liste
        </Link>
      </div>
    </main>
  );
}
