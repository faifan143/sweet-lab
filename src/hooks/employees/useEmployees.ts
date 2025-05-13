import { useMutation, useQuery, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import {
  createEmployee,
  fetchEmployees,
  fetchEmployeeById,
  updateEmployee,
  createEmployeePayment,
  createEmployeeWithdrawal,
  addEmployeeProduction,
  addEmployeeHours,
  getEmployeeFinancialSummary
} from '@/services/employees.service';
import {
  CreateEmployeeDTO,
  Employee,
  EmployeeDetails,
  EmployeeHoursDTO,
  EmployeePaymentDTO,
  EmployeeProductionDTO,
  EmployeeWithdrawalDTO,
  FinancialSummaryParams,
  UpdateEmployeeDTO
} from '@/types/employees.type';

// Hook for creating a new employee
export const useCreateEmployee = (options?: UseMutationOptions<Employee, Error, CreateEmployeeDTO>) => {
  return useMutation<Employee, Error, CreateEmployeeDTO>({
    mutationFn: createEmployee,
    ...options
  });
};

// Hook for fetching all employees
export const useEmployeesList = (options?: UseQueryOptions<Employee[], Error>) => {
  return useQuery<Employee[], Error>({
    queryKey: ['employees'],
    queryFn: fetchEmployees,
    ...options
  });
};

// Hook for fetching employee by ID
export const useEmployee = (employeeId: number, options?: UseQueryOptions<EmployeeDetails, Error>) => {
  return useQuery<EmployeeDetails, Error>({
    queryKey: ['employees', employeeId],
    queryFn: () => fetchEmployeeById(employeeId),
    enabled: !!employeeId,
    ...options
  });
};

// Hook for updating employee
export const useUpdateEmployee = (options?: UseMutationOptions<Employee, Error, { employeeId: number; data: UpdateEmployeeDTO }>) => {
  return useMutation<Employee, Error, { employeeId: number; data: UpdateEmployeeDTO }>({
    mutationFn: ({ employeeId, data }) => updateEmployee(employeeId, data),
    ...options
  });
};

// Hook for creating employee payments (income)
export const useCreateEmployeePayment = (options?: UseMutationOptions<any, Error, { employeeId: number; data: EmployeePaymentDTO }>) => {
  return useMutation<any, Error, { employeeId: number; data: EmployeePaymentDTO }>({
    mutationFn: ({ employeeId, data }) => createEmployeePayment(employeeId, data),
    ...options
  });
};

// Hook for creating employee withdrawals (expense)
export const useCreateEmployeeWithdrawal = (options?: UseMutationOptions<any, Error, { employeeId: number; data: EmployeeWithdrawalDTO }>) => {
  return useMutation<any, Error, { employeeId: number; data: EmployeeWithdrawalDTO }>({
    mutationFn: ({ employeeId, data }) => createEmployeeWithdrawal(employeeId, data),
    ...options
  });
};

// Hook for adding employee production
export const useAddEmployeeProduction = (options?: UseMutationOptions<any, Error, { employeeId: number; data: EmployeeProductionDTO }>) => {
  return useMutation<any, Error, { employeeId: number; data: EmployeeProductionDTO }>({
    mutationFn: ({ employeeId, data }) => addEmployeeProduction(employeeId, data),
    ...options
  });
};

// Hook for adding employee hours
export const useAddEmployeeHours = (options?: UseMutationOptions<any, Error, { employeeId: number; data: EmployeeHoursDTO }>) => {
  return useMutation<any, Error, { employeeId: number; data: EmployeeHoursDTO }>({
    mutationFn: ({ employeeId, data }) => addEmployeeHours(employeeId, data),
    ...options
  });
};

// Hook for getting employee financial summary
export const useEmployeeFinancialSummary = (
  employeeId: number,
  params: FinancialSummaryParams,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery<any, Error>({
    queryKey: ['employees', employeeId, 'financial-summary', params],
    queryFn: () => getEmployeeFinancialSummary(employeeId, params),
    enabled: !!employeeId && !!params.startDate && !!params.endDate,
    ...options
  });
};