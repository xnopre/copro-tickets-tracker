import { describe, it, expect } from 'vitest';
import { formatTicketDate, formatTicketDateTime } from './ticketFormatters';

describe('ticketFormatters', () => {
  describe('formatTicketDate', () => {
    it('should format date without time', () => {
      const date = new Date('2025-01-15T12:00:00Z');
      const result = formatTicketDate(date);

      expect(result).toBe('15/01/2025');
    });

    it('should format date in French format', () => {
      const date = new Date('2025-03-22T12:00:00Z');
      const result = formatTicketDate(date);

      expect(result).toBe('22/03/2025');
    });

    it('should handle different dates', () => {
      const date1 = new Date('2023-03-10T12:00:00Z');
      const date2 = new Date('2024-12-25T12:00:00Z');

      const result1 = formatTicketDate(date1);
      const result2 = formatTicketDate(date2);

      expect(result1).toBe('10/03/2023');
      expect(result2).toBe('25/12/2024');
    });
  });

  describe('formatTicketDateTime', () => {
    it('should format date with time', () => {
      const date = new Date('2025-01-15T14:30:00Z');
      const result = formatTicketDateTime(date);

      expect(result).toBe('15/01/2025 15:30');
    });

    it('should format date and time in French format', () => {
      const date = new Date('2025-03-22T09:45:00Z');
      const result = formatTicketDateTime(date);

      expect(result).toBe('22/03/2025 10:45');
    });

    it('should handle different dates with time', () => {
      const date1 = new Date('2023-03-10T10:00:00Z');
      const date2 = new Date('2024-12-25T23:59:00Z');

      const result1 = formatTicketDateTime(date1);
      const result2 = formatTicketDateTime(date2);

      expect(result1).toBe('10/03/2023 11:00');
      expect(result2).toBe('26/12/2024 00:59');
    });
  });
});
