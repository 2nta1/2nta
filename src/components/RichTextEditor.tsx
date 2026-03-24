'use client';

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'اكتب محتواك هنا...',
  className = '',
}: RichTextEditorProps) {
  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.formatText(0, value.length, 'direction', 'rtl');
    }
  }, [value]);

  return (
    <ReactQuill
      ref={quillRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`min-h-[200px] ${className}`}
      modules={{
        toolbar: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          ['link', 'image'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['clean'],
        ],
      }}
      formats={[
        'header',
        'bold',
        'italic',
        'underline',
        'link',
        'image',
        'list',
        'bullet',
        'ordered',
      ]}
    />
  );
}
