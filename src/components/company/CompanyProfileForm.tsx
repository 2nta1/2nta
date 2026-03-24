'use client';

import React, { useState } from 'react';
import RichTextEditor from '../RichTextEditor';

interface CompanyProfileFormProps {
  initial?: {
    overview?: string;
    description?: string;
  };
  onSubmit: (data: {
    overview: string;
    description: string;
  }) => Promise<void>;
  submitting: boolean;
}

export default function CompanyProfileForm({
  initial = {},
  onSubmit,
  submitting,
}: CompanyProfileFormProps) {
  const [formData, setFormData] = useState({
    overview: initial.overview || '',
    description: initial.description || '',
  });

  const handleChange = (field: keyof typeof formData) => (
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">نبذة عن الشركة</h2>
        <RichTextEditor
          value={formData.overview}
          onChange={handleChange('overview')}
          placeholder="اكتب نبذة عن شركتك هنا..."
          className="w-full"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">وصف الشركة</h2>
        <RichTextEditor
          value={formData.description}
          onChange={handleChange('description')}
          placeholder="اكتب وصف مفصل عن شركتك هنا..."
          className="w-full"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
      </button>
    </form>
  );
}
