export class HabitEntrieNotFoundError extends Error {
  constructor(habitId: string) {
    super(`Habit Entrie with id: ${habitId} not found`);
    this.name = 'HabitEntrieNotFoundError';
  }
}
