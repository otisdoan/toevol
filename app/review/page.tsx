"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ReviewPage() {
  const router = useRouter();
  const [numberOfQuestions, setNumberOfQuestions] = useState(20);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartReview = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number_of_questions: numberOfQuestions }),
      });

      if (response.ok) {
        const data = await response.json();
        // Save session data to localStorage for the session page
        localStorage.setItem(
          `review_session_${data.session_id}`,
          JSON.stringify(data),
        );
        router.push(`/review/${data.session_id}`);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create review session");
      }
    } catch (error) {
      console.error("Error creating review session:", error);
      alert("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#fdf8f8] min-h-screen flex flex-col transition-colors duration-200">
      <Header />

      <main className="flex-1 w-full max-w-[960px] mx-auto px-4 py-8 md:py-12 flex flex-col items-center gap-12">
        {/* Setup Section */}
        <section className="w-full max-w-[600px] flex flex-col gap-6 p-6 md:p-8 rounded-xl bg-white shadow-sm border border-red-50 transition-colors duration-200">
          <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
            <span className="material-symbols-outlined text-[#e54d42]">
              tune
            </span>
            <h2 className="text-lg font-bold text-[#2d1a1a]">
              New Session Setup
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-end gap-4">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-[#7c5e5e] mb-2">
                Number of questions
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={numberOfQuestions}
                  onChange={(e) =>
                    setNumberOfQuestions(
                      Math.max(1, Math.min(100, parseInt(e.target.value) || 1)),
                    )
                  }
                  className="w-full h-12 px-4 rounded-lg bg-[#fdf8f8] border border-red-100 text-[#2d1a1a] focus:ring-2 focus:ring-[#e54d42]/20 focus:border-[#e54d42] outline-none transition-all"
                />
                <div className="absolute right-3 flex flex-col">
                  <button
                    onClick={() =>
                      setNumberOfQuestions((prev) => Math.min(100, prev + 1))
                    }
                    className="text-[#7c5e5e] hover:text-[#e54d42] leading-none"
                  >
                    <span className="material-symbols-outlined text-sm">
                      keyboard_arrow_up
                    </span>
                  </button>
                  <button
                    onClick={() =>
                      setNumberOfQuestions((prev) => Math.max(1, prev - 1))
                    }
                    className="text-[#7c5e5e] hover:text-[#e54d42] leading-none"
                  >
                    <span className="material-symbols-outlined text-sm">
                      keyboard_arrow_down
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleStartReview}
              disabled={isLoading}
              className="w-full md:w-auto h-12 px-8 bg-[#e54d42] hover:bg-[#c93d33] text-white font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">
                play_arrow
              </span>
              {isLoading ? "Creating..." : "Start Review"}
            </button>
          </div>
        </section>

        {/* Divider */}
        <div className="w-px h-8 bg-red-100"></div>

        {/* Instructions */}
        <section className="w-full max-w-[600px] flex flex-col gap-6 p-6 md:p-8 rounded-xl bg-white shadow-sm border border-red-50">
          <h3 className="text-lg font-bold text-[#2d1a1a] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#e54d42]">
              info
            </span>
            How it works
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#e54d42]/10 text-[#e54d42] flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-medium text-[#2d1a1a]">
                  See the Vietnamese meaning
                </h4>
                <p className="text-sm text-[#7c5e5e]">
                  You&apos;ll be shown the Vietnamese meaning of a word
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#e54d42]/10 text-[#e54d42] flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-medium text-[#2d1a1a]">
                  Type the English word
                </h4>
                <p className="text-sm text-[#7c5e5e]">
                  Enter the corresponding English vocabulary word
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#e54d42]/10 text-[#e54d42] flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-medium text-[#2d1a1a]">
                  Add synonyms (optional)
                </h4>
                <p className="text-sm text-[#7c5e5e]">
                  Enter synonyms separated by commas for bonus points
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#e54d42]/10 text-[#e54d42] flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h4 className="font-medium text-[#2d1a1a]">
                  Get instant feedback
                </h4>
                <p className="text-sm text-[#7c5e5e]">
                  See if you&apos;re correct and learn from mistakes
                </p>
              </div>
            </div>
          </div>
        </section>

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
