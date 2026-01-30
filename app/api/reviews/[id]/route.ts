import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { ReviewSessionResult, ReviewQuestionResult } from "@/lib/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/reviews/:id - Get review session detail with results
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Fetch session
    const { data: session, error: sessionError } = await supabase
      .from("review_sessions")
      .select("*")
      .eq("id", id)
      .single();

    if (sessionError) {
      if (sessionError.code === "PGRST116") {
        return NextResponse.json(
          { error: "Review session not found" },
          { status: 404 },
        );
      }
      return NextResponse.json(
        {
          error: "Failed to fetch review session",
          details: sessionError.message,
        },
        { status: 500 },
      );
    }

    // Fetch questions with vocabulary details
    const { data: questions, error: questionsError } = await supabase
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
      .eq("review_session_id", id)
      .order("created_at");

    if (questionsError) {
      return NextResponse.json(
        { error: "Failed to fetch questions", details: questionsError.message },
        { status: 500 },
      );
    }

    // Build response
    const questionResults: ReviewQuestionResult[] = questions.map((q) => {
      const vocab = q.vocabularies as {
        id: string;
        word_en: string;
        meaning_vi: string;
        synonyms: { synonym_word: string }[];
      };

      return {
        question_id: q.id,
        vocabulary: {
          word_en: vocab.word_en,
          meaning_vi: vocab.meaning_vi,
          synonyms: vocab.synonyms.map((s) => s.synonym_word),
        },
        user_answer: {
          word: q.user_answer_word,
          synonyms: q.user_answer_synonyms
            ? q.user_answer_synonyms
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean)
            : [],
        },
        is_correct: q.is_correct,
      };
    });

    const result: ReviewSessionResult = {
      session_id: session.id,
      total_questions: session.total_questions,
      correct_answers: session.correct_answers,
      score_percentage:
        session.total_questions > 0
          ? Math.round(
              (session.correct_answers / session.total_questions) * 100,
            )
          : 0,
      questions: questionResults,
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 },
    );
  }
}
