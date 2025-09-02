import { db } from './index';
import { habitEntries, habitStacks, habitStats, habits, users } from './schema';

async function main() {
  console.log('🌱 Seeding database...');

  await db.delete(habitStacks);
  await db.delete(habitEntries);
  await db.delete(habitStats);
  await db.delete(habits);
  await db.delete(users);

  const [user] = await db
    .insert(users)
    .values({
      name: 'Jhon doe',
      email: 'jhondoe@example.com',
      passwordHash: 'hashed_password',
    })
    .returning();

  const [habit1, habit2] = await db
    .insert(habits)
    .values([
      {
        userId: user.id,
        title: 'Ler 10 páginas',
        description: 'Ler pelo menos 10 páginas por dia',
        frequency: 'daily',
      },
      {
        userId: user.id,
        title: 'Fazer exercício',
        description: 'Treinar 3x por semana',
        frequency: 'weekly',
      },
    ])
    .returning();

  await db.insert(habitStats).values([
    {
      userId: user.id,
      habitId: habit1.id,
      currentStreak: 2,
      longestStreak: 5,
    },
    {
      userId: user.id,
      habitId: habit2.id,
      currentStreak: 0,
      longestStreak: 1,
    },
  ]);

  await db.insert(habitEntries).values([
    {
      userId: user.id,
      habitId: habit1.id,
      entryDate: new Date('2025-08-30').toISOString(),
      completed: true,
    },
    {
      userId: user.id,
      habitId: habit1.id,
      entryDate: new Date('2025-08-31').toISOString(),
      completed: false,
    },
    {
      userId: user.id,
      habitId: habit2.id,
      entryDate: new Date('2025-08-28').toISOString(),
      completed: true,
    },
  ]);

  await db.insert(habitStacks).values([
    {
      userId: user.id,
      existingHabitId: habit1.id,
      newHabitId: habit2.id,
    },
  ]);

  console.log('✅ Seed finalizado!');
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
