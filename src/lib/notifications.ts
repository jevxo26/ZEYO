"use client";

export interface AppNotification {
  id: number | string;
  icon: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  createdAt?: string;
}

export function createNotification(title: string, desc: string, icon = "🔔") {
  if (typeof window === "undefined") return;
  const newNotif: AppNotification = {
    id: Date.now(),
    icon,
    title,
    desc,
    time: "Just now",
    read: false,
    createdAt: new Date().toISOString(),
  };

  try {
    const existing = localStorage.getItem("custom_notifications");
    const list: AppNotification[] = existing ? JSON.parse(existing) : [];
    list.unshift(newNotif);
    localStorage.setItem("custom_notifications", JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("dashboard-data-update"));
  } catch (e) {
    console.error("Failed to save custom notification", e);
  }
}

export function getCustomNotifications(): AppNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const existing = localStorage.getItem("custom_notifications");
    return existing ? JSON.parse(existing) : [];
  } catch (e) {
    return [];
  }
}
