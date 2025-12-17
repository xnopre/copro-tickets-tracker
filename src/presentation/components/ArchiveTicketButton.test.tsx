import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import ArchiveTicketButton from './ArchiveTicketButton';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('ArchiveTicketButton', () => {
  const mockPush = vi.fn();
  const mockRefresh = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    } as any);
    global.fetch = vi.fn();
  });

  it('should render archive button', () => {
    render(<ArchiveTicketButton ticketId="123" />);

    const button = screen.getByRole('button', { name: /archiver le ticket/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Archiver');
  });

  it('should show confirmation dialog when archive button is clicked', () => {
    render(<ArchiveTicketButton ticketId="123" />);

    const archiveButton = screen.getByRole('button', { name: /archiver le ticket/i });
    fireEvent.click(archiveButton);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText(/confirmer l'archivage/i)).toBeInTheDocument();
    expect(screen.getByText(/êtes-vous sûr de vouloir archiver ce ticket/i)).toBeInTheDocument();
  });

  it('should close confirmation dialog when cancel is clicked', () => {
    render(<ArchiveTicketButton ticketId="123" />);

    const archiveButton = screen.getByRole('button', { name: /archiver le ticket/i });
    fireEvent.click(archiveButton);

    const cancelButton = screen.getByRole('button', { name: /annuler/i });
    fireEvent.click(cancelButton);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should archive ticket and redirect on confirmation', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        id: '123',
        archived: true,
      }),
    } as Response);

    render(<ArchiveTicketButton ticketId="123" />);

    const archiveButton = screen.getByRole('button', { name: /archiver le ticket/i });
    fireEvent.click(archiveButton);

    const confirmButton = screen.getByRole('button', { name: /confirmer/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/tickets/123/archive', {
        method: 'PATCH',
      });
      expect(mockPush).toHaveBeenCalledWith('/');
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it('should display loading state while archiving', async () => {
    vi.mocked(global.fetch).mockImplementation(
      () =>
        new Promise(resolve =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => ({ id: '123', archived: true }),
              } as Response),
            100
          )
        )
    );

    render(<ArchiveTicketButton ticketId="123" />);

    const archiveButton = screen.getByRole('button', { name: /archiver le ticket/i });
    fireEvent.click(archiveButton);

    const confirmButton = screen.getByRole('button', { name: /confirmer/i });
    fireEvent.click(confirmButton);

    expect(screen.getByText(/archivage en cours/i)).toBeInTheDocument();
    expect(confirmButton).toHaveAttribute('aria-busy', 'true');
    expect(confirmButton).toBeDisabled();

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('should display error message when archive fails', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Ticket non trouvé' }),
    } as Response);

    render(<ArchiveTicketButton ticketId="123" />);

    const archiveButton = screen.getByRole('button', { name: /archiver le ticket/i });
    fireEvent.click(archiveButton);

    const confirmButton = screen.getByRole('button', { name: /confirmer/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent('Ticket non trouvé');
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should have proper accessibility attributes', () => {
    render(<ArchiveTicketButton ticketId="123" />);

    const archiveButton = screen.getByRole('button', { name: /archiver le ticket/i });
    fireEvent.click(archiveButton);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'archive-confirmation-title');

    const title = screen.getByText(/confirmer l'archivage/i);
    expect(title).toHaveAttribute('id', 'archive-confirmation-title');
  });

  it('should disable buttons during archiving', async () => {
    vi.mocked(global.fetch).mockImplementation(
      () =>
        new Promise(resolve =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => ({ id: '123', archived: true }),
              } as Response),
            100
          )
        )
    );

    render(<ArchiveTicketButton ticketId="123" />);

    const archiveButton = screen.getByRole('button', { name: /archiver le ticket/i });
    fireEvent.click(archiveButton);

    const confirmButton = screen.getByRole('button', { name: /confirmer/i });
    const cancelButton = screen.getByRole('button', { name: /annuler/i });

    fireEvent.click(confirmButton);

    expect(confirmButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });
});
