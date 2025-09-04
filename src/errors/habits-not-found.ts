export class HabitsNotFoundError extends Error {
  constructor(userId: string) {
    super(`No habits found for user with id: ${userId}`);
    this.name = 'HabitNotFoundError';
  }
}
