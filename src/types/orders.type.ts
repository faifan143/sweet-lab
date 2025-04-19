import { AllCustomerType } from "./customers.type";

export interface OrdersCategoriesCreateDto {
    name: string;
    description: string;
}
export interface OrdersCategoriesCreateResponseDto {
    id: number;
    name: string;
    description: string;
}


export interface OrdersCategoriesFetchDto {
    id: number,
    name: string,
    description: string,
    _count: {
        orders: number
    },
    customersCount: number,
    customers: AllCustomerType[]
}


export interface OrdersCreateDto {
    customerId: number,
    totalAmount: number,
    paidStatus: boolean,
    notes: string,
    categoryId: number,
    items: {
        itemId: number,
        quantity: number,
        unitPrice: number,
        unit: string,
        notes: string,
    }[],
    isForToday: boolean
}


// orders.service.ts interfaces

export enum OrderStatus {
    pending = 'pending',
    processing = 'processing',
    ready = 'ready',
    delivered = 'delivered',
    cancelled = 'cancelled'
}

export interface ItemUnit {
    unit: string;
    price: number;
    factor: number;
}

export interface Item {
    id: number;
    name: string;
    type: string;
    units: ItemUnit[];
    defaultUnit: string;
    cost: number;
    price: number;
    description: string;
    groupId: number;
}

export interface OrderItem {
    id?: number;
    orderId?: number;
    itemId: number;
    quantity: number;
    unitPrice: number;
    unit: string;
    subTotal?: number;
    notes?: string;
    item?: Item;
}

export interface Customer {
    id: number;
    name: string;
    phone: string;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
    categoryId?: number;
}

export interface Employee {
    id?: number;
    username: string;
}

export interface OrderCategory {
    id?: number;
    name: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface OrderResponseDto {
    id?: number;
    orderNumber?: string;
    customerId: number;
    totalAmount: number;
    paidStatus?: boolean;
    status?: OrderStatus;
    createdAt?: Date;
    scheduledFor?: string;
    deliveryDate?: string | null;
    notes?: string;
    categoryId: number;
    invoiceId?: number | null;
    employeeId?: number;
    isForToday?: boolean;
    customer?: Customer;
    category?: OrderCategory;
    employee?: Employee;
    items: OrderItem[];
}

export interface UpdateOrder {
    customerId?: number;
    totalAmount?: number;
    paidStatus?: boolean;
    status?: OrderStatus;
    scheduledFor?: string;
    deliveryDate?: string;
    notes?: string;
    categoryId?: number;
    employeeId?: number;
    items?: OrderItem[];
}

export interface FilterOrders {
    customerId?: number;
    paidStatus?: boolean;
    status?: OrderStatus;
    startDate?: string;
    endDate?: string;
    categoryId?: number;
    forToday?: boolean;
    forTomorrow?: boolean;
}

export interface UpdateOrderCategory {
    name?: string;
    description?: string;
}

export interface InvoiceItem {
    id: number;
    quantity: number;
    unitPrice: number;
    subTotal: number;
    unit: string;
    invoiceId: number;
    itemId: number;
    item?: Item;
}

export interface Invoice {
    id: number;
    invoiceNumber: string;
    invoiceType: string;
    invoiceCategory: string;
    customerId: number;
    totalAmount: number;
    discount: number;
    additionalAmount: number;
    paidStatus: boolean;
    paymentDate: string;
    createdAt: string;
    notes?: string;
    isBreak: boolean;
    fundId: number;
    shiftId: number;
    employeeId: number;
    relatedDebtId?: number | null;
    trayCount: number;
    relatedAdvanceId?: number | null;
    items: InvoiceItem[];
    customer?: Customer;
}

export interface OrderWithInvoice {
    order: OrderResponseDto;
    invoice?: Invoice;
    message?: string;
}

export interface OrdersSummary {
    total: number,
    byStatus: {
        pending: number,
        processing?: number,
        ready?: number,
        delivered?: number,
        cancelled?: number,
    },
    forToday: number,
    forTomorrow: number,
    totalPaidAmount: number
}


