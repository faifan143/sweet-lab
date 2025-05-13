import { useState } from "react";
import { Employee } from "@/types/employees.type";
import { EmployeeDebt } from "@/types/debts.type";
import { Workshop } from "@/types/workshops/workshop.type";

interface ModalState<T> {
  isOpen: boolean;
  data: T | null;
}

export function useModalState<T = any>() {
  const [state, setState] = useState<ModalState<T>>({
    isOpen: false,
    data: null,
  });

  const open = (data?: T) => {
    setState({
      isOpen: true,
      data: data || null,
    });
  };

  const close = () => {
    setState({
      isOpen: false,
      data: null,
    });
  };

  return {
    isOpen: state.isOpen,
    data: state.data,
    open,
    close,
  };
}

export function useEmployeeModals() {
  const addModal = useModalState<Employee>();
  const detailsModal = useModalState<Employee>();
  const debtDetailsModal = useModalState<EmployeeDebt>();

  const handleAddEmployee = () => {
    addModal.open();
  };

  const handleEditEmployee = (employee: Employee) => {
    addModal.open(employee);
  };

  const handleViewDetails = (employee: Employee) => {
    detailsModal.open(employee);
  };

  const handleViewDebtDetails = (debt: EmployeeDebt) => {
    debtDetailsModal.open(debt);
  };

  return {
    addModal,
    detailsModal,
    debtDetailsModal,
    handleAddEmployee,
    handleEditEmployee,
    handleViewDetails,
    handleViewDebtDetails,
  };
}

export function useWorkshopPasswordFlow() {
  const [passwordModal, setPasswordModal] = useState({
    isOpen: false,
    workshop: null as Workshop | null,
    action: null as 'view' | 'edit' | null,
    verifiedPassword: null as string | null,
    verifiedWorkshop: null as Workshop | null,
    pendingAction: null as 'view' | 'edit' | null,
  });

  const requirePassword = (workshop: Workshop, action: 'view' | 'edit') => {
    setPasswordModal({
      ...passwordModal,
      isOpen: true,
      workshop,
      action,
    });
  };

  const verifyPassword = (password: string): boolean => {
    if (passwordModal.workshop?.password === password) {
      setPasswordModal({
        ...passwordModal,
        isOpen: false,
        verifiedPassword: password,
        verifiedWorkshop: passwordModal.workshop,
        pendingAction: passwordModal.action,
        workshop: null,
        action: null,
      });
      return true;
    }
    return false;
  };

  const resetFlow = () => {
    setPasswordModal({
      isOpen: false,
      workshop: null,
      action: null,
      verifiedPassword: null,
      verifiedWorkshop: null,
      pendingAction: null,
    });
  };

  return {
    passwordModal,
    requirePassword,
    verifyPassword,
    resetFlow,
  };
}
