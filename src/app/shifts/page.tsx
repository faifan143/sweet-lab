"use client";
import { ShiftSummaryData } from "@/components/common/CloseShiftModal";
import Navbar from "@/components/common/Navbar";
import PageSpinner from "@/components/common/PageSpinner";
import ShiftSummaryModal from "@/components/common/ShiftSummaryModal";
import SplineBackground from "@/components/common/SplineBackground";
import { useFetchShiftSummary, useShifts } from "@/hooks/shifts/useShifts";
import { formatDate } from "@/utils/formatters";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Clock, User2 } from "lucide-react";
import { useState } from "react";

const Shifts = () => {
  // Pagination and filtering state
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "morning" | "evening">(
    "all"
  );
  const [filterStatus, setFilterStatus] = useState<"all" | "open" | "closed">(
    "all"
  );
  const [selectedShift, setSelectedShift] = useState<number | null>(null);
  const [shiftSummary, setShiftSummary] = useState<ShiftSummaryData | null>(
    null
  );

  const itemsPerPage = 10;
  const { data: shifts, isLoading } = useShifts();
  const { mutate: fetchSummary, isPending: isSummaryLoading } =
    useFetchShiftSummary({
      onSuccess: (data) => setShiftSummary(data),
    });

  const handleShiftClick = (shiftId: number) => {
    setSelectedShift(shiftId);
    fetchSummary(shiftId);
  };

  // Filter and search logic
  const filteredShifts =
    shifts
      ?.filter((shift) => {
        const matchesSearch =
          shift.employee.username
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          shift.id.toString().includes(search);
        const matchesType =
          filterType === "all" || shift.shiftType === filterType;
        const matchesStatus =
          filterStatus === "all" || shift.status === filterStatus;

        return matchesSearch && matchesType && matchesStatus;
      })
      .sort((a, b) => b.id - a.id) || [];

  // Pagination logic
  const totalPages = Math.ceil(filteredShifts.length / itemsPerPage);
  const paginatedShifts = filteredShifts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-background relative transition-colors duration-300">
      {(isLoading || isSummaryLoading) && <PageSpinner />}

      <SplineBackground activeTab="shifts" />
      <AnimatePresence>
        {selectedShift && (
          <ShiftSummaryModal
            shiftId={selectedShift}
            summary={shiftSummary || undefined}
            onClose={() => {
              setSelectedShift(null);
              setShiftSummary(null);
            }}
          />
        )}
      </AnimatePresence>
      <div className="relative z-10">
        <Navbar />
        <main className="py-32 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Title Section */}
            <div className="container mx-auto px-4 mb-12">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <h1 className="text-4xl font-bold text-white mb-4">
                  سجل الورديات
                </h1>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full" />
              </motion.div>
            </div>
            {/* Search and Filters */}
            <div
              className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 px-4"
              dir="rtl"
            >
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="بحث..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-blue-500/30"
                />
              </div>

              {/* Type Filter */}
              <div>
                <select
                  value={filterType}
                  onChange={(e) =>
                    setFilterType(e.target.value as typeof filterType)
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                >
                  <option value="all">جميع الورديات</option>
                  <option value="morning">وردية صباحية</option>
                  <option value="evening">وردية مسائية</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={filterStatus}
                  onChange={(e) =>
                    setFilterStatus(e.target.value as typeof filterStatus)
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="open">مفتوحة</option>
                  <option value="closed">مغلقة</option>
                </select>
              </div>
              <button
                onClick={() => {
                  setSearch("");
                  setFilterType("all");
                  setFilterStatus("all");
                  setCurrentPage(1);
                }}
                className="px-4 py-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
              >
                إعادة تعيين الفلترة
              </button>
            </div>
            {/* Shifts List */}
            <div className="container mx-auto px-4" dir="rtl">
              <div className="grid gap-6">
                {paginatedShifts.map((shift, index) => (
                  <motion.div
                    key={shift.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300 cursor-pointer"
                    onClick={() => handleShiftClick(shift.id)}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            shift.shiftType === "morning"
                              ? "bg-yellow-500/10 text-yellow-400"
                              : "bg-blue-500/10 text-blue-400"
                          }`}
                        >
                          {shift.shiftType === "morning"
                            ? "وردية صباحية"
                            : "وردية مسائية"}
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            shift.status === "open"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {shift.status === "open" ? "مفتوحة" : "مغلقة"}
                        </div>
                        {shift.differenceStatus && (
                          <div
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              shift.differenceStatus === "surplus"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-red-500/10 text-red-400"
                            }`}
                          >
                            {shift.differenceValue}{" "}
                            {shift.differenceStatus === "surplus"
                              ? "زيادة"
                              : "نقصان"}
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-400">
                        رقم الوردية: #{shift.id}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex items-center gap-3">
                        <User2 className="w-5 h-5 text-blue-500" />
                        <div>
                          <div className="text-sm text-gray-400">الموظف</div>
                          <div className="text-white">
                            {shift.employee.username}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        <div>
                          <div className="text-sm text-gray-400">وقت الفتح</div>
                          <div className="text-white">
                            {formatDate(shift.openTime)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-blue-500" />
                        <div>
                          <div className="text-sm text-gray-400">
                            وقت الإغلاق
                          </div>
                          <div className="text-white">
                            {shift.closeTime
                              ? formatDate(shift.closeTime)
                              : "الوردية مفتوحة"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Empty State */}
                {!isLoading && filteredShifts.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    لا يوجد ورديات لعرضها
                  </div>
                )}
              </div>
            </div>
            {/* Pagination */}
            <div
              className="mt-8 flex justify-center items-center gap-4"
              dir="rtl"
            >
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-white/5 text-white disabled:opacity-50 hover:bg-white/10 transition-colors"
              >
                السابق
              </button>

              <div className="flex items-center gap-2" dir="rtl">
                <span className="text-white">الصفحة</span>
                <select
                  value={currentPage}
                  onChange={(e) => setCurrentPage(Number(e.target.value))}
                  className="bg-white/5 border border-white/10 rounded-lg text-white px-2 py-1"
                >
                  {[...Array(totalPages)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <span className="text-white">من {totalPages}</span>
              </div>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-4 py-2 rounded-lg bg-white/5 text-white disabled:opacity-50 hover:bg-white/10 transition-colors"
              >
                التالي
              </button>
            </div>

            {/* Results count */}
            <div className="mt-4 text-center text-gray-400">
              إجمالي النتائج: {filteredShifts.length}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Shifts;
