"use client";

import { VocabularyWithSynonyms } from "@/lib/types";

interface VocabularyDetailModalProps {
  vocabulary: VocabularyWithSynonyms;
  onClose: () => void;
}

export default function VocabularyDetailModal({
  vocabulary,
  onClose,
}: VocabularyDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 z-30 group flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-[#e54d42] hover:bg-red-50 transition-all duration-200"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        <div className="overflow-y-auto max-h-[90vh]">
          {/* Header */}
          <div className="px-8 pt-12 pb-8 text-center">
            <h1 className="text-[#e54d42] font-extrabold tracking-tight text-5xl sm:text-6xl mb-3 capitalize">
              {vocabulary.word_en}
            </h1>
            <div className="flex items-center justify-center gap-3">
              <span className="text-slate-400 text-lg font-medium tracking-wider">
                {vocabulary.part_of_speech || "word"}
              </span>
              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-[#e54d42] hover:bg-[#e54d42] hover:text-white transition-colors">
                <span className="material-symbols-outlined text-xl">
                  volume_up
                </span>
              </button>
            </div>
          </div>

          {/* Image */}
          {vocabulary.image_url && (
            <div className="px-8 mb-10">
              <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-slate-100 group">
                <img
                  alt={vocabulary.word_en}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={vocabulary.image_url}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="px-8 sm:px-12 pb-12 space-y-10">
            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="h-1.5 w-1.5 rounded-full bg-[#e54d42]/40"></span>
              </div>
            </div>

            {/* Vietnamese Meaning */}
            <section>
              <h3 className="text-[10px] font-bold text-[#e54d42]/60 uppercase tracking-[0.2em] mb-4 text-center">
                Nghĩa tiếng Việt
              </h3>
              <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">
                  {vocabulary.meaning_vi}
                </h2>
              </div>
            </section>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="h-1.5 w-1.5 rounded-full bg-[#e54d42]/40"></span>
              </div>
            </div>

            {/* Example */}
            {(vocabulary.example_en || vocabulary.example_vi) && (
              <>
                <section>
                  <h3 className="text-[10px] font-bold text-[#e54d42]/60 uppercase tracking-[0.2em] mb-4">
                    Example
                  </h3>
                  <div className="bg-red-50/40 border-l-4 border-[#e54d42] rounded-r-2xl p-6">
                    {vocabulary.example_en && (
                      <p className="text-xl text-slate-800 font-semibold mb-3 leading-snug">
                        &quot;{vocabulary.example_en}&quot;
                      </p>
                    )}
                    {vocabulary.example_vi && (
                      <p className="text-slate-500 italic">
                        &quot;{vocabulary.example_vi}&quot;
                      </p>
                    )}
                  </div>
                </section>

                {/* Divider */}
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#e54d42]/40"></span>
                  </div>
                </div>
              </>
            )}

            {/* Synonyms */}
            {vocabulary.synonyms && vocabulary.synonyms.length > 0 && (
              <section>
                <h3 className="text-[10px] font-bold text-[#e54d42]/60 uppercase tracking-[0.2em] mb-4">
                  Synonyms
                </h3>
                <div className="flex flex-wrap gap-2">
                  {vocabulary.synonyms.map((synonym) => (
                    <span
                      key={synonym.id}
                      className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-medium border border-slate-100 hover:border-[#e54d42]/30 hover:text-[#e54d42] transition-all cursor-default"
                    >
                      {synonym.synonym_word}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
