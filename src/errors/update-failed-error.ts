export class UpdateFailedError extends Error {
  constructor(entityName: string, id: string) {
    super(`Failed to update ${entityName} with id: ${id}`);
    this.name = 'UpdateFailedError';
  }
}
