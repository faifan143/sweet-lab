// hooks/orders/useOrders.ts
import {
    ConvertToInvoiceRequest,
    OrdersService
} from "@/services/orders.service";
import {
    FilterOrders,
    OrderResponseDto,
    OrderStatus,
    OrdersCategoriesCreateDto,
    OrdersCategoriesFetchDto,
    OrdersCreateDto,
    OrdersSummary,
    UpdateOrder
} from "@/types/orders.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Order Categories Hooks
export const useOrderCategories = (params?: Partial<FilterOrders>) => {
    return useQuery<OrdersCategoriesFetchDto[], Error>({
        queryKey: ["orderCategories", params],
        queryFn: () => OrdersService.fetchOrderCategoriesWithCustomers(params),
    });
};

export const useCreateOrderCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: OrdersCategoriesCreateDto) => OrdersService.createOrderCategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orderCategories"] });
        },
    });
};

// Orders Hooks
export const useOrders = (params?: FilterOrders) => {
    return useQuery<OrderResponseDto[], Error>({
        queryKey: ["orders", params],
        queryFn: () => OrdersService.getOrders(params),
    });
};

export const useOrderById = (orderId: number) => {
    return useQuery<OrderResponseDto, Error>({
        queryKey: ["order", orderId],
        queryFn: () => OrdersService.getOrderById(orderId),
        enabled: !!orderId,
    });
};

export const useOrdersSummary = () => {
    return useQuery<OrdersSummary, Error>({
        queryKey: ["ordersSummary"],
        queryFn: OrdersService.getOrdersSummary,
    });
};

export const useOrdersForPreparation = () => {
    return useQuery<OrderResponseDto[], Error>({
        queryKey: ["ordersForPreparation"],
        queryFn: OrdersService.getOrdersForPreparation,
    });
};

export const useOrdersForDeliveryToday = () => {
    return useQuery<OrderResponseDto[], Error>({
        queryKey: ["ordersForDeliveryToday"],
        queryFn: OrdersService.getOrdersForDeliveryToday,
    });
};

export const useCreateOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: OrdersCreateDto) => OrdersService.createOrder(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["ordersSummary"] });
        },
    });
};

export const useUpdateOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ orderId, data }: { orderId: number, data: UpdateOrder }) =>
            OrdersService.updateOrder(orderId, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["order", variables.orderId] });
            queryClient.invalidateQueries({ queryKey: ["ordersSummary"] });
        },
    });
};

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            orderId,
            status,
            notes
        }: {
            orderId: number,
            status: OrderStatus,
            notes?: string
        }) => OrdersService.updateOrderStatus(orderId, status, notes),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["order", variables.orderId] });
            queryClient.invalidateQueries({ queryKey: ["ordersSummary"] });
            queryClient.invalidateQueries({ queryKey: ["ordersForPreparation"] });
            queryClient.invalidateQueries({ queryKey: ["ordersForDeliveryToday"] });
        },
    });
};

export const useConvertOrderToInvoice = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            orderId,
            data
        }: {
            orderId: number,
            data?: ConvertToInvoiceRequest
        }) => OrdersService.convertOrderToInvoice(orderId, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["order", variables.orderId] });
            queryClient.invalidateQueries({ queryKey: ["ordersSummary"] });
            // You might also want to invalidate invoice queries if you have them
            queryClient.invalidateQueries({ queryKey: ["invoices"] });
        },
    });
};

export const useDeleteOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (orderId: number) => OrdersService.deleteOrder(orderId),
        onSuccess: (_, orderId) => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["ordersSummary"] });
            queryClient.invalidateQueries({ queryKey: ["ordersForPreparation"] });
            queryClient.invalidateQueries({ queryKey: ["ordersForDeliveryToday"] });
            queryClient.removeQueries({ queryKey: ["order", orderId] });
        },
    });
};