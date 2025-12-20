import { TicketStatus } from '@/domain/value-objects/TicketStatus';

type BadgeVariant = 'blue' | 'yellow' | 'green' | 'gray' | 'red';

export function getStatusBadgeVariant(status: TicketStatus): BadgeVariant {
  const statusVariantMap: Record<TicketStatus, BadgeVariant> = {
    [TicketStatus.NEW]: 'blue',
    [TicketStatus.IN_PROGRESS]: 'yellow',
    [TicketStatus.RESOLVED]: 'green',
    [TicketStatus.CLOSED]: 'gray',
  };

  return statusVariantMap[status];
}
