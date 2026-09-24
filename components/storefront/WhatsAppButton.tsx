'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { CONTACT_INFO } from '@/lib/constants';
import { useApp } from '@/context/AppContext';

export default function WhatsAppButton() {
  const pathname = usePathname();
  const { language } = useApp();

  // Hide on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const defaultMsg = encodeURIComponent(
    language === 'bn'
      ? 'আসসালামু আলাইকুম! KhujiGo থেকে প্রোডাক্ট অর্ডার ও তথ্য জানতে চাই।'
      : 'Hello! I would like to inquire about products on KhujiGo.'
  );

  return (
    <a
      href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/[^0-9]/g, '')}?text=${defaultMsg}`}
      target="_blank"
      rel="noopener noreferrer"
      id="floating-whatsapp-btn"
      className="fixed bottom-[calc(5.125rem+env(safe-area-inset-bottom))] md:bottom-6 right-4 md:right-6 z-40 flex items-center gap-2 px-3.5 py-2.5 bg-[#107C6B] hover:bg-[#0C6656] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 group"
      title="Chat on WhatsApp"
    >
      <div className="relative">
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white animate-ping" />
      </div>
      <span className="text-xs font-bold tracking-wide hidden sm:inline-block">
        {language === 'bn' ? 'WhatsApp এ কথা বলুন' : 'Chat on WhatsApp'}
      </span>
    </a>
  );
}
