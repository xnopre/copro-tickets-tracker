import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TicketList from './TicketList'
import { Ticket, TicketStatus } from '@/types/ticket'

describe('TicketList', () => {
  const mockTickets: Ticket[] = [
    {
      id: '1',
      title: 'First Ticket',
      description: 'First description',
      status: TicketStatus.NEW,
      createdAt: new Date('2025-01-15'),
      updatedAt: new Date('2025-01-15'),
    },
    {
      id: '2',
      title: 'Second Ticket',
      description: 'Second description',
      status: TicketStatus.IN_PROGRESS,
      createdAt: new Date('2025-01-16'),
      updatedAt: new Date('2025-01-16'),
    },
    {
      id: '3',
      title: 'Third Ticket',
      description: 'Third description',
      status: TicketStatus.RESOLVED,
      createdAt: new Date('2025-01-17'),
      updatedAt: new Date('2025-01-17'),
    },
  ]

  it('should render all tickets', () => {
    render(<TicketList tickets={mockTickets} />)
    expect(screen.getByText('First Ticket')).toBeInTheDocument()
    expect(screen.getByText('Second Ticket')).toBeInTheDocument()
    expect(screen.getByText('Third Ticket')).toBeInTheDocument()
  })

  it('should render empty state when no tickets', () => {
    render(<TicketList tickets={[]} />)
    expect(screen.getByText('Aucun ticket à afficher')).toBeInTheDocument()
  })

  it('should render correct number of tickets', () => {
    const { container } = render(<TicketList tickets={mockTickets} />)
    const ticketCards = container.querySelectorAll('.bg-white.rounded-lg')
    expect(ticketCards).toHaveLength(3)
  })

  it('should not render empty state when tickets exist', () => {
    render(<TicketList tickets={mockTickets} />)
    expect(screen.queryByText('Aucun ticket à afficher')).not.toBeInTheDocument()
  })
})
