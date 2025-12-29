import { describe, it, expect } from 'vitest';
import { TicketStatus } from '@/domain/value-objects/TicketStatus';
import { getStatusBadgeVariant } from './statusBadgeVariant';

describe('getStatusBadgeVariant', () => {
  it('should return blue for NEW status', () => {
    const variant = getStatusBadgeVariant(TicketStatus.NEW);
    expect(variant).toBe('blue');
  });

  it('should return yellow for IN_PROGRESS status', () => {
    const variant = getStatusBadgeVariant(TicketStatus.IN_PROGRESS);
    expect(variant).toBe('yellow');
  });

  it('should return green for RESOLVED status', () => {
    const variant = getStatusBadgeVariant(TicketStatus.RESOLVED);
    expect(variant).toBe('green');
  });

  it('should return gray for CLOSED status', () => {
    const variant = getStatusBadgeVariant(TicketStatus.CLOSED);
    expect(variant).toBe('gray');
  });
});
