import React, { useState } from 'react';
import {
    Calendar,
    Clock,
    Search,
    ShoppingBag,
    ChevronDown,
    ChevronUp,
    Eye
} from 'lucide-react';
import { OrderResponseDto, OrderStatus } from '@/types/orders.type';
import { AllCustomerType } from '@/types/customers.type';
import CustomerOrderCard from './CustomerOrderCard';
import SearchBar from './SearchBar';
import { formatCurrency } from '@/utils/formatters';
import { getStatusClass, getStatusText } from '@/utils/orderHelpers';

interface OrderListByDateViewProps {
    todayOrders: OrderResponseDto[];
    tomorrowOrders: OrderResponseDto[];
    allOrders: OrderResponseDto[];
    isLoading: boolean;
    activeTab: 'forToday' | 'forTomorrow' | 'all';
    onViewOrderDetails: (order: OrderResponseDto) => void;
    onSearchChange: (term: string) => void;
    searchTerm: string;
}

const OrderListByDateView: React.FC<OrderListByDateViewProps> = ({
    todayOrders,
    tomorrowOrders,
    allOrders,
    isLoading,
    activeTab,
    onViewOrderDetails,
    onSearchChange,
    searchTerm
}) => {
    // State for section expansion
    const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
        today: true,
        tomorrow: true,
        all: true
    });

    // Group orders by customer (for all orders section)
    const groupOrdersByCustomer = (orders: OrderResponseDto[]) => {
        const grouped: { [key: number]: { customer: AllCustomerType, orders: OrderResponseDto[] } } = {};

        orders.forEach(order => {
            if (order.customer && order.customerId) {
                if (!grouped[order.customerId]) {
                    grouped[order.customerId] = {
                        customer: order.customer,
                        orders: []
                    };
                }
                grouped[order.customerId].orders.push(order);
            }
        });

        return Object.values(grouped);
    };

    // Group orders by category (for today and tomorrow sections)
    const groupOrdersByCategory = (orders: OrderResponseDto[]) => {
        const grouped: { [key: number]: { categoryName: string, orders: OrderResponseDto[] } } = {};

        orders.forEach(order => {
            if (order.category && order.categoryId) {
                if (!grouped[order.categoryId]) {
                    grouped[order.categoryId] = {
                        categoryName: order.category.name,
                        orders: []
                    };
                }
                grouped[order.categoryId].orders.push(order);
            }
        });

        return Object.values(grouped);
    };

    // Toggle section expansion
    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Determine which orders to show based on activeTab
    const getVisibleSections = () => {
        switch (activeTab) {
            case 'forToday':
                return ['today'];
            case 'forTomorrow':
                return ['tomorrow'];
            case 'all':
                return ['today', 'tomorrow', 'all'];
            default:
                return ['today', 'tomorrow', 'all'];
        }
    };

    const visibleSections = getVisibleSections();

    if (isLoading) {
        return (
            <div className="h-96 flex items-center justify-center">
                <div className="animate-pulse text-slate-400">جاري تحميل البيانات...</div>
            </div>
        );
    }

    return (
        <div className="space-y-10" dir="rtl">
            {/* Search Bar */}
            <div className="mb-6">
                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={onSearchChange}
                    placeholder="البحث عن طريق اسم العميل أو رقم الطلب..."
                />
            </div>

            {/* Today's Orders Section */}
            {visibleSections.includes('today') && (
                <div className="bg-slate-800/40 rounded-lg border border-slate-700/50 overflow-hidden">
                    <div
                        className="flex justify-between items-center p-4 bg-slate-700/30 cursor-pointer"
                        onClick={() => toggleSection('today')}
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/20 text-amber-400">
                                <Clock className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-amber-400">طلبات اليوم</h3>
                                <p className="text-sm text-slate-400">{todayOrders.length} طلب</p>
                            </div>
                        </div>
                        {expandedSections.today ? (
                            <ChevronUp className="h-5 w-5 text-slate-400" />
                        ) : (
                            <ChevronDown className="h-5 w-5 text-slate-400" />
                        )}
                    </div>

                    {expandedSections.today && (
                        <div className="p-4">
                            {todayOrders.length === 0 ? (
                                <div className="text-center p-6 text-slate-400">
                                    لا توجد طلبات لليوم
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {groupOrdersByCategory(todayOrders).map((category, index) => (
                                        <div key={index}>
                                            <h4 className="text-slate-300 font-medium mb-3 flex items-center gap-2">
                                                <ShoppingBag className="h-4 w-4 text-slate-400" />
                                                {category.categoryName}
                                                <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full">
                                                    {category.orders.length} طلب
                                                </span>
                                            </h4>
                                            {/* Desktop: Table View */}
                                            <div className="hidden md:block overflow-x-auto">
                                                <table className="w-full text-sm text-right text-slate-200">
                                                    <thead>
                                                        <tr className="border-b border-slate-700/50 bg-slate-700/30">
                                                            <th className="px-4 py-3">رقم الفاتورة</th>
                                                            <th className="px-4 py-3">التاريخ</th>
                                                            <th className="px-4 py-3">اسم العميل</th>
                                                            <th className="px-4 py-3">المبلغ</th>
                                                            <th className="px-4 py-3">حالة الدفع</th>
                                                            <th className="px-4 py-3">حالة الطلب</th>
                                                            <th className="px-4 py-3">الإجراءات</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {category.orders.map(order => (
                                                            <tr
                                                                key={order.id}
                                                                className="border-b border-slate-700/50 hover:bg-slate-700/50 transition-colors"
                                                            >
                                                                <td className="px-4 py-3">
                                                                    {order.invoiceId ? `#${order.invoiceId}` : 'غير متوفر'}
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    {order.createdAt
                                                                        ? new Date(order.createdAt).toLocaleDateString('ar-EG')
                                                                        : 'غير محدد'}
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    {order.customer?.name || 'غير معروف'}
                                                                </td>
                                                                <td className="px-4 py-3 text-primary font-semibold">
                                                                    {formatCurrency(order.totalAmount)}
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <span
                                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.paidStatus
                                                                            ? 'bg-green-500/20 text-green-400'
                                                                            : 'bg-red-500/20 text-red-400'
                                                                            }`}
                                                                    >
                                                                        {order.paidStatus ? 'مدفوع' : 'غير مدفوع'}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <span
                                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(order.status!)}`}
                                                                    >
                                                                        {getStatusText(order.status!)}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <button
                                                                        onClick={() => onViewOrderDetails(order)}
                                                                        className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                        عرض
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            {/* Mobile: Cards Grid View */}
                                            <div className="block md:hidden">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {category.orders.map(order => (
                                                        <CustomerOrderCard
                                                            key={order.id}
                                                            order={order}
                                                            onViewDetails={onViewOrderDetails}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Tomorrow's Orders Section */}
            {visibleSections.includes('tomorrow') && (
                <div className="bg-slate-800/40 rounded-lg border border-slate-700/50 overflow-hidden">
                    <div
                        className="flex justify-between items-center p-4 bg-slate-700/30 cursor-pointer"
                        onClick={() => toggleSection('tomorrow')}
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-emerald-400">طلبات الغد</h3>
                                <p className="text-sm text-slate-400">{tomorrowOrders.length} طلب</p>
                            </div>
                        </div>
                        {expandedSections.tomorrow ? (
                            <ChevronUp className="h-5 w-5 text-slate-400" />
                        ) : (
                            <ChevronDown className="h-5 w-5 text-slate-400" />
                        )}
                    </div>

                    {expandedSections.tomorrow && (
                        <div className="p-4">
                            {tomorrowOrders.length === 0 ? (
                                <div className="text-center p-6 text-slate-400">
                                    لا توجد طلبات للغد
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {groupOrdersByCategory(tomorrowOrders).map((category, index) => (
                                        <div key={index}>
                                            <h4 className="text-slate-300 font-medium mb-3 flex items-center gap-2">
                                                <ShoppingBag className="h-4 w-4 text-slate-400" />
                                                {category.categoryName}
                                                <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">
                                                    {category.orders.length} طلب
                                                </span>
                                            </h4>
                                            {/* Desktop: Table View */}
                                            <div className="hidden md:block overflow-x-auto">
                                                <table className="w-full text-sm text-right text-slate-200">
                                                    <thead>
                                                        <tr className="border-b border-slate-700/50 bg-slate-700/30">
                                                            <th className="px-4 py-3">رقم الفاتورة</th>
                                                            <th className="px-4 py-3">التاريخ</th>
                                                            <th className="px-4 py-3">اسم العميل</th>
                                                            <th className="px-4 py-3">المبلغ</th>
                                                            <th className="px-4 py-3">حالة الدفع</th>
                                                            <th className="px-4 py-3">حالة الطلب</th>
                                                            <th className="px-4 py-3">الإجراءات</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {category.orders.map(order => (
                                                            <tr
                                                                key={order.id}
                                                                className="border-b border-slate-700/50 hover:bg-slate-700/50 transition-colors"
                                                            >
                                                                <td className="px-4 py-3">
                                                                    {order.invoiceId ? `#${order.invoiceId}` : 'غير متوفر'}
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    {order.scheduledFor
                                                                        ? new Date(order.scheduledFor).toLocaleDateString('ar-EG')
                                                                        : 'غير محدد'}
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    {order.customer?.name || 'غير معروف'}
                                                                </td>
                                                                <td className="px-4 py-3 text-primary font-semibold">
                                                                    {formatCurrency(order.totalAmount)}
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <span
                                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.paidStatus
                                                                            ? 'bg-green-500/20 text-green-400'
                                                                            : 'bg-red-500/20 text-red-400'
                                                                            }`}
                                                                    >
                                                                        {order.paidStatus ? 'مدفوع' : 'غير مدفوع'}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <span
                                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(order.status!)}`}
                                                                    >
                                                                        {getStatusText(order.status!)}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <button
                                                                        onClick={() => onViewOrderDetails(order)}
                                                                        className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                        عرض
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            {/* Mobile: Cards Grid View */}
                                            <div className="block md:hidden">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {category.orders.map(order => (
                                                        <CustomerOrderCard
                                                            key={order.id}
                                                            order={order}
                                                            onViewDetails={onViewOrderDetails}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* All Orders Section (excluding today and tomorrow) */}
            {visibleSections.includes('all') && (
                <div className="bg-slate-800/40 rounded-lg border border-slate-700/50 overflow-hidden">
                    <div
                        className="flex justify-between items-center p-4 bg-slate-700/30 cursor-pointer"
                        onClick={() => toggleSection('all')}
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20 text-blue-400">
                                <ShoppingBag className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-blue-400">جميع الطلبات</h3>
                                <p className="text-sm text-slate-400">{allOrders.length} طلب</p>
                            </div>
                        </div>
                        {expandedSections.all ? (
                            <ChevronUp className="h-5 w-5 text-slate-400" />
                        ) : (
                            <ChevronDown className="h-5 w-5 text-slate-400" />
                        )}
                    </div>

                    {expandedSections.all && (
                        <div className="p-4">
                            {allOrders.length === 0 ? (
                                <div className="text-center p-6 text-slate-400">
                                    لا توجد طلبات
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {groupOrdersByCustomer(allOrders).map((group, index) => (
                                        <div key={index} className="border-b border-slate-700/30 pb-6 last:border-b-0 last:pb-0">
                                            <h4 className="text-slate-300 font-medium mb-3 flex items-center gap-2">
                                                <ShoppingBag className="h-4 w-4 text-slate-400" />
                                                {group.customer.name}
                                                <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full">
                                                    {group.orders.length} طلب
                                                </span>
                                            </h4>
                                            {/* Desktop: Table View */}
                                            <div className="hidden md:block overflow-x-auto">
                                                <table className="w-full text-sm text-right text-slate-200">
                                                    <thead>
                                                        <tr className="border-b border-slate-700/50 bg-slate-700/30">
                                                            <th className="px-4 py-3">رقم الفاتورة</th>
                                                            <th className="px-4 py-3">التاريخ</th>
                                                            <th className="px-4 py-3">اسم العميل</th>
                                                            <th className="px-4 py-3">المبلغ</th>
                                                            <th className="px-4 py-3">حالة الدفع</th>
                                                            <th className="px-4 py-3">حالة الطلب</th>
                                                            <th className="px-4 py-3">الإجراءات</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {group.orders.map(order => (
                                                            <tr
                                                                key={order.id}
                                                                className="border-b border-slate-700/50 hover:bg-slate-700/50 transition-colors"
                                                            >
                                                                <td className="px-4 py-3">
                                                                    {order.invoiceId ? `#${order.invoiceId}` : 'غير متوفر'}
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    {order.scheduledFor
                                                                        ? new Date(order.scheduledFor).toLocaleDateString('ar-EG')
                                                                        : 'غير محدد'}
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    {order.customer?.name || 'غير معروف'}
                                                                </td>
                                                                <td className="px-4 py-3 text-primary font-semibold">
                                                                    {formatCurrency(order.totalAmount)}
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <span
                                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.paidStatus
                                                                            ? 'bg-green-500/20 text-green-400'
                                                                            : 'bg-red-500/20 text-red-400'
                                                                            }`}
                                                                    >
                                                                        {order.paidStatus ? 'مدفوع' : 'غير مدفوع'}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <span
                                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(order.status!)}`}
                                                                    >
                                                                        {getStatusText(order.status!)}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <button
                                                                        onClick={() => onViewOrderDetails(order)}
                                                                        className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                        عرض
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            {/* Mobile: Cards Grid View */}
                                            <div className="block md:hidden">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {group.orders.map(order => (
                                                        <CustomerOrderCard
                                                            key={order.id}
                                                            order={order}
                                                            onViewDetails={onViewOrderDetails}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default OrderListByDateView;