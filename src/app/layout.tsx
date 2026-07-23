import type { Metadata } from "next";
import { Bai_Jamjuree } from "next/font/google";
import "./globals.css";

import { ReduxProvider } from "@/components/ReduxProvider";
import { AuthInitializer } from "@/components/auth/AuthInitializer";
import { Toaster } from "sonner";
import FacebookSdkLoader from "@/components/FacebookSdkLoader";

const baiJamjuree = Bai_Jamjuree({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-bai-jamjuree",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EVENTO",
  description: "Smart Multi-Vendor Event Planning & Booking Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${baiJamjuree.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className={baiJamjuree.className} suppressHydrationWarning>
        <ReduxProvider>
          <AuthInitializer>{children}</AuthInitializer>
        </ReduxProvider>
        <Toaster richColors position="top-right" />
        <FacebookSdkLoader />
      </body>
    </html>
  );
}