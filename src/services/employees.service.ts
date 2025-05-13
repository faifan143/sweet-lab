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
import { apiClient } from '@/utils/axios';

// Fetch all employees
export const fetchEmployees = async (): Promise<Employee[]> => {
  const response = await apiClient.get<Employee[]>('/employees');
  return response;
};

// Fetch employee by ID (returns detailed data)
export const fetchEmployeeById = async (employeeId: number): Promise<EmployeeDetails> => {
  const response = await apiClient.get<EmployeeDetails>(`/employees/${employeeId}`);
  return response;
};

// Create employee
export const createEmployee = async (employeeData: CreateEmployeeDTO): Promise<Employee> => {
  const response = await apiClient.post<Employee>('/employees', employeeData);
  return response;
};

// Update employee
export const updateEmployee = async (employeeId: number, employeeData: UpdateEmployeeDTO): Promise<Employee> => {
  const response = await apiClient.put<Employee>(`/employees/${employeeId}`, employeeData);
  return response;
};

// Employee payment operations (income)
export const createEmployeePayment = async (employeeId: number, paymentData: EmployeePaymentDTO): Promise<any> => {
  const response = await apiClient.post(`/employees/${employeeId}/payments`, paymentData);
  return response;
};

// Employee withdrawal operations (expense)
export const createEmployeeWithdrawal = async (employeeId: number, withdrawalData: EmployeeWithdrawalDTO): Promise<any> => {
  const response = await apiClient.post(`/employees/${employeeId}/withdrawals`, withdrawalData);
  return response;
};

// Add employee production
export const addEmployeeProduction = async (employeeId: number, productionData: EmployeeProductionDTO): Promise<any> => {
  const response = await apiClient.post(`/employees/${employeeId}/production`, productionData);
  return response;
};

// Add employee hours
export const addEmployeeHours = async (employeeId: number, hoursData: EmployeeHoursDTO): Promise<any> => {
  const response = await apiClient.post(`/employees/${employeeId}/hours`, hoursData);
  return response;
};

// Get employee financial summary
export const getEmployeeFinancialSummary = async (employeeId: number, params: FinancialSummaryParams): Promise<any> => {
  const response = await apiClient.get(`/employees/${employeeId}/financial-summary`, { params });
  return response;
};

// Get employee details with all related data
export const fetchEmployeeDetails = async (employeeId: number): Promise<any> => {
  const response = await apiClient.get(`/employees/${employeeId}/details`);
  return response;
};