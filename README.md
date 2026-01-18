# QuestBoard - Quest-Based Learning System for CS Beginners

A comprehensive gamified learning platform that transforms computer science education into an epic adventure. Built with Next.js, React, MongoDB, and modern web technologies.

## 🎯 Features

### Core Learning System
- **Quest-Based Learning**: Complete quests organized into skill trees to learn programming
- **Multi-Task Quests**: Each quest contains reading, coding, and quiz tasks
- **Prerequisite System**: Quests unlock based on completed dependencies
- **5 Role Paths**: Frontend, Backend, DevOps, Full-Stack, and Data Engineering

### Gamification
- **XP & Leveling**: Earn experience points with dynamic bonuses
- **Streak System**: Maintain daily learning streaks for bonus XP (up to 50% bonus)
- **Achievement Badges**: 50+ badges across 8 categories (Common to Legendary rarity)
- **Leaderboards**: Compete globally, weekly, and daily

### User Experience
- **Personalized Dashboard**: Track progress, active quests, and recent achievements
- **Quest Trees Visualization**: Navigate interconnected skill paths
- **Real-time Notifications**: Quest completions, badge unlocks, streak alerts
- **Dark/Light Theme**: Full theme support with system preference detection

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | Next.js 14, React 18, Tailwind CSS |
| Backend | Next.js API Routes, NextAuth.js |
| Database | MongoDB with Prisma ORM |
| State | Zustand with persistence |
| Validation | Zod schemas |
| Auth | NextAuth.js (Credentials + OAuth) |
| UI | Custom component library |

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or later
- MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/quest-board.git
   cd quest-board
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your settings:
   ```env
   # Database
   DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/questboard"
   
   # NextAuth
   NEXTAUTH_SECRET="your-super-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   
   # OAuth (optional)
   GITHUB_ID="your-github-oauth-id"
   GITHUB_SECRET="your-github-oauth-secret"
   GOOGLE_CLIENT_ID="your-google-oauth-id"
   GOOGLE_CLIENT_SECRET="your-google-oauth-secret"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Push schema to MongoDB
   npx prisma db push
   
   # Seed with sample data
   npx prisma db seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
quest-board/
├── prisma/
│   ├── schema.prisma          # MongoDB data models
│   └── seed.ts                # Sample data seeder
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── badges/        # Badge endpoints
│   │   │   ├── leaderboard/   # Leaderboard endpoints
│   │   │   ├── notifications/ # Notification endpoints
│   │   │   ├── quests/        # Quest CRUD & actions
│   │   │   ├── trees/         # Quest tree endpoints
│   │   │   └── user/          # User profile & stats
│   │   ├── auth/              # Auth pages (signin/signup)
│   │   ├── dashboard/         # Main dashboard
│   │   ├── quests/            # Quest browser & detail
│   │   ├── trees/             # Quest tree browser
│   │   ├── badges/            # Badge collection
│   │   ├── leaderboard/       # Rankings
│   │   ├── profile/           # User profile
│   │   ├── settings/          # User settings
│   │   ├── notifications/     # Notification center
│   │   ├── onboarding/        # New user onboarding
│   │   └── active/            # Active quests
│   ├── components/
│   │   ├── ui/                # Reusable UI primitives
│   │   ├── layout/            # Layout components
│   │   ├── quest/             # Quest-specific components
│   │   └── dashboard/         # Dashboard widgets
│   └── lib/
│       ├── prisma.ts          # Prisma client singleton
│       ├── store.ts           # Zustand state stores
│       ├── utils.ts           # Utility functions
│       ├── types.ts           # TypeScript type definitions
│       └── validations.ts     # Zod validation schemas
└── public/                    # Static assets
```

## 🗄️ Database Models

### Core Models
- **User** - User accounts with XP, level, streaks, preferences
- **QuestTree** - Skill tree categories (Foundations, React, etc.)
- **Quest** - Individual learning challenges with tasks
- **UserQuestProgress** - Track quest status and task completion

### Gamification Models
- **Badge** - Achievement definitions (50+ badges)
- **UserBadge** - Earned badges with timestamps
- **XPTransaction** - XP earning history
- **LeaderboardEntry** - Cached ranking data

### Support Models
- **Notification** - User notifications
- **Artifact** - Submitted quest solutions
- **Account/Session** - NextAuth.js models

## 📡 API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/[...nextauth]` | NextAuth.js handlers |

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user` | Get current user profile |
| PATCH | `/api/user` | Update user profile |
| GET | `/api/user/stats` | Get dashboard statistics |

### Quests
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/quests` | List quests (with filters) |
| GET | `/api/quests/[id]` | Get quest details |
| POST | `/api/quests/accept` | Accept a quest |
| POST | `/api/quests/task/complete` | Complete a task |
| POST | `/api/quests/submit` | Submit completed quest |

### Quest Trees
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trees` | List all quest trees |
| GET | `/api/trees/[slug]` | Get tree with quests |

### Other
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/badges` | List all badges |
| GET | `/api/leaderboard` | Get rankings |
| GET/PATCH | `/api/notifications` | Manage notifications |

## 🎮 XP System

### Base XP by Difficulty
| Difficulty | Base XP |
|------------|---------|
| Tutorial | 50 XP |
| Easy | 100 XP |
| Medium | 200 XP |
| Hard | 400 XP |
| Expert | 700 XP |
| Legendary | 1000 XP |

### Bonuses
- **Streak Bonus**: Up to 50% (1% per day, max 50 days)
- **Early Completion**: 20% bonus for finishing 20%+ early
- **First Completion**: 10% bonus for first-time completers

### Leveling Formula
```
Required XP = 100 × level^1.5
```

## 🧪 Development

```bash
# Development server with hot reload
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Production build
npm run build

# Start production server
npm start

# Database management
npx prisma studio    # GUI for database
npx prisma db push   # Sync schema
npx prisma generate  # Regenerate client
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Design inspired by gamified learning platforms
- Icons from [Lucide](https://lucide.dev/)
- UI components built with [Tailwind CSS](https://tailwindcss.com/)