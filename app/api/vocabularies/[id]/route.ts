import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type {
  UpdateVocabularyRequest,
  VocabularyWithSynonyms,
} from "@/lib/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/vocabularies/:id - Get vocabulary detail
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from("vocabularies")
      .select("*, synonyms(*)")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Vocabulary not found" },
          { status: 404 },
        );
      }
      return NextResponse.json(
        { error: "Failed to fetch vocabulary", details: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json(data as VocabularyWithSynonyms);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 },
    );
  }
}

// PUT /api/vocabularies/:id - Update vocabulary
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body: UpdateVocabularyRequest = await request.json();

    // Build update object
    const updateData: Record<string, unknown> = {};
    if (body.word_en !== undefined)
      updateData.word_en = body.word_en.trim().toLowerCase();
    if (body.meaning_vi !== undefined)
      updateData.meaning_vi = body.meaning_vi.trim();
    if (body.part_of_speech !== undefined)
      updateData.part_of_speech = body.part_of_speech?.trim() || null;
    if (body.image_url !== undefined)
      updateData.image_url = body.image_url?.trim() || null;
    if (body.example_en !== undefined)
      updateData.example_en = body.example_en?.trim() || null;
    if (body.example_vi !== undefined)
      updateData.example_vi = body.example_vi?.trim() || null;

    // Update vocabulary
    const { data: vocabulary, error: vocabError } = await supabase
      .from("vocabularies")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (vocabError) {
      if (vocabError.code === "PGRST116") {
        return NextResponse.json(
          { error: "Vocabulary not found" },
          { status: 404 },
        );
      }
      if (vocabError.code === "23505") {
        return NextResponse.json(
          { error: "Word already exists" },
          { status: 409 },
        );
      }
      return NextResponse.json(
        { error: "Failed to update vocabulary", details: vocabError.message },
        { status: 500 },
      );
    }

    // Update synonyms if provided
    if (body.synonyms !== undefined) {
      // Delete existing synonyms
      await supabase.from("synonyms").delete().eq("vocabulary_id", id);

      // Insert new synonyms
      if (body.synonyms.length > 0) {
        const synonymsToInsert = body.synonyms.map((synonym) => ({
          vocabulary_id: id,
          synonym_word: synonym.trim().toLowerCase(),
        }));

        await supabase.from("synonyms").insert(synonymsToInsert);
      }
    }

    // Fetch complete vocabulary with synonyms
    const { data: completeVocab } = await supabase
      .from("vocabularies")
      .select("*, synonyms(*)")
      .eq("id", vocabulary.id)
      .single();

    return NextResponse.json(completeVocab);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 },
    );
  }
}

// DELETE /api/vocabularies/:id - Delete vocabulary
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const { error } = await supabase.from("vocabularies").delete().eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to delete vocabulary", details: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: "Vocabulary deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 },
    );
  }
}
