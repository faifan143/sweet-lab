// components/orders/CustomerCard.tsx
import React from "react";
import { User } from "lucide-react";
import { OrderCustomer } from "@/types/orders.type";

interface CustomerCardProps {
    count: number;
    customer: OrderCustomer;
    onSelect: (customer: OrderCustomer) => void;
    isActive: boolean;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onSelect, isActive, count }) => {
    return (
        <div
            onClick={() => onSelect(customer)}
            className={`p-3 border rounded-lg cursor-pointer transition-all ${isActive
                ? "bg-slate-700/40 border-primary"
                : "bg-slate-800/30 border-slate-700/50 hover:bg-slate-700/20"
                }`}
        >
            <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-slate-400" />
                <h3 className="font-medium text-slate-200">{customer.name}</h3>
            </div>
            <div className="mt-1 flex justify-between items-center">
                <span className="text-sm text-slate-400">{customer.phone || "—"}</span>
                <span className="bg-slate-700/50 text-xs px-2 py-0.5 rounded-full text-slate-300">
                    {count} طلبات
                </span>
            </div>
        </div>
    );
};

export default CustomerCard;