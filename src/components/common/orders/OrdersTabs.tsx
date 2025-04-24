// components/orders/OrdersTabs.tsx
import React from "react";
import { ShoppingBag, Clock, Calendar } from "lucide-react";
import { OrdersSummary } from "@/types/orders.type";

// Define tab types
export type OrderTabType = "all" | "forToday" | "forTomorrow";

interface OrdersTabsProps {
    activeTab: OrderTabType;
    onTabChange: (tab: OrderTabType) => void;
    summary: OrdersSummary | undefined;
}

const OrdersTabs: React.FC<OrdersTabsProps> = ({ activeTab, onTabChange, summary }) => {
    return (
        <div className="border-b border-slate-700/50 mb-6 overflow-auto no-scrollbar" dir="rtl">
            <div className="flex">
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
                <button
                    onClick={() => onTabChange("forTomorrow")}
                    className={`px-4 py-2 -mb-px flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "forTomorrow"
                        ? "text-emerald-400 border-b-2 border-emratext-emerald-400"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    <Calendar className="h-4 w-4" />
                    <span>طلبات الغد</span>
                    <span className="mx-2 bg-emerald-400/10  text-emerald-400 px-2 py-0.5 rounded-full text-xs">
                        {summary?.forTomorrow || 0}
                    </span>
                </button>
                <button
                    onClick={() => onTabChange("all")}
                    className={`px-4 py-2 -mb-px flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "all"
                        ? "text-orange-400 border-b-2 border-orangetext-orange-400"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    <ShoppingBag className="h-4 w-4" />
                    <span>جميع الطلبات</span>
                    <span className="mx-2 bg-orange-400/10  text-orange-400 px-2 py-0.5 rounded-full text-xs">
                        {summary?.total || 0}
                    </span>
                </button>




            </div>
        </div>
    );
};

export default OrdersTabs;