-- ToeVol Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Table: vocabularies
-- Stores all vocabulary items
-- ============================================
CREATE TABLE IF NOT EXISTS vocabularies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    word_en TEXT UNIQUE NOT NULL,
    meaning_vi TEXT NOT NULL,
    part_of_speech TEXT,
    image_url TEXT,
    example_en TEXT,
    example_vi TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster search
CREATE INDEX IF NOT EXISTS idx_vocabularies_word_en ON vocabularies(word_en);
CREATE INDEX IF NOT EXISTS idx_vocabularies_meaning_vi ON vocabularies(meaning_vi);

-- ============================================
-- Table: synonyms
-- Stores synonyms for vocabulary
-- ============================================
CREATE TABLE IF NOT EXISTS synonyms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vocabulary_id UUID NOT NULL REFERENCES vocabularies(id) ON DELETE CASCADE,
    synonym_word TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookup
CREATE INDEX IF NOT EXISTS idx_synonyms_vocabulary_id ON synonyms(vocabulary_id);

-- ============================================
-- Table: review_sessions
-- Stores review sessions created by user
-- ============================================
CREATE TABLE IF NOT EXISTS review_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Table: review_questions
-- Stores each question in a review session
-- ============================================
CREATE TABLE IF NOT EXISTS review_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_session_id UUID NOT NULL REFERENCES review_sessions(id) ON DELETE CASCADE,
    vocabulary_id UUID NOT NULL REFERENCES vocabularies(id) ON DELETE CASCADE,
    user_answer_word TEXT,
    user_answer_synonyms TEXT,
    is_correct BOOLEAN,
    answered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookup
CREATE INDEX IF NOT EXISTS idx_review_questions_session_id ON review_questions(review_session_id);

-- ============================================
-- Function: Update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for vocabularies table
DROP TRIGGER IF EXISTS update_vocabularies_updated_at ON vocabularies;
CREATE TRIGGER update_vocabularies_updated_at
    BEFORE UPDATE ON vocabularies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Row Level Security (RLS) Policies
-- For now, allow all operations (anonymous access)
-- ============================================
ALTER TABLE vocabularies ENABLE ROW LEVEL SECURITY;
ALTER TABLE synonyms ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_questions ENABLE ROW LEVEL SECURITY;

-- Public read/write access for now (can be restricted later with auth)
CREATE POLICY "Allow all access to vocabularies" ON vocabularies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to synonyms" ON synonyms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to review_sessions" ON review_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to review_questions" ON review_questions FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- Sample Data (Optional - for testing)
-- ============================================
INSERT INTO vocabularies (word_en, meaning_vi, part_of_speech, example_en, example_vi) VALUES
    ('happy', 'vui vẻ, hạnh phúc', 'adjective', 'I am very happy today.', 'Tôi rất vui vẻ hôm nay.'),
    ('beautiful', 'đẹp, xinh đẹp', 'adjective', 'She is a beautiful woman.', 'Cô ấy là một người phụ nữ xinh đẹp.'),
    ('run', 'chạy', 'verb', 'I run every morning.', 'Tôi chạy bộ mỗi sáng.'),
    ('book', 'sách, quyển sách', 'noun', 'I love reading books.', 'Tôi thích đọc sách.'),
    ('quickly', 'nhanh chóng', 'adverb', 'She finished the work quickly.', 'Cô ấy hoàn thành công việc nhanh chóng.')
ON CONFLICT (word_en) DO NOTHING;

-- Insert synonyms for sample data
INSERT INTO synonyms (vocabulary_id, synonym_word) 
SELECT v.id, s.synonym_word
FROM vocabularies v
CROSS JOIN (VALUES 
    ('happy', 'joyful'),
    ('happy', 'cheerful'),
    ('happy', 'delighted'),
    ('beautiful', 'gorgeous'),
    ('beautiful', 'stunning'),
    ('beautiful', 'pretty'),
    ('run', 'sprint'),
    ('run', 'jog'),
    ('run', 'dash'),
    ('book', 'volume'),
    ('book', 'publication'),
    ('quickly', 'rapidly'),
    ('quickly', 'swiftly'),
    ('quickly', 'fast')
) AS s(word_en, synonym_word)
WHERE v.word_en = s.word_en
ON CONFLICT DO NOTHING;
