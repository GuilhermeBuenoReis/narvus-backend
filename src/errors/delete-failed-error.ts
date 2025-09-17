export class DeleteFailedError extends Error {
  constructor(entityName: string, id: string) {
    super(`Failed to delete ${entityName} with id: ${id}`);
    this.name = 'UpdateFailedError';
  }
}
