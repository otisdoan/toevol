"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VocabularyCard from "@/components/VocabularyCard";
import VocabularyDetailModal from "@/components/VocabularyDetailModal";
import AddVocabularyModal from "@/components/AddVocabularyModal";
import EditVocabularyModal from "@/components/EditVocabularyModal";
import { VocabularyWithSynonyms } from "@/lib/types";

const PARTS_OF_SPEECH = [
  "All Words",
  "Verbs",
  "Nouns",
  "Adjectives",
  "Adverbs",
];

export default function VocabularyExplorer() {
  const [vocabularies, setVocabularies] = useState<VocabularyWithSynonyms[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All Words");
  const [selectedVocab, setSelectedVocab] =
    useState<VocabularyWithSynonyms | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 0,
  });

  const fetchVocabularies = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) {
        params.append("word_en", searchQuery);
      }
      params.append("page", pagination.page.toString());
      params.append("limit", pagination.limit.toString());

      const response = await fetch(`/api/vocabularies?${params}`);
      const data = await response.json();

      if (response.ok) {
        let filteredData = data.data || [];

        // Client-side filter by part of speech
        if (selectedFilter !== "All Words") {
          const filterMap: Record<string, string> = {
            Verbs: "verb",
            Nouns: "noun",
            Adjectives: "adjective",
            Adverbs: "adverb",
          };
          filteredData = filteredData.filter(
            (v: VocabularyWithSynonyms) =>
              v.part_of_speech?.toLowerCase() === filterMap[selectedFilter],
          );
        }

        setVocabularies(filteredData);
        setPagination((prev) => ({
          ...prev,
          total: data.pagination?.total || 0,
          total_pages: data.pagination?.total_pages || 0,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch vocabularies:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedFilter, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchVocabularies();
  }, [fetchVocabularies]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-[#fcfafa]">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Search Section */}
          <div className="mx-auto max-w-3xl py-12 text-center">
            <h2 className="mb-8 text-3xl font-bold tracking-tight text-[#1a1616] sm:text-4xl">
              Explore your library
            </h2>

            <div className="relative mx-auto max-w-2xl">
              <label className="relative flex w-full items-center">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <span className="material-symbols-outlined text-[#6b5c5c]">
                    search
                  </span>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="block h-14 w-full rounded-xl border-0 bg-white py-4 pl-12 pr-4 text-[#1a1616] shadow-lg ring-1 ring-inset ring-gray-200 placeholder:text-[#6b5c5c] focus:ring-2 focus:ring-inset focus:ring-[#e54d42] sm:text-sm sm:leading-6 transition-all"
                  placeholder="Search by English word or Vietnamese meaning"
                />
                <div className="absolute inset-y-0 right-2 flex items-center">
                  <kbd className="hidden rounded border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-medium text-gray-500 sm:inline-block">
                    ⌘K
                  </kbd>
                </div>
              </label>
            </div>

            {/* Filter Buttons */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {PARTS_OF_SPEECH.map((pos) => (
                <button
                  key={pos}
                  onClick={() => {
                    setSelectedFilter(pos);
                    setPagination((prev) => ({ ...prev, page: 1 }));
                  }}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium shadow-sm transition-all ${
                    selectedFilter === pos
                      ? "bg-[#e54d42] text-white hover:bg-[#c93d33]"
                      : "bg-white text-[#6b5c5c] hover:bg-[#fdf2f2] hover:text-[#e54d42] ring-1 ring-inset ring-gray-200"
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          {/* Vocabulary Grid */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {isLoading ? (
              // Loading skeleton
              [...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5"
                >
                  <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              ))
            ) : (
              <>
                {vocabularies.map((vocab) => (
                  <VocabularyCard
                    key={vocab.id}
                    vocabulary={vocab}
                    onClick={() => setSelectedVocab(vocab)}
                  />
                ))}

                {/* Add New Card */}
                <div
                  onClick={() => setShowAddModal(true)}
                  className="group relative flex flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-transparent p-6 text-center hover:border-[#e54d42] hover:bg-[#fdf2f2] transition-all cursor-pointer min-h-[180px]"
                >
                  <div className="mb-3 rounded-full bg-gray-100 p-3 text-gray-400 group-hover:bg-[#e54d42] group-hover:text-white transition-all">
                    <span className="material-symbols-outlined">add</span>
                  </div>
                  <h3 className="text-sm font-semibold text-[#1a1616]">
                    Add New Word
                  </h3>
                  <p className="mt-1 text-xs text-[#6b5c5c]">
                    Contribute to the library
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Empty State */}
          {!isLoading && vocabularies.length === 0 && (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-6xl text-gray-300">
                search_off
              </span>
              <h3 className="mt-4 text-lg font-medium text-[#1a1616]">
                No vocabularies found
              </h3>
              <p className="mt-2 text-sm text-[#6b5c5c]">
                Try adjusting your search or add a new word
              </p>
            </div>
          )}

          {/* Pagination */}
          {pagination.total_pages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.max(1, prev.page - 1),
                  }))
                }
                disabled={pagination.page === 1}
                className="flex items-center justify-center rounded-lg border border-[#f1eaea] bg-white px-3 py-2 text-sm font-medium text-[#6b5c5c] hover:bg-[#fdf2f2] hover:text-[#e54d42] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-sm mr-1">
                  arrow_back
                </span>
                Previous
              </button>

              {[...Array(Math.min(3, pagination.total_pages))].map((_, i) => (
                <button
                  key={i}
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: i + 1 }))
                  }
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium ${
                    pagination.page === i + 1
                      ? "bg-[#e54d42] text-white shadow-sm hover:bg-[#c93d33]"
                      : "border border-[#f1eaea] bg-white text-[#6b5c5c] hover:bg-[#fdf2f2] hover:text-[#e54d42]"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              {pagination.total_pages > 3 && (
                <span className="px-2 text-gray-400">...</span>
              )}

              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.min(prev.total_pages, prev.page + 1),
                  }))
                }
                disabled={pagination.page === pagination.total_pages}
                className="flex items-center justify-center rounded-lg border border-[#f1eaea] bg-white px-3 py-2 text-sm font-medium text-[#6b5c5c] hover:bg-[#fdf2f2] hover:text-[#e54d42] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <span className="material-symbols-outlined text-sm ml-1">
                  arrow_forward
                </span>
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Modals */}
      {selectedVocab && !showEditModal && (
        <VocabularyDetailModal
          vocabulary={selectedVocab}
          onClose={() => setSelectedVocab(null)}
          onEdit={() => setShowEditModal(true)}
          onDelete={() => {
            setSelectedVocab(null);
            fetchVocabularies();
          }}
        />
      )}

      {showEditModal && selectedVocab && (
        <EditVocabularyModal
          vocabulary={selectedVocab}
          onClose={() => {
            setShowEditModal(false);
            setSelectedVocab(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setSelectedVocab(null);
            fetchVocabularies();
          }}
        />
      )}

      {showAddModal && (
        <AddVocabularyModal
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchVocabularies}
        />
      )}
    </div>
  );
}
