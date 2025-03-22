import { useMokkBar } from "@/components/providers/MokkBarContext";
import {
  useHandlePendingTransfer,
  usePendingTransfers,
  useTransferHistory,
} from "@/hooks/funds/useFunds";
import { Role, useRoles } from "@/hooks/users/useRoles";
import { formatDate } from "@/utils/formatters";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const TransfersSection = ({ currentShiftId }: { currentShiftId: number }) => {
  const { hasAnyRole } = useRoles();
  const [activeTab, setActiveTab] = useState<
    "pending" | "accepted" | "rejected"
  >("pending");
  const { setSnackbarConfig } = useMokkBar();

  // Hooks for data and mutations
  const handlePendingTransfer = useHandlePendingTransfer();
  const {
    data: pendingTransfers,
    isLoading: isPendingTransfersLoading,
    isError: isPendingTransfersError,
  } = usePendingTransfers();

  const {
    data: acceptedTransfers,
    isLoading: isAcceptedTransfersLoading,
    isError: isAcceptedTransfersError,
  } = useTransferHistory("accepted");

  const {
    data: rejectedTransfers,
    isLoading: isRejectedTransfersLoading,
    isError: isRejectedTransfersError,
  } = useTransferHistory("rejected");

  console.log("current shift : ", currentShiftId);

  const handleTransferAction = async (transferId: string, accept: boolean) => {
    try {
      await handlePendingTransfer.mutateAsync({
        id: transferId,
        data: {
          accept,
          shiftId: currentShiftId,
          notes: accept ? "تم قبول التحويل" : "تم رفض التحويل",
        },
      });

      // Success notification
      setSnackbarConfig({
        open: true,
        severity: "success",
        message: accept ? "تم قبول التحويل بنجاح" : "تم رفض التحويل بنجاح",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Error notification
      setSnackbarConfig({
        open: true,
        severity: "error",
        message:
          error?.response?.data?.message || "حدث خطأ أثناء معالجة التحويل",
      });
    }
  };

  const renderTransferList = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transfers: any[],
    status: "pending" | "accepted" | "rejected"
  ) => {
    // Error handling for empty transfers
    if (!transfers || transfers.length === 0) {
      return (
        <div className="text-center p-4 text-gray-500">
          {status === "pending"
            ? "لا توجد تحويلات معلقة"
            : status === "accepted"
            ? "لا توجد تحويلات مقبولة"
            : "لا توجد تحويلات مرفوضة"}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4">
        {transfers.map((transfer) => (
          <div
            key={transfer.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-3"
          >
            <div className="flex flex-wrap justify-between items-center gap-2">
              <span
                className={`px-3 py-1 text-sm rounded-full ${
                  status === "pending"
                    ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300"
                    : status === "accepted"
                    ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                    : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                }`}
              >
                {status === "pending"
                  ? "معلق"
                  : status === "accepted"
                  ? "مقبول"
                  : "مرفوض"}
              </span>
              <span className="font-medium text-sm text-white">
                رقم التحويل: {transfer.transferNumber}
              </span>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {transfer.notes || "لا توجد ملاحظات"}
              </p>
              <div className="flex flex-wrap justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <span>
                  بواسطة: {transfer.requestedBy.username} في{" "}
                  {formatDate(transfer.requestedAt)}
                </span>
                <span className="font-bold text-base text-gray-800 dark:text-gray-200">
                  ${transfer.amount.toLocaleString()}
                </span>
              </div>
            </div>

            {status === "pending" &&
              hasAnyRole([Role.ADMIN, Role.ShiftManager]) && (
                <div className="flex flex-wrap gap-2 mt-3">
                  <button
                    onClick={() => handleTransferAction(transfer.id, true)}
                    disabled={handlePendingTransfer.isPending}
                    className="grow sm:grow-0 p-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                  >
                    {handlePendingTransfer.isPending ? (
                      <span className="animate-spin">⌛</span>
                    ) : (
                      <span>✓</span>
                    )}
                    <span className="hidden sm:inline">قبول</span>
                  </button>
                  <button
                    onClick={() => handleTransferAction(transfer.id, false)}
                    disabled={handlePendingTransfer.isPending}
                    className="grow sm:grow-0 p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                  >
                    {handlePendingTransfer.isPending ? (
                      <span className="animate-spin">⌛</span>
                    ) : (
                      <span>✗</span>
                    )}
                    <span className="hidden sm:inline">رفض</span>
                  </button>
                </div>
              )}
          </div>
        ))}
      </div>
    );
  };

  // Centralized loading component
  const LoadingSpinner = () => (
    <div className="flex justify-center py-6">
      <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
    </div>
  );

  // Centralized error component
  const ErrorMessage = ({ message }: { message?: string }) => (
    <div className="text-center py-6 text-red-400">
      {message || "حدث خطأ أثناء تحميل البيانات"}
    </div>
  );

  return (
    <section id="transfers" title="التحويلات">
      <div className="flex items-center justify-center mb-5">
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 shadow-lg  w-full flex-col items-center gap-4">
          <div className="flex gap-4 mb-5">
            <div className="bg-blue-500/20 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-200">
                إدارة تحويلات الوردية السابقة
              </h2>
              <p className="text-sm text-slate-400">
                راجع واعتمد التحويلات المالية المعلقة من الوردية السابقة
              </p>
            </div>
          </div>
          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex flex-wrap border-b border-slate-700/50 mb-4">
              <button
                onClick={() => setActiveTab("pending")}
                className={`flex items-center justify-center flex-1 py-2 px-1 min-w-[80px] transition-colors ${
                  activeTab === "pending"
                    ? "border-b-2 border-blue-500 text-blue-400"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className="text-sm md:text-base">التحويلات المعلقة</span>
                {pendingTransfers?.count ? (
                  <span className="mr-1 md:mr-2 bg-red-500/20 text-red-400 rounded-full px-1.5 md:px-2 py-0.5 text-xs whitespace-nowrap">
                    {pendingTransfers.count}
                  </span>
                ) : null}
              </button>
              <button
                onClick={() => setActiveTab("accepted")}
                className={`flex items-center justify-center flex-1 py-2 px-1 min-w-[80px] transition-colors ${
                  activeTab === "accepted"
                    ? "border-b-2 border-emerald-500 text-emerald-400"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className="text-sm md:text-base">المقبولة</span>
                {acceptedTransfers?.count ? (
                  <span className="mr-1 md:mr-2 bg-emerald-500/20 text-emerald-400 rounded-full px-1.5 md:px-2 py-0.5 text-xs whitespace-nowrap">
                    {acceptedTransfers.count}
                  </span>
                ) : null}
              </button>
              <button
                onClick={() => setActiveTab("rejected")}
                className={`flex items-center justify-center flex-1 py-2 px-1 min-w-[80px] transition-colors ${
                  activeTab === "rejected"
                    ? "border-b-2 border-red-500 text-red-400"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className="text-sm md:text-base">المرفوضة</span>
                {rejectedTransfers?.count ? (
                  <span className="mr-1 md:mr-2 bg-red-500/20 text-red-400 rounded-full px-1.5 md:px-2 py-0.5 text-xs whitespace-nowrap">
                    {rejectedTransfers.count}
                  </span>
                ) : null}
              </button>
            </div>

            {/* Content with comprehensive loading and error handling */}
            {activeTab === "pending" ? (
              isPendingTransfersLoading ? (
                <LoadingSpinner />
              ) : isPendingTransfersError ? (
                <ErrorMessage />
              ) : (
                renderTransferList(
                  pendingTransfers?.pendingTransfers || [],
                  "pending"
                )
              )
            ) : activeTab === "accepted" ? (
              isAcceptedTransfersLoading ? (
                <LoadingSpinner />
              ) : isAcceptedTransfersError ? (
                <ErrorMessage />
              ) : (
                renderTransferList(
                  acceptedTransfers?.transfers || [],
                  "accepted"
                )
              )
            ) : isRejectedTransfersLoading ? (
              <LoadingSpinner />
            ) : isRejectedTransfersError ? (
              <ErrorMessage />
            ) : (
              renderTransferList(rejectedTransfers?.transfers || [], "rejected")
            )}

            {/* Summary with loading state consideration */}
            {activeTab === "pending" &&
              !isPendingTransfersLoading &&
              !isPendingTransfersError &&
              pendingTransfers && (
                <div className="mt-4 text-center text-slate-400">
                  إجمالي المبلغ المعلق:
                  <span className="text-blue-400 mr-1">
                    ${pendingTransfers.totalPendingAmount.toLocaleString()}
                  </span>
                </div>
              )}
            {activeTab === "accepted" &&
              !isAcceptedTransfersLoading &&
              !isAcceptedTransfersError &&
              acceptedTransfers && (
                <div className="mt-4 text-center text-slate-400">
                  إجمالي المبلغ المقبول:
                  <span className="text-emerald-400 mr-1">
                    ${acceptedTransfers.totalAmount.toLocaleString()}
                  </span>
                </div>
              )}
            {activeTab === "rejected" &&
              !isRejectedTransfersLoading &&
              !isRejectedTransfersError &&
              rejectedTransfers && (
                <div className="mt-4 text-center text-slate-400">
                  إجمالي المبلغ المرفوض:
                  <span className="text-red-400 mr-1">
                    ${rejectedTransfers.totalAmount.toLocaleString()}
                  </span>
                </div>
              )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransfersSection;
