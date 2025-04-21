// components/orders/CategorySection.tsx
import React, { useState } from "react";
import { ShoppingBag, ChevronUp, ChevronDown } from "lucide-react";
import { OrdersCategoriesFetchDto, OrderResponseDto } from "@/types/orders.type";
import { AllCustomerType } from "@/types/customers.type";
import CustomerCard from "./CustomerCard";

interface CategorySectionProps {
    category: OrdersCategoriesFetchDto;
    orders: OrderResponseDto[];
    onSelectCustomer: (customer: AllCustomerType) => void;
    selectedCustomerId: number | null;
}

const CategorySection: React.FC<CategorySectionProps> = ({
    category,
    orders,
    onSelectCustomer,
    selectedCustomerId
}) => {
    const [isExpanded, setIsExpanded] = useState(true);

    // Group customers from this category
    const categoryCustomers = category.customers || [];
    const categoryOrdersCount = orders.filter(order => order.categoryId === category.id).length;

    return (
        <div className="mb-4">
            <div
                className="flex justify-between items-center p-3 bg-slate-800/70 rounded-lg border border-slate-700/50 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-slate-400" />
                    <h2 className="font-semibold text-slate-200">{category.name}</h2>
                    <span className="bg-slate-700/70 text-xs px-2 py-0.5 rounded-full text-slate-300">
                        {categoryCustomers.length} عميل
                    </span>
                    {categoryOrdersCount > 0 && (
                        <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                            {categoryOrdersCount} طلب
                        </span>
                    )}
                </div>
                {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-slate-400" />
                ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                )}
            </div>

            {isExpanded && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3 pr-3 pl-0">
                    {categoryCustomers.length === 0 ? (
                        <div className="col-span-full text-center p-4 bg-slate-800/30 rounded-lg text-slate-400">
                            لا يوجد عملاء في هذا التصنيف
                        </div>
                    ) : (
                        categoryCustomers.map(customer => (
                            <CustomerCard
                                key={customer.id}
                                customer={customer}
                                onSelect={() => onSelectCustomer(customer)}
                                isActive={customer.id === selectedCustomerId}
                                count={orders.filter(order => (order.customerId == customer.id && order.categoryId == category.id)).length}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default CategorySection;