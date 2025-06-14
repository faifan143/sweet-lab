import { CheckPendingTransfersResponse } from "@/types/shifts.type";
import {
  AnyToGeneralBody,
  AnyToGeneralResponse,
  ConfirmationResponse,
  GeneralToMainBody,
  GeneralToMainResponse,
  GeneralToNextShift,
  HandleShiftTransferResponse,
  PendingTransfersResponse,
  TransferHistoryResponse,
  TransferRequest,
} from "@/types/transfer.type";
import { apiClient } from "@/utils/axios";

export class TransferService {
  static async handlePendingTransfer(
    id: string,
    data: {
      accept: boolean;
      shiftId: number;
      notes: string;
    }
  ): Promise<HandleShiftTransferResponse> {
    const response = await apiClient.post<HandleShiftTransferResponse>(
      "/funds/handle-pending-transfer/" + id,
      data
    );
    return response;
  }

  static async getNextShiftPendingTransfers(): Promise<PendingTransfersResponse> {
    const response = await apiClient.get<PendingTransfersResponse>(
      "/funds/pending-transfers"
    );
    return response;
  }

  // Fetch Transfer History with optional status filter
  static async getTransferHistory(
    status?: "pending" | "accepted" | "rejected"
  ): Promise<TransferHistoryResponse> {
    const url = status
      ? `/funds/transfer-history?status=${status}`
      : "/funds/transfer-history";

    const response = await apiClient.get<TransferHistoryResponse>(url);
    return response;
  }

  static async generalToNextShift(
    data: Omit<GeneralToMainBody, "sourceId">
  ): Promise<GeneralToNextShift> {
    const res = await apiClient.post<GeneralToNextShift>(
      "/funds/transfer-for-next-shift",
      data
    );
    return res;
  }

  static async anyToGeneral(
    data: AnyToGeneralBody
  ): Promise<AnyToGeneralResponse> {
    const res = await apiClient.post<AnyToGeneralResponse>(
      "/invoices/transfer/booth-university-to-general",
      data
    );
    return res;
  }

  static async generalToMain(
    data: GeneralToMainBody
  ): Promise<GeneralToMainResponse> {
    const res = await apiClient.post<GeneralToMainResponse>(
      `/invoices/transfer/from/${data.sourceId}/to-main/request`,
      data
    );
    return res;
  }

  static async generalToMainConfirmation() { }

  static async getTransfers(status: string): Promise<TransferRequest> {
    const res = await apiClient.get<TransferRequest>(
      `/invoices/transfer/to-main/history?status=${status}`
    );
    return res;
  }

  static async NextShift(): Promise<TransferRequest> {
    const res = await apiClient.get<TransferRequest>(
      `/invoices/transfer/to-main/pending`
    );
    return res;
  }

  static async confirmPendingTransfer(
    transferId: string,
    data: {
      confirm: boolean;
      rejectionReason: string;
    }
  ): Promise<ConfirmationResponse> {
    const res = await apiClient.post<ConfirmationResponse>(
      `/invoices/transfer/to-main/confirm/` + transferId,
      data
    );
    return res;
  }

  static async checkPendingTransfers(): Promise<CheckPendingTransfersResponse> {
    const res = await apiClient.get<CheckPendingTransfersResponse>(
      `/shifts/check-pending-transfers`
    );
    return res;
  }


}
