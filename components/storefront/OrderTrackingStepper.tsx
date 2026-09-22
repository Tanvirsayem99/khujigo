'use client';

import React from 'react';
import { Clock, CheckCircle2, Truck, PackageCheck, XCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { OrderStatus } from '@/types';

interface OrderTrackingStepperProps {
  status: OrderStatus;
  className?: string;
}

const STEPS = [
  { key: 'PENDING', en: 'Pending', bn: 'পেন্ডিং', Icon: Clock },
  { key: 'CONFIRMED', en: 'Confirmed', bn: 'কনফার্মড', Icon: CheckCircle2 },
  { key: 'SHIPPED', en: 'On the way', bn: 'পথে আছে', Icon: Truck },
  { key: 'DELIVERED', en: 'Delivered', bn: 'ডেলিভারড', Icon: PackageCheck },
] as const;

// PROCESSING is "confirmed and being packed", so it shares the Confirmed step.
const STEP_INDEX: Partial<Record<OrderStatus, number>> = {
  PENDING: 0,
  CONFIRMED: 1,
  PROCESSING: 1,
  SHIPPED: 2,
  DELIVERED: 3,
};

export default function OrderTrackingStepper({ status, className = '' }: OrderTrackingStepperProps) {
  const { t } = useApp();

  if (status === 'CANCELLED' || status === 'RETURNED') {
    return (
      <div
        className={`flex items-center gap-3 rounded-2xl bg-rose-50 border border-rose-100 p-4 ${className}`}
      >
        <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
        <div>
          <p className="text-sm font-bold text-rose-800">
            {status === 'CANCELLED'
              ? t({ en: 'This order was cancelled', bn: 'এই অর্ডারটি বাতিল করা হয়েছে' })
              : t({ en: 'This order was returned', bn: 'এই অর্ডারটি ফেরত দেওয়া হয়েছে' })}
          </p>
          <p className="text-xs text-rose-600">
            {t({
              en: 'Need help? Contact our support team.',
              bn: 'সহায়তা প্রয়োজন? আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন।',
            })}
          </p>
        </div>
      </div>
    );
  }

  const current = STEP_INDEX[status] ?? 0;

  return (
    <ol className={`flex items-start ${className}`}>
      {STEPS.map((step, index) => {
        const isDone = index < current;
        const isCurrent = index === current;
        const circleClass = isDone
          ? 'bg-brand-orange text-white'
          : isCurrent
            ? 'bg-brand-orange text-white ring-4 ring-orange-100'
            : 'bg-neutral-100 text-neutral-400 border border-neutral-200';
        const labelClass = isDone || isCurrent ? 'text-brand-navy font-semibold' : 'text-neutral-400';

        return (
          <li key={step.key} className="flex-1 relative flex flex-col items-center">
            {index < STEPS.length - 1 && (
              <span
                className={`absolute top-5 left-1/2 w-full h-0.5 ${
                  index < current ? 'bg-brand-orange' : 'bg-neutral-200'
                }`}
              />
            )}
            <span
              className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center ${circleClass}`}
            >
              <step.Icon className="w-5 h-5" />
            </span>
            <span className={`mt-2 text-[11px] text-center leading-tight ${labelClass}`}>
              {t({ en: step.en, bn: step.bn })}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
