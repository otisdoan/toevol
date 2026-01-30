import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type {
  CreateReviewSessionRequest,
  CreateReviewSessionResponse,
  ReviewQuestionDetail,
} from "@/lib/types";

// POST /api/reviews - Create new review session
export async function POST(request: NextRequest) {
  try {
    const body: CreateReviewSessionRequest = await request.json();
    const numberOfQuestions = body.number_of_questions;

    // Validate
    if (!numberOfQuestions || numberOfQuestions < 1) {
      return NextResponse.json(
        { error: "number_of_questions must be at least 1" },
        { status: 400 },
      );
    }

    // Get total available vocabularies
    const { count: totalVocab } = await supabase
      .from("vocabularies")
      .select("*", { count: "exact", head: true });

    if (!totalVocab || totalVocab === 0) {
      return NextResponse.json(
        { error: "No vocabularies available for review" },
        { status: 400 },
      );
    }

    // Limit questions to available vocabularies
    const actualQuestions = Math.min(numberOfQuestions, totalVocab);

    // Get random vocabularies
    // Using PostgreSQL's RANDOM() for randomization
    const { data: vocabularies, error: vocabError } = await supabase
      .from("vocabularies")
      .select(
        "id, meaning_vi, part_of_speech, example_en, example_vi, image_url",
      )
      .order("id") // Need some order for reproducibility
      .limit(actualQuestions * 3); // Get more to allow randomization

    if (vocabError || !vocabularies) {
      return NextResponse.json(
        { error: "Failed to fetch vocabularies", details: vocabError?.message },
        { status: 500 },
      );
    }

    // Shuffle and pick random vocabularies (no duplicates)
    const shuffled = vocabularies.sort(() => Math.random() - 0.5);
    const selectedVocabs = shuffled.slice(0, actualQuestions);

    // Create review session
    const { data: session, error: sessionError } = await supabase
      .from("review_sessions")
      .insert({
        total_questions: actualQuestions,
        correct_answers: 0,
      })
      .select()
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        {
          error: "Failed to create review session",
          details: sessionError?.message,
        },
        { status: 500 },
      );
    }

    // Create review questions
    const questionsToInsert = selectedVocabs.map((vocab) => ({
      review_session_id: session.id,
      vocabulary_id: vocab.id,
    }));

    const { data: questions, error: questionsError } = await supabase
      .from("review_questions")
      .insert(questionsToInsert)
      .select();

    if (questionsError || !questions) {
      return NextResponse.json(
        {
          error: "Failed to create review questions",
          details: questionsError?.message,
        },
        { status: 500 },
      );
    }

    // Build response
    const questionDetails: ReviewQuestionDetail[] = questions.map(
      (q, index) => ({
        question_id: q.id,
        vocabulary_id: q.vocabulary_id,
        meaning_vi: selectedVocabs[index].meaning_vi,
        part_of_speech: selectedVocabs[index].part_of_speech,
        example_en: selectedVocabs[index].example_en,
        example_vi: selectedVocabs[index].example_vi,
        image_url: selectedVocabs[index].image_url,
      }),
    );

    const response: CreateReviewSessionResponse = {
      session_id: session.id,
      total_questions: actualQuestions,
      questions: questionDetails,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 },
    );
  }
}

// GET /api/reviews - List all review sessions
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("review_sessions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch review sessions", details: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 },
    );
  }
}
