"use client";
import ActionButton from "@/components/common/ActionButtons";
import CloseShiftModal from "@/components/common/CloseShiftModal";
import Navbar from "@/components/common/Navbar";
import ShiftModal, { ShiftType } from "@/components/common/ShiftModal";
import SplineBackground from "@/components/common/SplineBackground";
import StatBox from "@/components/common/StatBox";
import TabContent from "@/components/common/TableContent";
import { AnimatePresence, motion } from "framer-motion";
import {
  DollarSign,
  Package,
  Play,
  StopCircle,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [activeTab, setActiveTab] = useState("بسطة");
  const [isShiftOpen, setIsShiftOpen] = useState(false);
  const [currentShiftType, setCurrentShiftType] = useState<ShiftType>(null);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showCloseShiftModal, setShowCloseShiftModal] = useState(false);

  const stats = [
    {
      title: "المبيعات اليومية",
      value: "12,500$",
      icon: TrendingUp,
      trend: 12,
    },
    { title: "العملاء النشطون", value: "320", icon: Users, trend: -5 },
    { title: "الإيرادات", value: "45,000$", icon: DollarSign, trend: 8 },
    { title: "المخزون", value: "1,250", icon: Package, trend: 3 },
  ];

  const handleAddIncome = (type: string) => {
    console.log(`Adding income for ${type}...`);
  };

  const handleAddExpense = (type: string) => {
    console.log(`Adding expense for ${type}...`);
  };

  const handleShiftOpen = () => {
    setShowShiftModal(true);
  };

  const handleShiftTypeSelect = (type: ShiftType) => {
    setCurrentShiftType(type);
    setIsShiftOpen(true);
    setShowShiftModal(false);
  };

  // Initiates shift closing process
  const handleShiftClose = () => {
    setShowCloseShiftModal(true);
  };

  // Confirms shift closing
  const handleConfirmShiftClose = () => {
    setIsShiftOpen(false);
    setCurrentShiftType(null);
    setActiveTab("بسطة");
    setShowCloseShiftModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative">
      <SplineBackground activeTab={activeTab} />

      {/* Modals */}
      <AnimatePresence>
        {showShiftModal && (
          <ShiftModal
            onClose={() => setShowShiftModal(false)}
            onSelect={handleShiftTypeSelect}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCloseShiftModal && currentShiftType && (
          <CloseShiftModal
            onClose={() => setShowCloseShiftModal(false)}
            onConfirm={handleConfirmShiftClose}
            shiftType={currentShiftType}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10">
        <Navbar />
        <main className="pt-32 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Stats Grid */}
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
              dir="rtl"
            >
              {stats.map((stat, index) => (
                <StatBox key={index} {...stat} />
              ))}
            </div>

            {/* Shift Control Buttons */}
            <div
              className="flex flex-wrap gap-4 mb-8 justify-end items-center"
              dir="rtl"
            >
              {currentShiftType && (
                <span className="text-slate-400">
                  الوردية الحالية: {currentShiftType}
                </span>
              )}
              {!isShiftOpen ? (
                <ActionButton
                  icon={<Play className="h-5 w-5" />}
                  label="فتح وردية"
                  onClick={handleShiftOpen}
                  variant="success"
                />
              ) : (
                <ActionButton
                  icon={<StopCircle className="h-5 w-5" />}
                  label="اغلاق وردية"
                  onClick={handleShiftClose}
                  variant="danger"
                />
              )}
            </div>

            {/* Tabs and Content - Only visible when shift is open */}
            {isShiftOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-8"
                dir="rtl"
              >
                <div className="flex space-x-4 border-b border-slate-700/50">
                  {["بسطة", "جامعة", "عام"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 -mb-px text-sm font-medium transition-colors duration-200 ${
                        activeTab === tab
                          ? "text-sky-400 border-b-2 border-sky-400"
                          : "text-slate-400 hover:text-slate-300"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <TabContent
                  type={activeTab}
                  onAddIncome={() => handleAddIncome(activeTab)}
                  onAddExpense={() => handleAddExpense(activeTab)}
                />
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
