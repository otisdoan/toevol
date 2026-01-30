import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type {
  VocabularyWithSynonyms,
  CreateVocabularyRequest,
} from "@/lib/types";

// GET /api/vocabularies - List/Search vocabularies
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const word_en = searchParams.get("word_en");
    const meaning_vi = searchParams.get("meaning_vi");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    let query = supabase
      .from("vocabularies")
      .select("*, synonyms(*)", { count: "exact" });

    // Search filters
    if (word_en) {
      query = query.ilike("word_en", `%${word_en}%`);
    }
    if (meaning_vi) {
      query = query.ilike("meaning_vi", `%${meaning_vi}%`);
    }

    // Pagination
    query = query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch vocabularies", details: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      data: data as VocabularyWithSynonyms[],
      pagination: {
        page,
        limit,
        total: count || 0,
        total_pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 },
    );
  }
}

// POST /api/vocabularies - Create new vocabulary
export async function POST(request: NextRequest) {
  try {
    const body: CreateVocabularyRequest = await request.json();

    // Validate required fields
    if (!body.word_en || !body.meaning_vi) {
      return NextResponse.json(
        { error: "word_en and meaning_vi are required" },
        { status: 400 },
      );
    }

    // Insert vocabulary
    const { data: vocabulary, error: vocabError } = await supabase
      .from("vocabularies")
      .insert({
        word_en: body.word_en.trim().toLowerCase(),
        meaning_vi: body.meaning_vi.trim(),
        part_of_speech: body.part_of_speech?.trim() || null,
        image_url: body.image_url?.trim() || null,
        example_en: body.example_en?.trim() || null,
        example_vi: body.example_vi?.trim() || null,
      })
      .select()
      .single();

    if (vocabError) {
      if (vocabError.code === "23505") {
        return NextResponse.json(
          { error: "Vocabulary already exists" },
          { status: 409 },
        );
      }
      return NextResponse.json(
        { error: "Failed to create vocabulary", details: vocabError.message },
        { status: 500 },
      );
    }

    // Insert synonyms if provided
    if (body.synonyms && body.synonyms.length > 0) {
      const synonymsToInsert = body.synonyms.map((synonym) => ({
        vocabulary_id: vocabulary.id,
        synonym_word: synonym.trim().toLowerCase(),
      }));

      const { error: synonymError } = await supabase
        .from("synonyms")
        .insert(synonymsToInsert);

      if (synonymError) {
        console.error("Failed to insert synonyms:", synonymError);
      }
    }

    // Fetch complete vocabulary with synonyms
    const { data: completeVocab } = await supabase
      .from("vocabularies")
      .select("*, synonyms(*)")
      .eq("id", vocabulary.id)
      .single();

    return NextResponse.json(completeVocab, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 },
    );
  }
}
