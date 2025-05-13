"use client";
import { useRoles, Role } from "@/hooks/users/useRoles";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/components/common/PageSpinner";

export default function EmployeesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { hasAnyRole, } = useRoles();

  // Check if user has permission to access this page
  useEffect(() => {
    if (!hasAnyRole([Role.ADMIN, Role.MANAGER, Role.TreasuryManager])) {
      router.replace("/");
    }
  }, [hasAnyRole, router]);


  return <>{children}</>;
}
