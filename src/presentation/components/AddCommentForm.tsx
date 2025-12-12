'use client';

import { useState } from 'react';

interface AddCommentFormProps {
  ticketId: string;
  onCommentAdded: () => void;
}

export default function AddCommentForm({ ticketId, onCommentAdded }: AddCommentFormProps) {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!content.trim()) {
      setError('Le contenu du commentaire est requis');
      return;
    }

    if (!author.trim()) {
      setError("L'auteur du commentaire est requis");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/tickets/${ticketId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, author }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'ajout du commentaire");
      }

      setSuccess(true);
      setContent('');
      setAuthor('');

      setTimeout(() => {
        setSuccess(false);
        onCommentAdded();
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'ajout du commentaire");
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasError = error !== null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajouter un commentaire</h3>
      <form onSubmit={handleSubmit} aria-label="Formulaire d'ajout de commentaire">
        <div className="mb-4">
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
            Votre nom <span aria-label="requis">*</span>
          </label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={hasError && !author.trim()}
            aria-describedby={hasError && !author.trim() ? 'form-error' : undefined}
            autoComplete="name"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Commentaire <span aria-label="requis">*</span>
          </label>
          <textarea
            id="content"
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={hasError && !content.trim()}
            aria-describedby={hasError && !content.trim() ? 'form-error' : undefined}
            autoComplete="off"
          />
        </div>

        {error && (
          <div
            id="form-error"
            className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm"
            role="status"
            aria-live="polite"
          >
            Commentaire ajouté avec succès !
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-busy={isSubmitting}
        >
          {isSubmitting ? 'Ajout en cours...' : 'Ajouter le commentaire'}
        </button>
      </form>
    </div>
  );
}
