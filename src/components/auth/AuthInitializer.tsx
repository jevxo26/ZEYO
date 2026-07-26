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
      const storedUser = localStorage.getItem("user");

      if (!token) return;

      // Immediately restore from localStorage so UI is instant and doesn't blink
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          dispatch(restoreUser(parsedUser));
        } catch {
          // invalid JSON
        }
      }

      // If this is a demo token, no need to call backend /auth/me
      if (token.startsWith("demo-")) {
        return;
      }

      try {
        const res = await apiClient.get("/auth/me");
        const data = res.data;

        if (data.success) {
          dispatch(restoreUser(data.data.user ?? data.data));
        } else if (!storedUser) {
          dispatch(logout());
        }
      } catch (err: any) {
        // Only logout if explicit 401 Unauthorized from backend; keep stored user if backend is offline
        if (err.response?.status === 401 && !storedUser) {
          dispatch(logout());
        }
      }
    }
    loadUser();
  }, [dispatch]);

  return <>{children}</>;
}