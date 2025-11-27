import TicketList from '@/components/TicketList'
import { Ticket, TicketStatus } from '@/types/ticket'

const mockTickets: Ticket[] = [
  {
    id: '1',
    title: 'Fuite d\'eau dans le hall',
    description: 'Une fuite d\'eau a été détectée dans le hall d\'entrée au niveau du plafond',
    status: TicketStatus.NEW,
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15'),
  },
  {
    id: '2',
    title: 'Panne ascenseur',
    description: 'L\'ascenseur principal est en panne depuis ce matin',
    status: TicketStatus.IN_PROGRESS,
    createdAt: new Date('2025-01-14'),
    updatedAt: new Date('2025-01-16'),
  },
  {
    id: '3',
    title: 'Ampoule grillée parking',
    description: 'L\'éclairage au niveau -1 du parking est défectueux',
    status: TicketStatus.RESOLVED,
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-12'),
  },
  {
    id: '4',
    title: 'Porte d\'entrée défectueuse',
    description: 'La porte d\'entrée principale ne se fermait plus correctement. Réparation effectuée et vérifiée',
    status: TicketStatus.CLOSED,
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-08'),
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-600 mb-2">
            CoTiTra
          </h1>
          <p className="text-xl text-gray-600">
            Copro Tickets Tracker
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Gestion de tickets pour copropriété
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Tickets
          </h2>
          <TicketList tickets={mockTickets} />
        </div>
      </div>
    </main>
  );
}
