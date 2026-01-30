import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { CheckAnswerRequest, CheckAnswerResponse } from "@/lib/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Normalize string for comparison
function normalizeString(str: string): string {
  return str.trim().toLowerCase();
}

// Parse comma-separated synonyms
function parseSynonyms(synonymsStr: string): string[] {
  if (!synonymsStr || !synonymsStr.trim()) {
    return [];
  }
  return synonymsStr
    .split(",")
    .map((s) => normalizeString(s))
    .filter(Boolean);
}

// Compare arrays ignoring order
function compareArrays(
  arr1: string[],
  arr2: string[],
): {
  missing: string[];
  extra: string[];
  allCorrect: boolean;
} {
  const set1 = new Set(arr1.map(normalizeString));
  const set2 = new Set(arr2.map(normalizeString));

  const missing = arr1.filter((item) => !set2.has(normalizeString(item)));
  const extra = arr2.filter((item) => !set1.has(normalizeString(item)));

  return {
    missing,
    extra,
    allCorrect: missing.length === 0 && extra.length === 0,
  };
}

// POST /api/reviews/:id/check - Check answer for a question
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: sessionId } = await params;
    const body: CheckAnswerRequest = await request.json();

    const { question_id, user_word, user_synonyms } = body;

    // Validate input
    if (!question_id) {
      return NextResponse.json(
        { error: "question_id is required" },
        { status: 400 },
      );
    }

    // Fetch the question with vocabulary and synonyms
    const { data: question, error: questionError } = await supabase
      .from("review_questions")
      .select(
        `
        *,
        vocabularies (
          id,
          word_en,
          meaning_vi,
          synonyms (synonym_word)
        )
      `,
      )
      .eq("id", question_id)
      .eq("review_session_id", sessionId)
      .single();

    if (questionError) {
      if (questionError.code === "PGRST116") {
        return NextResponse.json(
          { error: "Question not found in this session" },
          { status: 404 },
        );
      }
      return NextResponse.json(
        { error: "Failed to fetch question", details: questionError.message },
        { status: 500 },
      );
    }

    const vocab = question.vocabularies as {
      id: string;
      word_en: string;
      meaning_vi: string;
      synonyms: { synonym_word: string }[];
    };

    // Get correct answers
    const correctWord = vocab.word_en;
    const correctSynonyms = vocab.synonyms.map((s) => s.synonym_word);

    // Parse user answers
    const userWordNormalized = normalizeString(user_word || "");
    const userSynonymsParsed = parseSynonyms(user_synonyms || "");

    // Check word correctness
    const wordCorrect = userWordNormalized === normalizeString(correctWord);

    // Check synonyms correctness
    const synonymComparison = compareArrays(
      correctSynonyms,
      userSynonymsParsed,
    );

    // Overall correctness: word must be correct, and no missing synonyms
    // (extra synonyms are acceptable - user might know more synonyms)
    const isCorrect = wordCorrect && synonymComparison.missing.length === 0;

    // Update the question record
    const { error: updateError } = await supabase
      .from("review_questions")
      .update({
        user_answer_word: user_word?.trim() || null,
        user_answer_synonyms: user_synonyms?.trim() || null,
        is_correct: isCorrect,
        answered_at: new Date().toISOString(),
      })
      .eq("id", question_id);

    if (updateError) {
      console.error("Failed to update question:", updateError);
    }

    // Update session correct_answers count if this is correct
    if (isCorrect) {
      // Get current correct count and increment
      const { data: session } = await supabase
        .from("review_sessions")
        .select("correct_answers")
        .eq("id", sessionId)
        .single();

      if (session) {
        await supabase
          .from("review_sessions")
          .update({ correct_answers: (session.correct_answers || 0) + 1 })
          .eq("id", sessionId);
      }
    }

    // Build response
    const response: CheckAnswerResponse = {
      is_correct: isCorrect,
      correct_word: correctWord,
      user_word: user_word || "",
      correct_synonyms: correctSynonyms,
      user_synonyms: userSynonymsParsed,
      missing_synonyms: synonymComparison.missing,
      extra_synonyms: synonymComparison.extra,
      word_correct: wordCorrect,
      synonyms_correct: synonymComparison.missing.length === 0,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 },
    );
  }
}
