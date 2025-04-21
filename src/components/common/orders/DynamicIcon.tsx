// components/orders/DynamicIcon.tsx
import React from "react";
import * as LucideIcons from "lucide-react";
import { OrderStatus } from "@/types/orders.type";
import { getStatusIcon } from "@/utils/orderHelpers";

interface DynamicIconProps {
    name: string | OrderStatus;
    className?: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = "" }) => {
    let iconName = name;

    // Handle status-based icons
    if (Object.values(OrderStatus).includes(name as OrderStatus)) {
        iconName = getStatusIcon(name as OrderStatus);
    }

    // Check if iconName is a valid property of LucideIcons
    if (typeof iconName === 'string' && iconName in LucideIcons) {
        // @ts-ignore - LucideIcons has a dynamic set of components
        const IconComponent = LucideIcons[iconName];
        return <IconComponent className={className} />;
    }

    // Fallback to HelpCircle if not found
    return <LucideIcons.HelpCircle className={className} />;
};