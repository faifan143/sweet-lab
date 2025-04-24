"use client";

import Navbar from "@/components/common/Navbar";
import CategoryManagementModal from "@/components/common/orders/CategoryManagmentModal";
import CategorySection from "@/components/common/orders/CategorySection";
import CreateOrderModal from "@/components/common/orders/CreateOrderModal";
import CustomerOrderCard from "@/components/common/orders/CustomerOrderCard";
import InvoiceOrderConversionModal from "@/components/common/orders/InvoiceOrderConversionModal";
import OrderDetailsModal from "@/components/common/orders/OrderDetailsModal";
import OrderListByDateView from "@/components/common/orders/OrderListByDateView";
import OrdersSummaryComponent from "@/components/common/orders/OrdersSummary";
import OrdersTabs, { OrderTabType } from "@/components/common/orders/OrdersTabs";
import PageSpinner from "@/components/common/PageSpinner";
import SplineBackground from "@/components/common/SplineBackground";
import {
    useOrderCategories,
    useOrders,
    useOrdersSummary
} from "@/hooks/useOrders";
import { AllCustomerType } from "@/types/customers.type";
import { FilterOrders, OrderCustomer, OrderResponseDto } from "@/types/orders.type";
import {
    CalendarDays,
    Plus,
    ShoppingBag,
    Tags,
    User,
    X
} from "lucide-react";
import React, { useMemo, useState } from "react";

// Customer Orders Modal Component
interface CustomerOrdersModalProps {
    customer: OrderCustomer;
    categoryId: number | null;
    orders: OrderResponseDto[];
    isOpen: boolean;
    onClose: () => void;
    onViewOrderDetails: (order: OrderResponseDto) => void;
}

const CustomerOrdersModal: React.FC<CustomerOrdersModalProps> = ({
    customer,
    categoryId,
    orders,
    isOpen,
    onClose,
    onViewOrderDetails
}) => {
    const { data: categories = [] } = useOrderCategories();

    const category = categories.find((category) => category.id == categoryId)

    if (!isOpen) return null;

    // Filter orders by customer ID and category ID
    const filteredOrders = orders.filter(order =>
        order.customerId === customer.id &&
        (categoryId !== null ? order.categoryId === categoryId : true)
    );

    // Get category name from the categoryId
    const getCategoryName = () => {
        if (categoryId === null) return '';
        return ` - ${category?.name || `تصنيف #${categoryId}`}`;
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden" dir="rtl">
                <div className="flex justify-between items-center p-4 border-b border-slate-700">
                    <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold text-slate-200">
                            طلبات {customer?.name}
                            {getCategoryName()}
                        </h3>
                        <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                            {filteredOrders.length} طلب
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-200 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="overflow-y-auto p-4 max-h-[calc(90vh-120px)]">
                    {filteredOrders.length === 0 ? (
                        <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-6 text-center text-slate-400">
                            لا توجد طلبات لهذا العميل{categoryId !== null ? ' في هذا التصنيف' : ''}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredOrders.map(order => (
                                <CustomerOrderCard
                                    key={order.id}
                                    order={order}
                                    onViewDetails={onViewOrderDetails}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Main Orders Page Component
const OrdersPage: React.FC = () => {
    // State
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [activeTab, setActiveTab] = useState<OrderTabType>("forToday");
    const [selectedCustomer, setSelectedCustomer] = useState<OrderCustomer | null>(null);
    const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [isCustomerOrdersModalOpen, setIsCustomerOrdersModalOpen] = useState<boolean>(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderResponseDto | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
    const [isInvoiceConversionModalOpen, setIsInvoiceConversionModalOpen] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<'byDate' | 'byCategory'>('byDate');

    // Filter parameters for all orders
    const getAllFilters = (): FilterOrders | undefined => {
        return undefined; // Get all orders without filtering
    };

    // Filter parameters for today's orders
    const getTodayFilters = (): FilterOrders | undefined => {
        return { forToday: true };
    };

    // Filter parameters for tomorrow's orders
    const getTomorrowFilters = (): FilterOrders | undefined => {
        return { forTomorrow: true };
    };

    // Query hooks with appropriate filters
    const { data: summary, isLoading: isSummaryLoading } = useOrdersSummary();
    const { data: allOrders = [], isLoading: isAllOrdersLoading } = useOrders(getAllFilters());
    const { data: todayOrders = [], isLoading: isTodayOrdersLoading } = useOrders(getTodayFilters());
    const { data: tomorrowOrders = [], isLoading: isTomorrowOrdersLoading } = useOrders(getTomorrowFilters());
    const { data: categories = [], isLoading: isCategoriesLoading } = useOrderCategories();

    // Combined loading state
    const isLoading = isSummaryLoading || isAllOrdersLoading || isTodayOrdersLoading ||
        isTomorrowOrdersLoading || isCategoriesLoading;

    // Filter orders based on search term
    const filteredAllOrders = useMemo(() => {
        if (!allOrders) return [];
        if (!searchTerm) return allOrders;

        const searchLower = searchTerm.toLowerCase();
        return allOrders.filter(order =>
            order.customer?.name?.toLowerCase().includes(searchLower) ||
            order.orderNumber?.toLowerCase().includes(searchLower) ||
            order.notes?.toLowerCase().includes(searchLower) ||
            order.category?.name?.toLowerCase().includes(searchLower)
        );
    }, [allOrders, searchTerm]);

    const filteredTodayOrders = useMemo(() => {
        if (!todayOrders) return [];
        if (!searchTerm) return todayOrders;

        const searchLower = searchTerm.toLowerCase();
        return todayOrders.filter(order =>
            order.customer?.name?.toLowerCase().includes(searchLower) ||
            order.orderNumber?.toLowerCase().includes(searchLower) ||
            order.notes?.toLowerCase().includes(searchLower) ||
            order.category?.name?.toLowerCase().includes(searchLower)
        );
    }, [todayOrders, searchTerm]);

    const filteredTomorrowOrders = useMemo(() => {
        if (!tomorrowOrders) return [];
        if (!searchTerm) return tomorrowOrders;

        const searchLower = searchTerm.toLowerCase();
        return tomorrowOrders.filter(order =>
            order.customer?.name?.toLowerCase().includes(searchLower) ||
            order.orderNumber?.toLowerCase().includes(searchLower) ||
            order.notes?.toLowerCase().includes(searchLower) ||
            order.category?.name?.toLowerCase().includes(searchLower)
        );
    }, [tomorrowOrders, searchTerm]);

    // Handle customer selection to show orders in modal
    const handleSelectCustomer = (customer: OrderCustomer, categoryId: number) => {
        setSelectedCustomer(customer);
        setSelectedCustomerId(customer.id);
        setSelectedCategoryId(categoryId);
        setIsCustomerOrdersModalOpen(true);
    };

    // Handle view order details
    const handleViewOrderDetails = (order: OrderResponseDto) => {
        setSelectedOrder(order);
        setIsDetailsModalOpen(true);
    };

    // Handle order conversion to invoice
    const handleConvertToInvoice = (order: OrderResponseDto) => {
        setSelectedOrder(order);
        setIsInvoiceConversionModalOpen(true);
        // Do not close OrderDetailsModal here
    };

    // Create order handler
    const handleCreateOrder = () => {
        setIsCreateModalOpen(true);
    };

    // Create category handler
    const handleCreateCategory = () => {
        setIsCategoryModalOpen(true);
    };

    // Handler to close both modals
    const closeAllModals = () => {
        setIsInvoiceConversionModalOpen(false);
        setIsDetailsModalOpen(false);
        setSelectedOrder(null);
    };

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
                                    <span>إدارة التصنيفات</span>
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

                        {/* View Toggle */}
                        <div className="mb-6 flex justify-end" dir="rtl">
                            <div className="bg-slate-800/50 p-1 rounded-lg flex">
                                <button
                                    onClick={() => setViewMode('byDate')}
                                    className={`px-4 py-1.5 rounded-md text-sm flex items-center gap-1.5 transition-colors ${viewMode === 'byDate'
                                        ? 'bg-slate-700 text-white'
                                        : 'text-slate-400 hover:text-slate-200'
                                        }`}
                                >
                                    <CalendarDays className="h-4 w-4" />
                                    <span>عرض حسب الطلبيات</span>
                                </button>
                                <button
                                    onClick={() => setViewMode('byCategory')}
                                    className={`px-4 py-1.5 rounded-md text-sm flex items-center gap-1.5 transition-colors ${viewMode === 'byCategory'
                                        ? 'bg-slate-700 text-white'
                                        : 'text-slate-400 hover:text-slate-200'
                                        }`}
                                >
                                    <Tags className="h-4 w-4" />
                                    <span>عرض حسب الزبون</span>
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <OrdersTabs
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                            summary={summary}
                        />

                        {/* Content */}
                        <div dir="rtl">
                            {viewMode === 'byDate' ? (
                                /* Orders by Date View */
                                <OrderListByDateView
                                    todayOrders={filteredTodayOrders}
                                    tomorrowOrders={filteredTomorrowOrders}
                                    allOrders={filteredAllOrders}
                                    isLoading={isLoading}
                                    activeTab={activeTab}
                                    onViewOrderDetails={handleViewOrderDetails}
                                    onSearchChange={setSearchTerm}
                                    searchTerm={searchTerm}
                                />
                            ) : (
                                /* Categories with Customers */
                                categories && categories.length > 0 ? (
                                    <div>
                                        {categories.map(category => (
                                            <CategorySection
                                                key={category.id}
                                                category={category}
                                                orders={
                                                    activeTab === 'forToday'
                                                        ? filteredTodayOrders
                                                        : activeTab === 'forTomorrow'
                                                            ? filteredTomorrowOrders
                                                            : filteredAllOrders
                                                }
                                                onSelectCustomer={(customer) => handleSelectCustomer(customer, category.id)}
                                                selectedCustomerId={selectedCustomerId}
                                            />
                                        ))}

                                        {/* Show a message if no customers with orders are found */}
                                        {!categories.some(category =>
                                            category.customers?.some(customer =>
                                                (activeTab === 'forToday'
                                                    ? filteredTodayOrders
                                                    : activeTab === 'forTomorrow'
                                                        ? filteredTomorrowOrders
                                                        : filteredAllOrders).some(order => order.customerId === customer.id)
                                            )
                                        ) && (
                                                <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-6 text-center text-slate-400">
                                                    لا توجد طلبات متاحة في هذا التصنيف
                                                </div>
                                            )}
                                    </div>
                                ) : (
                                    <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-6 text-center text-slate-400">
                                        لا توجد تصنيفات متاحة حاليًا
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Customer Orders Modal */}
            {selectedCustomer && (
                <CustomerOrdersModal
                    customer={selectedCustomer}
                    categoryId={selectedCategoryId}
                    orders={allOrders || []}
                    isOpen={isCustomerOrdersModalOpen}
                    onClose={() => {
                        setIsCustomerOrdersModalOpen(false);
                        setSelectedCustomerId(null);
                        setSelectedCategoryId(null);
                    }}
                    onViewOrderDetails={handleViewOrderDetails}
                />
            )}

            {/* Order Details Modal */}
            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    isOpen={isDetailsModalOpen}
                    onClose={() => {
                        setIsDetailsModalOpen(false);
                        setSelectedOrder(null);
                        setIsInvoiceConversionModalOpen(false); // Ensure conversion modal closes too
                    }}
                    onOrderUpdated={() => {
                        // Refetch data when order is updated
                    }}
                    onConvertToInvoice={handleConvertToInvoice}
                />
            )}

            {/* Invoice Conversion Modal */}
            {selectedOrder && (
                <InvoiceOrderConversionModal
                    order={selectedOrder}
                    isOpen={isInvoiceConversionModalOpen}
                    onClose={() => {
                        setIsInvoiceConversionModalOpen(false);
                        // Optionally keep OrderDetailsModal open; close it if desired
                        // setIsDetailsModalOpen(false);
                        // setSelectedOrder(null);
                    }}
                    onSuccess={closeAllModals} // Close both modals on successful conversion
                />
            )}

            {/* Create Order Modal */}
            <CreateOrderModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    // Refetch data when order is created
                }}
            />

            {/* Create Category Modal */}
            <CategoryManagementModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}

            />
        </div>
    );
};

export default OrdersPage;