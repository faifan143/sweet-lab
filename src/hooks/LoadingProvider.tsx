"use client";

import PageSpinner from "@/components/common/PageSpinner";
import { RootState } from "@/redux/store";
import React, { ReactNode } from "react";
import { useSelector } from "react-redux";

interface LoadingProviderProps {
  children: ReactNode;
}

const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const status = useSelector((state: RootState) => state.user.user.status);
  const isLoading = useSelector(
    (state: RootState) => state.user.wrapper.isLoading
  );

  return (
    <>
      {(status == "loading" || isLoading) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/5 z-50">
          <PageSpinner />
        </div>
      )}
      {children}
    </>
  );
};

export default LoadingProvider;
