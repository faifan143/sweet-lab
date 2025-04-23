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
    OrdersSummary,
    UpdateOrder,
    OrderCategoryUpdateDto,
    OrdersCreateDto
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
            // Invalidate only order categories
            queryClient.invalidateQueries({ queryKey: ["orderCategories"] });
        },
    });
};

export const useUpdateOrderCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ orderCategoryId, data }: { orderCategoryId: number, data: OrderCategoryUpdateDto }) =>
            OrdersService.updateOrderCategory(orderCategoryId, data),
        onSuccess: () => {
            // Invalidate order categories since a category was updated
            queryClient.invalidateQueries({ queryKey: ["orderCategories"] });
        },
    });
};

export const useDeleteOrderCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (orderCategoryId: number) => OrdersService.deleteOrderCategory(orderCategoryId),
        onSuccess: () => {
            // Invalidate order categories since a category was deleted
            queryClient.invalidateQueries({ queryKey: ["orderCategories"] });
            // Invalidate orders-related queries as orders may be affected (e.g., if orders are reassigned or removed)
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["ordersSummary"] });
            queryClient.invalidateQueries({ queryKey: ["ordersForPreparation"] });
            queryClient.invalidateQueries({ queryKey: ["ordersForDeliveryToday"] });
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
            // Invalidate queries related to orders
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["ordersSummary"] });
            queryClient.invalidateQueries({ queryKey: ["ordersForPreparation"] });
            queryClient.invalidateQueries({ queryKey: ["ordersForDeliveryToday"] });
        },
    });
};

export const useUpdateOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ orderId, data }: { orderId: number, data: UpdateOrder }) =>
            OrdersService.updateOrder(orderId, data),
        onSuccess: (_, variables) => {
            // Invalidate queries related to the updated order
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["order", variables.orderId] });
            queryClient.invalidateQueries({ queryKey: ["ordersSummary"] });
            queryClient.invalidateQueries({ queryKey: ["ordersForPreparation"] });
            queryClient.invalidateQueries({ queryKey: ["ordersForDeliveryToday"] });
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
        onSuccess: (_, variables) => {
            // Invalidate queries related to the updated order
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
        onSuccess: (_, variables) => {
            // Invalidate queries related to the converted order
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["order", variables.orderId] });
            queryClient.invalidateQueries({ queryKey: ["ordersSummary"] });
            queryClient.invalidateQueries({ queryKey: ["ordersForPreparation"] });
            queryClient.invalidateQueries({ queryKey: ["ordersForDeliveryToday"] });
        },
    });
};

export const useDeleteOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (orderId: number) => OrdersService.deleteOrder(orderId),
        onSuccess: (_, orderId) => {
            // Invalidate queries related to the deleted order
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["order", orderId] });
            queryClient.invalidateQueries({ queryKey: ["ordersSummary"] });
            queryClient.invalidateQueries({ queryKey: ["ordersForPreparation"] });
            queryClient.invalidateQueries({ queryKey: ["ordersForDeliveryToday"] });
        },
    });
};