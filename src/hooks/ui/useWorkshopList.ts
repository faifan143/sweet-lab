import { useState, useEffect, useMemo } from "react";
import { WorkType } from "@/types/employees.type";
import { Workshop } from "@/types/workshops/workshop.type";
import { useWorkshops, useWorkshop } from "@/hooks/workshops/useWorkshops";

export interface FilteredWorkshopsOptions {
  searchQuery: string;
  filterWorkType: "all" | WorkType;
}

export function useFilteredWorkshops(options: FilteredWorkshopsOptions) {
  const { searchQuery, filterWorkType } = options;
  const { data: workshops, isLoading, refetch } = useWorkshops();

  const filteredWorkshops = useMemo(() => {
    if (!workshops) return [];
    
    return workshops.filter((workshop) => {
      const searchMatch = workshop.name.toLowerCase().includes(searchQuery.toLowerCase());
      const workTypeMatch = filterWorkType === "all" || workshop.workType === filterWorkType;
      return searchMatch && workTypeMatch;
    });
  }, [workshops, searchQuery, filterWorkType]);

  const statistics = useMemo(() => {
    return {
      total: filteredWorkshops.length,
      hourly: filteredWorkshops.filter(w => w.workType === WorkType.HOURLY).length,
      production: filteredWorkshops.filter(w => w.workType === WorkType.PRODUCTION).length,
      totalBalance: filteredWorkshops.reduce((sum, workshop) => 
        sum + (workshop.financialSummary?.netAmount ?? 0), 0
      ),
    };
  }, [filteredWorkshops]);

  return {
    workshops: filteredWorkshops,
    statistics,
    isLoading,
    refetch,
  };
}

export function useWorkshopSelection() {
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<number>(0);
  const [editWorkshopId, setEditWorkshopId] = useState<number>(0);
  
  const { data: selectedWorkshop, isLoading: isLoadingSelected } = useWorkshop(selectedWorkshopId);
  const { data: editWorkshop } = useWorkshop(editWorkshopId);

  const selectForView = (workshopId: number) => {
    setSelectedWorkshopId(workshopId);
  };

  const selectForEdit = (workshopId: number) => {
    setEditWorkshopId(workshopId);
  };

  const resetSelection = () => {
    setSelectedWorkshopId(0);
    setEditWorkshopId(0);
  };

  return {
    selectedWorkshop,
    editWorkshop,
    isLoadingSelected,
    selectForView,
    selectForEdit,
    resetSelection,
  };
}

export function useWorkshopModals() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const openAddModal = () => setShowAddModal(true);
  const closeAddModal = () => setShowAddModal(false);
  
  const openDetailsModal = () => setShowDetailsModal(true);
  const closeDetailsModal = () => setShowDetailsModal(false);

  const resetModals = () => {
    setShowAddModal(false);
    setShowDetailsModal(false);
  };

  return {
    showAddModal,
    showDetailsModal,
    openAddModal,
    closeAddModal,
    openDetailsModal,
    closeDetailsModal,
    resetModals,
  };
}

export function useWorkshopPasswordVerification(
  verifiedWorkshop: Workshop | null,
  verifiedPassword: string | null,
  pendingAction: 'view' | 'edit' | null
) {
  const { selectForView, selectForEdit } = useWorkshopSelection();
  const { openAddModal, openDetailsModal } = useWorkshopModals();

  useEffect(() => {
    if (verifiedWorkshop && verifiedPassword && pendingAction) {
      if (pendingAction === 'edit') {
        selectForEdit(verifiedWorkshop.id);
        openAddModal();
      } else if (pendingAction === 'view') {
        selectForView(verifiedWorkshop.id);
        openDetailsModal();
      }
    }
  }, [verifiedWorkshop, verifiedPassword, pendingAction]);
}
