export class InvalidUserIdError extends Error {
  constructor(userId: string) {
    super(`Invalid user id: ${userId}`);
    this.name = 'InvalidUserIdError';
  }
}
