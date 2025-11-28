import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { TicketModel } from './Ticket'
import { TicketStatus } from '@/types/ticket'
import { setupTestDB, teardownTestDB, clearDatabase } from '@/tests/helpers/db-setup'

describe('Ticket Model', () => {
  let mongoServer: MongoMemoryServer

  beforeAll(async () => {
    mongoServer = await setupTestDB()
  })

  afterAll(async () => {
    await teardownTestDB(mongoServer)
  })

  beforeEach(async () => {
    await clearDatabase()
  })

  describe('Schema Validation', () => {
    it('should create a valid ticket with all required fields', async () => {
      const ticketData = {
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.NEW,
      }

      const ticket = new TicketModel(ticketData)
      const savedTicket = await ticket.save()

      expect(savedTicket._id).toBeDefined()
      expect(savedTicket.title).toBe(ticketData.title)
      expect(savedTicket.description).toBe(ticketData.description)
      expect(savedTicket.status).toBe(ticketData.status)
      expect(savedTicket.createdAt).toBeInstanceOf(Date)
      expect(savedTicket.updatedAt).toBeInstanceOf(Date)
    })

    it('should fail validation if title is missing', async () => {
      const ticketData = {
        description: 'Test Description',
      }

      const ticket = new TicketModel(ticketData)

      await expect(ticket.save()).rejects.toThrow()
    })

    it('should fail validation if description is missing', async () => {
      const ticketData = {
        title: 'Test Ticket',
      }

      const ticket = new TicketModel(ticketData)

      await expect(ticket.save()).rejects.toThrow()
    })

    it('should automatically trim the title', async () => {
      const ticketData = {
        title: '  Test Ticket  ',
        description: 'Test Description',
      }

      const ticket = new TicketModel(ticketData)
      const savedTicket = await ticket.save()

      expect(savedTicket.title).toBe('Test Ticket')
    })
  })

  describe('Status Field', () => {
    it('should accept valid status values', async () => {
      const validStatuses = [
        TicketStatus.NEW,
        TicketStatus.IN_PROGRESS,
        TicketStatus.RESOLVED,
        TicketStatus.CLOSED,
      ]

      for (const status of validStatuses) {
        const ticketData = {
          title: 'Test Ticket',
          description: 'Test Description',
          status,
        }

        const ticket = new TicketModel(ticketData)
        const savedTicket = await ticket.save()

        expect(savedTicket.status).toBe(status)
      }
    })

    it('should reject invalid status values', async () => {
      const ticketData = {
        title: 'Test Ticket',
        description: 'Test Description',
        status: 'INVALID_STATUS',
      }

      const ticket = new TicketModel(ticketData)

      await expect(ticket.save()).rejects.toThrow()
    })

    it('should have NEW as default status', async () => {
      const ticketData = {
        title: 'Test Ticket',
        description: 'Test Description',
      }

      const ticket = new TicketModel(ticketData)
      const savedTicket = await ticket.save()

      expect(savedTicket.status).toBe(TicketStatus.NEW)
    })
  })

  describe('Timestamps', () => {
    it('should automatically generate createdAt and updatedAt', async () => {
      const ticketData = {
        title: 'Test Ticket',
        description: 'Test Description',
      }

      const ticket = new TicketModel(ticketData)
      const savedTicket = await ticket.save()

      expect(savedTicket.createdAt).toBeInstanceOf(Date)
      expect(savedTicket.updatedAt).toBeInstanceOf(Date)
    })

    it('should update updatedAt when ticket is modified', async () => {
      const ticketData = {
        title: 'Test Ticket',
        description: 'Test Description',
      }

      const ticket = new TicketModel(ticketData)
      const savedTicket = await ticket.save()
      const originalUpdatedAt = savedTicket.updatedAt

      await new Promise(resolve => setTimeout(resolve, 10))

      savedTicket.title = 'Updated Title'
      const updatedTicket = await savedTicket.save()

      expect(updatedTicket.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime())
    })
  })

  describe('Model Caching', () => {
    it('should reuse cached model', () => {
      expect(mongoose.models.Ticket).toBeDefined()
      expect(TicketModel).toBe(mongoose.models.Ticket)
    })
  })
})
