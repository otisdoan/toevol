"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import { ReviewQuestionDetail, CheckAnswerResponse } from "@/lib/types";

interface SessionData {
  session_id: string;
  total_questions: number;
  questions: ReviewQuestionDetail[];
}

export default function ReviewSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userWord, setUserWord] = useState("");
  const [userSynonyms, setUserSynonyms] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [feedback, setFeedback] = useState<CheckAnswerResponse | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch session data
  useEffect(() => {
    const fetchSession = async () => {
      try {
        // Get session from localStorage (saved when creating)
        const stored = localStorage.getItem(`review_session_${sessionId}`);
        if (stored) {
          setSessionData(JSON.parse(stored));
        } else {
          // Fetch from API
          const response = await fetch(`/api/reviews/${sessionId}`);
          if (response.ok) {
            const data = await response.json();
            // Transform to expected format
            const sessionData: SessionData = {
              session_id: data.session_id,
              total_questions: data.total_questions,
              questions: data.questions.map(
                (q: {
                  question_id: string;
                  vocabulary: { word_en: string; meaning_vi: string };
                }) => ({
                  question_id: q.question_id,
                  vocabulary_id: "",
                  meaning_vi: q.vocabulary.meaning_vi,
                  part_of_speech: null,
                  example_en: null,
                  example_vi: null,
                  image_url: null,
                }),
              ),
            };
            setSessionData(sessionData);
          } else {
            router.push("/review");
          }
        }
      } catch (error) {
        console.error("Failed to load session:", error);
        router.push("/review");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, router]);

  const currentQuestion = sessionData?.questions[currentQuestionIndex];
  const progress = sessionData
    ? ((currentQuestionIndex + 1) / sessionData.total_questions) * 100
    : 0;

  const handleCheckAnswer = useCallback(async () => {
    if (!currentQuestion || isChecking) return;

    setIsChecking(true);
    try {
      const response = await fetch(`/api/reviews/${sessionId}/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_id: currentQuestion.question_id,
          user_word: userWord,
          user_synonyms: userSynonyms,
        }),
      });

      if (response.ok) {
        const result: CheckAnswerResponse = await response.json();
        setFeedback(result);
        if (result.is_correct) {
          setCorrectCount((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.error("Failed to check answer:", error);
    } finally {
      setIsChecking(false);
    }
  }, [currentQuestion, isChecking, sessionId, userWord, userSynonyms]);

  const handleNextQuestion = () => {
    if (!sessionData) return;

    if (currentQuestionIndex < sessionData.total_questions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setUserWord("");
      setUserSynonyms("");
      setFeedback(null);
    } else {
      // Session complete - go to results
      router.push(`/review/${sessionId}/results`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !feedback) {
      e.preventDefault();
      handleCheckAnswer();
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#fdf8f8] min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e54d42]"></div>
      </div>
    );
  }

  if (!sessionData || !currentQuestion) {
    return (
      <div className="bg-[#fdf8f8] min-h-screen flex flex-col items-center justify-center gap-4">
        <span className="material-symbols-outlined text-6xl text-gray-400">
          error
        </span>
        <p className="text-[#2d1a1a]">Session not found</p>
        <button
          onClick={() => router.push("/review")}
          className="px-6 py-2 bg-[#e54d42] text-white rounded-lg"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#fdf8f8] min-h-screen flex flex-col transition-colors duration-200">
      <Header />

      <main className="flex-1 w-full max-w-[960px] mx-auto px-4 py-8 md:py-12 flex flex-col items-center gap-8">
        {/* Question Card */}
        <section className="w-full max-w-[600px] flex flex-col rounded-xl bg-white shadow-lg border border-red-50 overflow-hidden transition-colors duration-200 relative">
          {/* Progress Bar */}
          <div className="bg-red-50/30 px-6 py-4 border-b border-red-50 flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-[#7c5e5e]">
                Question {currentQuestionIndex + 1} of{" "}
                {sessionData.total_questions}
              </span>
              <span className="text-[#e54d42] font-bold">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-red-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#e54d42] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="p-6 md:p-10 flex flex-col gap-8">
            {/* Vietnamese Meaning */}
            <div className="text-center space-y-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#7c5e5e]">
                Vietnamese Meaning
              </span>
              <h3 className="text-3xl md:text-4xl font-bold text-[#2d1a1a] leading-tight">
                {currentQuestion.meaning_vi}
              </h3>
            </div>

            {/* Input Fields */}
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#2d1a1a]">
                  English Word
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#7c5e5e] group-focus-within:text-[#e54d42] transition-colors">
                    translate
                  </span>
                  <input
                    type="text"
                    autoFocus
                    value={userWord}
                    onChange={(e) => setUserWord(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={!!feedback}
                    className="w-full h-14 pl-10 pr-4 rounded-lg bg-white border-2 border-red-50 text-lg text-[#2d1a1a] focus:ring-2 focus:ring-[#e54d42]/20 focus:border-[#e54d42] outline-none transition-all placeholder:text-red-200 disabled:opacity-50"
                    placeholder="Type the English word..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-[#2d1a1a]">
                    Synonyms
                  </label>
                  <span className="text-xs text-[#7c5e5e] italic">
                    Optional
                  </span>
                </div>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#7c5e5e] group-focus-within:text-[#e54d42] transition-colors">
                    dataset
                  </span>
                  <input
                    type="text"
                    value={userSynonyms}
                    onChange={(e) => setUserSynonyms(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={!!feedback}
                    className="w-full h-12 pl-10 pr-4 rounded-lg bg-white border border-red-100 text-[#2d1a1a] focus:ring-2 focus:ring-[#e54d42]/20 focus:border-[#e54d42] outline-none transition-all placeholder:text-red-200 disabled:opacity-50"
                    placeholder="Add synonyms (comma-separated)..."
                  />
                </div>
              </div>
            </div>

            {/* Feedback */}
            {feedback && (
              <div
                className={`rounded-lg p-4 ${feedback.is_correct ? "bg-green-50 border border-green-100" : "bg-red-50 border border-red-100"}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${feedback.is_correct ? "bg-green-600" : "bg-red-600"}`}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {feedback.is_correct ? "check" : "close"}
                    </span>
                  </div>
                  <div>
                    <h4
                      className={`font-bold ${feedback.is_correct ? "text-green-700" : "text-red-700"}`}
                    >
                      {feedback.is_correct ? "Correct!" : "Incorrect"}
                    </h4>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <p className="text-[#2d1a1a]">
                    <span className="font-medium">Correct word:</span>{" "}
                    {feedback.correct_word}
                  </p>
                  {feedback.correct_synonyms.length > 0 && (
                    <p className="text-[#2d1a1a]">
                      <span className="font-medium">Synonyms:</span>{" "}
                      {feedback.correct_synonyms.join(", ")}
                    </p>
                  )}
                  {feedback.missing_synonyms.length > 0 && (
                    <p className="text-red-600">
                      <span className="font-medium">Missing:</span>{" "}
                      {feedback.missing_synonyms.join(", ")}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col gap-3">
              {!feedback ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={isChecking || !userWord.trim()}
                  className="w-full h-14 bg-[#e54d42] hover:bg-[#c93d33] text-white font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 transform active:scale-[0.99] disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">
                    check_circle
                  </span>
                  {isChecking ? "Checking..." : "Check Answer"}
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="w-full h-14 bg-[#e54d42] hover:bg-[#c93d33] text-white font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 transform active:scale-[0.99]"
                >
                  {currentQuestionIndex < sessionData.total_questions - 1 ? (
                    <>
                      Next Question
                      <span className="material-symbols-outlined text-lg">
                        arrow_forward
                      </span>
                    </>
                  ) : (
                    <>
                      View Results
                      <span className="material-symbols-outlined text-lg">
                        assessment
                      </span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#e54d42]/30 to-transparent"></div>
        </section>

        {/* Score */}
        <div className="text-center text-sm text-[#7c5e5e]">
          Score:{" "}
          <span className="font-bold text-[#e54d42]">{correctCount}</span> /{" "}
          {currentQuestionIndex + (feedback ? 1 : 0)}
        </div>

        {/* Keyboard shortcuts */}
        <div className="flex items-center gap-6 text-xs text-[#7c5e5e] mt-4">
          <div className="flex items-center gap-1.5">
            <kbd className="px-2 py-1 bg-red-50 rounded border border-red-100 font-mono text-[10px]">
              Enter
            </kbd>
            <span>Check</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="px-2 py-1 bg-red-50 rounded border border-red-100 font-mono text-[10px]">
              Tab
            </kbd>
            <span>Next field</span>
          </div>
        </div>
      </main>

      <footer className="w-full py-8 text-center text-sm text-[#7c5e5e]">
        <p>© 2024 ToeVol. Focused learning in a minimal space.</p>
      </footer>
    </div>
  );
}
