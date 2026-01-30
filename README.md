# ToeVol - English Vocabulary Learning App

An English vocabulary learning web application built with Next.js and Supabase.

## Features

- 📚 **Vocabulary Management**: Store and manage English vocabulary with Vietnamese meanings, examples, and synonyms
- 🔍 **Search**: Search vocabularies by English word or Vietnamese meaning
- 📝 **Review Sessions**: Create randomized review sessions to test your knowledge
- ✅ **Answer Checking**: Smart answer validation with synonym support

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TailwindCSS 4
- **Backend**: Supabase (PostgreSQL)
- **Language**: TypeScript

## Getting Started

### 1. Prerequisites

- Node.js 18+
- Supabase account (free tier works)

### 2. Setup Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase/schema.sql`
3. Copy your project URL and API keys from Settings > API

### 3. Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## API Reference

### Vocabulary APIs

| Method | Endpoint                | Description              |
| ------ | ----------------------- | ------------------------ |
| GET    | `/api/vocabularies`     | List/search vocabularies |
| GET    | `/api/vocabularies/:id` | Get vocabulary detail    |
| POST   | `/api/vocabularies`     | Create vocabulary        |
| PUT    | `/api/vocabularies/:id` | Update vocabulary        |
| DELETE | `/api/vocabularies/:id` | Delete vocabulary        |

**Query Parameters for GET /api/vocabularies:**

- `word_en` - Search by English word (partial match)
- `meaning_vi` - Search by Vietnamese meaning (partial match)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

### Review APIs

| Method | Endpoint                 | Description           |
| ------ | ------------------------ | --------------------- |
| GET    | `/api/reviews`           | List review sessions  |
| POST   | `/api/reviews`           | Create review session |
| GET    | `/api/reviews/:id`       | Get session results   |
| POST   | `/api/reviews/:id/check` | Check answer          |

**Create Review Session (POST /api/reviews):**

```json
{
  "number_of_questions": 10
}
```

**Check Answer (POST /api/reviews/:id/check):**

```json
{
  "question_id": "uuid",
  "user_word": "happy",
  "user_synonyms": "joyful, cheerful"
}
```

## Database Schema

- **vocabularies** - English words with Vietnamese meanings
- **synonyms** - Synonyms for each vocabulary
- **review_sessions** - Review session records
- **review_questions** - Individual questions in each session

See `supabase/schema.sql` for full schema.

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── vocabularies/      # Vocabulary CRUD APIs
│   │   └── reviews/           # Review session APIs
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── supabase.ts           # Supabase client
│   ├── types.ts              # TypeScript types
│   └── review-utils.ts       # Review helper functions
├── html-stich/               # UI HTML templates
├── supabase/
│   └── schema.sql            # Database schema
└── .env.example              # Environment template
```

## License

MIT
