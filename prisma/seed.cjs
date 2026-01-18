const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Running simplified CommonJS seed...')

  // Create a small set of seed data to bootstrap the app
  const badge = await prisma.badge.upsert({
    where: { slug: 'first-steps' },
    update: {},
    create: {
      slug: 'first-steps',
      name: 'First Steps',
      description: 'Complete your first quest',
      icon: 'footprints',
      color: '#22c55e',
      type: 'PROGRESS',
      rarity: 'COMMON',
      criteria: { type: 'quest_complete', target: 1 },
    },
  })

  const tree = await prisma.questTree.upsert({
    where: { slug: 'foundations' },
    update: {},
    create: {
      slug: 'foundations',
      name: 'Foundations of Computing',
      description: 'Introductory concepts and setup',
      icon: 'book-open',
      color: '#8b5cf6',
      difficulty: 'NOVICE',
      estimatedHours: 10,
      roleRelevance: ['FULLSTACK'],
      prerequisiteTreeIds: [],
      order: 1,
      layer: 'FOUNDATIONS',
    },
  })

  const quest = await prisma.quest.upsert({
    where: { slug: 'hello-world' },
    update: {},
    create: {
      slug: 'hello-world',
      name: 'Hello World App',
      description: 'Create a simple Hello World program',
      difficulty: 'NOVICE',
      estimatedHours: 1,
      xpReward: 50,
      treeId: tree.id,
      prerequisiteQuestIds: [],
      tasks: [
        { id: 't1', name: 'Read intro', description: 'Read the tutorial intro', order: 1, hints: [] },
        { id: 't2', name: 'Write code', description: 'Write Hello World', order: 2, hints: [] },
      ],
      learningObjectives: ['Write a simple program', 'Understand runtime'],
      resources: [],
    },
  })

  console.log('Seeded:', { badge: badge.slug, tree: tree.slug, quest: quest.slug })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
