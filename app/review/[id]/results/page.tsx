"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import { ReviewSessionResult } from "@/lib/types";

export default function ReviewResultsPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [results, setResults] = useState<ReviewSessionResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/reviews/${sessionId}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data);
        } else {
          router.push("/review");
        }
      } catch (error) {
        console.error("Failed to fetch results:", error);
        router.push("/review");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [sessionId, router]);

  if (isLoading) {
    return (
      <div className="bg-[#f6f6f8] min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e54d42]"></div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="bg-[#f6f6f8] min-h-screen flex flex-col items-center justify-center gap-4">
        <span className="material-symbols-outlined text-6xl text-gray-400">
          error
        </span>
        <p className="text-slate-900">Results not found</p>
        <button
          onClick={() => router.push("/review")}
          className="px-6 py-2 bg-[#e54d42] text-white rounded-lg"
        >
          Go back
        </button>
      </div>
    );
  }

  const scorePercentage = results.score_percentage;
  const isPassing = scorePercentage >= 70;

  return (
    <div className="bg-[#f6f6f8] min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-[800px] mx-auto px-4 py-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Review Session Complete
              </h2>
              <p className="text-sm text-slate-500">
                Daily Vocabulary Practice
              </p>
            </div>
            <span
              className={`text-sm font-medium px-3 py-1 rounded-full ${isPassing ? "text-green-600 bg-green-100" : "text-[#e54d42] bg-[#e54d42]/10"}`}
            >
              {results.correct_answers} / {results.total_questions} Correct
            </span>
          </div>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${isPassing ? "bg-green-500" : "bg-[#e54d42]"}`}
              style={{ width: `${scorePercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Score Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div
            className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${isPassing ? "bg-green-100" : "bg-red-100"}`}
          >
            <span
              className={`material-symbols-outlined text-5xl ${isPassing ? "text-green-600" : "text-red-600"}`}
            >
              {isPassing ? "emoji_events" : "sentiment_dissatisfied"}
            </span>
          </div>
          <h1 className="text-5xl font-extrabold text-slate-900 mb-2">
            {scorePercentage}%
          </h1>
          <p className="text-slate-500">
            {isPassing
              ? "Great job! Keep up the good work!"
              : "Keep practicing! You'll get better!"}
          </p>

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => router.push("/review")}
              className="px-6 py-3 bg-[#e54d42] hover:bg-[#c93d33] text-white font-semibold rounded-lg shadow-md transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined">replay</span>
              New Session
            </button>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-slate-700 font-semibold rounded-lg transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined">home</span>
              Home
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#e54d42]">
              quiz
            </span>
            Question Details
          </h3>

          {results.questions.map((question, index) => (
            <div
              key={question.question_id}
              className={`bg-white rounded-xl shadow-sm border overflow-hidden ${
                question.is_correct
                  ? "border-green-200"
                  : "border-red-200"
              }`}
            >
              {/* Header */}
              <div
                className={`px-4 py-3 flex items-center gap-3 ${
                  question.is_correct
                    ? "bg-green-50 border-b border-green-100"
                    : "bg-red-50 border-b border-red-100"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm ${
                    question.is_correct ? "bg-green-600" : "bg-red-600"
                  }`}
                >
                  <span className="material-symbols-outlined text-base">
                    {question.is_correct ? "check" : "close"}
                  </span>
                </div>
                <span className="text-sm font-medium text-slate-700">
                  Question {index + 1}
                </span>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 capitalize">
                      {question.vocabulary.word_en}
                    </h4>
                    <p className="text-sm text-slate-500">
                      {question.vocabulary.meaning_vi}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                  {/* Your Answer */}
                  <div>
                    <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                      Your Answer
                    </span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {question.user_answer.word ? (
                        <span
                          className={`text-sm ${
                            question.user_answer.word.toLowerCase() ===
                            question.vocabulary.word_en.toLowerCase()
                              ? "text-green-600"
                              : "text-red-600 line-through"
                          }`}
                        >
                          {question.user_answer.word}
                        </span>
                      ) : (
                        <span className="text-sm text-slate-400 italic">
                          No answer
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Correct Synonyms */}
                  {question.vocabulary.synonyms.length > 0 && (
                    <div>
                      <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                        Synonyms
                      </span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {question.vocabulary.synonyms.map((synonym, i) => {
                          const userHasSynonym =
                            question.user_answer.synonyms.some(
                              (s) => s.toLowerCase() === synonym.toLowerCase(),
                            );
                          return (
                            <span
                              key={i}
                              className={`px-2 py-0.5 rounded text-xs font-medium ${
                                userHasSynonym
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-slate-600"
                              }`}
                            >
                              {synonym}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="w-full py-8 text-center text-sm text-slate-500">
        <p>© 2024 ToeVol. Keep learning!</p>
      </footer>
    </div>
  );
}
