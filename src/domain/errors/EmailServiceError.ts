export class EmailServiceError extends Error {
  constructor(
    message: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'EmailServiceError';
  }
}
