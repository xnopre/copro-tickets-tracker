import { describe, it, expect, beforeAll, afterAll, beforeEach, vi, afterEach } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { TicketModel } from '@/lib/models/Ticket'
import { TicketStatus } from '@/types/ticket'
import { setupTestDB, teardownTestDB, clearDatabase } from '@/tests/helpers/db-setup'

describe('GET /api/tickets', () => {
  describe('Unit Tests (with mocks)', () => {
    beforeAll(() => {
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test'
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should return empty array if no tickets exist', async () => {
      const { GET } = await import('./route')
      vi.spyOn(TicketModel, 'find').mockReturnValue({
        sort: vi.fn().mockReturnValue({
          lean: vi.fn().mockResolvedValue([]),
        }),
      } as any)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual([])
    })

    it('should return formatted tickets correctly', async () => {
      const { GET } = await import('./route')

      const mockTickets = [
        {
          _id: { toString: () => '507f1f77bcf86cd799439011' },
          title: 'Test Ticket 1',
          description: 'Description 1',
          status: TicketStatus.NEW,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
        },
        {
          _id: { toString: () => '507f1f77bcf86cd799439012' },
          title: 'Test Ticket 2',
          description: 'Description 2',
          status: TicketStatus.IN_PROGRESS,
          createdAt: new Date('2024-01-03'),
          updatedAt: new Date('2024-01-04'),
        },
      ]

      vi.spyOn(TicketModel, 'find').mockReturnValue({
        sort: vi.fn().mockReturnValue({
          lean: vi.fn().mockResolvedValue(mockTickets),
        }),
      } as any)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveLength(2)
      expect(data[0]).toMatchObject({
        id: '507f1f77bcf86cd799439011',
        title: 'Test Ticket 1',
        description: 'Description 1',
        status: TicketStatus.NEW,
      })
      expect(data[1]).toMatchObject({
        id: '507f1f77bcf86cd799439012',
        title: 'Test Ticket 2',
        description: 'Description 2',
        status: TicketStatus.IN_PROGRESS,
      })
    })

    it('should return 500 error if database query fails', async () => {
      const { GET } = await import('./route')
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      vi.spyOn(TicketModel, 'find').mockReturnValue({
        sort: vi.fn().mockReturnValue({
          lean: vi.fn().mockRejectedValue(new Error('Database error')),
        }),
      } as any)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to fetch tickets' })
      expect(consoleErrorSpy).toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
    })

    it('should sort tickets by createdAt in descending order', async () => {
      const { GET } = await import('./route')
      const sortSpy = vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([]),
      })

      vi.spyOn(TicketModel, 'find').mockReturnValue({
        sort: sortSpy,
      } as any)

      await GET()

      expect(sortSpy).toHaveBeenCalledWith({ createdAt: -1 })
    })
  })

  describe('Integration Tests (with real database)', () => {
    let mongoServer: MongoMemoryServer

    beforeAll(async () => {
      delete global.mongoose
      mongoServer = await setupTestDB()
    })

    afterAll(async () => {
      await teardownTestDB(mongoServer)
    })

    beforeEach(async () => {
      await clearDatabase()
      process.env.MONGODB_URI = mongoServer.getUri()
      delete global.mongoose
      vi.resetModules()
    })

    it('should return tickets from database', async () => {
      const { GET } = await import('./route')

      await TicketModel.create({
        title: 'Integration Test 1',
        description: 'Description 1',
        status: TicketStatus.NEW,
      })

      await new Promise(resolve => setTimeout(resolve, 10))

      await TicketModel.create({
        title: 'Integration Test 2',
        description: 'Description 2',
        status: TicketStatus.IN_PROGRESS,
      })

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveLength(2)
      expect(data[0].title).toBe('Integration Test 2')
      expect(data[1].title).toBe('Integration Test 1')
    })

    it('should convert MongoDB _id to string id', async () => {
      const { GET } = await import('./route')

      const ticket = await TicketModel.create({
        title: 'Test Ticket',
        description: 'Test Description',
      })

      const response = await GET()
      const data = await response.json()

      expect(data[0].id).toBe(ticket._id.toString())
      expect(data[0]._id).toBeUndefined()
    })

    it('should convert dates to Date objects in response', async () => {
      const { GET } = await import('./route')

      await TicketModel.create({
        title: 'Test Ticket',
        description: 'Test Description',
      })

      const response = await GET()
      const data = await response.json()

      expect(typeof data[0].createdAt).toBe('string')
      expect(typeof data[0].updatedAt).toBe('string')
      expect(new Date(data[0].createdAt)).toBeInstanceOf(Date)
      expect(new Date(data[0].updatedAt)).toBeInstanceOf(Date)
    })
  })
})
