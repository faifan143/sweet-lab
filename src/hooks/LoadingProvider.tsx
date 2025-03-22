"use client";
import PageSpinner from "@/components/common/PageSpinner";
import { setLoading } from "@/redux/reducers/wrapper.slice";
import { AppDispatch, RootState } from "@/redux/store";
import { usePathname } from "next/navigation";
import React, { ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

interface LoadingProviderProps {
  children: ReactNode;
}

const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  // Access nested user state based on your structure
  const accessToken = useSelector(
    (state: RootState) => state.user.user.accessToken
  );
  const status = useSelector((state: RootState) => state.user.user.status);
  const isLoading = useSelector((state: RootState) => state.wrapper.isLoading);
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();

  // Get new_page from localStorage only when needed to avoid stale values
  const getNewPage = () => localStorage.getItem("new_page");

  // Reset loading when user is not authenticated
  useEffect(() => {
    if (!accessToken) {
      dispatch(setLoading(false));
      console.log(
        "from loading provider : Loading is set to ( " + false + " )"
      );
    }
  }, [dispatch, accessToken]);

  useEffect(() => {
    const new_page = getNewPage();
    console.log("new page is : \n", new_page + "\n");
    console.log("path name is : \n", pathname + "\n");

    if (pathname === new_page) {
      const timeout = setTimeout(() => {
        dispatch(setLoading(false));
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [dispatch, isLoading, pathname]);

  return (
    <>
      {(status === "loading" || isLoading) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/5 backdrop-blur-sm z-50">
          <PageSpinner />
        </div>
      )}
      {children}
    </>
  );
};

export default LoadingProvider;
