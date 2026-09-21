'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { ApiError } from '@/lib/api/client';
import {
  createCategory,
  createCoupon,
  createProduct,
  deleteCoupon,
  deleteProduct,
  deleteReview,
  setProductStock,
  setReviewStatus,
  toggleCoupon,
  updateDeliverySettings,
  updateOrderPaymentStatus,
  updateOrderStatus,
  updateProduct,
  updateUserRole,
} from '@/lib/api/endpoints';
import {
  revalidateAdmin,
  useAdminAnalytics,
  useAdminCategories,
  useAdminCoupons,
  useAdminOrders,
  useAdminProducts,
  useAdminReviews,
  useAdminUsers,
  useDeliverySettings,
} from '@/lib/hooks/api';
import { RowsSkeleton } from '@/components/common/LoadingStates';
import { Product, Order, Category, Coupon, Review, AdminRole, ManagedUser } from '@/types';
import { formatBDT } from '@/lib/constants';
import Logo from '@/components/common/Logo';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Layers,
  TicketPercent,
  Star,
  Settings,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Truck,
  ExternalLink,
  LogOut,
  RefreshCw,
  ShieldCheck,
  UserCheck,
  TrendingUp,
  DollarSign,
  Users,
  Printer,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  ArrowUpRight,
  Save,
  PhoneCall,
  MapPin,
  FileText,
} from 'lucide-react';

type AdminTab = 'dashboard' | 'products' | 'orders' | 'categories' | 'coupons' | 'reviews' | 'settings' | 'users';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { adminUser, isAdminLoggedIn, isAuthLoading, logoutAdmin } = useAuth();
  const { showToast } = useApp();

  // Selected tab
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ----------------------------------------------------
  // Data Queries — only fire once an admin session exists
  // ----------------------------------------------------
  const adminReady = !isAuthLoading && isAdminLoggedIn;

  // Lock background scroll while the mobile sidebar drawer is open.
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const { analytics: analyticsData } = useAdminAnalytics({ enabled: adminReady });
  const { products } = useAdminProducts({ enabled: adminReady });
  const { orders } = useAdminOrders({ enabled: adminReady });
  const { categories } = useAdminCategories({ enabled: adminReady });
  const { coupons } = useAdminCoupons({ enabled: adminReady && activeTab === 'coupons' });
  const { reviews } = useAdminReviews(undefined, {
    enabled: adminReady && activeTab === 'reviews',
  });
  const { users: adminUsers, isLoading: usersLoading } = useAdminUsers({ enabled: adminReady });
  const { settings: deliverySettingsData } = useDeliverySettings();

  // Replaces the old `refreshKey` counter: invalidate every admin query.
  const triggerRefresh = () => {
    void revalidateAdmin();
  };

  const analytics = analyticsData ?? {
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    lowStockCount: 0,
    averageOrderValue: 0,
  };

  const deliverySettings = deliverySettingsData ?? {
    insideDhaka: 60,
    outsideDhaka: 120,
    freeDeliveryThreshold: 2500,
    estimatedDaysInsideDhaka: '1-2 Days',
    estimatedDaysOutsideDhaka: '2-4 Days',
  };

  // ----------------------------------------------------
  // Product Tab State
  // ----------------------------------------------------
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productStockFilter, setProductStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State for Product Add/Edit
  const [prodFormNameEn, setProdFormNameEn] = useState('');
  const [prodFormNameBn, setProdFormNameBn] = useState('');
  const [prodFormSlug, setProdFormSlug] = useState('');
  const [prodFormCategory, setProdFormCategory] = useState('');
  const [prodFormRegularPrice, setProdFormRegularPrice] = useState('');
  const [prodFormSalePrice, setProdFormSalePrice] = useState('');
  const [prodFormStock, setProdFormStock] = useState('');
  const [prodFormSku, setProdFormSku] = useState('');
  const [prodFormDescEn, setProdFormDescEn] = useState('');
  const [prodFormDescBn, setProdFormDescBn] = useState('');
  const [prodFormImage, setProdFormImage] = useState('');
  const [prodFormIsTrending, setProdFormIsTrending] = useState(false);
  const [prodFormIsBestSeller, setProdFormIsBestSeller] = useState(false);

  const openAddProductModal = () => {
    setEditingProduct(null);
    setProdFormNameEn('');
    setProdFormNameBn('');
    setProdFormSlug('');
    setProdFormCategory(categories[0]?.id || 'cat-gadgets');
    setProdFormRegularPrice('');
    setProdFormSalePrice('');
    setProdFormStock('25');
    setProdFormSku(`KG-SKU-${Math.floor(100 + Math.random() * 900)}`);
    setProdFormDescEn('');
    setProdFormDescBn('');
    setProdFormImage('https://picsum.photos/seed/newprod/600/600');
    setProdFormIsTrending(true);
    setProdFormIsBestSeller(false);
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setProdFormNameEn(product.name_en);
    setProdFormNameBn(product.name_bn);
    setProdFormSlug(product.slug);
    setProdFormCategory(product.category_id);
    setProdFormRegularPrice((product.compare_price || product.price).toString());
    setProdFormSalePrice(product.price.toString());
    setProdFormStock(product.stock_quantity.toString());
    setProdFormSku(product.sku);
    setProdFormDescEn(product.description_en);
    setProdFormDescBn(product.description_bn);
    setProdFormImage(product.thumbnail_url || product.gallery_urls[0] || '');
    setProdFormIsTrending(product.is_trending);
    setProdFormIsBestSeller(product.is_best_seller);
    setIsProductModalOpen(true);
  };

  /** Surfaces API failures instead of letting a mutation fail silently. */
  const apiError = (error: unknown, fallback: string): string => {
    if (error instanceof ApiError) {
      if (error.status === 403) return 'Your role does not have permission for this action.';
      if (error.status === 401) return 'Your admin session expired. Please log in again.';
      return error.message || fallback;
    }
    return fallback;
  };

  const handleUpdateUserRole = async (id: string, role: AdminRole) => {
    try {
      await updateUserRole(id, role);
      showToast('User role updated. That account has been signed out.', 'success');
      triggerRefresh();
    } catch (error) {
      showToast(apiError(error, 'Could not update this user role.'), 'error');
    }
  };

  // ----------------------------------------------------
  // Users Tab State
  // ----------------------------------------------------
  const [userSearch, setUserSearch] = useState('');
  const [userKindFilter, setUserKindFilter] = useState<'all' | 'ADMIN' | 'CUSTOMER'>('all');

  const filteredUsers = useMemo(() => {
    const term = userSearch.trim().toLowerCase();
    return adminUsers.filter((u: ManagedUser) => {
      const matchKind = userKindFilter === 'all' || u.kind === userKindFilter;
      const matchSearch =
        !term ||
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        (u.phone ?? '').toLowerCase().includes(term);
      return matchKind && matchSearch;
    });
  }, [adminUsers, userSearch, userKindFilter]);

  // Precomputed once per catalog change instead of filtering per category row.
  const productCountByCategory = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of products) {
      counts.set(p.category_id, (counts.get(p.category_id) ?? 0) + 1);
    }
    return counts;
  }, [products]);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodFormNameEn.trim() || !prodFormRegularPrice || !prodFormSalePrice || !prodFormDescEn.trim()) {
      showToast('Please fill in the product name, prices and description', 'error');
      return;
    }

    const regular = parseFloat(prodFormRegularPrice) || 0;
    const sale = parseFloat(prodFormSalePrice) || regular;
    const stock = parseInt(prodFormStock) || 0;
    const slug = prodFormSlug.trim() || prodFormNameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const discount = regular > sale ? Math.round(((regular - sale) / regular) * 100) : 0;

    const descriptionEn = prodFormDescEn.trim();
    const descriptionBn = prodFormDescBn.trim() || descriptionEn;
    const image = prodFormImage.trim() || 'https://picsum.photos/seed/khujigo/600/600';

    const payload = {
      name_en: prodFormNameEn,
      name_bn: prodFormNameBn || prodFormNameEn,
      slug,
      category_id: prodFormCategory || categories[0]?.id,
      compare_price: regular,
      price: sale,
      discount_percent: discount,
      stock_quantity: stock,
      sku: prodFormSku,
      description_en: descriptionEn,
      description_bn: descriptionBn,
      short_desc_en: descriptionEn.slice(0, 100),
      short_desc_bn: descriptionBn.slice(0, 100),
      thumbnail_url: image,
      gallery_urls: [image],
      is_trending: prodFormIsTrending,
      is_best_seller: prodFormIsBestSeller,
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        showToast('Product updated successfully', 'success');
      } else {
        await createProduct({
          ...payload,
          low_stock_threshold: 5,
          brand: 'KhujiGo',
          status: 'ACTIVE',
          rating: 5,
          reviews_count: 0,
          is_featured: true,
          is_new_arrival: true,
          specifications: [
            { key_en: 'Warranty', key_bn: 'ওয়ারেন্টি', value_en: '7 Days Replacement', value_bn: '৭ দিন রিপ্লেসমেন্ট' },
          ],
          tags: ['trending', 'new'],
        });
        showToast('New product created successfully', 'success');
      }

      setIsProductModalOpen(false);
      triggerRefresh();
    } catch (error) {
      showToast(apiError(error, 'Could not save the product.'), 'error');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (adminUser?.role === 'STAFF') {
      showToast('Staff role does not have permission to delete products.', 'error');
      return;
    }
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteProduct(productId);
      showToast('Product deleted', 'success');
      triggerRefresh();
    } catch (error) {
      showToast(apiError(error, 'Could not delete the product.'), 'error');
    }
  };

  const handleInlineStockUpdate = async (productId: string, current: number, delta: number) => {
    const nextVal = Math.max(0, current + delta);
    try {
      await setProductStock(productId, nextVal);
      triggerRefresh();
    } catch (error) {
      showToast(apiError(error, 'Could not update stock.'), 'error');
    }
  };

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name_en.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.name_bn.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.sku.toLowerCase().includes(productSearch.toLowerCase());
      const matchCategory = productCategoryFilter === 'all' || p.category_id === productCategoryFilter;
      let matchStock = true;
      if (productStockFilter === 'in_stock') matchStock = p.stock_quantity > p.low_stock_threshold;
      if (productStockFilter === 'low_stock') matchStock = p.stock_quantity > 0 && p.stock_quantity <= p.low_stock_threshold;
      if (productStockFilter === 'out_of_stock') matchStock = p.stock_quantity === 0;
      return matchSearch && matchCategory && matchStock;
    });
  }, [products, productSearch, productCategoryFilter, productStockFilter]);

  // ----------------------------------------------------
  // Orders Tab State
  // ----------------------------------------------------
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus = orderStatusFilter === 'ALL' || o.order_status === orderStatusFilter;
      const matchSearch =
        o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customer_name.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customer_phone.includes(orderSearch);
      return matchStatus && matchSearch;
    });
  }, [orders, orderStatusFilter, orderSearch]);

  const handleUpdateOrderStatus = async (orderId: string, status: Order['order_status']) => {
    try {
      await updateOrderStatus(orderId, status);
      showToast(`Order #${orderId} status updated to ${status}`, 'success');
      triggerRefresh();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, order_status: status } : null));
      }
    } catch (error) {
      showToast(apiError(error, 'Could not update the order status.'), 'error');
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, status: Order['payment_status']) => {
    try {
      await updateOrderPaymentStatus(orderId, status);
      showToast(`Order #${orderId} payment marked as ${status}`, 'success');
      triggerRefresh();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, payment_status: status } : null));
      }
    } catch (error) {
      showToast(apiError(error, 'Could not update the payment status.'), 'error');
    }
  };

  // ----------------------------------------------------
  // Categories Tab State
  // ----------------------------------------------------
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [catNameEn, setCatNameEn] = useState('');
  const [catNameBn, setCatNameBn] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDescEn, setCatDescEn] = useState('');
  const [catDescBn, setCatDescBn] = useState('');
  const [catImage, setCatImage] = useState('');

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catNameEn.trim()) {
      showToast('Category name is required', 'error');
      return;
    }
    const slug = catSlug.trim() || catNameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    try {
      await createCategory({
        name_en: catNameEn,
        name_bn: catNameBn || catNameEn,
        slug,
        description_en: catDescEn,
        description_bn: catDescBn,
        image_url: catImage || 'https://picsum.photos/seed/catimg/400/400',
        icon: 'Tag',
        display_order: categories.length + 1,
        is_active: true,
      });
      showToast('Category created', 'success');
      setIsCategoryModalOpen(false);
      triggerRefresh();
    } catch (error) {
      showToast(apiError(error, 'Could not create the category.'), 'error');
    }
  };

  // ----------------------------------------------------
  // Coupons Tab State
  // ----------------------------------------------------
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponType, setCouponType] = useState<'FIXED' | 'PERCENTAGE'>('FIXED');
  const [couponValue, setCouponValue] = useState('');
  const [couponMinAmount, setCouponMinAmount] = useState('500');

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim() || !couponValue) {
      showToast('Coupon code and discount value required', 'error');
      return;
    }

    try {
      await createCoupon({
        code: couponCode.trim().toUpperCase(),
        discount_type: couponType,
        discount_value: parseFloat(couponValue) || 0,
        min_order_amount: parseFloat(couponMinAmount) || 0,
        start_date: new Date().toISOString(),
        expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        usage_limit: 100,
        is_active: true,
      });
      showToast('Coupon created successfully', 'success');
      setIsCouponModalOpen(false);
      setCouponCode('');
      setCouponValue('');
      triggerRefresh();
    } catch (error) {
      showToast(apiError(error, 'Could not create the coupon.'), 'error');
    }
  };

  const handleToggleCoupon = async (id: string) => {
    try {
      await toggleCoupon(id);
      showToast('Coupon status updated', 'info');
      triggerRefresh();
    } catch (error) {
      showToast(apiError(error, 'Could not update the coupon.'), 'error');
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    try {
      await deleteCoupon(id);
      showToast('Coupon deleted', 'success');
      triggerRefresh();
    } catch (error) {
      showToast(apiError(error, 'Could not delete the coupon.'), 'error');
    }
  };

  // ----------------------------------------------------
  // Reviews Tab Actions
  // ----------------------------------------------------
  const handleApproveReview = async (id: string) => {
    try {
      await setReviewStatus(id, 'APPROVED');
      showToast('Review approved and visible publicly', 'success');
      triggerRefresh();
    } catch (error) {
      showToast(apiError(error, 'Could not approve the review.'), 'error');
    }
  };

  const handleRejectReview = async (id: string) => {
    try {
      await setReviewStatus(id, 'REJECTED');
      showToast('Review marked as rejected', 'info');
      triggerRefresh();
    } catch (error) {
      showToast(apiError(error, 'Could not reject the review.'), 'error');
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      await deleteReview(id);
      showToast('Review deleted', 'success');
      triggerRefresh();
    } catch (error) {
      showToast(apiError(error, 'Could not delete the review.'), 'error');
    }
  };

  // ----------------------------------------------------
  // Settings Tab Actions
  // ----------------------------------------------------
  const [deliveryDhaka, setDeliveryDhaka] = useState<string | null>(null);
  const [deliveryOutside, setDeliveryOutside] = useState<string | null>(null);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState<string | null>(null);

  // Fall back to the server values until the admin edits a field, so there is
  // no need for an effect to copy fetched data into the form.
  const dhakaValue = deliveryDhaka ?? String(deliverySettings.insideDhaka);
  const outsideValue = deliveryOutside ?? String(deliverySettings.outsideDhaka);
  const thresholdValue =
    freeDeliveryThreshold ?? String(deliverySettings.freeDeliveryThreshold);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateDeliverySettings({
        insideDhaka: parseFloat(dhakaValue) || 60,
        outsideDhaka: parseFloat(outsideValue) || 120,
        freeDeliveryThreshold: parseFloat(thresholdValue) || 2000,
      });
      showToast('Delivery configuration saved', 'success');
      triggerRefresh();
    } catch (error) {
      showToast(apiError(error, 'Could not save the delivery configuration.'), 'error');
    }
  };

  // ----------------------------------------------------
  // If the session is still restoring, or not an admin: prompt sign-in
  // ----------------------------------------------------
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <RowsSkeleton rows={3} />
      </div>
    );
  }

  if (!isAdminLoggedIn || !adminUser) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center">
          <div className="p-3 bg-slate-800/80 rounded-2xl inline-block mb-4 border border-slate-700">
            <Logo />
          </div>
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Admin Control Center</h1>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Authentication is required to access the KhujiGo enterprise catalog, inventory, and order fulfillment systems.
          </p>

          <div className="space-y-3 mb-6">
            <Link
              href="/admin-login"
              className="w-full py-3 bg-brand-orange hover:bg-brand-orange-hover text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-orange-950/40 flex items-center justify-center gap-2"
            >
              <span>Sign In to Admin Portal</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <Link
            href="/"
            className="text-xs text-slate-500 hover:text-slate-300 transition inline-flex items-center gap-1"
          >
            ← Return to KhujiGo Storefront
          </Link>
        </div>
      </main>
    );
  }

  // Helper for Order Status Badge
  const getOrderStatusBadge = (status: Order['order_status']) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-200">Pending</span>;
      case 'CONFIRMED':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-200">Confirmed</span>;
      case 'PROCESSING':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-600 border border-purple-200">Processing</span>;
      case 'SHIPPED':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-50 text-sky-600 border border-sky-200">Shipped</span>;
      case 'DELIVERED':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">Delivered</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-600 border border-rose-200">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col md:flex-row">
      {/* ============================================================ */}
      {/* 1. SIDEBAR NAVIGATION */}
      {/* ============================================================ */}
      {/* Backdrop for the mobile sidebar — tap anywhere to dismiss */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800 flex flex-col transition-transform duration-200 md:static md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-900 rounded-xl border border-slate-800">
              <Logo />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-orange/20 text-brand-orange border border-brand-orange/30">
                Admin OS
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close navigation menu"
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Signed-in role (read-only) */}
        <div className="px-3 py-2.5 mx-3 mt-3 bg-slate-900/90 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
            <span className="flex items-center gap-1 text-amber-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Role: {adminUser.role}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <button
            onClick={() => {
              setActiveTab('dashboard');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'dashboard'
                ? 'bg-brand-orange text-white shadow-lg shadow-orange-950/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('products');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'products'
                ? 'bg-brand-orange text-white shadow-lg shadow-orange-950/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4" />
              <span>Products & Stock</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('orders');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'orders'
                ? 'bg-brand-orange text-white shadow-lg shadow-orange-950/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-4 h-4" />
              <span>Orders Dispatch</span>
            </div>
            {analytics.pendingOrders > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-bold">
                {analytics.pendingOrders}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('categories');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'categories'
                ? 'bg-brand-orange text-white shadow-lg shadow-orange-950/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Categories</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('coupons');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'coupons'
                ? 'bg-brand-orange text-white shadow-lg shadow-orange-950/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <TicketPercent className="w-4 h-4" />
            <span>Coupons & Deals</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('reviews');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'reviews'
                ? 'bg-brand-orange text-white shadow-lg shadow-orange-950/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Reviews Moderation</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('settings');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'settings'
                ? 'bg-brand-orange text-white shadow-lg shadow-orange-950/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Delivery & Store</span>
          </button>

          {adminUser.role === 'SUPER_ADMIN' && (
            <button
              onClick={() => {
                setActiveTab('users');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'users'
                  ? 'bg-brand-orange text-white shadow-lg shadow-orange-950/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Users & Roles</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                {adminUsers.length}
              </span>
            </button>
          )}
        </nav>

        {/* User Profile & Storefront Exit */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-850 transition border border-slate-800"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-brand-orange" />
              <span>View Live Store</span>
            </span>
            <ChevronRight className="w-3 h-3 text-slate-500" />
          </Link>

          <div className="flex items-center justify-between pt-1 px-1">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{adminUser.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{adminUser.email}</p>
            </div>
            <button
              onClick={() => {
                logoutAdmin();
                router.push('/admin-login');
              }}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* 2. MAIN CONTENT WRAPPER */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900/60">
        {/* Top Header */}
        <header className="h-16 bg-slate-950/80 backdrop-blur border-b border-slate-800 px-3 sm:px-6 gap-2 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              className="md:hidden p-2.5 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-bold text-white capitalize flex items-center gap-2 truncate">
                {activeTab === 'dashboard' && 'Executive Overview'}
                {activeTab === 'products' && 'Catalog & Inventory Management'}
                {activeTab === 'orders' && 'Order Processing & Dispatch'}
                {activeTab === 'categories' && 'Category Taxonomy'}
                {activeTab === 'coupons' && 'Promotions & Coupons'}
                {activeTab === 'reviews' && 'Customer Reviews'}
                {activeTab === 'settings' && 'Store Configuration'}
                {activeTab === 'users' && 'All Accounts & Permissions'}
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                KhujiGo E-Commerce Control Center • Dhaka Operations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={triggerRefresh}
              title="Refresh database records"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {activeTab === 'products' && (
              <button
                onClick={openAddProductModal}
                className="px-3 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-md shadow-orange-950/40 transition"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Product</span>
              </button>
            )}

            {activeTab === 'categories' && (
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="px-3 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-md transition"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Category</span>
              </button>
            )}

            {activeTab === 'coupons' && (
              <button
                onClick={() => setIsCouponModalOpen(true)}
                className="px-3 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-md transition"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Coupon</span>
              </button>
            )}

            <Link
              href="/"
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 flex items-center gap-1.5 transition"
            >
              <span className="hidden sm:inline">Shopfront</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-4 sm:p-6 flex-1 overflow-x-hidden">
          {/* ---------------------------------------------------- */}
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Metric Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-3 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">Total Revenue</span>
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white">
                    {formatBDT(analytics.totalSales)}
                  </div>
                  <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" /> Live from completed orders
                  </span>
                </div>

                <div className="p-3 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">Total Orders</span>
                    <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      <ShoppingCart className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white">{analytics.totalOrders}</div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    {analytics.deliveredOrders} Delivered successfully
                  </span>
                </div>

                <div className="p-3 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">Pending Dispatch</span>
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-amber-400">
                    {analytics.pendingOrders}
                  </div>
                  <button
                    onClick={() => {
                      setOrderStatusFilter('PENDING');
                      setActiveTab('orders');
                    }}
                    className="text-[11px] text-amber-300 underline mt-1 block"
                  >
                    Review Pending Queue →
                  </button>
                </div>

                <div className="p-3 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">Low Stock Alerts</span>
                    <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-rose-400">
                    {analytics.lowStockCount}
                  </div>
                  <button
                    onClick={() => {
                      setProductStockFilter('low_stock');
                      setActiveTab('products');
                    }}
                    className="text-[11px] text-rose-300 underline mt-1 block"
                  >
                    View Low Stock Items →
                  </button>
                </div>
              </div>

              {/* Quick Actions & Recent Orders Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Recent Orders */}
                <div className="lg:col-span-2 bg-slate-950 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-white">Recent Orders</h3>
                      <p className="text-xs text-slate-400">Latest customer transactions</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="shrink-0 text-xs text-brand-orange hover:underline font-semibold"
                    >
                      View All Orders ({orders.length}) →
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                          <th className="pb-3 pl-2">Order ID</th>
                          <th className="pb-3">Customer</th>
                          <th className="pb-3">Total</th>
                          <th className="pb-3">Method</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 pr-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {orders.slice(0, 5).map((ord) => (
                          <tr key={ord.id} className="hover:bg-slate-900/60 transition">
                            <td className="py-3 pl-2 font-mono font-bold text-amber-300">
                              #{ord.id}
                            </td>
                            <td className="py-3">
                              <div className="font-semibold text-white">{ord.customer_name}</div>
                              <div className="text-[11px] text-slate-400">{ord.customer_phone}</div>
                            </td>
                            <td className="py-3 font-semibold text-white">
                              {formatBDT(ord.total_amount)}
                            </td>
                            <td className="py-3">
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300 font-mono">
                                {ord.payment_method}
                              </span>
                            </td>
                            <td className="py-3">{getOrderStatusBadge(ord.order_status)}</td>
                            <td className="py-3 pr-2 text-right">
                              <button
                                onClick={() => {
                                  setSelectedOrder(ord);
                                  setActiveTab('orders');
                                }}
                                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right Col: Low Stock Watchlist & Fast Actions */}
                <div className="space-y-6">
                  {/* Quick Dispatch Shortcuts */}
                  <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5">
                    <h3 className="text-sm font-bold text-white mb-3">Quick Controls</h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        onClick={openAddProductModal}
                        className="p-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-left transition"
                      >
                        <Plus className="w-4 h-4 text-brand-orange mb-1" />
                        <div className="font-semibold text-white">New Product</div>
                        <div className="text-[10px] text-slate-400">Add to catalog</div>
                      </button>

                      <button
                        onClick={() => {
                          setOrderStatusFilter('PENDING');
                          setActiveTab('orders');
                        }}
                        className="p-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-left transition"
                      >
                        <Truck className="w-4 h-4 text-amber-400 mb-1" />
                        <div className="font-semibold text-white">Pending Queue</div>
                        <div className="text-[10px] text-slate-400">Process dispatch</div>
                      </button>

                      <button
                        onClick={() => setIsCouponModalOpen(true)}
                        className="p-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-left transition"
                      >
                        <TicketPercent className="w-4 h-4 text-purple-400 mb-1" />
                        <div className="font-semibold text-white">Add Coupon</div>
                        <div className="text-[10px] text-slate-400">Discount promo</div>
                      </button>

                      <button
                        onClick={() => setActiveTab('settings')}
                        className="p-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-left transition"
                      >
                        <Settings className="w-4 h-4 text-sky-400 mb-1" />
                        <div className="font-semibold text-white">Delivery Fees</div>
                        <div className="text-[10px] text-slate-400">Dhaka & Outside</div>
                      </button>
                    </div>
                  </div>

                  {/* Low Stock Watch */}
                  <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        <span>Inventory Warnings</span>
                      </h3>
                      <span className="text-xs text-rose-400 font-bold">
                        {products.filter((p) => p.stock_quantity <= p.low_stock_threshold).length}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {products
                        .filter((p) => p.stock_quantity <= p.low_stock_threshold)
                        .slice(0, 4)
                        .map((lp) => (
                          <div
                            key={lp.id}
                            className="p-2.5 bg-slate-900 border border-slate-800/80 rounded-xl flex items-center justify-between"
                          >
                            <div className="min-w-0 pr-2">
                              <p className="text-xs font-semibold text-white truncate">{lp.name_en}</p>
                              <span className="text-[10px] text-rose-400 font-bold">
                                Only {lp.stock_quantity} remaining
                              </span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => handleInlineStockUpdate(lp.id, lp.stock_quantity, 10)}
                                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] text-emerald-400 font-bold rounded-lg transition"
                              >
                                +10
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 2: PRODUCTS MANAGEMENT */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              {/* Product Filters Toolbar */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search by name or SKU..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name_en}
                      </option>
                    ))}
                  </select>

                  <select
                    value={productStockFilter}
                    onChange={(e) => setProductStockFilter(e.target.value as any)}
                    className="px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="all">All Stock Levels</option>
                    <option value="in_stock">In Stock (&gt;5)</option>
                    <option value="low_stock">Low Stock (1-5)</option>
                    <option value="out_of_stock">Out of Stock (0)</option>
                  </select>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-semibold">
                      <tr>
                        <th className="py-3 px-4">Product</th>
                        <th className="py-3 px-3">Category</th>
                        <th className="py-3 px-3">SKU</th>
                        <th className="py-3 px-3">Price</th>
                        <th className="py-3 px-3">Stock</th>
                        <th className="py-3 px-3">Badges</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredProducts.map((p) => {
                        const isLow = p.stock_quantity <= p.low_stock_threshold;
                        const isOut = p.stock_quantity === 0;
                        const cat = categories.find((c) => c.id === p.category_id);

                        return (
                          <tr key={p.id} className="hover:bg-slate-900/40 transition">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                                  <Image
                                    src={p.thumbnail_url || 'https://picsum.photos/seed/default/100/100'}
                                    alt={p.name_en}
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                    referrerPolicy="no-referrer"
                                    unoptimized={(() => {
                                      try {
                                        const allowedHosts = ['picsum.photos', 'www.nyq.info'];
                                        const url = new URL(p.thumbnail_url || '');
                                        return !allowedHosts.includes(url.hostname);
                                      } catch {
                                        return true;
                                      }
                                    })()}
                                  />
                                </div>
                                <div className="min-w-0 max-w-[200px] sm:max-w-xs">
                                  <p className="font-semibold text-white truncate">{p.name_en}</p>
                                  <p className="text-[11px] text-slate-400 truncate">{p.name_bn}</p>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-3 text-slate-300">
                              {cat?.name_en || p.category_id}
                            </td>

                            <td className="py-3 px-3 font-mono text-[11px] text-slate-400">{p.sku}</td>

                            <td className="py-3 px-3">
                              <div className="font-bold text-white">{formatBDT(p.price)}</div>
                              {p.compare_price && p.compare_price > p.price && (
                                <div className="text-[10px] text-slate-500 line-through">
                                  {formatBDT(p.compare_price)}
                                </div>
                              )}
                            </td>

                            <td className="py-3 px-3">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    isOut
                                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                      : isLow
                                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  }`}
                                >
                                  {p.stock_quantity} in stock
                                </span>
                                <div className="flex items-center gap-0.5">
                                  <button
                                    onClick={() => handleInlineStockUpdate(p.id, p.stock_quantity, -1)}
                                    title="Decrease by 1"
                                    className="w-8 h-8 sm:w-5 sm:h-5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded flex items-center justify-center text-xs font-bold"
                                  >
                                    -
                                  </button>
                                  <button
                                    onClick={() => handleInlineStockUpdate(p.id, p.stock_quantity, 5)}
                                    title="Add 5"
                                    className="w-8 h-8 sm:w-5 sm:h-5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded flex items-center justify-center text-xs font-bold"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-3">
                              <div className="flex flex-wrap gap-1">
                                {p.is_trending && (
                                  <span className="px-1.5 py-0.5 bg-brand-orange/20 text-brand-orange text-[10px] font-bold rounded">
                                    Trending
                                  </span>
                                )}
                                {p.is_best_seller && (
                                  <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded">
                                    Best Seller
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Link
                                  href={`/products/${p.slug}`}
                                  target="_blank"
                                  title="View on storefront"
                                  className="p-2 sm:p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </Link>
                                <button
                                  onClick={() => openEditProductModal(p)}
                                  title="Edit product"
                                  className="p-2 sm:p-1.5 text-slate-400 hover:text-sky-400 hover:bg-slate-800 rounded-lg transition"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p.id)}
                                  title="Delete product"
                                  className="p-2 sm:p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 3: ORDERS DISPATCH & TRACKING */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {/* Status Tabs */}
              <div className="flex items-center gap-1.5 pb-2 border-b border-slate-800 overflow-x-auto">
                {['ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      orderStatusFilter === st
                        ? 'bg-brand-orange text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {st === 'ALL' ? 'All Orders' : st}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search by #KG-ID, Customer Name, or Phone..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-orange"
                />
              </div>

              {/* Orders Table */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-semibold">
                      <tr>
                        <th className="py-3 px-4">Order ID & Date</th>
                        <th className="py-3 px-3">Customer Info</th>
                        <th className="py-3 px-3">Destination</th>
                        <th className="py-3 px-3">Items & Total</th>
                        <th className="py-3 px-3">Payment</th>
                        <th className="py-3 px-3">Order Status</th>
                        <th className="py-3 px-4 text-right">Quick Dispatch</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-900/40 transition">
                          <td className="py-3 px-4">
                            <span className="font-mono font-bold text-amber-300 block">
                              #{ord.id}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(ord.created_at).toLocaleDateString()} {new Date(ord.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </td>

                          <td className="py-3 px-3">
                            <div className="font-semibold text-white">{ord.customer_name}</div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {ord.customer_phone}
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <div className="text-slate-300 capitalize">
                              {ord.district.replace('-', ' ')}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[160px]">
                              {ord.full_address}
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <div className="font-bold text-white">{formatBDT(ord.total_amount)}</div>
                            <div className="text-[10px] text-slate-400">
                              {ord.items.length} product(s)
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300 block w-fit mb-1">
                              {ord.payment_method}
                            </span>
                            <span
                              className={`text-[10px] font-bold ${
                                ord.payment_status === 'PAID' ? 'text-emerald-400' : 'text-amber-400'
                              }`}
                            >
                              {ord.payment_status}
                            </span>
                          </td>

                          <td className="py-3 px-3">
                            {getOrderStatusBadge(ord.order_status)}
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <select
                                value={ord.order_status}
                                onChange={(e) =>
                                  handleUpdateOrderStatus(ord.id, e.target.value as any)
                                }
                                className="px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-[11px] text-slate-200 focus:outline-none"
                              >
                                <option value="PENDING">PENDING</option>
                                <option value="CONFIRMED">CONFIRMED</option>
                                <option value="PROCESSING">PROCESSING</option>
                                <option value="SHIPPED">SHIPPED</option>
                                <option value="DELIVERED">DELIVERED</option>
                                <option value="CANCELLED">CANCELLED</option>
                              </select>

                              <button
                                onClick={() => setSelectedOrder(ord)}
                                title="Inspect order receipt"
                                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 4: CATEGORIES TAXONOMY */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                        <Image
                          src={cat.image_url || 'https://picsum.photos/seed/catdefault/100/100'}
                          alt={cat.name_en}
                          fill
                          sizes="48px"
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{cat.name_en}</h4>
                        <p className="text-[11px] text-slate-400">{cat.name_bn}</p>
                        <span className="text-[10px] text-brand-orange font-mono">
                          /{cat.slug} • {productCountByCategory.get(cat.id) ?? 0} products
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 5: COUPONS & DEALS */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'coupons' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {coupons.map((c) => (
                  <div
                    key={c.id}
                    className="p-5 bg-slate-950 border border-slate-800 rounded-2xl relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-bold text-sm tracking-wider text-amber-300 px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                        {c.code}
                      </span>
                      <button
                        onClick={() => handleToggleCoupon(c.id)}
                        className={`text-[11px] font-bold px-2 py-1 rounded-full ${
                          c.is_active
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {c.is_active ? 'ACTIVE' : 'INACTIVE'}
                      </button>
                    </div>

                    <div className="text-lg font-bold text-white mt-2">
                      {c.discount_type === 'FIXED' ? `৳${c.discount_value} OFF` : `${c.discount_value}% OFF`}
                    </div>

                    <p className="text-xs text-slate-400 mt-1">
                      Min Order: ৳{c.min_order_amount}
                      {c.max_discount_amount && ` • Max discount: ৳${c.max_discount_amount}`}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-slate-500 text-[11px]">Used: {c.used_count || 0} times</span>
                      <button
                        onClick={() => handleDeleteCoupon(c.id)}
                        className="text-rose-400 hover:text-rose-300 text-xs font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 6: REVIEWS MODERATION */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold">
                    <tr>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-3">Product</th>
                      <th className="py-3 px-3">Rating</th>
                      <th className="py-3 px-3">Comment</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-4 text-right">Moderation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {reviews.map((rev) => (
                      <tr key={rev.id} className="hover:bg-slate-900/40 transition">
                        <td className="py-3 px-4 font-semibold text-white">{rev.customer_name}</td>
                        <td className="py-3 px-3 text-slate-300 max-w-[140px] truncate">
                          {rev.product_name}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1 text-amber-400 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span>{rev.rating}/5</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-400 max-w-xs truncate italic">
                          &ldquo;{rev.comment}&rdquo;
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              rev.status === 'APPROVED'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : rev.status === 'PENDING'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-rose-500/20 text-rose-400'
                            }`}
                          >
                            {rev.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {rev.status !== 'APPROVED' && (
                              <button
                                onClick={() => handleApproveReview(rev.id)}
                                className="px-2 py-2 sm:py-1 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 rounded text-[11px] font-bold"
                              >
                                Approve
                              </button>
                            )}
                            {rev.status !== 'REJECTED' && (
                              <button
                                onClick={() => handleRejectReview(rev.id)}
                                className="px-2 py-2 sm:py-1 bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 rounded text-[11px] font-bold"
                              >
                                Reject
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteReview(rev.id)}
                              className="p-2 sm:p-1 text-slate-400 hover:text-rose-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 7: DELIVERY & STORE SETTINGS */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-white mb-1">Bangladesh Shipping Rates</h3>
                <p className="text-xs text-slate-400">
                  Configure real-time courier shipping charges for Inside Dhaka and Outside Dhaka.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Inside Dhaka Delivery Fee (৳)
                  </label>
                  <input
                    type="number"
                    value={dhakaValue}
                    onChange={(e) => setDeliveryDhaka(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-brand-orange"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Default: ৳60 (Pathao/Steadfast/RedX Same day & Next day)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Outside Dhaka 64 Districts Delivery Fee (৳)
                  </label>
                  <input
                    type="number"
                    value={outsideValue}
                    onChange={(e) => setDeliveryOutside(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-brand-orange"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Default: ৳120 across all 8 divisions
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Free Delivery Threshold (৳)
                  </label>
                  <input
                    type="number"
                    value={thresholdValue}
                    onChange={(e) => setFreeDeliveryThreshold(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Shipping Settings</span>
                </button>
              </form>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 8: USERS & ROLE MANAGEMENT (Super Admin only) */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'users' && adminUser.role === 'SUPER_ADMIN' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-orange" />
                  <span>All Accounts & Permissions</span>
                </h2>
                <p className="text-[11px] text-slate-400 mt-1">
                  Every staff and customer account. Only staff roles can be changed; your own role
                  and the last remaining Super Admin are locked, and changing a role signs that
                  account out.
                </p>
              </div>

              {/* Filters Toolbar */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search by name, email or phone..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <select
                  value={userKindFilter}
                  onChange={(e) =>
                    setUserKindFilter(e.target.value as 'all' | 'ADMIN' | 'CUSTOMER')
                  }
                  className="px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-300 focus:outline-none w-full sm:w-auto"
                >
                  <option value="all">All Accounts</option>
                  <option value="ADMIN">Staff Only</option>
                  <option value="CUSTOMER">Customers Only</option>
                </select>
              </div>

              {usersLoading && adminUsers.length === 0 ? (
                <RowsSkeleton rows={4} />
              ) : (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-semibold">
                        <tr>
                          <th className="py-3 px-4">User</th>
                          <th className="py-3 px-3">Type</th>
                          <th className="py-3 px-3">Phone</th>
                          <th className="py-3 px-3">Role</th>
                          <th className="py-3 px-3">Joined</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {filteredUsers.map((u) => {
                          const isSelf = u.id === adminUser.id;
                          const isStaff = u.kind === 'ADMIN';
                          return (
                            <tr key={u.id} className="hover:bg-slate-900/40 transition">
                              <td className="py-3 px-4">
                                <p className="font-semibold text-white">
                                  {u.name}
                                  {isSelf && (
                                    <span className="ml-1.5 text-[10px] text-brand-orange">
                                      (you)
                                    </span>
                                  )}
                                </p>
                                <p className="text-[11px] text-slate-400">{u.email}</p>
                              </td>
                              <td className="py-3 px-3">
                                {isStaff ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                                    Staff
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-700/40 text-slate-300 border border-slate-600/40">
                                    Customer
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-3 text-slate-300">{u.phone || '—'}</td>
                              <td className="py-3 px-3">
                                {isStaff ? (
                                  <select
                                    value={u.role ?? 'STAFF'}
                                    disabled={isSelf}
                                    onChange={(e) =>
                                      handleUpdateUserRole(u.id, e.target.value as AdminRole)
                                    }
                                    className="px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-[11px] text-slate-200 focus:outline-none focus:border-brand-orange disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="STAFF">STAFF</option>
                                  </select>
                                ) : (
                                  <span className="text-[11px] text-slate-500">—</span>
                                )}
                              </td>
                              <td className="py-3 px-3 text-slate-400">
                                {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. MODAL: ADD / EDIT PRODUCT */}
      {/* ============================================================ */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 text-white my-3 sm:my-8 max-h-[calc(100dvh-1.5rem)] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingProduct ? 'Edit Catalog Product' : 'Add New Trending Product'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Product Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={prodFormNameEn}
                    onChange={(e) => setProdFormNameEn(e.target.value)}
                    placeholder="e.g. Smart LED Magnetic Desk Lamp"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-brand-orange focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Product Title (বাংলা)
                  </label>
                  <input
                    type="text"
                    value={prodFormNameBn}
                    onChange={(e) => setProdFormNameBn(e.target.value)}
                    placeholder="e.g. স্মার্ট এলইডি ম্যাগনেটিক টেবিল ল্যাম্প"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-brand-orange focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={prodFormCategory}
                    onChange={(e) => setProdFormCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-brand-orange focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name_en}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={prodFormSku}
                    onChange={(e) => setProdFormSku(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-brand-orange focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={prodFormStock}
                    onChange={(e) => setProdFormStock(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-brand-orange focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Regular Price (৳) *
                  </label>
                  <input
                    type="number"
                    required
                    value={prodFormRegularPrice}
                    onChange={(e) => setProdFormRegularPrice(e.target.value)}
                    placeholder="1500"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-brand-orange focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Sale / Offer Price (৳) *
                  </label>
                  <input
                    type="number"
                    required
                    value={prodFormSalePrice}
                    onChange={(e) => setProdFormSalePrice(e.target.value)}
                    placeholder="1150"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-brand-orange focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Image URL</label>
                <input
                  type="url"
                  value={prodFormImage}
                  onChange={(e) => setProdFormImage(e.target.value)}
                  placeholder="https://picsum.photos/seed/gadget/600/600"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-brand-orange focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Description (EN)</label>
                  <textarea
                    rows={3}
                    value={prodFormDescEn}
                    onChange={(e) => setProdFormDescEn(e.target.value)}
                    placeholder="Product highlights and benefits..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-brand-orange focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Description (বাংলা)</label>
                  <textarea
                    rows={3}
                    value={prodFormDescBn}
                    onChange={(e) => setProdFormDescBn(e.target.value)}
                    placeholder="পণ্যের বিশেষত্ব ও ব্যবহার..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-brand-orange focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={prodFormIsTrending}
                    onChange={(e) => setProdFormIsTrending(e.target.checked)}
                    className="rounded text-brand-orange focus:ring-brand-orange"
                  />
                  <span>Mark as Trending</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={prodFormIsBestSeller}
                    onChange={(e) => setProdFormIsBestSeller(e.target.checked)}
                    className="rounded text-brand-orange focus:ring-brand-orange"
                  />
                  <span>Mark as Best Seller</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-xl font-bold flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingProduct ? 'Update Product' : 'Create Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. MODAL: ORDER DETAILS & RECEIPT INSPECTOR */}
      {/* ============================================================ */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 text-white my-3 sm:my-8 max-h-[calc(100dvh-1.5rem)] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Order Details</span>
                  <span className="font-mono text-amber-400">#{selectedOrder.id}</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Placed on {new Date(selectedOrder.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mt-4 text-xs">
              {/* Customer & Shipping Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-900 rounded-2xl border border-slate-800">
                <div>
                  <h4 className="font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                    Customer Details
                  </h4>
                  <p className="text-white font-semibold">{selectedOrder.customer_name}</p>
                  <p className="text-slate-400 flex items-center gap-1 mt-0.5 font-mono">
                    <PhoneCall className="w-3 h-3" /> {selectedOrder.customer_phone}
                  </p>
                  {selectedOrder.customer_email && (
                    <p className="text-slate-400">{selectedOrder.customer_email}</p>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    Shipping Address
                  </h4>
                  <p className="text-white capitalize">
                    {selectedOrder.district.replace('-', ' ')}, {selectedOrder.division}
                  </p>
                  <p className="text-slate-400 mt-0.5">{selectedOrder.full_address}</p>
                  {selectedOrder.delivery_notes && (
                    <p className="text-amber-300 text-[10px] mt-1">Note: {selectedOrder.delivery_notes}</p>
                  )}
                </div>
              </div>

              {/* Status Update Quick Bar */}
              <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-300">Dispatch Status:</span>
                  <select
                    value={selectedOrder.order_status}
                    onChange={(e) =>
                      handleUpdateOrderStatus(selectedOrder.id, e.target.value as any)
                    }
                    className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-bold"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-300">Payment:</span>
                  <button
                    onClick={() =>
                      handleUpdatePaymentStatus(
                        selectedOrder.id,
                        selectedOrder.payment_status === 'PAID' ? 'UNPAID' : 'PAID'
                      )
                    }
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                      selectedOrder.payment_status === 'PAID'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {selectedOrder.payment_status} (Click to toggle)
                  </button>
                </div>
              </div>

              {selectedOrder.payment_reference && (
                <div className="rounded-xl bg-slate-800/60 border border-slate-700 px-3 py-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Payment Reference (bKash / Nagad TrxID)
                  </span>
                  <span className="font-mono text-xs text-amber-300">
                    {selectedOrder.payment_reference}
                  </span>
                </div>
              )}

              {/* Items List */}
              <div>
                <h4 className="font-bold text-slate-300 mb-2">Order Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 bg-slate-900 rounded-xl border border-slate-800/80"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                          <Image
                            src={item.thumbnail_url}
                            alt={item.name_en}
                            fill
                            sizes="40px"
                            className="object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{item.name_en}</p>
                          <p className="text-[10px] text-slate-400">
                            {formatBDT(item.price)} × {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-white">
                        {formatBDT(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Calculation */}
              <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span>{formatBDT(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Delivery Fee</span>
                  <span>{formatBDT(selectedOrder.delivery_charge)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Discount {selectedOrder.coupon_code && `(${selectedOrder.coupon_code})`}</span>
                    <span>-{formatBDT(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                  <span>Grand Total</span>
                  <span className="text-amber-400">{formatBDT(selectedOrder.total_amount)}</span>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Invoice</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-xl font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. MODAL: ADD CATEGORY */}
      {/* ============================================================ */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-white my-3 sm:my-8 max-h-[calc(100dvh-1.5rem)] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Create New Category</h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Category Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={catNameEn}
                  onChange={(e) => setCatNameEn(e.target.value)}
                  placeholder="e.g. Smart Wearables"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Category Name (বাংলা)
                </label>
                <input
                  type="text"
                  value={catNameBn}
                  onChange={(e) => setCatNameBn(e.target.value)}
                  placeholder="e.g. স্মার্ট ওয়্যারেবলস"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">URL Slug</label>
                <input
                  type="text"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  placeholder="smart-wearables"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-brand-orange font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={catImage}
                  onChange={(e) => setCatImage(e.target.value)}
                  placeholder="https://picsum.photos/seed/cat/400/400"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-xl font-bold"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 6. MODAL: ADD COUPON */}
      {/* ============================================================ */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-white my-3 sm:my-8 max-h-[calc(100dvh-1.5rem)] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Create Discount Coupon</h3>
              <button
                onClick={() => setIsCouponModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. FLASH200"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-brand-orange font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Discount Type</label>
                  <select
                    value={couponType}
                    onChange={(e) => setCouponType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-brand-orange"
                  >
                    <option value="FIXED">Flat Taka (৳)</option>
                    <option value="PERCENTAGE">Percentage (%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={couponValue}
                    onChange={(e) => setCouponValue(e.target.value)}
                    placeholder="200"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-brand-orange"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Minimum Order Amount (৳)
                </label>
                <input
                  type="number"
                  value={couponMinAmount}
                  onChange={(e) => setCouponMinAmount(e.target.value)}
                  placeholder="500"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-xl font-bold"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
