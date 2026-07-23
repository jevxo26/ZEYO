"use client";
import { logout, restoreUser } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/store/store";
import { useEffect } from "react";

import apiClient from "@/lib/apiClient";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const res = await apiClient.get("/auth/me");
        const data = res.data;

        if (data.success) {
          dispatch(restoreUser(data.data.user ?? data.data));
        } else {
          dispatch(logout());
        }
      } catch {
        dispatch(logout());
      }
    }
    loadUser();
  }, [dispatch]);

  return <>{children}</>;
}