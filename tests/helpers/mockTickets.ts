import { Ticket } from '@/domain/entities/Ticket';
import { TicketStatus } from '@/domain/value-objects/TicketStatus';
import { mockUserPublic1, mockUserPublic2, mockUserPublic3 } from './mockUsers';

/**
 * Mock tickets for testing purposes
 */

// Basic tickets with different statuses
export const mockTicketNew: Ticket = {
  id: '1',
  title: 'Test Ticket New',
  description: 'Test Description',
  status: TicketStatus.NEW,
  createdBy: mockUserPublic1,
  assignedTo: null,
  archived: false,
  createdAt: new Date('2025-01-15T10:00:00.000Z'),
  updatedAt: new Date('2025-01-15T10:00:00.000Z'),
};

export const mockTicketInProgress: Ticket = {
  id: '2',
  title: 'Test Ticket In Progress',
  description: 'Test Description',
  status: TicketStatus.IN_PROGRESS,
  createdBy: mockUserPublic2,
  assignedTo: mockUserPublic1,
  archived: false,
  createdAt: new Date('2025-01-14T10:00:00.000Z'),
  updatedAt: new Date('2025-01-15T11:00:00.000Z'),
};

export const mockTicketResolved: Ticket = {
  id: '3',
  title: 'Test Ticket Resolved',
  description: 'Test Description',
  status: TicketStatus.RESOLVED,
  createdBy: mockUserPublic3,
  assignedTo: mockUserPublic2,
  archived: false,
  createdAt: new Date('2025-01-13T10:00:00.000Z'),
  updatedAt: new Date('2025-01-15T14:00:00.000Z'),
};

export const mockTicketClosed: Ticket = {
  id: '4',
  title: 'Test Ticket Closed',
  description: 'Test Description',
  status: TicketStatus.CLOSED,
  createdBy: mockUserPublic1,
  assignedTo: mockUserPublic3,
  archived: false,
  createdAt: new Date('2025-01-12T10:00:00.000Z'),
  updatedAt: new Date('2025-01-15T15:00:00.000Z'),
};

// Archived tickets
export const mockTicketArchivedNew: Ticket = {
  id: '5',
  title: 'Archived Ticket New',
  description: 'Archived Description',
  status: TicketStatus.CLOSED,
  createdBy: mockUserPublic2,
  assignedTo: null,
  archived: true,
  createdAt: new Date('2025-01-10T10:00:00.000Z'),
  updatedAt: new Date('2025-01-14T10:00:00.000Z'),
};

export const mockTicketArchivedClosed: Ticket = {
  id: '6',
  title: 'Archived Ticket Closed',
  description: 'Archived Description',
  status: TicketStatus.CLOSED,
  createdBy: mockUserPublic3,
  assignedTo: mockUserPublic1,
  archived: true,
  createdAt: new Date('2025-01-08T10:00:00.000Z'),
  updatedAt: new Date('2025-01-13T10:00:00.000Z'),
};

// Component-specific tickets
export const mockFirstTicket: Ticket = {
  id: '1',
  title: 'First Ticket',
  description: 'First description',
  status: TicketStatus.NEW,
  createdBy: mockUserPublic1,
  assignedTo: null,
  archived: false,
  createdAt: new Date('2025-01-15'),
  updatedAt: new Date('2025-01-15'),
};

export const mockSecondTicket: Ticket = {
  id: '2',
  title: 'Second Ticket',
  description: 'Second description',
  status: TicketStatus.IN_PROGRESS,
  createdBy: mockUserPublic2,
  assignedTo: mockUserPublic1,
  archived: false,
  createdAt: new Date('2025-01-16'),
  updatedAt: new Date('2025-01-16'),
};

export const mockThirdTicket: Ticket = {
  id: '3',
  title: 'Third Ticket',
  description: 'Third description',
  status: TicketStatus.RESOLVED,
  createdBy: mockUserPublic3,
  assignedTo: mockUserPublic2,
  archived: false,
  createdAt: new Date('2025-01-17'),
  updatedAt: new Date('2025-01-17'),
};

export const mockActiveTicket1: Ticket = {
  id: '1',
  title: 'Active Ticket 1',
  description: 'Active description',
  status: TicketStatus.NEW,
  createdBy: mockUserPublic1,
  assignedTo: null,
  archived: false,
  createdAt: new Date('2025-01-15T10:00:00.000Z'),
  updatedAt: new Date('2025-01-15T10:00:00.000Z'),
};

export const mockArchivedTicket1: Ticket = {
  id: '2',
  title: 'Archived Ticket 1',
  description: 'Archived description',
  status: TicketStatus.CLOSED,
  createdBy: mockUserPublic2,
  assignedTo: mockUserPublic1,
  archived: true,
  createdAt: new Date('2025-01-10T10:00:00.000Z'),
  updatedAt: new Date('2025-01-14T10:00:00.000Z'),
};

export const mockActiveTicket2: Ticket = {
  id: '3',
  title: 'Active Ticket 2',
  description: 'Active description 2',
  status: TicketStatus.IN_PROGRESS,
  createdBy: mockUserPublic3,
  assignedTo: mockUserPublic2,
  archived: false,
  createdAt: new Date('2025-01-16T10:00:00.000Z'),
  updatedAt: new Date('2025-01-16T10:00:00.000Z'),
};

export const mockArchivedTicket2: Ticket = {
  id: '4',
  title: 'Archived Ticket 2',
  description: 'Archived description 2',
  status: TicketStatus.RESOLVED,
  createdBy: mockUserPublic1,
  assignedTo: null,
  archived: true,
  createdAt: new Date('2025-01-12T10:00:00.000Z'),
  updatedAt: new Date('2025-01-13T10:00:00.000Z'),
};

// Ticket arrays for list tests
export const mockTickets: Ticket[] = [mockTicketNew, mockTicketInProgress, mockTicketResolved];

export const mockTicketsList: Ticket[] = [mockFirstTicket, mockSecondTicket, mockThirdTicket];

export const mockTicketsWithArchived: Ticket[] = [
  mockActiveTicket1,
  mockArchivedTicket1,
  mockActiveTicket2,
  mockArchivedTicket2,
];
