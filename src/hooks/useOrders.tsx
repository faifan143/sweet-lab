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
            queryClient.resetQueries();
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
            queryClient.resetQueries();
        },
    });
};

export const useUpdateOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ orderId, data }: { orderId: number, data: UpdateOrder }) =>
            OrdersService.updateOrder(orderId, data),
        onSuccess: (data, variables) => {
            queryClient.resetQueries();
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
            queryClient.resetQueries();
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
            queryClient.resetQueries();
        },
    });
};

export const useDeleteOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (orderId: number) => OrdersService.deleteOrder(orderId),
        onSuccess: (_, orderId) => {
            queryClient.resetQueries();
        },
    });
};