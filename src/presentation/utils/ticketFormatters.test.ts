import { describe, it, expect } from 'vitest';
import { formatTicketDate, formatTicketDateTime } from './ticketFormatters';

describe('ticketFormatters', () => {
  describe('formatTicketDate', () => {
    it('should format date without time', () => {
      const date = new Date('2025-01-15T14:30:00Z');
      const result = formatTicketDate(date);

      expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });

    it('should format date in French format', () => {
      const date = new Date('2025-01-15T14:30:00Z');
      const result = formatTicketDate(date);

      expect(result).toContain('/01/');
      expect(result).toContain('2025');
    });

    it('should handle different dates', () => {
      const date1 = new Date('2023-03-10T10:00:00Z');
      const date2 = new Date('2024-12-25T23:59:59Z');

      const result1 = formatTicketDate(date1);
      const result2 = formatTicketDate(date2);

      expect(result1).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
      expect(result2).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });
  });

  describe('formatTicketDateTime', () => {
    it('should format date with time', () => {
      const date = new Date('2025-01-15T14:30:00Z');
      const result = formatTicketDateTime(date);

      expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}.*\d{2}:\d{2}$/);
    });

    it('should format date and time in French format', () => {
      const date = new Date('2025-01-15T14:30:00Z');
      const result = formatTicketDateTime(date);

      expect(result).toContain('/01/');
      expect(result).toContain('2025');
      expect(result).toContain(':');
    });

    it('should handle different dates with time', () => {
      const date1 = new Date('2023-03-10T10:00:00Z');
      const date2 = new Date('2024-12-25T23:59:59Z');

      const result1 = formatTicketDateTime(date1);
      const result2 = formatTicketDateTime(date2);

      expect(result1).toMatch(/^\d{2}\/\d{2}\/\d{4}.*\d{2}:\d{2}$/);
      expect(result2).toMatch(/^\d{2}\/\d{2}\/\d{4}.*\d{2}:\d{2}$/);
    });
  });
});
