import {
  CreateWorkshopDTO,
  CreateWorkshopHoursDTO,
  CreateWorkshopProductionDTO,
  CreateWorkshopSettlementDTO,
  UpdateWorkshopDTO,
  Workshop,
  WorkshopFinancialSummary,
  WorkshopFinancialSummaryParams,
  WorkshopHours,
  WorkshopProduction,
  WorkshopSettlement
} from '@/types/workshops/workshop.type';
import { apiClient } from '@/utils/axios';

export class WorkshopService {
  // Base workshop operations
  static async getAllWorkshops(): Promise<Workshop[]> {
    const response = await apiClient.get<Workshop[]>('/workshops');
    return response;
  }

  static async getWorkshopById(id: number, password?: string): Promise<Workshop> {
    const response = await apiClient.get<Workshop>(`/workshops/${id}`,);
    return response;
  }

  static async createWorkshop(data: CreateWorkshopDTO): Promise<Workshop> {
    const response = await apiClient.post<Workshop>('/workshops', data);
    return response;
  }

  static async updateWorkshop(id: number, data: UpdateWorkshopDTO, password?: string): Promise<Workshop> {
    const response = await apiClient.put<Workshop>(`/workshops/${id}`, data,);
    return response;
  }

  // Production operations
  static async addWorkshopProduction(
    workshopId: number,
    data: CreateWorkshopProductionDTO,
  ): Promise<WorkshopProduction> {
    const response = await apiClient.post<WorkshopProduction>(
      `/workshops/${workshopId}/production`,
      data,
    );
    return response;
  }

  // Hours operations
  static async addWorkshopHours(
    workshopId: number,
    data: CreateWorkshopHoursDTO,
  ): Promise<WorkshopHours> {
    const response = await apiClient.post<WorkshopHours>(
      `/workshops/${workshopId}/hours`,
      data,
    );
    return response;
  }

  // Settlement operations
  static async createWorkshopSettlement(
    workshopId: number,
    data: CreateWorkshopSettlementDTO,
  ): Promise<WorkshopSettlement> {
    const response = await apiClient.post<WorkshopSettlement>(
      `/workshops/${workshopId}/settlement`,
      data,
    );
    return response;
  }

  // Financial summary
  static async getWorkshopFinancialSummary(
    workshopId: number,
    params: WorkshopFinancialSummaryParams,
  ): Promise<WorkshopFinancialSummary> {
    const response = await apiClient.get<WorkshopFinancialSummary>(
      `/workshops/${workshopId}/summary`,
      {
        params,
      }
    );
    return response;
  }

  // Additional employee management operations
  static async addEmployeeToWorkshop(
    workshopId: number,
    employeeId: number,

  ): Promise<void> {
    await apiClient.post(`/workshops/${workshopId}/employees/${employeeId}`,);
  }

  static async removeEmployeeFromWorkshop(
    workshopId: number,
    employeeId: number,

  ): Promise<void> {
    await apiClient.delete(`/workshops/${workshopId}/employees/${employeeId}`,);
  }
}
