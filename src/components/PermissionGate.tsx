import React from "react";
import { useAuth } from "../contexts/AuthContext";

type PermissionGateProps = {
  children: React.ReactNode;
};

export default function PermissionGate({ children }: PermissionGateProps) {
  const { user } = useAuth();

  const isStaff = user?.roleLevel === "staff" || user?.role?.level === "staff";
  const isReadOnly = user?.actionPermission === "Chỉ xem";

  if (isStaff && isReadOnly) {
    return null;
  }

  return <>{children}</>;
}
