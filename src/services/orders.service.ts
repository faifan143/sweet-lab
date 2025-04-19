// services/orders.service.ts
import { apiClient } from "@/utils/axios";
import {
    OrdersCategoriesCreateDto,
    OrdersCategoriesCreateResponseDto,
    OrdersCategoriesFetchDto,
    OrdersCreateDto,
    OrderResponseDto,
    OrderStatus,
    OrderWithInvoice,
    OrdersSummary,
    UpdateOrder,
    FilterOrders
} from "@/types/orders.type";

export interface UpdateOrderStatusRequest {
    status: OrderStatus;
    notes?: string;
}

export interface ConvertToInvoiceRequest {
    fundId?: number;
    notes?: string;
}

export class OrdersService {
    // Order Categories Endpoints
    static createOrderCategory = async (data: OrdersCategoriesCreateDto): Promise<OrdersCategoriesCreateResponseDto> => {
        const response = await apiClient.post<OrdersCategoriesCreateResponseDto>("/order-categories", data);
        return response;
    };

    static fetchOrderCategoriesWithCustomers = async (params?: Partial<FilterOrders>): Promise<OrdersCategoriesFetchDto[]> => {
        const url = params
            ? `/order-categories/with-customers?${new URLSearchParams(params as Record<string, string>).toString()}`
            : "/order-categories/with-customers";
        const response = await apiClient.get<OrdersCategoriesFetchDto[]>(url);
        return response;
    };

    // Orders Endpoints
    static createOrder = async (data: OrdersCreateDto): Promise<OrderWithInvoice> => {
        const response = await apiClient.post<OrderWithInvoice>("/orders", data);
        return response;
    };

    static getOrdersSummary = async (): Promise<OrdersSummary> => {
        const response = await apiClient.get<OrdersSummary>("/orders/summary");
        return response;
    };

    static getOrdersForPreparation = async (): Promise<OrderResponseDto[]> => {
        const response = await apiClient.get<OrderResponseDto[]>("/orders/for-preparation");
        return response;
    };

    static getOrdersForDeliveryToday = async (): Promise<OrderResponseDto[]> => {
        const response = await apiClient.get<OrderResponseDto[]>("/orders/for-delivery-today");
        return response;
    };

    static updateOrder = async (orderId: number, data: UpdateOrder): Promise<OrderResponseDto> => {
        const response = await apiClient.patch<OrderResponseDto>(`/orders/${orderId}`, data);
        return response;
    };

    static updateOrderStatus = async (orderId: number, status: OrderStatus, notes?: string): Promise<OrderResponseDto> => {
        const data = notes ? { notes } : undefined;
        const response = await apiClient.patch<OrderResponseDto>(`/orders/${orderId}/status/${status}`, data);
        return response;
    };

    static convertOrderToInvoice = async (orderId: number, data?: ConvertToInvoiceRequest): Promise<OrderWithInvoice> => {
        const response = await apiClient.post<OrderWithInvoice>(`/orders/${orderId}/convert-to-invoice`, data);
        return response;
    };

    static deleteOrder = async (orderId: number): Promise<void> => {
        await apiClient.delete(`/orders/${orderId}`);
    };

    // Additional helper methods for filtering orders
    static getOrders = async (params?: FilterOrders): Promise<OrderResponseDto[]> => {
        const url = params
            ? `/orders?${new URLSearchParams(params as Record<string, string>).toString()}`
            : "/orders";
        const response = await apiClient.get<OrderResponseDto[]>(url);
        return response;
    };

    static getOrderById = async (orderId: number): Promise<OrderResponseDto> => {
        const response = await apiClient.get<OrderResponseDto>(`/orders/${orderId}`);
        return response;
    };
}