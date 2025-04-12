import { CategoryWithCount, CreateCategoryRequest, CreateCategoryResponse, CustomerCategory, DeleteCategoryResponse, GetCategoriesListResponse, GetCategoryByIdResponse, UpdateCategoryRequest, UpdateCategoryResponse } from "@/types/customerCategories.types";
import { apiClient } from "@/utils/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Hook for retrieving detailed information for all customer categories
 */
export const useFetchCategories = () => {
    return useQuery<CustomerCategory[]>({
        queryKey: ["customer-categories"],
        queryFn: async () => {
            const response = await apiClient.get<CustomerCategory[]>(
                "/customer-categories"
            );
            return response;
        },
    });
};

/**
 * Hook for retrieving a simple list of categories with customer counts
 */
export const useCategoriesList = () => {
    return useQuery<CategoryWithCount[]>({
        queryKey: ["categories-list"],
        queryFn: async () => {
            const response = await apiClient.get<GetCategoriesListResponse>(
                "/customer-categories/list"
            );
            return response;
        },
    });
};

/**
 * Hook for retrieving a specific customer category by ID
 */
export const useCategory = (categoryId: string | number) => {
    return useQuery<CustomerCategory>({
        queryKey: ["category", categoryId.toString()],
        queryFn: async () => {
            if (!categoryId) {
                throw new Error("Category ID is required");
            }
            const response = await apiClient.get<GetCategoryByIdResponse>(
                `/customer-categories/${categoryId}`
            );
            return response;
        },
        enabled: !!categoryId, // Only run the query if we have a category ID
    });
};

// Function to format API errors
const formatError = (error: unknown): Error => {
    if (error instanceof Error) {
        return error;
    }

    if (typeof error === "object" && error !== null) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const anyError = error as any;
        const message =
            anyError.response?.data?.message ||
            anyError.message ||
            "An unknown error occurred";
        return new Error(message);
    }

    return new Error("An unknown error occurred");
};

/**
 * Hook for creating a new customer category
 */
export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation<CreateCategoryResponse, Error, CreateCategoryRequest>({
        mutationFn: async (categoryData: CreateCategoryRequest) => {
            const response = await apiClient.post<CreateCategoryResponse>(
                "/customer-categories",
                categoryData
            );
            return response;
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ["customer-categories"] });
            queryClient.invalidateQueries({ queryKey: ["categories-list"] });
        },
        onError: (error) => {
            console.error("Error creating category:", error);
            throw formatError(error);
        },
    });
};

/**
 * Hook for updating an existing customer category
 */
export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    interface UpdateCategoryParams extends UpdateCategoryRequest {
        id: number;
    }

    return useMutation<UpdateCategoryResponse, Error, UpdateCategoryParams>({
        mutationFn: async (categoryData: UpdateCategoryParams) => {
            const { id, ...data } = categoryData;
            const response = await apiClient.patch<UpdateCategoryResponse>(
                `/customer-categories/${id}`,
                data
            );
            return response;
        },
        onSuccess: (data, variables) => {
            // Invalidate and refetch categories
            queryClient.invalidateQueries({ queryKey: ["customer-categories"] });
            queryClient.invalidateQueries({ queryKey: ["categories-list"] });
            queryClient.invalidateQueries({
                queryKey: ["category", variables.id.toString()],
            });
            // Also refresh customer data as it may include category info
            queryClient.invalidateQueries({ queryKey: ["customers"] });
            queryClient.invalidateQueries({ queryKey: ["all-customers"] });
        },
        onError: (error) => {
            console.error("Error updating category:", error);
            throw formatError(error);
        },
    });
};

/**
 * Hook for deleting a customer category
 */
export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation<DeleteCategoryResponse, Error, number>({
        mutationFn: async (categoryId: number) => {
            const response = await apiClient.delete<DeleteCategoryResponse>(
                `/customer-categories/${categoryId}`
            );
            return response;
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ["customer-categories"] });
            queryClient.invalidateQueries({ queryKey: ["categories-list"] });
            // Also refresh customer data as it may include category info
            queryClient.invalidateQueries({ queryKey: ["customers"] });
            queryClient.invalidateQueries({ queryKey: ["all-customers"] });
        },
        onError: (error) => {
            console.error("Error deleting category:", error);
            throw formatError(error);
        },
    });
};