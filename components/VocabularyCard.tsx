"use client";

import { VocabularyWithSynonyms } from "@/lib/types";

interface VocabularyCardProps {
  vocabulary: VocabularyWithSynonyms;
  onClick?: () => void;
}

const partOfSpeechStyles: Record<string, string> = {
  adjective:
    "bg-green-50 text-green-700 ring-green-600/20",
  verb: "bg-blue-50 text-blue-700 ring-blue-700/10",
  noun: "bg-purple-50 text-purple-700 ring-purple-700/10",
  adverb:
    "bg-orange-50 text-orange-700 ring-orange-700/10",
};

export default function VocabularyCard({
  vocabulary,
  onClick,
}: VocabularyCardProps) {
  const posStyle =
    partOfSpeechStyles[vocabulary.part_of_speech?.toLowerCase() || ""] ||
    partOfSpeechStyles.noun;

  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:ring-[#e54d42]/40 cursor-pointer"
    >
      <div className="absolute top-0 left-0 w-1 h-0 bg-[#e54d42] transition-all duration-300 group-hover:h-full"></div>

      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-[#1a1616] capitalize">
              {vocabulary.word_en}
            </h3>
            <div className="w-1.5 h-1.5 rounded-full bg-[#e54d42] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          {vocabulary.part_of_speech && (
            <span
              className={`mt-1 inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${posStyle}`}
            >
              {vocabulary.part_of_speech}
            </span>
          )}
        </div>
        <button
          onClick={(e) => e.stopPropagation()}
          className="text-[#6b5c5c] opacity-0 transition-opacity group-hover:opacity-100 hover:text-[#e54d42]"
        >
          <span className="material-symbols-outlined">star</span>
        </button>
      </div>

      <div>
        <p className="text-sm font-medium text-[#6b5c5c]">
          {vocabulary.meaning_vi}
        </p>
        {vocabulary.example_en && (
          <p className="mt-2 line-clamp-2 text-xs text-gray-400">
            {vocabulary.example_en}
          </p>
        )}
      </div>
    </div>
  );
}
