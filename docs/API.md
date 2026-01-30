# ToeVol API Documentation

Base URL: `http://localhost:3000/api`

## Vocabulary APIs

### List/Search Vocabularies

```http
GET /api/vocabularies
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| word_en | string | Search by English word (partial, case-insensitive) |
| meaning_vi | string | Search by Vietnamese meaning (partial, case-insensitive) |
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 20) |

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "word_en": "happy",
      "meaning_vi": "vui vẻ, hạnh phúc",
      "part_of_speech": "adjective",
      "image_url": null,
      "example_en": "I am very happy today.",
      "example_vi": "Tôi rất vui vẻ hôm nay.",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "synonyms": [
        { "id": "uuid", "vocabulary_id": "uuid", "synonym_word": "joyful" },
        { "id": "uuid", "vocabulary_id": "uuid", "synonym_word": "cheerful" }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

---

### Get Vocabulary Detail

```http
GET /api/vocabularies/:id
```

**Response:**

```json
{
  "id": "uuid",
  "word_en": "happy",
  "meaning_vi": "vui vẻ, hạnh phúc",
  "part_of_speech": "adjective",
  "image_url": null,
  "example_en": "I am very happy today.",
  "example_vi": "Tôi rất vui vẻ hôm nay.",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z",
  "synonyms": [
    { "id": "uuid", "vocabulary_id": "uuid", "synonym_word": "joyful" }
  ]
}
```

---

### Create Vocabulary

```http
POST /api/vocabularies
```

**Request Body:**

```json
{
  "word_en": "happy",
  "meaning_vi": "vui vẻ, hạnh phúc",
  "part_of_speech": "adjective",
  "image_url": "https://example.com/happy.jpg",
  "example_en": "I am very happy today.",
  "example_vi": "Tôi rất vui vẻ hôm nay.",
  "synonyms": ["joyful", "cheerful", "delighted"]
}
```

**Required Fields:** `word_en`, `meaning_vi`

**Response:** `201 Created`

```json
{
  "id": "uuid",
  "word_en": "happy",
  "meaning_vi": "vui vẻ, hạnh phúc",
  ...
}
```

---

### Update Vocabulary

```http
PUT /api/vocabularies/:id
```

**Request Body:** (all fields optional)

```json
{
  "word_en": "happy",
  "meaning_vi": "vui vẻ, hạnh phúc",
  "part_of_speech": "adjective",
  "synonyms": ["joyful", "cheerful"]
}
```

**Response:** Updated vocabulary object

---

### Delete Vocabulary

```http
DELETE /api/vocabularies/:id
```

**Response:**

```json
{
  "message": "Vocabulary deleted successfully"
}
```

---

## Review APIs

### Create Review Session

```http
POST /api/reviews
```

**Request Body:**

```json
{
  "number_of_questions": 10
}
```

**Response:** `201 Created`

```json
{
  "session_id": "uuid",
  "total_questions": 10,
  "questions": [
    {
      "question_id": "uuid",
      "vocabulary_id": "uuid",
      "meaning_vi": "vui vẻ, hạnh phúc",
      "part_of_speech": "adjective",
      "example_en": "I am very happy today.",
      "example_vi": "Tôi rất vui vẻ hôm nay.",
      "image_url": null
    }
  ]
}
```

---

### Get Review Session Results

```http
GET /api/reviews/:id
```

**Response:**

```json
{
  "session_id": "uuid",
  "total_questions": 10,
  "correct_answers": 7,
  "score_percentage": 70,
  "questions": [
    {
      "question_id": "uuid",
      "vocabulary": {
        "word_en": "happy",
        "meaning_vi": "vui vẻ, hạnh phúc",
        "synonyms": ["joyful", "cheerful"]
      },
      "user_answer": {
        "word": "happy",
        "synonyms": ["joyful"]
      },
      "is_correct": true
    }
  ]
}
```

---

### Check Answer

```http
POST /api/reviews/:id/check
```

**Request Body:**

```json
{
  "question_id": "uuid",
  "user_word": "happy",
  "user_synonyms": "joyful, cheerful"
}
```

**Response:**

```json
{
  "is_correct": true,
  "correct_word": "happy",
  "user_word": "happy",
  "correct_synonyms": ["joyful", "cheerful", "delighted"],
  "user_synonyms": ["joyful", "cheerful"],
  "missing_synonyms": ["delighted"],
  "extra_synonyms": [],
  "word_correct": true,
  "synonyms_correct": false
}
```

**Note:**

- `is_correct` = true if word is correct AND no missing synonyms
- Comparison is case-insensitive and ignores whitespace
- Synonym order doesn't matter

---

## Error Responses

All endpoints may return error responses:

```json
{
  "error": "Error message",
  "details": "Additional details (optional)"
}
```

**HTTP Status Codes:**

- `400` - Bad Request (invalid input)
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `500` - Internal Server Error
