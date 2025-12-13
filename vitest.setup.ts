import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Configuration du serveur MSW pour les tests
export const server = setupServer(
  // Handler par défaut pour les commentaires
  http.get('/api/tickets/:id/comments', () => {
    return HttpResponse.json([]);
  })
);

// Démarrer le serveur avant tous les tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Réinitialiser les handlers après chaque test
afterEach(() => server.resetHandlers());

// Fermer le serveur après tous les tests
afterAll(() => server.close());
