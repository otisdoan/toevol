# ToeVol – Full Product & System Specification Prompt

## Role
You are a senior full-stack engineer and system architect.
Design and reason about the complete product **ToeVol**, including backend architecture, database design, and API contracts.

UI is already implemented and MUST NOT be regenerated.
Focus on system logic, database schema, API design, and data flow.

---

## Product Overview

**Product name:** ToeVol  
**Product type:** English vocabulary learning web application  

### Core Goals
- Help users learn and review English vocabulary effectively
- Simple, focused learning experience
- Randomized vocabulary review
- Support synonym-based learning

---

## Core Features

### 1. Vocabulary Management
- Store English vocabulary with:
  - English word
  - Vietnamese meaning
  - Example sentences
  - Synonyms
  - Image (URL)
  - Part of speech
- Search vocabulary by:
  - English word
  - Vietnamese meaning

---

### 2. Vocabulary Review
- Users create review sessions by selecting:
  - Number of questions
- Questions are:
  - Randomly selected from vocabulary source
- Review format:
  - Given Vietnamese meaning
  - User types:
    - English word
    - Synonyms (comma-separated)
- System checks:
  - Correct English word
  - Missing or incorrect synonyms
- Feedback includes:
  - Correct answer
  - Missing synonyms

---

## Technology Stack

### Frontend
- Next.js (App Router)
- UI already implemented
- HTML files located in:
  `/html-stich`
- Frontend consumes REST APIs

---

### Backend
- Supabase
- PostgreSQL
- Supabase Auth (optional, can be anonymous for now)
- Supabase Storage (for vocabulary images)

---

## Database Design (PostgreSQL / Supabase)

### Table: vocabularies
Stores all vocabulary items.

Fields:
- id (uuid, primary key)
- word_en (text, unique, not null)
- meaning_vi (text, not null)
- part_of_speech (text)
- image_url (text)
- example_en (text)
- example_vi (text)
- created_at (timestamp)
- updated_at (timestamp)

---

### Table: synonyms
Stores synonyms for vocabulary.

Fields:
- id (uuid, primary key)
- vocabulary_id (uuid, foreign key → vocabularies.id)
- synonym_word (text)
- created_at (timestamp)

---

### Table: review_sessions
Stores review sessions created by user.

Fields:
- id (uuid, primary key)
- total_questions (integer)
- created_at (timestamp)

---

### Table: review_questions
Stores each question in a review session.

Fields:
- id (uuid, primary key)
- review_session_id (uuid, foreign key → review_sessions.id)
- vocabulary_id (uuid, foreign key → vocabularies.id)
- user_answer_word (text)
- user_answer_synonyms (text)
- is_correct (boolean)
- created_at (timestamp)

---

## API Design (REST)

### Vocabulary APIs
- GET /api/vocabularies
  - Search by `word_en` or `meaning_vi`
- GET /api/vocabularies/:id
  - Get full vocabulary detail
- POST /api/vocabularies (admin/internal)
- PUT /api/vocabularies/:id
- DELETE /api/vocabularies/:id

---

### Review APIs
- POST /api/reviews
  - Input: number_of_questions
  - Output: review_session_id + list of questions
- GET /api/reviews/:id
- POST /api/reviews/:id/check
  - Input:
    - user English word
    - user synonyms
  - Output:
    - correct word
    - missing synonyms
    - correctness result

---

## Review Logic Rules

- Randomly select vocabulary records
- No duplicate vocabulary in a single session
- English word comparison:
  - Case-insensitive
  - Trim whitespace
- Synonym comparison:
  - Ignore order
  - Trim whitespace
  - Case-insensitive

---

## Data Flow

1. UI requests vocabulary list
2. Backend queries vocabularies + synonyms
3. UI displays vocabulary cards
4. User creates review session
5. Backend randomizes vocabulary
6. UI submits answers
7. Backend validates and returns feedback

---

## Constraints
- Do NOT regenerate UI
- Use existing HTML from `/html-stich`
- Focus on backend, DB, API, and logic
- Keep system simple and scalable

---

## Expected Output
- Clear database schema
- Clean API contracts
- Scalable backend logic
- Production-ready architecture
