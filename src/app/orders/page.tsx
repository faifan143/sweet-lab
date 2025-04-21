"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/common/Navbar";
import CategoryModal from "@/components/common/orders/CategoryModal";
import CreateOrderModal from "@/components/common/orders/CreateOrderModal";
import OrderDetailsModal from "@/components/common/orders/OrderDetailsModal";
import PageSpinner from "@/components/common/PageSpinner";
import SplineBackground from "@/components/common/SplineBackground";
import {
    useOrderCategories,
    useOrders,
    useOrdersSummary
} from "@/hooks/useOrders";
import { AllCustomerType } from "@/types/customers.type";
import { FilterOrders, OrderCategory, OrderResponseDto } from "@/types/orders.type";
import { Plus, ShoppingBag, User, X } from "lucide-react";
import OrdersTabs, { OrderTabType } from "@/components/common/orders/OrdersTabs";
import OrdersSummaryComponent from "@/components/common/orders/OrdersSummary";
import SearchBar from "@/components/common/orders/SearchBar";
import CustomerOrderCard from "@/components/common/orders/CustomerOrderCard";
import CategorySection from "@/components/common/orders/CategorySection";

// Customer Orders Modal Component
interface CustomerOrdersModalProps {
    customer: AllCustomerType;
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
    if (!isOpen) return null;

    // Filter orders by customer ID and category ID
    const filteredOrders = orders.filter(order =>
        order.customerId === customer.id &&
        (categoryId !== null ? order.categoryId === categoryId : true)
    );

    // Get category name from the categoryId
    const getCategoryName = () => {
        if (categoryId === null) return '';
        return ` - ${customer.category?.name || `تصنيف #${categoryId}`}`;
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
    const [activeTab, setActiveTab] = useState<OrderTabType>("all");
    const [selectedCustomer, setSelectedCustomer] = useState<AllCustomerType | null>(null);
    const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [isCustomerOrdersModalOpen, setIsCustomerOrdersModalOpen] = useState<boolean>(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderResponseDto | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);

    // Filter parameters based on active tab
    const getFilterParams = (): FilterOrders | undefined => {
        switch (activeTab) {
            case "forToday":
                return { forToday: true };
            case "forTomorrow":
                return { forTomorrow: true };
            default:
                return undefined;
        }
    };

    // Query hooks
    const { data: summary, isLoading: isSummaryLoading } = useOrdersSummary();
    const { data: allOrders, isLoading: isOrdersLoading } = useOrders(getFilterParams());
    const { data: categories, isLoading: isCategoriesLoading } = useOrderCategories();

    const isLoading = isSummaryLoading || isOrdersLoading || isCategoriesLoading;

    // Filter orders based on search term
    const filteredOrders = React.useMemo(() => {
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

    // Handle customer selection to show orders in modal
    const handleSelectCustomer = (customer: AllCustomerType, categoryId: number) => {
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

    // Create order handler
    const handleCreateOrder = () => {
        setIsCreateModalOpen(true);
    };

    // Create category handler
    const handleCreateCategory = () => {
        setIsCategoryModalOpen(true);
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

                        {/* Search Bar */}
                        <div className="mb-6">
                            <SearchBar
                                searchTerm={searchTerm}
                                onSearchChange={setSearchTerm}
                            />
                        </div>

                        {/* Tabs */}
                        <OrdersTabs
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                            summary={summary}
                        />

                        {/* Content */}
                        <div dir="rtl">
                            {/* Categories with Customers */}
                            {categories && categories.length > 0 ? (
                                <div>
                                    {categories.map(category => (
                                        <CategorySection
                                            key={category.id}
                                            category={category}
                                            orders={filteredOrders}
                                            onSelectCustomer={(customer) => handleSelectCustomer(customer, category.id)}
                                            selectedCustomerId={selectedCustomerId}
                                        />
                                    ))}

                                    {/* Show a message if no customers with orders are found */}
                                    {!categories.some(category =>
                                        category.customers?.some(customer =>
                                            filteredOrders.some(order => order.customerId === customer.id)
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