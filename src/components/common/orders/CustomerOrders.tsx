// components/orders/CustomerOrders.tsx
import { AllCustomerType } from "@/types/customers.type";
import { OrderResponseDto } from "@/types/orders.type";
import { User } from "lucide-react";
import React from "react";
import CustomerOrderCard from "./CustomerOrderCard";

interface CustomerOrdersProps {
    customer: AllCustomerType;
    orders: OrderResponseDto[];
    onViewOrderDetails?: (order: OrderResponseDto) => void;
}

const CustomerOrders: React.FC<CustomerOrdersProps> = ({
    customer,
    orders,
    onViewOrderDetails
}) => {
    const customerOrders = orders.filter(order => order.customerId === customer?.id);

    return (
        <div className="mt-6">
            <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-slate-200">طلبات {customer?.name}</h2>
                <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                    {customerOrders.length} طلب
                </span>
            </div>

            {customerOrders.length === 0 ? (
                <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-6 text-center text-slate-400">
                    لا توجد طلبات لهذا العميل
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {customerOrders.map(order => (
                        <CustomerOrderCard
                            key={order.id}
                            order={order}
                            onViewDetails={onViewOrderDetails}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomerOrders;