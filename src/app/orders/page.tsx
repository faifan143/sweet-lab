"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/common/Navbar";
import CategoryModal from "@/components/common/orders/CategoryModal";
import CreateOrderModal from "@/components/common/orders/CreateOrderModal";
import OrderDetailsModal from "@/components/common/orders/OrderDetailsModal";
import PageSpinner from "@/components/common/PageSpinner";
import SplineBackground from "@/components/common/SplineBackground";
import { useOrders, useOrdersForDeliveryToday, useOrdersForPreparation, useOrdersSummary } from "@/hooks/useOrders";
import { OrderResponseDto, OrderStatus, OrdersSummary } from "@/types/orders.type";
import { formatCurrency } from "@/utils/formatters";
import {
    AlertCircle,
    CheckCircle,
    CheckCircle2,
    Clock,
    EyeIcon,
    Plus,
    RefreshCcw,
    Search,
    ShoppingBag,
    Truck,
    Calendar,
    User
} from "lucide-react";

// Types
type OrderTabType = "all" | "pending" | "processing" | "ready" | "delivered" | "cancelled" | "forToday" | "forPreparation" | "forDeliveryToday";

interface OrdersSummaryComponentProps { }

interface OrdersTabsProps {
    activeTab: OrderTabType;
    onTabChange: (tab: OrderTabType) => void;
    summary: OrdersSummary | undefined;
}

interface OrdersTableProps {
    orders: OrderResponseDto[];
    onViewDetails: (order: OrderResponseDto) => void;
    isMobileView: boolean;
}

const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
        case OrderStatus.pending:
            return <Clock className="h-4 w-4 text-warning" />;
        case OrderStatus.processing:
            return <RefreshCcw className="h-4 w-4 text-blue-400" />;
        case OrderStatus.ready:
            return <CheckCircle className="h-4 w-4 text-info" />;
        case OrderStatus.delivered:
            return <CheckCircle2 className="h-4 w-4 text-success" />;
        case OrderStatus.cancelled:
            return <AlertCircle className="h-4 w-4 text-danger" />;
        default:
            return <Clock className="h-4 w-4 text-warning" />;
    }
};

const getStatusClass = (status: OrderStatus): string => {
    switch (status) {
        case OrderStatus.pending:
            return "text-warning bg-warning/10";
        case OrderStatus.processing:
            return "text-blue-400 bg-blue-400/10";
        case OrderStatus.ready:
            return "text-info bg-info/10";
        case OrderStatus.delivered:
            return "text-success bg-success/10";
        case OrderStatus.cancelled:
            return "text-danger bg-danger/10";
        default:
            return "text-warning bg-warning/10";
    }
};

const getStatusText = (status: OrderStatus): string => {
    switch (status) {
        case OrderStatus.pending:
            return "قيد الانتظار";
        case OrderStatus.processing:
            return "قيد التجهيز";
        case OrderStatus.ready:
            return "جاهز للتسليم";
        case OrderStatus.delivered:
            return "تم التسليم";
        case OrderStatus.cancelled:
            return "ملغي";
        default:
            return "قيد الانتظار";
    }
};

// Summary Component
const OrdersSummaryComponent: React.FC<OrdersSummaryComponentProps> = () => {
    const { data: summary, isLoading } = useOrdersSummary();

    if (isLoading || !summary) return <div className="h-24 animate-pulse bg-slate-800/50 rounded-lg"></div>;

    return (
        <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
            dir="rtl"
        >
            <div className="bg-slate-800/50 px-4 py-3 rounded-lg border border-slate-700/50 transform transition-transform hover:scale-105 hover:shadow-lg">
                <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-slate-400" />
                    <p className="text-slate-400 text-sm">إجمالي الطلبات</p>
                </div>
                <p className="text-lg font-semibold text-slate-200 mt-1">
                    {summary.total}
                </p>
            </div>
            <div className="bg-slate-800/50 px-4 py-3 rounded-lg border border-slate-700/50 transform transition-transform hover:scale-105 hover:shadow-lg">
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-warning" />
                    <p className="text-slate-400 text-sm">طلبات اليوم</p>
                </div>
                <p className="text-lg font-semibold text-warning mt-1">
                    {summary.forToday}
                </p>
            </div>
            <div className="bg-slate-800/50 px-4 py-3 rounded-lg border border-slate-700/50 transform transition-transform hover:scale-105 hover:shadow-lg !text-slate-400">
                <div className="flex items-center gap-2 ">
                    <Truck className="h-4 w-4 text-info" />
                    <p className=" text-sm">طلبات الغد</p>
                </div>
                <p className="text-lg font-semibold text-info mt-1">
                    {summary.forTomorrow}
                </p>
            </div>
            <div className="bg-slate-800/50 px-4 py-3 rounded-lg border border-slate-700/50 transform transition-transform hover:scale-105 hover:shadow-lg">
                <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-success" />
                    <p className="text-slate-400 text-sm">إجمالي المبيعات</p>
                </div>
                <p className="text-lg font-semibold text-success mt-1">
                    {formatCurrency(summary.totalPaidAmount)}
                </p>
            </div>
        </div>
    );
};

// Tabs Component
const OrdersTabs: React.FC<OrdersTabsProps> = ({
    activeTab,
    onTabChange,
    summary
}) => {
    return (
        <div className="border-b border-slate-700/50 mb-6 overflow-auto no-scrollbar" dir="rtl">
            <div className="flex">
                <button
                    onClick={() => onTabChange("all")}
                    className={`px-4 py-2 -mb-px flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "all"
                        ? "text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    <ShoppingBag className="h-4 w-4" />
                    <span>جميع الطلبات</span>
                    <span className="mx-2 bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                        {summary?.total || 0}
                    </span>
                </button>

                <button
                    onClick={() => onTabChange("pending")}
                    className={`px-4 py-2 -mb-px flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "pending"
                        ? "text-warning border-b-2 border-warning"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    <Clock className="h-4 w-4" />
                    <span>قيد الانتظار</span>
                    <span className="mx-2 bg-warning/10 text-warning px-2 py-0.5 rounded-full text-xs">
                        {summary?.byStatus?.pending || 0}
                    </span>
                </button>

                <button
                    onClick={() => onTabChange("processing")}
                    className={`px-4 py-2 -mb-px flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "processing"
                        ? "text-blue-400 border-b-2 border-blue-400"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    <RefreshCcw className="h-4 w-4" />
                    <span>قيد التجهيز</span>
                    <span className="mx-2 bg-blue-400/10 text-blue-400 px-2 py-0.5 rounded-full text-xs">
                        {summary?.byStatus?.processing || 0}
                    </span>
                </button>

                <button
                    onClick={() => onTabChange("ready")}
                    className={`px-4 py-2 -mb-px flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "ready"
                        ? "text-info border-b-2 border-info"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    <CheckCircle className="h-4 w-4" />
                    <span>جاهز للتسليم</span>
                    <span className="mx-2 bg-info/10 text-info px-2 py-0.5 rounded-full text-xs">
                        {summary?.byStatus?.ready || 0}
                    </span>
                </button>

                <button
                    onClick={() => onTabChange("delivered")}
                    className={`px-4 py-2 -mb-px flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "delivered"
                        ? "text-success border-b-2 border-success"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>تم التسليم</span>
                    <span className="mx-2 bg-success/10 text-success px-2 py-0.5 rounded-full text-xs">
                        {summary?.byStatus?.delivered || 0}
                    </span>
                </button>

                <button
                    onClick={() => onTabChange("forToday")}
                    className={`px-4 py-2 -mb-px flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "forToday"
                        ? "text-amber-400 border-b-2 border-amber-400"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    <Clock className="h-4 w-4" />
                    <span>طلبات اليوم</span>
                    <span className="mx-2 bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded-full text-xs">
                        {summary?.forToday || 0}
                    </span>
                </button>
            </div>
        </div>
    );
};

// Mobile Order Card Component
const OrderCard: React.FC<{ order: OrderResponseDto; onViewDetails: (order: OrderResponseDto) => void }> = ({ order, onViewDetails }) => {
    return (
        <div className="bg-slate-800/40 rounded-lg border border-slate-700/50 overflow-hidden mb-4 transform transition-all hover:bg-slate-800/50 hover:scale-102">
            <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-slate-200 font-medium">#{order.orderNumber}</h3>
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(order.status!)}`}>
                        {getStatusIcon(order.status!)}
                        <span className="mr-1">{getStatusText(order.status!)}</span>
                    </div>
                </div>

                <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400" />
                        <p className="text-sm text-slate-300">{order.customer?.name || 'غير معروف'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4 text-slate-400" />
                        <p className="text-sm text-slate-300">{order.category?.name || 'غير معروف'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <p className="text-sm text-slate-300">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString('ar-SA') : 'غير محدد'}
                        </p>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-700/30">
                    <p className="text-primary font-semibold">{formatCurrency(order.totalAmount)}</p>
                    <button
                        onClick={() => onViewDetails(order)}
                        className="inline-flex items-center text-primary hover:text-primary-dark transition-colors text-sm"
                    >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        عرض التفاصيل
                    </button>
                </div>
            </div>
        </div>
    );
};

// Orders Table Component
const OrdersTable: React.FC<OrdersTableProps> = ({ orders, onViewDetails, isMobileView }) => {
    if (isMobileView) {
        return (
            <div className="space-y-4" dir="rtl">
                {orders.length === 0 ? (
                    <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-6 text-center text-slate-400">
                        لا توجد طلبات متاحة حاليًا
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {orders.map((order) => (
                            <OrderCard key={order.id} order={order} onViewDetails={onViewDetails} />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 overflow-hidden" dir="rtl">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-800/50">
                            <th className="px-4 py-3 text-right text-sm font-medium text-slate-300">رقم الطلب</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-slate-300">العميل</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-slate-300">التصنيف</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-slate-300">المبلغ</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-slate-300">الحالة</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-slate-300">تاريخ الطلب</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-slate-300">تاريخ التسليم</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-slate-300">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/30">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-4 py-6 text-center text-slate-400">
                                    لا توجد طلبات متاحة حاليًا
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-700/20 transition-colors">
                                    <td className="px-4 py-3 text-sm text-slate-300">{order.orderNumber}</td>
                                    <td className="px-4 py-3 text-sm text-slate-300">{order.customer?.name}</td>
                                    <td className="px-4 py-3 text-sm text-slate-300">{order.category?.name}</td>
                                    <td className="px-4 py-3 text-sm text-slate-300">{formatCurrency(order.totalAmount)}</td>
                                    <td className="px-4 py-3">
                                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(order.status!)}`}>
                                            {getStatusIcon(order.status!)}
                                            <span className="mr-1">
                                                {getStatusText(order.status!)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-300">
                                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('ar-SA') : ''}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-300">
                                        {order.scheduledFor ? new Date(order.scheduledFor).toLocaleDateString('ar-SA') : "-"}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <button
                                            onClick={() => onViewDetails(order)}
                                            className="text-primary hover:text-primary-dark transition-colors"
                                        >
                                            عرض التفاصيل
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Main OrdersPage Component
const OrdersPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [activeTab, setActiveTab] = useState<OrderTabType>("all");
    const [selectedOrder, setSelectedOrder] = useState<OrderResponseDto | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
    const [isMobileView, setIsMobileView] = useState<boolean>(false);

    // Query hooks
    const { data: summary, isLoading: isSummaryLoading } = useOrdersSummary();
    const { data: allOrders, isLoading: isOrdersLoading } = useOrders();
    const { data: ordersForPreparation, isLoading: isPreparationLoading } = useOrdersForPreparation();
    const { data: ordersForDeliveryToday, isLoading: isDeliveryLoading } = useOrdersForDeliveryToday();

    const isLoading = isSummaryLoading || isOrdersLoading || isPreparationLoading || isDeliveryLoading;

    // Check for mobile view
    useEffect(() => {
        const checkMobileView = () => {
            setIsMobileView(window.innerWidth < 768);
        };

        // Initial check
        checkMobileView();

        // Add event listener for window resize
        window.addEventListener('resize', checkMobileView);

        // Cleanup
        return () => {
            window.removeEventListener('resize', checkMobileView);
        };
    }, []);

    // Filter orders based on active tab and search term
    const getFilteredOrders = (): OrderResponseDto[] => {
        let filteredOrders: OrderResponseDto[] = [];

        if (!allOrders) return [];

        switch (activeTab) {
            case "all":
                filteredOrders = allOrders;
                break;
            case "pending":
                filteredOrders = allOrders.filter(order => order.status === OrderStatus.pending);
                break;
            case "processing":
                filteredOrders = allOrders.filter(order => order.status === OrderStatus.processing);
                break;
            case "ready":
                filteredOrders = allOrders.filter(order => order.status === OrderStatus.ready);
                break;
            case "delivered":
                filteredOrders = allOrders.filter(order => order.status === OrderStatus.delivered);
                break;
            case "cancelled":
                filteredOrders = allOrders.filter(order => order.status === OrderStatus.cancelled);
                break;
            case "forToday":
                filteredOrders = allOrders.filter(order => order.isForToday);
                break;
            case "forPreparation":
                filteredOrders = ordersForPreparation || [];
                break;
            case "forDeliveryToday":
                filteredOrders = ordersForDeliveryToday || [];
                break;
            default:
                filteredOrders = allOrders;
        }

        // Apply search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            return filteredOrders.filter(order =>
                order.customer?.name?.toLowerCase().includes(searchLower) ||
                order.orderNumber?.toLowerCase().includes(searchLower) ||
                order.notes?.toLowerCase().includes(searchLower)
            );
        }

        return filteredOrders;
    };

    const handleViewDetails = (order: OrderResponseDto) => {
        setSelectedOrder(order);
        setIsDetailsModalOpen(true);
    };

    const handleCreateOrder = () => {
        setIsCreateModalOpen(true);
    };

    const handleCreateCategory = () => {
        setIsCategoryModalOpen(true);
    };

    const filteredOrders = getFilteredOrders();

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative">
            <SplineBackground activeTab="الطلبات" />
            {isLoading && <PageSpinner />}

            <div className="relative z-10">
                <Navbar />
                <main className="pt-32 p-4">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Header */}
                        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" dir="rtl">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="h-6 w-6 text-slate-400" />
                                <h1 className="text-2xl font-bold text-slate-200">
                                    إدارة الطلبات
                                </h1>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleCreateCategory}
                                    className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>إضافة تصنيف</span>
                                </button>
                                <button
                                    onClick={handleCreateOrder}
                                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>إضافة طلب</span>
                                </button>
                            </div>
                        </div>

                        {/* Summary Cards */}
                        <OrdersSummaryComponent />

                        {/* Search and Tabs */}
                        <div className="mb-6">
                            <div className="relative" dir="rtl">
                                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="البحث عن طريق اسم العميل أو رقم الطلب..."
                                    className="w-full pl-4 pr-10 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400/50"
                                />
                            </div>
                        </div>

                        {/* Tabs */}
                        <OrdersTabs
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                            summary={summary}
                        />

                        {/* Table/Cards */}
                        <OrdersTable
                            orders={filteredOrders}
                            onViewDetails={handleViewDetails}
                            isMobileView={isMobileView}
                        />
                    </div>
                </main>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    isOpen={isDetailsModalOpen}
                    onClose={() => {
                        setIsDetailsModalOpen(false);
                        setSelectedOrder(null);
                    }}
                />
            )}

            {/* Create Order Modal */}
            <CreateOrderModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />

            {/* Create Category Modal */}
            <CategoryModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
            />
        </div>
    );
};

export default OrdersPage;