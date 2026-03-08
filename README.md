# 🚀 Young Inventors Lab

An interactive AI learning platform that teaches children creativity, invention thinking, and entrepreneurship through a 52-week guided curriculum.

## 👥 For Whom

- **Mesha** (Age 10) - Builder-Inventor Track: Learn to build digital products and think like an inventor
- **Musiche** (Age 8) - Creative Inventor Track: Develop creativity and invention thinking through play

## ✨ Features

- 📚 **52-Week Curriculum** - Complete learning paths for both age groups
- 🤖 **AI Mentor System** - 5 distinct AI personalities for guidance
- 📓 **Invention Journal** - Document and track invention ideas
- 🏆 **Badge & Achievement System** - Gamified learning experience
- 📊 **Parent Dashboard** - Progress tracking and reporting
- 👨‍👩‍👧‍👦 **Family Collaboration** - Joint projects and innovation nights
- 📜 **IP Education** - Learn patents, copyrights, and trademarks

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Database**: PostgreSQL (via Prisma ORM)
- **AI**: z-ai-web-dev-sdk for LLM capabilities
- **State**: Zustand + TanStack Query
- **Deployment**: Vercel

## 🚀 Deploy to Vercel

### Prerequisites

1. A [Vercel account](https://vercel.com)
2. A PostgreSQL database (recommended: [Neon](https://neon.tech), [Supabase](https://supabase.com), or [PlanetScale](https://planetscale.com))
3. A z-ai API key for AI mentor functionality

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tulwegroup/young-inventors-lab)

### Manual Deployment Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/tulwegroup/young-inventors-lab.git
   cd young-inventors-lab
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Create a PostgreSQL database**
   - Go to [Neon](https://neon.tech) and create a free account
   - Create a new project and get your connection strings
   - You'll need both the pooled connection (DATABASE_URL) and direct connection (DIRECT_DATABASE_URL)

4. **Set up environment variables on Vercel**
   
   Go to your Vercel project settings → Environment Variables and add:
   
   | Variable | Description |
   |----------|-------------|
   | `DATABASE_URL` | PostgreSQL connection string (pooled) |
   | `DIRECT_DATABASE_URL` | PostgreSQL connection string (direct) |
   | `ZAI_API_KEY` | Your z-ai API key |
   | `NEXTAUTH_SECRET` | Random string for session encryption |
   | `NEXTAUTH_URL` | Your Vercel deployment URL |

5. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

6. **Seed the database**
   
   After deployment, run the seed script to populate the curriculum:
   ```bash
   bun run db:seed
   ```
   
   Or use the Vercel CLI:
   ```bash
   vercel env pull .env.local
   bun run db:seed
   ```

## 🔧 Local Development

1. **Clone and install**
   ```bash
   git clone https://github.com/tulwegroup/young-inventors-lab.git
   cd young-inventors-lab
   bun install
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your actual values:
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/young_inventors_lab?pgbouncer=true&connect_timeout=15"
   DIRECT_DATABASE_URL="postgresql://user:password@host:5432/young_inventors_lab"
   ZAI_API_KEY="your-api-key"
   NEXTAUTH_SECRET="your-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. **Initialize database**
   ```bash
   bun run db:push
   bun run db:seed
   ```

4. **Start development server**
   ```bash
   bun run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Curriculum data
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   │   ├── inventors/ # Child profiles
│   │   │   ├── mentor/    # AI mentor
│   │   │   ├── missions/  # Weekly missions
│   │   │   ├── inventions/# Invention journal
│   │   │   ├── reports/   # Parent reports
│   │   │   └── family/    # Family projects
│   │   ├── page.tsx       # Main application
│   │   ├── layout.tsx     # Root layout
│   │   └── globals.css    # Global styles
│   ├── components/ui/     # shadcn/ui components
│   ├── lib/               # Utilities and database
│   └── hooks/             # Custom hooks
├── vercel.json            # Vercel configuration
└── package.json
```

## 🎓 Curriculum Overview

### Builder-Inventor Track (Age 10)

| Phase | Weeks | Focus |
|-------|-------|-------|
| 1 | 1-8 | Creator Foundations |
| 2 | 9-16 | Product Thinking |
| 3 | 17-26 | Inventor Thinking |
| 4 | 27-39 | Mini Startup Projects |
| 5 | 40-52 | Product Launch |

### Creative Inventor Track (Age 8)

| Phase | Weeks | Focus |
|-------|-------|-------|
| 1 | 1-8 | AI Creativity Lab |
| 2 | 9-16 | Inventor Play |
| 3 | 17-26 | Story Worlds |
| 4 | 27-39 | Product Imagination |
| 5 | 40-52 | Creator Showcase |

## 🤖 AI Mentor Personalities

1. **Inventor Guide** - General guidance and encouragement
2. **Inventor Coach** - Help develop invention ideas
3. **Entrepreneur Coach** - Business thinking for kids
4. **IP Guide** - Patents, copyright, trademarks explained simply
5. **Collaboration Coach** - Teamwork and sibling collaboration

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL pooled connection |
| `DIRECT_DATABASE_URL` | ✅ | PostgreSQL direct connection |
| `ZAI_API_KEY` | ✅ | API key for AI mentor |
| `NEXTAUTH_SECRET` | ✅ | Session encryption secret |
| `NEXTAUTH_URL` | ✅ | App URL (auto-set on Vercel) |

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

---

Built with ❤️ for young inventors everywhere.
