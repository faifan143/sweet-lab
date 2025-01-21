"use client";
import { useState } from "react";
import { Box } from "lucide-react";
import Navbar from "@/components/common/Navbar";
import SplineBackground from "@/components/common/SplineBackground";
import TrayConfirmReturnModal from "@/components/common/TrayConfirmReturnModal";
import TrayTable from "@/components/common/TrayTable";
import { useMokkBar } from "@/components/providers/MokkBarContext";
import { usePendingTrayTracking, useReturnTrays } from "@/hooks/trays/useTrays";
import { TrayTracking } from "@/types/items.type";

const TraysPage = () => {
  const { data: pendingTrays, isLoading, isError } = usePendingTrayTracking();
  const returnTray = useReturnTrays();
  const { setSnackbarConfig } = useMokkBar();

  const [selectedTray, setSelectedTray] = useState<TrayTracking | null>(null);

  const handleReturnClick = (tray: TrayTracking) => {
    setSelectedTray(tray);
  };

  const handleReturn = async () => {
    if (!selectedTray) return;

    try {
      await returnTray.mutateAsync(selectedTray.invoiceId);
      setSnackbarConfig({
        open: true,
        severity: "success",
        message: "تم إرجاع الفوارغ بنجاح",
      });
      setSelectedTray(null);
    } catch {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: "حدث خطأ أثناء إرجاع الفوارغ",
      });
    }
  };

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-danger">
        حدث خطأ في تحميل البيانات
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative transition-colors duration-300">
      <SplineBackground activeTab="الفوارغ" />
      <div className="relative z-10">
        <Navbar />
        <main className="py-32 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between" dir="rtl">
              <div className="flex items-center gap-3" dir="rtl">
                <Box className="h-6 w-6 text-slate-400" />
                <h1 className="text-2xl font-bold text-slate-200">
                  الفوارغ المعلقة
                </h1>
              </div>
            </div>

            <TrayTable
              trays={pendingTrays}
              isLoading={isLoading}
              isPending={returnTray.isPending}
              onReturn={handleReturnClick}
            />
          </div>
        </main>
      </div>

      <TrayConfirmReturnModal
        isOpen={!!selectedTray}
        onClose={() => setSelectedTray(null)}
        onConfirm={handleReturn}
        isLoading={returnTray.isPending}
        trayCount={selectedTray?.totalTrays || 0}
        customerName={selectedTray?.customer.name || ""}
      />
    </div>
  );
};

export default TraysPage;
