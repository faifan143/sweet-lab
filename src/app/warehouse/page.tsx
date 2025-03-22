"use client";
import { Package, Receipt } from "lucide-react";
import { useState } from "react";

import InvoiceDetailModal from "@/components/common/InvoiceDetailModal";
import Navbar from "@/components/common/Navbar";
import SplineBackground from "@/components/common/SplineBackground";
import { InvoicesTable } from "@/components/common/warehouse/InvoicesTable";
import { PageTitle } from "@/components/common/warehouse/PageTitle";
import { Pagination } from "@/components/common/warehouse/Pagination";
import { RawMaterialStatsSummary } from "@/components/common/warehouse/RawMaterialStatsSummary";
import { SearchBar } from "@/components/common/warehouse/SearchBar";
import StoredMaterialsGrid from "@/components/common/warehouse/StoredMaterialsGrid";
import { useRawMaterialExpenses } from "@/hooks/warehouse/useWarehouse";
import { WareHouseInvoice } from "@/types/warehouse.type";

// Tabs Component
const WarehouseTabs = ({
  activeTab,
  onTabChange,
}: {
  activeTab: "materials" | "invoices";
  onTabChange: (tab: "materials" | "invoices") => void;
}) => (
  <div className="flex justify-center mb-8 w-full ">
    <div className="inline-flex bg-white/5 rounded-lg p-1 w-full gap-2">
      <button
        onClick={() => onTabChange("materials")}
        className={`
        w-full
justify-center        px-6 py-2 rounded-lg transition-colors flex items-center gap-2
          ${
            activeTab === "materials"
              ? "bg-purple-500/20 text-purple-400"
              : "text-slate-300 hover:bg-white/10"
          }
        `}
      >
        <Package className="h-5 w-5" />
        المواد المخزنة
      </button>
      <button
        onClick={() => onTabChange("invoices")}
        className={`
        w-full
        justify-center        px-6 py-2 rounded-lg transition-colors flex items-center gap-2
          ${
            activeTab === "invoices"
              ? "bg-purple-500/20 text-purple-400"
              : "text-slate-300 hover:bg-white/10"
          }
        `}
      >
        <Receipt className="h-5 w-5" />
        فواتير المشتريات
      </button>
    </div>
  </div>
);

// Main Warehouse Page Component
const RawMaterialWarehouse = () => {
  const [activeTab, setActiveTab] = useState<"materials" | "invoices">(
    "materials"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] =
    useState<WareHouseInvoice | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const { data } = useRawMaterialExpenses();

  // Handle view invoice details
  const handleViewInvoice = (invoice: WareHouseInvoice) => {
    setSelectedInvoice(invoice);
    setIsDetailModalOpen(true);
  };

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-background relative transition-colors duration-300">
      <SplineBackground activeTab="warehouse" />

      <div className="relative">
        <Navbar />

        <main className="py-32 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Page Title */}
            <PageTitle />

            {/* Raw Material Stats Summary */}
            {data?.rawMaterialStats?.summary && (
              <RawMaterialStatsSummary
                summary={data.rawMaterialStats.summary}
              />
            )}

            {/* Tabs */}
            <WarehouseTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Search Bar */}
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              onClearSearch={handleClearSearch}
            />

            {/* Content Based on Active Tab */}
            <div className="container mx-auto " dir="rtl">
              {activeTab === "materials" ? (
                data?.rawMaterialStats?.items &&
                data.rawMaterialStats.items.length > 0 ? (
                  <>
                    <StoredMaterialsGrid
                      materials={data.rawMaterialStats.items}
                    />

                    {/* Results Count */}
                    <div className="mt-4 text-center text-gray-400">
                      إجمالي المواد: {data.rawMaterialStats.items.length}
                    </div>
                  </>
                ) : (
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 text-center text-gray-400">
                    لا توجد مواد مخزنة
                  </div>
                )
              ) : data?.invoices && data.invoices.length > 0 ? (
                <>
                  {/* Invoices Table */}
                  <InvoicesTable
                    invoices={data.invoices}
                    onViewInvoice={handleViewInvoice}
                  />

                  {/* Pagination */}
                  {data.totalCount > 10 && (
                    <Pagination
                      totalCount={data.totalCount}
                      currentPage={1}
                      onPageChange={() => {}}
                    />
                  )}

                  {/* Results Count */}
                  <div className="mt-4 text-center text-gray-400">
                    إجمالي النتائج: {data.totalCount}
                  </div>
                </>
              ) : (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 text-center text-gray-400">
                  لا توجد فواتير مشتريات
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Invoice Detail Modal */}
        {selectedInvoice && (
          <InvoiceDetailModal
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            invoice={selectedInvoice}
          />
        )}
      </div>
    </div>
  );
};

export default RawMaterialWarehouse;
