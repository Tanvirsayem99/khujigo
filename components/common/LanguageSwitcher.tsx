'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';

interface LanguageSwitcherProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export default function LanguageSwitcher({ variant = 'full', className = '' }: LanguageSwitcherProps) {
  const { language, setLanguage } = useApp();

  return (
    <div
      id="khujigo-language-switcher"
      className={`inline-flex items-center p-1 rounded-full bg-orange-50/80 border border-orange-200/80 text-xs font-semibold select-none ${className}`}
    >
      <button
        type="button"
        id="lang-btn-bn"
        onClick={() => setLanguage('bn')}
        className={`px-2.5 py-1 rounded-full transition-all duration-150 ${
          language === 'bn'
            ? 'bg-[#FF6A00] text-white shadow-xs font-bold'
            : 'text-gray-700 hover:text-[#FF6A00]'
        }`}
      >
        বাংলা
      </button>
      <button
        type="button"
        id="lang-btn-en"
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 rounded-full transition-all duration-150 ${
          language === 'en'
            ? 'bg-[#FF6A00] text-white shadow-xs font-bold'
            : 'text-gray-700 hover:text-[#FF6A00]'
        }`}
      >
        English
      </button>
    </div>
  );
}
