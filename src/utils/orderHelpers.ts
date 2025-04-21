// utils/orderHelpers.ts
import { OrderStatus } from "@/types/orders.type";

export const getStatusIcon = (status: OrderStatus): string => {
    switch (status) {
        case OrderStatus.pending:
            return "Clock";
        case OrderStatus.processing:
            return "RefreshCcw";
        case OrderStatus.ready:
            return "CheckCircle";
        case OrderStatus.delivered:
            return "CheckCircle2";
        case OrderStatus.cancelled:
            return "AlertCircle";
        default:
            return "Clock";
    }
};

export const getStatusClass = (status: OrderStatus): string => {
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

export const getStatusText = (status: OrderStatus): string => {
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