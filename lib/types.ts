// Database types for ToeVol

export interface Vocabulary {
  id: string;
  word_en: string;
  meaning_vi: string;
  part_of_speech: string | null;
  image_url: string | null;
  example_en: string | null;
  example_vi: string | null;
  created_at: string;
  updated_at: string;
}

export interface VocabularyWithSynonyms extends Vocabulary {
  synonyms: Synonym[];
}

export interface Synonym {
  id: string;
  vocabulary_id: string;
  synonym_word: string;
  created_at: string;
}

export interface ReviewSession {
  id: string;
  total_questions: number;
  correct_answers: number;
  completed_at: string | null;
  created_at: string;
}

export interface ReviewQuestion {
  id: string;
  review_session_id: string;
  vocabulary_id: string;
  user_answer_word: string | null;
  user_answer_synonyms: string | null;
  is_correct: boolean | null;
  answered_at: string | null;
  created_at: string;
}

export interface ReviewQuestionWithVocabulary extends ReviewQuestion {
  vocabulary: VocabularyWithSynonyms;
}

// API Request/Response types
export interface CreateVocabularyRequest {
  word_en: string;
  meaning_vi: string;
  part_of_speech?: string;
  image_url?: string;
  example_en?: string;
  example_vi?: string;
  synonyms?: string[];
}

export interface UpdateVocabularyRequest {
  word_en?: string;
  meaning_vi?: string;
  part_of_speech?: string;
  image_url?: string;
  example_en?: string;
  example_vi?: string;
  synonyms?: string[];
}

export interface CreateReviewSessionRequest {
  number_of_questions: number;
}

export interface CreateReviewSessionResponse {
  session_id: string;
  total_questions: number;
  questions: ReviewQuestionDetail[];
}

export interface ReviewQuestionDetail {
  question_id: string;
  vocabulary_id: string;
  meaning_vi: string;
  part_of_speech: string | null;
  example_en: string | null;
  example_vi: string | null;
  image_url: string | null;
}

export interface CheckAnswerRequest {
  question_id: string;
  user_word: string;
  user_synonyms: string; // comma-separated
}

export interface CheckAnswerResponse {
  is_correct: boolean;
  correct_word: string;
  user_word: string;
  correct_synonyms: string[];
  user_synonyms: string[];
  missing_synonyms: string[];
  extra_synonyms: string[];
  word_correct: boolean;
  synonyms_correct: boolean;
}

export interface ReviewSessionResult {
  session_id: string;
  total_questions: number;
  correct_answers: number;
  score_percentage: number;
  questions: ReviewQuestionResult[];
}

export interface ReviewQuestionResult {
  question_id: string;
  vocabulary: {
    word_en: string;
    meaning_vi: string;
    synonyms: string[];
  };
  user_answer: {
    word: string | null;
    synonyms: string[];
  };
  is_correct: boolean | null;
}

// API Error response
export interface ApiError {
  error: string;
  details?: string;
}

// Search params
export interface VocabularySearchParams {
  word_en?: string;
  meaning_vi?: string;
  page?: number;
  limit?: number;
}
