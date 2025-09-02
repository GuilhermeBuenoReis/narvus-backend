export class InvalidCredentialsError extends Error {
  constructor() {
    super('Credentials do not match');
    this.name = 'InvalidCredentialsError';
  }
}
