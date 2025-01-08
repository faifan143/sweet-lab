// src/utils/shifts.ts
export const getCurrentShiftId = (): number => {
  const currentShiftId = window.localStorage.getItem("currentShiftId");
  return currentShiftId ? parseInt(currentShiftId) : 0;
};
