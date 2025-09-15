export class HabitNotFoundError extends Error {
  constructor(habitId: string) {
    super(`Habit with id: ${habitId} not found`);
    this.name = 'HabitNotFoundError';
  }
}
