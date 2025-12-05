import Link from 'next/link';

export default function NotFound() {
  return (
    <main
      className="min-h-screen bg-gray-50 flex items-center justify-center p-8"
      role="alert"
      aria-labelledby="not-found-heading"
    >
      <div className="text-center">
        <p className="text-6xl font-bold text-gray-800 mb-4" aria-hidden="true">
          404
        </p>
        <h1 id="not-found-heading" className="text-2xl font-semibold text-gray-700 mb-4">
          Ticket non trouvé
        </h1>
        <p className="text-gray-600 mb-8">
          Le ticket que vous recherchez n'existe pas ou a été supprimé.
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Retour à la liste des tickets"
        >
          Retour à la liste
        </Link>
      </div>
    </main>
  );
}
