"use client";

import { setLoading } from "@/redux/reducers/wrapper.slice";
import { AppDispatch, RootState } from "@/redux/store";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface RouteWrapperProps {
  href: string;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  skipLoading?: boolean;
}

const RouteWrapper: React.FC<RouteWrapperProps> = ({
  href,
  children,
  onClick,
  className = "",
  skipLoading = false,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();
  const [navigating, setNavigating] = useState(false);
  const isAuthenticated = useSelector(
    (state: RootState) => !!state.user?.user.accessToken
  );

  // Handle navigation and set loading state
  const handleRoute = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Set the new_page in localStorage at the time of click, not render
    localStorage.setItem("new_page", href);

    // Don't set loading if:
    // 1. We're not changing routes
    // 2. We're on the login page
    // 3. skipLoading is true
    // 4. User is not authenticated
    if (
      href !== pathname &&
      pathname !== "/login" &&
      !skipLoading &&
      isAuthenticated &&
      !navigating
    ) {
      dispatch(setLoading(true));
      setNavigating(true);
    }

    if (onClick) onClick();
    router.push(href);
  };

  return (
    <Link href={href} className={className} onClick={handleRoute}>
      {children}
    </Link>
  );
};

export default RouteWrapper;
