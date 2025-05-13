"use client";

import React, { useState, useEffect } from "react";
import { Hammer, Plus, Edit, Trash2, Eye, DollarSign, Clock, Users, Loader2 } from "lucide-react";
import { WorkType } from "@/types/employees.type";
import { Workshop } from "@/types/workshops/workshop.type";
import { useWorkshops, useWorkshop } from "@/hooks/workshops/useWorkshops";

import WorkshopModal from "./WorkshopModal";
import WorkshopDetailsModal from "./WorkshopDetailsModal";
import { useRoles, Role } from "@/hooks/users/useRoles";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";

interface WorkshopListProps {
  searchQuery: string;
  filterWorkType: "all" | WorkType;
  onPasswordRequired?: (workshop: Workshop, action: 'view' | 'edit') => void;
  verifiedWorkshop?: Workshop | null;
  verifiedPassword?: string | null;
  pendingWorkshopAction?: 'view' | 'edit' | null;
}

const WorkshopList: React.FC<WorkshopListProps> = ({
  searchQuery,
  filterWorkType,
  onPasswordRequired,
  verifiedWorkshop,
  verifiedPassword,
  pendingWorkshopAction
}) => {
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<number>(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editWorkshopId, setEditWorkshopId] = useState<number>(0);

  const { data: workshops, isLoading, refetch } = useWorkshops();
  const { data: selectedWorkshop, isLoading: isLoadingDetails } = useWorkshop(selectedWorkshopId);
  const { data: editWorkshop } = useWorkshop(editWorkshopId);
  const { hasAnyRole } = useRoles();

  // Format currency function
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("ar-SY", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const canManageWorkshops = hasAnyRole([
    Role.ADMIN,
    Role.MANAGER,
    Role.TreasuryManager,
  ]);

  // Filter workshops based on search and work type
  const filteredWorkshops = workshops?.filter((workshop) => {
    const searchMatch = workshop.name.toLowerCase().includes(searchQuery.toLowerCase());
    const workTypeMatch = filterWorkType === "all" || workshop.workType === filterWorkType;
    return searchMatch && workTypeMatch;
  });

  // Handle successful password verification
  useEffect(() => {
    if (verifiedWorkshop && verifiedPassword && pendingWorkshopAction) {
      if (pendingWorkshopAction === 'edit') {
        setEditWorkshopId(verifiedWorkshop.id);
        setShowAddModal(true);
      } else if (pendingWorkshopAction === 'view') {
        setSelectedWorkshopId(verifiedWorkshop.id);
        setShowDetailsModal(true);
      }
    }
  }, [verifiedWorkshop, verifiedPassword, pendingWorkshopAction]);

  const handleAddWorkshop = () => {
    setEditWorkshopId(0);
    setShowAddModal(true);
  };

  const handleEditWorkshop = (workshop: Workshop) => {
    if (workshop.password && onPasswordRequired) {
      onPasswordRequired(workshop, 'edit');
    } else {
      setEditWorkshopId(workshop.id);
      setShowAddModal(true);
    }
  };

  const handleViewDetails = (workshop: Workshop) => {
    if (workshop.password && onPasswordRequired) {
      onPasswordRequired(workshop, 'view');
    } else {
      setSelectedWorkshopId(workshop.id);
      setShowDetailsModal(true);
    }
  };

  // Reset modal states when needed
  const resetModalStates = () => {
    setShowDetailsModal(false);
    setShowAddModal(false);
    setSelectedWorkshopId(0);
    setEditWorkshopId(0);
  };

  // Render workshop statistics
  const renderStatistics = () => (
    <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
        <div className="text-3xl font-bold text-white mb-2">
          {filteredWorkshops?.length || 0}
        </div>
        <div className="text-slate-400">إجمالي الورشات</div>
      </div>
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
        <div className="text-3xl font-bold text-cyan-400 mb-2">
          {filteredWorkshops?.filter(w => w.workType === WorkType.HOURLY).length || 0}
        </div>
        <div className="text-slate-400">ورشات بالساعة</div>
      </div>
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
        <div className="text-3xl font-bold text-green-400 mb-2">
          {filteredWorkshops?.filter(w => w.workType === WorkType.PRODUCTION).length || 0}
        </div>
        <div className="text-slate-400">ورشات بالإنتاج</div>
      </div>
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
        <div className="text-3xl font-bold text-yellow-400 mb-2">
          {formatCurrency(
            filteredWorkshops?.reduce((sum, workshop) => sum + (workshop.financialSummary?.netAmount ?? 0), 0) || 0
          )}
        </div>
        <div className="text-slate-400">إجمالي الأرصدة</div>
      </div>
    </div>
  );

  return (
    <>
      {/* Statistics */}
      {renderStatistics()}

      {/* Add Workshop Button */}
      <div className="mb-8 flex justify-end px-4">
        {canManageWorkshops && (
          <button
            onClick={handleAddWorkshop}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg 
              bg-blue-500 text-white hover:bg-blue-600 transition-colors
              shadow-lg shadow-blue-500/20 whitespace-nowrap"
            dir="rtl"
          >
            <Plus className="h-5 w-5" />
            إضافة ورشة جديدة
          </button>
        )}
      </div>

      {/* Workshops Content */}
      <div className="container mx-auto px-4" dir="rtl">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 text-blue-400 animate-spin" />
          </div>
        ) : filteredWorkshops && filteredWorkshops.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 text-center text-gray-400">
            {searchQuery || filterWorkType !== "all"
              ? "لا توجد نتائج للبحث"
              : "لا يوجد ورشات"}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            <AnimatePresence>
              {filteredWorkshops?.map((workshop, index) => (
                <motion.div
                  dir="rtl"
                  key={`workshop-${workshop.id + " - " + index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm border border-white/10 rounded-xl p-6 
                            hover:shadow-lg hover:shadow-blue-500/5 hover:border-blue-500/30 transition-all duration-300"
                  onClick={() => handleViewDetails(workshop)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium text-white line-clamp-1">
                      {workshop.name}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1
                        ${workshop.workType === WorkType.HOURLY
                          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                          : "bg-green-500/10 text-green-400 border border-green-500/20"
                        }`}
                    >
                      {workshop.workType === WorkType.HOURLY ? (
                        <Clock className="w-4 h-4" />
                      ) : (
                        <DollarSign className="w-4 h-4" />
                      )}
                      {workshop.workType === WorkType.HOURLY ? "بالساعة" : "بالإنتاج"}
                    </span>
                  </div>

                  {/* Workshop Info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="text-sm text-gray-400">عدد الموظفين</div>
                        <div className="text-white">
                          {workshop.employees?.length || 0}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t border-white/10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(workshop);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-2 py-2 rounded-lg 
                              bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors
                              border border-blue-500/20"
                    >
                      <Eye className="w-4 h-4" />
                      عرض
                    </button>
                    {canManageWorkshops && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditWorkshop(workshop);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-2 py-2 rounded-lg 
                                  bg-slate-600/30 text-slate-300 hover:bg-slate-600/50 transition-colors
                                  border border-slate-600/30"
                        >
                          <Edit className="w-4 h-4" />
                          تعديل
                        </button>
                        <button
                          className="flex items-center justify-center gap-2 px-2 py-2 rounded-lg 
                                  bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors
                                  border border-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <WorkshopModal
          workshop={editWorkshop || null}
          currentPassword={verifiedPassword || undefined}
          onClose={() => {
            setShowAddModal(false);
            resetModalStates();
          }}
          onSave={() => {
            setShowAddModal(false);
            resetModalStates();
            refetch();
          }}
        />
      )}

      {showDetailsModal && selectedWorkshopId && selectedWorkshop && (
        <WorkshopDetailsModal
          workshop={selectedWorkshop}
          password={verifiedPassword || selectedWorkshop.password || ''}
          onClose={() => {
            setShowDetailsModal(false);
            resetModalStates();
          }}
          onUpdate={() => {
            refetch();
          }}
        />
      )}

      {/* Loading state for details modal */}
      {showDetailsModal && selectedWorkshopId && isLoadingDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <Loader2 className="h-10 w-10 text-blue-400 animate-spin" />
        </div>
      )}
    </>
  );
};

export default WorkshopList;