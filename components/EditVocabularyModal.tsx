"use client";

import { useState } from "react";
import { VocabularyWithSynonyms, UpdateVocabularyRequest } from "@/lib/types";

interface EditVocabularyModalProps {
  vocabulary: VocabularyWithSynonyms;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditVocabularyModal({
  vocabulary,
  onClose,
  onSuccess,
}: EditVocabularyModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateVocabularyRequest>({
    word_en: vocabulary.word_en,
    meaning_vi: vocabulary.meaning_vi,
    part_of_speech: vocabulary.part_of_speech || "",
    example_en: vocabulary.example_en || "",
    example_vi: vocabulary.example_vi || "",
    image_url: vocabulary.image_url || "",
  });
  const [synonymsInput, setSynonymsInput] = useState(
    vocabulary.synonyms?.map((s) => s.synonym_word).join(", ") || "",
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const synonyms = synonymsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const response = await fetch(`/api/vocabularies/${vocabulary.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          synonyms,
        }),
      });

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update vocabulary");
      }
    } catch (error) {
      console.error("Error updating vocabulary:", error);
      alert("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="w-full max-w-[700px] bg-white rounded-xl shadow-2xl border border-[#e7cfcf] overflow-hidden">
        {/* Header */}
        <div className="border-b border-[#f3e7e7] py-6">
          <h2 className="text-[#e54d42] tracking-tight text-[28px] font-bold leading-tight px-8 text-center">
            Chỉnh sửa từ vựng
          </h2>
          <p className="text-gray-500 text-sm text-center mt-1">
            Cập nhật thông tin từ vựng
          </p>
        </div>

        {/* Form */}
        <div className="p-8 custom-scrollbar overflow-y-auto max-h-[70vh]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Word & Part of Speech */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[#1b0d0d] text-base font-semibold">
                  Từ tiếng Anh <span className="text-[#e54d42]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.word_en}
                  onChange={(e) =>
                    setFormData({ ...formData, word_en: e.target.value })
                  }
                  className="w-full rounded-lg text-[#1b0d0d] border-[#e7cfcf] h-12 px-4 text-base focus:ring-[#e54d42]/20 focus:border-[#e54d42]"
                  placeholder="e.g. Vocabulary"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#1b0d0d] text-base font-semibold">
                  Loại từ
                </label>
                <select
                  value={formData.part_of_speech}
                  onChange={(e) =>
                    setFormData({ ...formData, part_of_speech: e.target.value })
                  }
                  className="w-full rounded-lg text-[#1b0d0d] border-[#e7cfcf] h-12 px-4 text-base focus:ring-[#e54d42]/20 focus:border-[#e54d42]"
                >
                  <option value="">Chọn loại từ</option>
                  <option value="noun">Danh từ (n)</option>
                  <option value="verb">Động từ (v)</option>
                  <option value="adjective">Tính từ (adj)</option>
                  <option value="adverb">Trạng từ (adv)</option>
                </select>
              </div>
            </div>

            {/* Vietnamese Meaning */}
            <div className="flex flex-col gap-2">
              <label className="text-[#1b0d0d] text-base font-semibold">
                Nghĩa tiếng Việt <span className="text-[#e54d42]">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.meaning_vi}
                onChange={(e) =>
                  setFormData({ ...formData, meaning_vi: e.target.value })
                }
                className="w-full rounded-lg text-[#1b0d0d] border-[#e7cfcf] h-12 px-4 text-base focus:ring-[#e54d42]/20 focus:border-[#e54d42]"
                placeholder="Nhập nghĩa của từ..."
              />
            </div>

            {/* Example English */}
            <div className="flex flex-col gap-2">
              <label className="text-[#1b0d0d] text-base font-semibold">
                Câu ví dụ (Tiếng Anh)
              </label>
              <textarea
                value={formData.example_en}
                onChange={(e) =>
                  setFormData({ ...formData, example_en: e.target.value })
                }
                className="w-full rounded-lg text-[#1b0d0d] border-[#e7cfcf] min-h-[80px] p-4 text-base focus:ring-[#e54d42]/20 focus:border-[#e54d42]"
                placeholder="Nhập câu ví dụ bằng tiếng Anh..."
              />
            </div>

            {/* Example Vietnamese */}
            <div className="flex flex-col gap-2">
              <label className="text-[#1b0d0d] text-base font-semibold">
                Dịch câu ví dụ
              </label>
              <textarea
                value={formData.example_vi}
                onChange={(e) =>
                  setFormData({ ...formData, example_vi: e.target.value })
                }
                className="w-full rounded-lg text-[#1b0d0d] border-[#e7cfcf] min-h-[80px] p-4 text-base focus:ring-[#e54d42]/20 focus:border-[#e54d42]"
                placeholder="Nhập bản dịch tiếng Việt..."
              />
            </div>

            {/* Synonyms */}
            <div className="flex flex-col gap-2">
              <label className="text-[#1b0d0d] text-base font-semibold">
                Từ đồng nghĩa
              </label>
              <input
                type="text"
                value={synonymsInput}
                onChange={(e) => setSynonymsInput(e.target.value)}
                className="w-full rounded-lg text-[#1b0d0d] border-[#e7cfcf] h-12 px-4 text-base focus:ring-[#e54d42]/20 focus:border-[#e54d42]"
                placeholder="Nhập các từ đồng nghĩa, cách nhau bởi dấu phẩy..."
              />
              <p className="text-xs text-gray-500">
                Ví dụ: happy, joyful, cheerful
              </p>
            </div>

            {/* Image URL */}
            <div className="flex flex-col gap-2">
              <label className="text-[#1b0d0d] text-base font-semibold">
                URL hình ảnh
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) =>
                  setFormData({ ...formData, image_url: e.target.value })
                }
                className="w-full rounded-lg text-[#1b0d0d] border-[#e7cfcf] h-12 px-4 text-base focus:ring-[#e54d42]/20 focus:border-[#e54d42]"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-[#fcf8f8] border-t border-[#e7cfcf] flex flex-col sm:flex-row-reverse items-center gap-4">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full sm:w-auto px-10 py-3 bg-[#e54d42] text-white rounded-lg font-bold text-base hover:bg-[#c93d33] transition-all shadow-lg shadow-[#e54d42]/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-xl">save</span>
            {isLoading ? "Đang lưu..." : "Cập nhật"}
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3 text-gray-500 font-medium text-base hover:text-[#e54d42] transition-colors flex items-center justify-center"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
