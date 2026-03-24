"use client";
import { useState } from "react";
import { FiImage, FiSend } from "react-icons/fi";

interface PostComposerProps {
  onPostCreated?: () => void;
}

export default function PostComposer({ onPostCreated }: PostComposerProps) {
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const encodeFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && images.length === 0) return;

    setIsSubmitting(true);

    try {
      let base64Image: string | undefined;
      if (images[0]) {
        base64Image = await encodeFileToBase64(images[0]);
      }
      const res = await fetch('/api/company/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, type: 'GENERAL', image: base64Image }),
      });
      if (!res.ok) {
        console.error('Error creating post');
      }
    } catch (err) {
      console.error(err);
    }

    setContent("");
    setImages([]);
    setIsSubmitting(false);
    onPostCreated?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow-sm mb-6"
    >
      <textarea
        className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:border-blue-300 resize-none"
        rows={3}
        placeholder="ماذا تريد أن تنشر؟"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      {images.length > 0 && (
        <p className="text-sm text-gray-600 mt-2">{images.length} صورة مرفوعة</p>
      )}

      <div className="flex items-center justify-between mt-3">
        <label className="flex items-center gap-2 cursor-pointer text-blue-600 hover:text-blue-700 text-sm">
          <FiImage /> إضافة صور
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>

        <button
          type="submit"
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded disabled:opacity-60"
          disabled={isSubmitting}
        >
          نشر <FiSend />
        </button>
      </div>
    </form>
  );
}
