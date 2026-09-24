import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'full' | 'compact' | 'footer';
  className?: string;
}

export default function Logo({ variant = 'full', className = '' }: LogoProps) {
  if (variant === 'compact') {
    return (
      <Link href="/" id="khujigo-logo-compact" className={`inline-flex items-center gap-1.5 group select-none ${className}`}>
        <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF6A00] to-[#FFC400] flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <path d="M8 11h6" stroke="#07111F" strokeWidth="2" />
            <path d="M11 8v6" stroke="#07111F" strokeWidth="2" />
          </svg>
          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#07111F] border-2 border-white flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC400]" />
          </span>
        </div>
        <span className="text-xl font-black tracking-tight text-[#07111F]">
          K<span className="text-brand-orange-deep">G</span>
        </span>
      </Link>
    );
  }

  const isFooter = variant === 'footer';

  return (
    <Link href="/" id={`khujigo-logo-${variant}`} className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* Brand Icon Badge */}
      <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF6A00] via-[#FF8A00] to-[#FFC400] p-0.5 shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200">
        <div className={`w-full h-full rounded-[10px] ${isFooter ? 'bg-[#07111F]' : 'bg-white'} flex items-center justify-center`}>
          <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Magnifying lens */}
            <circle cx="14" cy="14" r="8" stroke="#FF6A00" strokeWidth="2.8" />
            {/* Handle with trending arrow slant */}
            <path d="M20 20L27 27" stroke="#FF8A00" strokeWidth="3" strokeLinecap="round" />
            {/* Sparkle star in center */}
            <path d="M14 10V18M10 14H18" stroke="#FFC400" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        {/* Active BD Indicator dot */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFC400] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF6A00]"></span>
        </span>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`text-2xl font-black tracking-tight ${isFooter ? 'text-white' : 'text-[#07111F]'}`}>
            Khuji<span className={isFooter ? 'text-brand-orange' : 'text-brand-orange-deep'}>Go</span>
          </span>
          <span
            className={`px-1.5 py-0.5 text-[10px] font-extrabold uppercase rounded bg-[#FFC400]/20 border border-[#FFC400]/40 ${
              isFooter ? 'text-brand-orange' : 'text-brand-orange-deep'
            }`}
          >
            BD
          </span>
        </div>
        <span className={`text-[11px] font-medium tracking-wide mt-0.5 ${isFooter ? 'text-gray-400' : 'text-gray-500'}`}>
          খুঁজে নিন ট্রেন্ডিং সবকিছু!
        </span>
      </div>
    </Link>
  );
}
