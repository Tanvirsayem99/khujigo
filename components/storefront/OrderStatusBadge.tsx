'use client';

import React from 'react';
import { Clock, CheckCircle2, Package, Truck, XCircle, RotateCcw, PackageCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { OrderStatus } from '@/types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const BASE_CLASS =
  'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium';

export default function OrderStatusBadge({ status, className = '' }: OrderStatusBadgeProps) {
  const { t } = useApp();

  const pill = (tone: string, icon: React.ReactNode, label: string) => (
    <span className={`${BASE_CLASS} ${tone} ${className}`}>
      {icon}
      {label}
    </span>
  );

  switch (status) {
    case 'CONFIRMED':
      return pill(
        'bg-blue-100 text-blue-800',
        <CheckCircle2 className="w-3 h-3" />,
        t({ en: 'Confirmed', bn: 'কনফার্মড' }),
      );
    case 'PROCESSING':
      return pill(
        'bg-purple-100 text-purple-800',
        <Package className="w-3 h-3" />,
        t({ en: 'Processing', bn: 'প্রসেসিং' }),
      );
    case 'SHIPPED':
      return pill(
        'bg-sky-100 text-sky-800',
        <Truck className="w-3 h-3" />,
        t({ en: 'On the way', bn: 'পথে আছে' }),
      );
    case 'DELIVERED':
      return pill(
        'bg-emerald-100 text-emerald-800',
        <PackageCheck className="w-3 h-3" />,
        t({ en: 'Delivered', bn: 'ডেলিভারড' }),
      );
    case 'CANCELLED':
      return pill(
        'bg-rose-100 text-rose-800',
        <XCircle className="w-3 h-3" />,
        t({ en: 'Cancelled', bn: 'বাতিল' }),
      );
    case 'RETURNED':
      return pill(
        'bg-neutral-200 text-neutral-700',
        <RotateCcw className="w-3 h-3" />,
        t({ en: 'Returned', bn: 'ফেরত' }),
      );
    case 'PENDING':
    default:
      return pill(
        'bg-amber-100 text-amber-800',
        <Clock className="w-3 h-3" />,
        t({ en: 'Pending', bn: 'পেন্ডিং' }),
      );
  }
}
