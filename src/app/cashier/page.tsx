"use client";
import { useAuth } from "@/components/auth-prowider";
import React from "react";

const CashierPage = () => {
  const { isAuthenticated, logout } = useAuth();

  console.log(isAuthenticated);

  if (isAuthenticated.role === "SuperAdmin") {
    return <div>Access Denied</div>;
  } else if (isAuthenticated.role === "Cashier") {
    return <div onClick={logout}>Cashier Page</div>;
  } else {
    return <div>Loading...</div>;
  }
};

export default CashierPage;
