export class InvalidIdError extends Error {
  constructor(id: string) {
    super(`Invalid ID format: ${id}`);
    this.name = 'InvalidIdError';
  }
}
