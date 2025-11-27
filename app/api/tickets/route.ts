import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { TicketModel } from '@/lib/models/Ticket'
import { Ticket, TicketStatus } from '@/types/ticket'

export async function GET() {
  try {
    await connectDB()

    const tickets = await TicketModel.find({}).sort({ createdAt: -1 }).lean()

    const formattedTickets: Ticket[] = tickets.map((ticket) => ({
      id: ticket._id.toString(),
      title: ticket.title,
      description: ticket.description,
      status: ticket.status as TicketStatus,
      createdAt: new Date(ticket.createdAt),
      updatedAt: new Date(ticket.updatedAt),
    }))

    return NextResponse.json(formattedTickets)
  } catch (error) {
    console.error('Error fetching tickets:', error)
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 })
  }
}
