import { PrismaClient, Difficulty, RolePath, TreeLayer, BadgeType, BadgeRarity, ResourceType, AssessmentType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // ============================================
  // BADGES
  // ============================================
  console.log('Creating badges...')
  
  const badges = await Promise.all([
    // Progress Badges
    prisma.badge.upsert({
      where: { slug: 'first-steps' },
      update: {},
      create: {
        slug: 'first-steps',
        name: 'First Steps',
        description: 'Complete your first quest',
        icon: '👣',
        color: '#22c55e',
        type: BadgeType.PROGRESS,
        rarity: BadgeRarity.COMMON,
        criteria: {
          type: 'quest_complete',
          target: 1,
          questIds: [],
          treeIds: [],
        },
      },
    }),
    prisma.badge.upsert({
      where: { slug: 'quest-warrior' },
      update: {},
      create: {
        slug: 'quest-warrior',
        name: 'Quest Warrior',
        description: 'Complete 10 quests',
        icon: '⚔️',
        color: '#3b82f6',
        type: BadgeType.PROGRESS,
        rarity: BadgeRarity.UNCOMMON,
        criteria: {
          type: 'quest_complete',
          target: 10,
          questIds: [],
          treeIds: [],
        },
      },
    }),
    prisma.badge.upsert({
      where: { slug: 'quest-champion' },
      update: {},
      create: {
        slug: 'quest-champion',
        name: 'Quest Champion',
        description: 'Complete 50 quests',
        icon: '🏆',
        color: '#f59e0b',
        type: BadgeType.PROGRESS,
        rarity: BadgeRarity.RARE,
        criteria: {
          type: 'quest_complete',
          target: 50,
          questIds: [],
          treeIds: [],
        },
      },
    }),
    
    // Skill Badges
    prisma.badge.upsert({
      where: { slug: 'git-master' },
      update: {},
      create: {
        slug: 'git-master',
        name: 'Git Master',
        description: 'Complete all Git quests',
        icon: '🐙',
        color: '#f97316',
        type: BadgeType.SKILL,
        rarity: BadgeRarity.UNCOMMON,
        criteria: {
          type: 'tree_complete',
          target: 1,
          questIds: [],
          treeIds: [],
        },
      },
    }),
    prisma.badge.upsert({
      where: { slug: 'api-builder' },
      update: {},
      create: {
        slug: 'api-builder',
        name: 'API Builder',
        description: 'Build your first REST API',
        icon: '🔌',
        color: '#8b5cf6',
        type: BadgeType.SKILL,
        rarity: BadgeRarity.UNCOMMON,
        criteria: {
          type: 'quest_complete',
          target: 1,
          questIds: [],
          treeIds: [],
        },
      },
    }),
    prisma.badge.upsert({
      where: { slug: 'docker-captain' },
      update: {},
      create: {
        slug: 'docker-captain',
        name: 'Docker Captain',
        description: 'Master Docker containerization',
        icon: '🐳',
        color: '#0ea5e9',
        type: BadgeType.SKILL,
        rarity: BadgeRarity.RARE,
        criteria: {
          type: 'tree_complete',
          target: 1,
          questIds: [],
          treeIds: [],
        },
      },
    }),
    prisma.badge.upsert({
      where: { slug: 'api-architect' },
      update: {},
      create: {
        slug: 'api-architect',
        name: 'API Architect',
        description: 'Complete the Backend API capstone',
        icon: '🏛️',
        color: '#ec4899',
        type: BadgeType.SKILL,
        rarity: BadgeRarity.EPIC,
        criteria: {
          type: 'capstone_complete',
          target: 1,
          questIds: [],
          treeIds: [],
        },
      },
    }),
    
    // Streak Badges
    prisma.badge.upsert({
      where: { slug: 'week-warrior' },
      update: {},
      create: {
        slug: 'week-warrior',
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        color: '#ef4444',
        type: BadgeType.STREAK,
        rarity: BadgeRarity.UNCOMMON,
        criteria: {
          type: 'streak',
          target: 7,
          questIds: [],
          treeIds: [],
        },
      },
    }),
    prisma.badge.upsert({
      where: { slug: 'month-master' },
      update: {},
      create: {
        slug: 'month-master',
        name: 'Month Master',
        description: 'Maintain a 30-day streak',
        icon: '💫',
        color: '#a855f7',
        type: BadgeType.STREAK,
        rarity: BadgeRarity.EPIC,
        criteria: {
          type: 'streak',
          target: 30,
          questIds: [],
          treeIds: [],
        },
      },
    }),
    
    // Behavior Badges
    prisma.badge.upsert({
      where: { slug: 'night-owl' },
      update: {},
      create: {
        slug: 'night-owl',
        name: 'Night Owl',
        description: 'Complete a quest after midnight',
        icon: '🦉',
        color: '#6366f1',
        type: BadgeType.BEHAVIOR,
        rarity: BadgeRarity.COMMON,
        isHidden: true,
        criteria: {
          type: 'time_complete',
          target: 0,
          questIds: [],
          treeIds: [],
          conditions: '{"hour": {"gte": 0, "lte": 5}}',
        },
      },
    }),
    prisma.badge.upsert({
      where: { slug: 'speed-demon' },
      update: {},
      create: {
        slug: 'speed-demon',
        name: 'Speed Demon',
        description: 'Complete a quest in less than 50% of estimated time',
        icon: '⚡',
        color: '#facc15',
        type: BadgeType.BEHAVIOR,
        rarity: BadgeRarity.RARE,
        criteria: {
          type: 'speed_complete',
          target: 50,
          questIds: [],
          treeIds: [],
        },
      },
    }),
    prisma.badge.upsert({
      where: { slug: 'early-bird' },
      update: {},
      create: {
        slug: 'early-bird',
        name: 'Early Bird',
        description: 'Complete 5 quests before their deadline',
        icon: '🐦',
        color: '#06b6d4',
        type: BadgeType.BEHAVIOR,
        rarity: BadgeRarity.UNCOMMON,
        criteria: {
          type: 'early_complete',
          target: 5,
          questIds: [],
          treeIds: [],
        },
      },
    }),
    
    // Social Badges
    prisma.badge.upsert({
      where: { slug: 'helper' },
      update: {},
      create: {
        slug: 'helper',
        name: 'Helper',
        description: 'Help 10 other learners in the community',
        icon: '🤝',
        color: '#10b981',
        type: BadgeType.SOCIAL,
        rarity: BadgeRarity.UNCOMMON,
        criteria: {
          type: 'help_others',
          target: 10,
          questIds: [],
          treeIds: [],
        },
      },
    }),
  ])

  console.log(`Created ${badges.length} badges`)

  // ============================================
  // QUEST TREES
  // ============================================
  console.log('Creating quest trees...')

  // Foundations Tree
  const foundationsTree = await prisma.questTree.upsert({
    where: { slug: 'foundations' },
    update: {},
    create: {
      slug: 'foundations',
      name: 'Foundations of Computing',
      description: 'Understand how computers actually work, from binary to the internet. This is where every developer journey begins.',
      icon: '📚',
      color: '#8b5cf6',
      difficulty: Difficulty.NOVICE,
      estimatedHours: 15,
      roleRelevance: [RolePath.DEVOPS, RolePath.BACKEND, RolePath.FRONTEND, RolePath.SECURITY, RolePath.FULLSTACK],
      prerequisiteTreeIds: [],
      order: 1,
      layer: TreeLayer.FOUNDATIONS,
    },
  })

  // Tools Tree
  const toolsTree = await prisma.questTree.upsert({
    where: { slug: 'developer-tools' },
    update: {},
    create: {
      slug: 'developer-tools',
      name: 'Developer Tools & Environment',
      description: 'Master the essential tools every developer needs: terminal, Git, VS Code, and package managers.',
      icon: '🧰',
      color: '#f59e0b',
      difficulty: Difficulty.NOVICE,
      estimatedHours: 20,
      roleRelevance: [RolePath.DEVOPS, RolePath.BACKEND, RolePath.FRONTEND, RolePath.SECURITY, RolePath.FULLSTACK],
      prerequisiteTreeIds: [foundationsTree.id],
      order: 2,
      layer: TreeLayer.TOOL_MASTERY,
    },
  })

  // Linux Tree
  const linuxTree = await prisma.questTree.upsert({
    where: { slug: 'linux-fundamentals' },
    update: {},
    create: {
      slug: 'linux-fundamentals',
      name: 'Linux Fundamentals',
      description: 'Learn to navigate and command Linux systems, the foundation of most servers and cloud infrastructure.',
      icon: '🐧',
      color: '#fbbf24',
      difficulty: Difficulty.APPRENTICE,
      estimatedHours: 16,
      roleRelevance: [RolePath.DEVOPS, RolePath.BACKEND, RolePath.SECURITY, RolePath.FULLSTACK],
      prerequisiteTreeIds: [toolsTree.id],
      order: 3,
      layer: TreeLayer.TOOL_MASTERY,
    },
  })

  // Frontend Basics Tree
  const frontendBasicsTree = await prisma.questTree.upsert({
    where: { slug: 'frontend-basics' },
    update: {},
    create: {
      slug: 'frontend-basics',
      name: 'Frontend Fundamentals',
      description: 'Learn HTML, CSS, and JavaScript - the building blocks of every website and web application.',
      icon: '🎨',
      color: '#ec4899',
      difficulty: Difficulty.NOVICE,
      estimatedHours: 25,
      roleRelevance: [RolePath.FRONTEND, RolePath.FULLSTACK],
      prerequisiteTreeIds: [toolsTree.id],
      order: 4,
      layer: TreeLayer.SPECIALIZATION,
    },
  })

  // React Tree
  const reactTree = await prisma.questTree.upsert({
    where: { slug: 'react-fundamentals' },
    update: {},
    create: {
      slug: 'react-fundamentals',
      name: 'React Fundamentals',
      description: 'Build modern, interactive UIs with React - the most popular frontend framework.',
      icon: '⚛️',
      color: '#61dafb',
      difficulty: Difficulty.JOURNEYMAN,
      estimatedHours: 30,
      roleRelevance: [RolePath.FRONTEND, RolePath.FULLSTACK],
      prerequisiteTreeIds: [frontendBasicsTree.id],
      order: 5,
      layer: TreeLayer.SPECIALIZATION,
    },
  })

  // Backend Node.js Tree
  const backendTree = await prisma.questTree.upsert({
    where: { slug: 'backend-nodejs' },
    update: {},
    create: {
      slug: 'backend-nodejs',
      name: 'Backend Development with Node.js',
      description: 'Build server-side applications and APIs using Node.js and Express.',
      icon: '⚙️',
      color: '#22c55e',
      difficulty: Difficulty.JOURNEYMAN,
      estimatedHours: 35,
      roleRelevance: [RolePath.BACKEND, RolePath.FULLSTACK],
      prerequisiteTreeIds: [toolsTree.id, frontendBasicsTree.id],
      order: 6,
      layer: TreeLayer.SPECIALIZATION,
    },
  })

  // Database Tree
  const databaseTree = await prisma.questTree.upsert({
    where: { slug: 'database-fundamentals' },
    update: {},
    create: {
      slug: 'database-fundamentals',
      name: 'Database Design & SQL',
      description: 'Learn to design, query, and optimize databases - the backbone of every application.',
      icon: '🗄️',
      color: '#3b82f6',
      difficulty: Difficulty.JOURNEYMAN,
      estimatedHours: 25,
      roleRelevance: [RolePath.BACKEND, RolePath.FULLSTACK, RolePath.DEVOPS],
      prerequisiteTreeIds: [backendTree.id],
      order: 7,
      layer: TreeLayer.SPECIALIZATION,
    },
  })

  // Docker Tree
  const dockerTree = await prisma.questTree.upsert({
    where: { slug: 'docker-containers' },
    update: {},
    create: {
      slug: 'docker-containers',
      name: 'Docker & Containers',
      description: 'Master containerization with Docker - package and deploy applications anywhere.',
      icon: '🐳',
      color: '#0ea5e9',
      difficulty: Difficulty.JOURNEYMAN,
      estimatedHours: 20,
      roleRelevance: [RolePath.DEVOPS, RolePath.BACKEND, RolePath.FULLSTACK],
      prerequisiteTreeIds: [linuxTree.id],
      order: 8,
      layer: TreeLayer.SPECIALIZATION,
    },
  })

  // CI/CD Tree
  const cicdTree = await prisma.questTree.upsert({
    where: { slug: 'cicd-pipelines' },
    update: {},
    create: {
      slug: 'cicd-pipelines',
      name: 'CI/CD Pipelines',
      description: 'Automate testing and deployment with continuous integration and delivery.',
      icon: '🔄',
      color: '#6366f1',
      difficulty: Difficulty.EXPERT,
      estimatedHours: 18,
      roleRelevance: [RolePath.DEVOPS, RolePath.BACKEND, RolePath.FULLSTACK],
      prerequisiteTreeIds: [toolsTree.id, dockerTree.id],
      order: 9,
      layer: TreeLayer.SPECIALIZATION,
    },
  })

  // Cloud Tree
  const cloudTree = await prisma.questTree.upsert({
    where: { slug: 'cloud-deployment' },
    update: {},
    create: {
      slug: 'cloud-deployment',
      name: 'Cloud Deployment',
      description: 'Deploy and manage applications on cloud platforms like AWS, GCP, and Azure.',
      icon: '☁️',
      color: '#f97316',
      difficulty: Difficulty.EXPERT,
      estimatedHours: 30,
      roleRelevance: [RolePath.DEVOPS, RolePath.BACKEND, RolePath.FULLSTACK],
      prerequisiteTreeIds: [dockerTree.id, cicdTree.id],
      order: 10,
      layer: TreeLayer.SPECIALIZATION,
    },
  })

  // Security Tree
  const securityTree = await prisma.questTree.upsert({
    where: { slug: 'security-fundamentals' },
    update: {},
    create: {
      slug: 'security-fundamentals',
      name: 'Security Fundamentals',
      description: 'Learn to secure applications and infrastructure from common vulnerabilities.',
      icon: '🔐',
      color: '#ef4444',
      difficulty: Difficulty.EXPERT,
      estimatedHours: 25,
      roleRelevance: [RolePath.SECURITY, RolePath.BACKEND, RolePath.DEVOPS, RolePath.FULLSTACK],
      prerequisiteTreeIds: [backendTree.id, linuxTree.id],
      order: 11,
      layer: TreeLayer.CAPSTONE,
    },
  })

  // Monitoring Tree
  const monitoringTree = await prisma.questTree.upsert({
    where: { slug: 'monitoring-observability' },
    update: {},
    create: {
      slug: 'monitoring-observability',
      name: 'Monitoring & Observability',
      description: 'Implement logging, metrics, and alerting to keep your applications healthy.',
      icon: '📊',
      color: '#a855f7',
      difficulty: Difficulty.EXPERT,
      estimatedHours: 20,
      roleRelevance: [RolePath.DEVOPS, RolePath.BACKEND, RolePath.FULLSTACK],
      prerequisiteTreeIds: [cloudTree.id],
      order: 12,
      layer: TreeLayer.CAPSTONE,
    },
  })

  console.log('Created quest trees')

  // ============================================
  // QUESTS
  // ============================================
  console.log('Creating quests...')

  // Foundations Quests
  const foundationsQuests = await Promise.all([
    prisma.quest.upsert({
      where: { slug: 'how-computers-think' },
      update: {},
      create: {
        slug: 'how-computers-think',
        name: 'How Computers Think',
        description: 'Understand binary, logic gates, and how computers process information.',
        longDescription: `Before you can master programming, you need to understand how computers actually work at a fundamental level. In this quest, you'll explore binary numbers, logic gates, and the basics of how CPUs process instructions.

This knowledge will help you understand why certain design decisions are made in programming languages and why performance matters.`,
        treeId: foundationsTree.id,
        difficulty: Difficulty.NOVICE,
        estimatedHours: 3,
        deadlineDays: 3,
        xpReward: 100,
        order: 1,
        prerequisiteQuestIds: [],
        unlocksQuestIds: [],
        learningObjectives: [
          'Understand binary number representation',
          'Explain basic logic gates (AND, OR, NOT)',
          'Describe how a CPU executes instructions',
          'Convert between binary and decimal',
        ],
        assessmentType: AssessmentType.QUIZ,
        assessmentCriteria: {
          requirements: ['Complete interactive exercises', 'Pass the quiz with 80%+'],
          meetsExpectations: ['Convert numbers correctly', 'Identify logic gate outputs'],
          exceedsExpectations: ['Explain concepts in own words', 'Complete bonus challenges'],
          exceptional: ['Create teaching materials for others'],
        },
        tasks: [
          {
            id: 'task-1',
            name: 'Binary Basics',
            description: 'Learn how computers represent data using 1s and 0s',
            order: 1,
            hints: ['Start by counting in binary: 0, 1, 10, 11, 100...', 'Each position represents a power of 2'],
            verification: 'Complete the binary counting exercise',
          },
          {
            id: 'task-2',
            name: 'Logic Gates',
            description: 'Understand AND, OR, NOT, XOR gates',
            order: 2,
            hints: ['AND outputs 1 only if both inputs are 1', 'OR outputs 1 if any input is 1'],
            verification: 'Complete the logic gate simulator',
          },
          {
            id: 'task-3',
            name: 'CPU Basics',
            description: 'Learn the fetch-decode-execute cycle',
            order: 3,
            hints: ['Think of the CPU as following a recipe step by step'],
            verification: 'Pass the CPU concepts quiz',
          },
        ],
        resources: [
          {
            type: ResourceType.VIDEO,
            name: 'Binary Explained in 10 Minutes',
            url: '/resources/videos/binary-basics',
            description: 'Visual explanation of binary numbers',
            duration: 10,
          },
          {
            type: ResourceType.INTERACTIVE,
            name: 'Logic Gate Simulator',
            url: '/resources/interactive/logic-gates',
            description: 'Interactive tool to experiment with logic gates',
          },
          {
            type: ResourceType.DOCUMENT,
            name: 'How CPUs Work',
            url: '/resources/docs/cpu-basics.pdf',
            description: 'Detailed guide to CPU architecture',
          },
        ],
        tools: [],
      },
    }),
    prisma.quest.upsert({
      where: { slug: 'internet-explained' },
      update: {},
      create: {
        slug: 'internet-explained',
        name: 'The Internet Explained',
        description: 'Learn how data travels across the internet - DNS, HTTP, packets, and more.',
        longDescription: `The internet is the backbone of modern software. Understanding how it works will help you build better web applications, debug network issues, and make informed architecture decisions.`,
        treeId: foundationsTree.id,
        difficulty: Difficulty.NOVICE,
        estimatedHours: 4,
        deadlineDays: 4,
        xpReward: 150,
        order: 2,
        prerequisiteQuestIds: [],
        unlocksQuestIds: [],
        learningObjectives: [
          'Explain how DNS resolves domain names',
          'Understand HTTP request/response cycle',
          'Describe how data is packetized and routed',
          'Use browser dev tools to inspect network traffic',
        ],
        assessmentType: AssessmentType.ARTIFACT,
        assessmentCriteria: {
          requirements: ['Create a diagram explaining internet flow', 'Demonstrate using dev tools'],
          meetsExpectations: ['Accurate diagram', 'Correct terminology'],
          exceedsExpectations: ['Include TCP/IP layers', 'Show real network analysis'],
          exceptional: ['Create an educational video or blog post'],
        },
        tasks: [
          {
            id: 'task-1',
            name: 'DNS Deep Dive',
            description: 'Understand how domain names become IP addresses',
            order: 1,
            hints: ['Try using nslookup or dig command', 'DNS is like the phone book of the internet'],
            verification: 'Explain DNS resolution steps',
          },
          {
            id: 'task-2',
            name: 'HTTP Fundamentals',
            description: 'Learn about requests, responses, headers, and status codes',
            order: 2,
            hints: ['200 = OK, 404 = Not Found, 500 = Server Error'],
            verification: 'Identify HTTP methods and status codes',
          },
          {
            id: 'task-3',
            name: 'Packets & Routing',
            description: 'How data travels from your computer to servers',
            order: 3,
            hints: ['Use traceroute to see the path your data takes'],
            verification: 'Run traceroute and explain the output',
          },
          {
            id: 'task-4',
            name: 'Browser Dev Tools',
            description: 'Inspect network traffic in your browser',
            order: 4,
            hints: ['Press F12 to open dev tools', 'Check the Network tab'],
            verification: 'Screenshot of network analysis',
          },
        ],
        resources: [
          {
            type: ResourceType.VIDEO,
            name: 'How the Internet Works',
            url: '/resources/videos/internet-explained',
            duration: 15,
          },
          {
            type: ResourceType.CHEATSHEET,
            name: 'HTTP Status Codes Cheat Sheet',
            url: '/resources/cheatsheets/http-status-codes.pdf',
          },
          {
            type: ResourceType.EXTERNAL_LINK,
            name: 'MDN: How the Web Works',
            url: 'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/How_the_Web_works',
          },
        ],
        tools: [],
      },
    }),
    prisma.quest.upsert({
      where: { slug: 'programming-fundamentals' },
      update: {},
      create: {
        slug: 'programming-fundamentals',
        name: 'Programming Fundamentals',
        description: 'Learn the core concepts that apply to every programming language.',
        treeId: foundationsTree.id,
        difficulty: Difficulty.NOVICE,
        estimatedHours: 6,
        deadlineDays: 7,
        xpReward: 200,
        order: 3,
        prerequisiteQuestIds: [],
        unlocksQuestIds: [],
        learningObjectives: [
          'Understand variables and data types',
          'Write conditional statements (if/else)',
          'Create loops (for, while)',
          'Define and call functions',
        ],
        assessmentType: AssessmentType.ARTIFACT,
        tasks: [
          {
            id: 'task-1',
            name: 'Variables & Types',
            description: 'Store and manipulate data',
            order: 1,
            hints: ['Variables are like labeled boxes that hold values'],
            verification: 'Complete 5 variable exercises',
          },
          {
            id: 'task-2',
            name: 'Conditionals',
            description: 'Make decisions in your code',
            order: 2,
            hints: ['Think of if/else as a fork in the road'],
            verification: 'Complete 5 conditional exercises',
          },
          {
            id: 'task-3',
            name: 'Loops',
            description: 'Repeat actions efficiently',
            order: 3,
            hints: ['Use for loops when you know how many times', 'Use while loops when you don\'t'],
            verification: 'Complete 5 loop exercises',
          },
          {
            id: 'task-4',
            name: 'Functions',
            description: 'Create reusable blocks of code',
            order: 4,
            hints: ['Functions are like recipes - define once, use many times'],
            verification: 'Write 3 custom functions',
          },
        ],
        resources: [
          {
            type: ResourceType.INTERACTIVE,
            name: 'JavaScript Playground',
            url: '/resources/interactive/js-playground',
          },
          {
            type: ResourceType.DOCUMENT,
            name: 'Programming Concepts Guide',
            url: '/resources/docs/programming-fundamentals.pdf',
          },
        ],
        tools: [
          {
            name: 'Node.js',
            version: '>=18',
            purpose: 'Run JavaScript code',
            installGuide: '/guides/install-nodejs',
            required: true,
          },
        ],
      },
    }),
  ])

  // Developer Tools Quests
  const toolsQuests = await Promise.all([
    prisma.quest.upsert({
      where: { slug: 'terminal-mastery' },
      update: {},
      create: {
        slug: 'terminal-mastery',
        name: 'Terminal Mastery',
        description: 'Command your computer like a pro with the terminal.',
        longDescription: `The terminal is the developer's cockpit. Learning to use it effectively will make you dramatically more productive and give you access to powerful tools that don't have graphical interfaces.`,
        treeId: toolsTree.id,
        difficulty: Difficulty.NOVICE,
        estimatedHours: 4,
        deadlineDays: 5,
        xpReward: 150,
        order: 1,
        prerequisiteQuestIds: [],
        unlocksQuestIds: [],
        learningObjectives: [
          'Navigate the filesystem from the command line',
          'Create, move, copy, and delete files and folders',
          'Use pipes and redirects',
          'Understand environment variables',
        ],
        assessmentType: AssessmentType.ARTIFACT,
        tasks: [
          {
            id: 'task-1',
            name: 'Navigation Basics',
            description: 'Learn cd, ls, pwd, and path concepts',
            order: 1,
            hints: ['cd = change directory', 'ls = list files', 'pwd = print working directory'],
            verification: 'Navigate to 5 different directories',
          },
          {
            id: 'task-2',
            name: 'File Operations',
            description: 'Create, copy, move, and delete files',
            order: 2,
            hints: ['touch creates files', 'mkdir creates directories', 'rm removes (careful!)'],
            verification: 'Complete file manipulation exercises',
          },
          {
            id: 'task-3',
            name: 'Pipes & Redirects',
            description: 'Chain commands together',
            order: 3,
            hints: ['| sends output to another command', '> saves output to a file'],
            verification: 'Create a pipeline of 3+ commands',
          },
          {
            id: 'task-4',
            name: 'Environment Variables',
            description: 'Configure your shell environment',
            order: 4,
            hints: ['echo $PATH shows your path', 'export sets variables'],
            verification: 'Set and use a custom environment variable',
          },
        ],
        resources: [
          {
            type: ResourceType.CHEATSHEET,
            name: 'Terminal Commands Cheat Sheet',
            url: '/resources/cheatsheets/terminal-commands.pdf',
          },
          {
            type: ResourceType.INTERACTIVE,
            name: 'Terminal Simulator',
            url: '/resources/interactive/terminal-sim',
          },
        ],
        tools: [
          {
            name: 'Terminal',
            purpose: 'Command line interface',
            installGuide: '/guides/terminal-setup',
            required: true,
          },
        ],
      },
    }),
    prisma.quest.upsert({
      where: { slug: 'git-fundamentals' },
      update: {},
      create: {
        slug: 'git-fundamentals',
        name: 'Git Fundamentals',
        description: 'Track your code changes and collaborate with others using Git.',
        longDescription: `Git is the industry-standard version control system. Every professional developer uses it daily. This quest will teach you not just the commands, but the mental model behind Git.`,
        treeId: toolsTree.id,
        difficulty: Difficulty.APPRENTICE,
        estimatedHours: 5,
        deadlineDays: 7,
        xpReward: 200,
        order: 2,
        prerequisiteQuestIds: [],
        unlocksQuestIds: [],
        learningObjectives: [
          'Initialize and clone repositories',
          'Stage, commit, and push changes',
          'Create and merge branches',
          'Resolve merge conflicts',
          'Use GitHub for collaboration',
        ],
        assessmentType: AssessmentType.ARTIFACT,
        tasks: [
          {
            id: 'task-1',
            name: 'Repository Basics',
            description: 'Create and clone repositories',
            order: 1,
            hints: ['git init starts a new repo', 'git clone copies an existing repo'],
            verification: 'Create a new repository',
          },
          {
            id: 'task-2',
            name: 'Commit Workflow',
            description: 'Stage and commit your changes',
            order: 2,
            hints: ['git add stages files', 'git commit saves a snapshot'],
            verification: 'Make 5 meaningful commits',
          },
          {
            id: 'task-3',
            name: 'Branching',
            description: 'Work on features in isolation',
            order: 3,
            hints: ['git branch creates branches', 'git checkout switches branches'],
            verification: 'Create and merge a feature branch',
          },
          {
            id: 'task-4',
            name: 'Collaboration',
            description: 'Push, pull, and handle conflicts',
            order: 4,
            hints: ['git push sends to remote', 'git pull fetches and merges'],
            verification: 'Resolve a merge conflict',
          },
          {
            id: 'task-5',
            name: 'GitHub Workflow',
            description: 'Use Pull Requests and Issues',
            order: 5,
            hints: ['PRs are how teams review code'],
            verification: 'Create a Pull Request',
          },
        ],
        resources: [
          {
            type: ResourceType.VIDEO,
            name: 'Git Explained Visually',
            url: '/resources/videos/git-visual',
            duration: 20,
          },
          {
            type: ResourceType.CHEATSHEET,
            name: 'Git Commands Cheat Sheet',
            url: '/resources/cheatsheets/git-commands.pdf',
          },
          {
            type: ResourceType.EXTERNAL_LINK,
            name: 'GitHub Learning Lab',
            url: 'https://lab.github.com/',
          },
        ],
        tools: [
          {
            name: 'Git',
            version: '>=2.30',
            purpose: 'Version control',
            installGuide: '/guides/install-git',
            required: true,
          },
          {
            name: 'GitHub Account',
            purpose: 'Code hosting and collaboration',
            installGuide: '/guides/github-setup',
            required: true,
          },
        ],
      },
    }),
    prisma.quest.upsert({
      where: { slug: 'vscode-mastery' },
      update: {},
      create: {
        slug: 'vscode-mastery',
        name: 'VS Code Mastery',
        description: 'Supercharge your productivity with VS Code.',
        treeId: toolsTree.id,
        difficulty: Difficulty.NOVICE,
        estimatedHours: 3,
        deadlineDays: 4,
        xpReward: 120,
        order: 3,
        prerequisiteQuestIds: [],
        unlocksQuestIds: [],
        learningObjectives: [
          'Navigate and edit files efficiently',
          'Use keyboard shortcuts like a pro',
          'Install and configure extensions',
          'Use the integrated terminal and debugger',
        ],
        assessmentType: AssessmentType.ARTIFACT,
        tasks: [
          {
            id: 'task-1',
            name: 'Navigation & Editing',
            description: 'Master file navigation and multi-cursor editing',
            order: 1,
            hints: ['Ctrl+P opens file finder', 'Ctrl+D selects next occurrence'],
            verification: 'Complete editing challenges',
          },
          {
            id: 'task-2',
            name: 'Keyboard Shortcuts',
            description: 'Learn essential shortcuts',
            order: 2,
            hints: ['Ctrl+Shift+P opens command palette'],
            verification: 'Use 10 different shortcuts',
          },
          {
            id: 'task-3',
            name: 'Extensions',
            description: 'Customize VS Code with extensions',
            order: 3,
            hints: ['Prettier for formatting', 'ESLint for linting'],
            verification: 'Install and configure 5 extensions',
          },
          {
            id: 'task-4',
            name: 'Terminal & Debugging',
            description: 'Use integrated tools',
            order: 4,
            hints: ['Ctrl+` opens terminal'],
            verification: 'Debug a simple program',
          },
        ],
        resources: [
          {
            type: ResourceType.CHEATSHEET,
            name: 'VS Code Shortcuts',
            url: '/resources/cheatsheets/vscode-shortcuts.pdf',
          },
          {
            type: ResourceType.DOCUMENT,
            name: 'Recommended Extensions List',
            url: '/resources/docs/vscode-extensions.md',
          },
        ],
        tools: [
          {
            name: 'VS Code',
            purpose: 'Code editor',
            installGuide: '/guides/install-vscode',
            required: true,
          },
        ],
      },
    }),
  ])

  // Backend Quests
  const backendQuests = await Promise.all([
    prisma.quest.upsert({
      where: { slug: 'nodejs-basics' },
      update: {},
      create: {
        slug: 'nodejs-basics',
        name: 'Node.js Basics',
        description: 'Run JavaScript outside the browser with Node.js.',
        treeId: backendTree.id,
        difficulty: Difficulty.APPRENTICE,
        estimatedHours: 4,
        deadlineDays: 5,
        xpReward: 150,
        order: 1,
        prerequisiteQuestIds: [],
        unlocksQuestIds: [],
        learningObjectives: [
          'Understand the Node.js runtime',
          'Use npm to manage packages',
          'Work with built-in modules (fs, path, http)',
          'Handle asynchronous operations',
        ],
        assessmentType: AssessmentType.ARTIFACT,
        tasks: [
          {
            id: 'task-1',
            name: 'Node.js Setup',
            description: 'Install Node.js and run your first script',
            order: 1,
            hints: ['Use nvm for version management'],
            verification: 'Run hello world script',
          },
          {
            id: 'task-2',
            name: 'NPM Essentials',
            description: 'Manage packages with npm',
            order: 2,
            hints: ['npm init creates package.json', 'npm install adds packages'],
            verification: 'Create project with 3 dependencies',
          },
          {
            id: 'task-3',
            name: 'Built-in Modules',
            description: 'Use fs, path, and http modules',
            order: 3,
            hints: ['fs for file operations', 'path for file paths'],
            verification: 'Read and write files with Node.js',
          },
          {
            id: 'task-4',
            name: 'Async JavaScript',
            description: 'Handle callbacks, promises, and async/await',
            order: 4,
            hints: ['async/await makes async code readable'],
            verification: 'Write async functions',
          },
        ],
        resources: [
          {
            type: ResourceType.DOCUMENT,
            name: 'Node.js Getting Started Guide',
            url: '/resources/docs/nodejs-guide.pdf',
          },
          {
            type: ResourceType.CHEATSHEET,
            name: 'NPM Commands Cheat Sheet',
            url: '/resources/cheatsheets/npm-commands.pdf',
          },
        ],
        tools: [
          {
            name: 'Node.js',
            version: '>=18',
            purpose: 'JavaScript runtime',
            installGuide: '/guides/install-nodejs',
            required: true,
          },
        ],
      },
    }),
    prisma.quest.upsert({
      where: { slug: 'build-rest-api' },
      update: {},
      create: {
        slug: 'build-rest-api',
        name: 'Build a REST API',
        description: 'Design and implement a RESTful API with Express.js.',
        longDescription: `APIs are how different parts of software communicate. This quest teaches you to build professional-grade APIs that follow industry best practices.`,
        treeId: backendTree.id,
        difficulty: Difficulty.JOURNEYMAN,
        estimatedHours: 8,
        deadlineDays: 7,
        xpReward: 350,
        badgeId: badges.find(b => b.slug === 'api-builder')?.id,
        order: 2,
        prerequisiteQuestIds: [],
        unlocksQuestIds: [],
        learningObjectives: [
          'Design RESTful endpoints',
          'Implement CRUD operations',
          'Handle errors gracefully',
          'Validate and sanitize input',
          'Document your API',
        ],
        assessmentType: AssessmentType.ARTIFACT,
        assessmentCriteria: {
          requirements: [
            'GitHub repository with commit history',
            'All 5 endpoints working',
            'README with API documentation',
            'Error handling for edge cases',
          ],
          meetsExpectations: [
            'All endpoints functional',
            'Proper HTTP status codes',
            'Basic documentation',
          ],
          exceedsExpectations: [
            'Input validation',
            'Consistent error format',
            'OpenAPI spec file',
          ],
          exceptional: [
            'Rate limiting',
            'Request logging',
            'Automated tests',
          ],
        },
        tasks: [
          {
            id: 'task-1',
            name: 'Setup Express Project',
            description: 'Initialize a Node.js project with Express',
            order: 1,
            hints: ['Use npm init to create package.json', 'Install express with npm install express'],
            verification: 'package.json exists with express dependency',
          },
          {
            id: 'task-2',
            name: 'Design API Endpoints',
            description: 'Plan your API routes before coding',
            order: 2,
            hints: ['Think about resources (nouns) not actions (verbs)', 'Use standard HTTP methods'],
            verification: 'Submitted API design document',
          },
          {
            id: 'task-3',
            name: 'Implement GET /todos',
            description: 'Return list of all todos',
            order: 3,
            hints: ['Use app.get(\'/todos\', ...)', 'Return JSON with res.json()'],
            verification: 'Endpoint returns 200 with array',
          },
          {
            id: 'task-4',
            name: 'Implement POST /todos',
            description: 'Create a new todo',
            order: 4,
            hints: ['Parse body with express.json() middleware', 'Return 201 for creation'],
            verification: 'Endpoint creates todo and returns 201',
          },
          {
            id: 'task-5',
            name: 'Implement PUT /todos/:id',
            description: 'Update an existing todo',
            order: 5,
            hints: ['Access URL params with req.params.id', 'Return 404 if not found'],
            verification: 'Endpoint updates todo and returns 200',
          },
          {
            id: 'task-6',
            name: 'Implement DELETE /todos/:id',
            description: 'Delete a todo',
            order: 6,
            hints: ['204 No Content is appropriate for delete'],
            verification: 'Endpoint deletes todo and returns 204',
          },
          {
            id: 'task-7',
            name: 'Add Error Handling',
            description: 'Handle invalid requests gracefully',
            order: 7,
            hints: ['Use try/catch for async', 'Create error handling middleware'],
            verification: 'Invalid requests return appropriate error codes',
          },
        ],
        resources: [
          {
            type: ResourceType.DOCUMENT,
            name: 'REST API Design Guide',
            url: '/resources/docs/rest-api-design.pdf',
            description: 'Best practices for API design',
          },
          {
            type: ResourceType.CHEATSHEET,
            name: 'Express.js Quick Reference',
            url: '/resources/cheatsheets/express-cheatsheet.pdf',
          },
          {
            type: ResourceType.VIDEO,
            name: 'HTTP Methods Explained',
            url: '/resources/videos/http-methods-101',
            duration: 12,
          },
          {
            type: ResourceType.STARTER_CODE,
            name: 'API Starter Template',
            url: 'https://github.com/questboard/api-starter',
          },
        ],
        tools: [
          {
            name: 'Node.js',
            version: '>=18',
            installGuide: '/guides/install-nodejs',
            required: true,
          },
          {
            name: 'Postman',
            purpose: 'API testing',
            installGuide: '/guides/install-postman',
            required: true,
          },
          {
            name: 'VS Code REST Client',
            purpose: 'Quick API testing in editor',
            required: false,
          },
        ],
      },
    }),
    prisma.quest.upsert({
      where: { slug: 'api-authentication' },
      update: {},
      create: {
        slug: 'api-authentication',
        name: 'API Authentication',
        description: 'Secure your API with JWT authentication.',
        treeId: backendTree.id,
        difficulty: Difficulty.JOURNEYMAN,
        estimatedHours: 6,
        deadlineDays: 7,
        xpReward: 300,
        order: 3,
        prerequisiteQuestIds: [],
        unlocksQuestIds: [],
        learningObjectives: [
          'Understand authentication vs authorization',
          'Implement JWT-based authentication',
          'Hash passwords securely',
          'Protect routes with middleware',
        ],
        assessmentType: AssessmentType.ARTIFACT,
        tasks: [
          {
            id: 'task-1',
            name: 'User Registration',
            description: 'Create signup endpoint with password hashing',
            order: 1,
            hints: ['Use bcrypt for password hashing', 'Never store plain text passwords'],
            verification: 'Users can register',
          },
          {
            id: 'task-2',
            name: 'User Login',
            description: 'Create login endpoint that returns JWT',
            order: 2,
            hints: ['Use jsonwebtoken package', 'Include user ID in token payload'],
            verification: 'Users can login and receive token',
          },
          {
            id: 'task-3',
            name: 'Protected Routes',
            description: 'Create auth middleware',
            order: 3,
            hints: ['Check Authorization header', 'Verify and decode token'],
            verification: 'Routes reject invalid tokens',
          },
          {
            id: 'task-4',
            name: 'Token Refresh',
            description: 'Implement token refresh flow',
            order: 4,
            hints: ['Use short-lived access tokens', 'Longer-lived refresh tokens'],
            verification: 'Tokens can be refreshed',
          },
        ],
        resources: [
          {
            type: ResourceType.DOCUMENT,
            name: 'JWT Authentication Guide',
            url: '/resources/docs/jwt-auth.pdf',
          },
          {
            type: ResourceType.VIDEO,
            name: 'Auth Security Best Practices',
            url: '/resources/videos/auth-security',
            duration: 18,
          },
        ],
        tools: [
          {
            name: 'Node.js',
            version: '>=18',
            required: true,
          },
          {
            name: 'bcrypt',
            purpose: 'Password hashing',
            required: true,
          },
          {
            name: 'jsonwebtoken',
            purpose: 'JWT handling',
            required: true,
          },
        ],
      },
    }),
  ])

  // Docker Quests
  const dockerQuests = await Promise.all([
    prisma.quest.upsert({
      where: { slug: 'why-containers' },
      update: {},
      create: {
        slug: 'why-containers',
        name: 'Why Containers?',
        description: 'Understand the problems Docker solves and when to use it.',
        treeId: dockerTree.id,
        difficulty: Difficulty.APPRENTICE,
        estimatedHours: 2,
        deadlineDays: 3,
        xpReward: 100,
        order: 1,
        prerequisiteQuestIds: [],
        unlocksQuestIds: [],
        learningObjectives: [
          'Explain the "it works on my machine" problem',
          'Compare containers vs virtual machines',
          'Understand when containers are the right solution',
        ],
        assessmentType: AssessmentType.QUIZ,
        tasks: [
          {
            id: 'task-1',
            name: 'The Problem',
            description: 'Understand dependency and environment issues',
            order: 1,
            hints: ['Think about different dev, staging, and production environments'],
            verification: 'Explain the problem containers solve',
          },
          {
            id: 'task-2',
            name: 'Containers vs VMs',
            description: 'Learn the key differences',
            order: 2,
            hints: ['Containers share the host OS kernel', 'VMs have their own OS'],
            verification: 'Complete comparison quiz',
          },
          {
            id: 'task-3',
            name: 'Use Cases',
            description: 'When to use containers',
            order: 3,
            hints: ['Microservices, CI/CD, local development'],
            verification: 'Identify appropriate use cases',
          },
        ],
        resources: [
          {
            type: ResourceType.VIDEO,
            name: 'Containers Explained',
            url: '/resources/videos/containers-explained',
            duration: 10,
          },
          {
            type: ResourceType.DOCUMENT,
            name: 'Container Concepts Guide',
            url: '/resources/docs/container-concepts.pdf',
          },
        ],
        tools: [],
      },
    }),
    prisma.quest.upsert({
      where: { slug: 'docker-basics' },
      update: {},
      create: {
        slug: 'docker-basics',
        name: 'Docker Basics',
        description: 'Run your first containers with Docker.',
        treeId: dockerTree.id,
        difficulty: Difficulty.JOURNEYMAN,
        estimatedHours: 4,
        deadlineDays: 5,
        xpReward: 200,
        order: 2,
        prerequisiteQuestIds: [],
        unlocksQuestIds: [],
        learningObjectives: [
          'Install and configure Docker',
          'Pull and run images',
          'Manage containers (start, stop, remove)',
          'Understand images vs containers',
        ],
        assessmentType: AssessmentType.ARTIFACT,
        tasks: [
          {
            id: 'task-1',
            name: 'Install Docker',
            description: 'Get Docker running on your machine',
            order: 1,
            hints: ['Docker Desktop for Windows/Mac', 'Docker Engine for Linux'],
            verification: 'docker --version works',
          },
          {
            id: 'task-2',
            name: 'Run Hello World',
            description: 'Run your first container',
            order: 2,
            hints: ['docker run hello-world'],
            verification: 'Successfully run hello-world',
          },
          {
            id: 'task-3',
            name: 'Container Management',
            description: 'List, stop, and remove containers',
            order: 3,
            hints: ['docker ps lists running containers', 'docker stop stops them'],
            verification: 'Manage 5 containers',
          },
          {
            id: 'task-4',
            name: 'Run Interactive Containers',
            description: 'Enter containers with shell access',
            order: 4,
            hints: ['docker run -it ubuntu bash'],
            verification: 'Run interactive container',
          },
        ],
        resources: [
          {
            type: ResourceType.CHEATSHEET,
            name: 'Docker Commands Cheat Sheet',
            url: '/resources/cheatsheets/docker-commands.pdf',
          },
          {
            type: ResourceType.DOCUMENT,
            name: 'Docker Installation Guide',
            url: '/resources/docs/docker-install.pdf',
          },
        ],
        tools: [
          {
            name: 'Docker',
            version: '>=20',
            purpose: 'Container runtime',
            installGuide: '/guides/install-docker',
            required: true,
          },
        ],
      },
    }),
    prisma.quest.upsert({
      where: { slug: 'dockerfile-mastery' },
      update: {},
      create: {
        slug: 'dockerfile-mastery',
        name: 'Dockerfile Mastery',
        description: 'Create custom images with Dockerfiles.',
        treeId: dockerTree.id,
        difficulty: Difficulty.JOURNEYMAN,
        estimatedHours: 5,
        deadlineDays: 7,
        xpReward: 250,
        order: 3,
        prerequisiteQuestIds: [],
        unlocksQuestIds: [],
        learningObjectives: [
          'Write Dockerfiles from scratch',
          'Understand layers and caching',
          'Optimize image size',
          'Follow best practices',
        ],
        assessmentType: AssessmentType.ARTIFACT,
        tasks: [
          {
            id: 'task-1',
            name: 'Basic Dockerfile',
            description: 'Create a simple Dockerfile',
            order: 1,
            hints: ['Start with FROM', 'Use COPY to add files', 'CMD runs the app'],
            verification: 'Build an image from Dockerfile',
          },
          {
            id: 'task-2',
            name: 'Multi-stage Builds',
            description: 'Optimize with multi-stage builds',
            order: 2,
            hints: ['Use multiple FROM statements', 'Copy only what you need'],
            verification: 'Create multi-stage Dockerfile',
          },
          {
            id: 'task-3',
            name: 'Best Practices',
            description: 'Apply Dockerfile best practices',
            order: 3,
            hints: ['Use specific base image tags', 'Minimize layers', 'Don\'t run as root'],
            verification: 'Dockerfile passes linting',
          },
          {
            id: 'task-4',
            name: 'Containerize Your App',
            description: 'Dockerize a real application',
            order: 4,
            hints: ['Start with your REST API from earlier'],
            verification: 'Working containerized app',
          },
        ],
        resources: [
          {
            type: ResourceType.DOCUMENT,
            name: 'Dockerfile Reference',
            url: '/resources/docs/dockerfile-reference.pdf',
          },
          {
            type: ResourceType.CHEATSHEET,
            name: 'Dockerfile Best Practices',
            url: '/resources/cheatsheets/dockerfile-best-practices.pdf',
          },
        ],
        tools: [
          {
            name: 'Docker',
            version: '>=20',
            required: true,
          },
        ],
      },
    }),
    prisma.quest.upsert({
      where: { slug: 'docker-compose' },
      update: {},
      create: {
        slug: 'docker-compose',
        name: 'Docker Compose',
        description: 'Orchestrate multi-container applications.',
        treeId: dockerTree.id,
        difficulty: Difficulty.JOURNEYMAN,
        estimatedHours: 4,
        deadlineDays: 5,
        xpReward: 200,
        badgeId: badges.find(b => b.slug === 'docker-captain')?.id,
        order: 4,
        prerequisiteQuestIds: [],
        unlocksQuestIds: [],
        learningObjectives: [
          'Write docker-compose.yml files',
          'Connect multiple services',
          'Manage volumes and networks',
          'Use environment variables',
        ],
        assessmentType: AssessmentType.ARTIFACT,
        tasks: [
          {
            id: 'task-1',
            name: 'Compose Basics',
            description: 'Write your first compose file',
            order: 1,
            hints: ['Define services in YAML', 'Use docker-compose up'],
            verification: 'Run multi-container app',
          },
          {
            id: 'task-2',
            name: 'Service Networking',
            description: 'Connect containers together',
            order: 2,
            hints: ['Services can reach each other by name'],
            verification: 'App + Database connected',
          },
          {
            id: 'task-3',
            name: 'Volumes',
            description: 'Persist data with volumes',
            order: 3,
            hints: ['Named volumes persist data', 'Bind mounts for development'],
            verification: 'Data persists after restart',
          },
          {
            id: 'task-4',
            name: 'Complete Stack',
            description: 'Run a full application stack',
            order: 4,
            hints: ['Frontend + Backend + Database'],
            verification: 'Full stack running locally',
          },
        ],
        resources: [
          {
            type: ResourceType.DOCUMENT,
            name: 'Docker Compose Guide',
            url: '/resources/docs/docker-compose-guide.pdf',
          },
          {
            type: ResourceType.STARTER_CODE,
            name: 'Compose Examples',
            url: 'https://github.com/questboard/compose-examples',
          },
        ],
        tools: [
          {
            name: 'Docker',
            version: '>=20',
            required: true,
          },
          {
            name: 'Docker Compose',
            version: '>=2',
            required: true,
          },
        ],
      },
    }),
  ])

  // Update quest prerequisites now that we have IDs
  // Git unlocks CI/CD quests, etc.
  
  console.log(`Created ${foundationsQuests.length + toolsQuests.length + backendQuests.length + dockerQuests.length} quests`)

  console.log('✅ Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
