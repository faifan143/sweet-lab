export interface AnyToGeneralBody {
  sourceId: number; // booth : 3 , university : 4
  amount: number;
  notes: string;
}

export type GeneralToMainBody = AnyToGeneralBody;

export interface AnyToGeneralResponse {
  success: boolean;
  message: string;
  transferAmount: number;
  sourceType: string;
  expenseInvoice: {
    id: number;
    invoiceNumber: string;
    invoiceType: "expense";
    invoiceCategory: "direct";
    customerId: null;
    totalAmount: number;
    discount: 0;
    paidStatus: true;
    paymentDate: string;
    createdAt: string;
    notes: string;
    isBreak: false;
    fundId: number;
    shiftId: number;
    employeeId: number;
    relatedDebtId: null;
    trayCount: 0;
  };
  incomeInvoice: {
    id: number;
    invoiceNumber: string;
    invoiceType: "income";
    invoiceCategory: "direct";
    customerId: null;
    totalAmount: number;
    discount: 0;
    paidStatus: true;
    paymentDate: string;
    createdAt: string;
    notes: string;
    isBreak: false;
    fundId: number;
    shiftId: number;
    employeeId: number;
    relatedDebtId: null;
    trayCount: 0;
  };
  transferLog: {
    id: number;
    amount: number;
    fromFundId: number;
    toFundId: number;
    transferredById: number;
    transferredAt: string;
  };
}

export interface GeneralToMainResponse {
  success: boolean;
  message: string;
  transferAmount: number;
  status: "pending";
  expenseInvoice: {
    id: number;
    invoiceNumber: string;
    invoiceType: "expense";
    invoiceCategory: "direct";
    customerId: null;
    totalAmount: number;
    discount: 0;
    paidStatus: false;
    paymentDate: null;
    createdAt: string;
    notes: string;
    isBreak: false;
    fundId: number;
    shiftId: number;
    employeeId: number;
    relatedDebtId: null;
    trayCount: 0;
  };
  incomeInvoice: {
    id: number;
    invoiceNumber: string;
    invoiceType: "income";
    invoiceCategory: "direct";
    customerId: null;
    totalAmount: number;
    discount: 0;
    paidStatus: false;
    paymentDate: null;
    createdAt: string;
    notes: string;
    isBreak: false;
    fundId: number;
    shiftId: number;
    employeeId: number;
    relatedDebtId: null;
    trayCount: 0;
  };
  transferRequest: {
    id: number;
    amount: number;
    status: "pending";
    requestedById: number;
    confirmedById: null;
    requestedAt: string;
    confirmedAt: null;
    notes: string;
    rejectionReason: null;
    expenseInvoiceId: number;
    incomeInvoiceId: number;
  };
}

export interface TransferRequest {
  id: number;
  amount: number;
  status: "pending" | "confirmed" | "rejected";
  requestedById: number;
  confirmedById: number | null;
  requestedAt: string;
  confirmedAt: string | null;
  notes: string;
  rejectionReason: string | null;
  expenseInvoiceId: number;
  incomeInvoiceId: number;
  requestedBy: {
    username: string;
  };
  confirmedBy: {
    username: string;
  } | null;
}

export interface ConfirmationResponse {
  success: boolean;
  message: string;
  transferAmount: number;
  status: "rejected" | "confirmed";
  rejectionReason: string;
}

export interface GeneralToNextShift {
  success: boolean;
  message: string;
  transferNumber: string;
  amount: number;
  status: "pending" | "rejected" | "accepted";
  generalFundBalance: number;
}

// Types for Fund Transfers دفتر الورديةfrom

interface UserReference {
  id?: number;
  username: string;
}

interface FundTransfer {
  id: number;
  transferNumber: string;
  amount: number;
  status: "pending" | "accpted" | "rejected";
  requestedById: number;
  requestedAt: string;
  acceptedById: number | null;
  acceptedAt: string | null;
  notes: string | null;
  expenseInvoiceId: number | null;
  incomeInvoiceId: number | null;
  requestedBy: UserReference;
  acceptedBy?: UserReference | null;
  expenseInvoice?: {
    id?: number;
  } | null;
  incomeInvoice?: {
    id?: number;
  } | null;
}

export interface PendingTransfersResponse {
  pendingTransfers: FundTransfer[];
  count: number;
  totalPendingAmount: number;
}

export interface TransferHistoryResponse {
  transfers: FundTransfer[];
  count: number;
  totalAmount: number;
}

export interface HandleShiftTransferResponse {
  success: boolean;
  message: string;
  amount: number;
  transferNumber: string;
  status: "accepted" | "rejected";
}
