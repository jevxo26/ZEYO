import type { Metadata } from "next";
<<<<<<< Updated upstream
import { Bai_Jamjuree } from "next/font/google";
=======
import { Plus_Jakarta_Sans } from "next/font/google";
>>>>>>> Stashed changes
import "./globals.css";

import { ReduxProvider } from "@/components/ReduxProvider";
import { AuthInitializer } from "@/components/auth/AuthInitializer";
import FacebookSdkLoader from "@/components/FacebookSdkLoader";

<<<<<<< Updated upstream
const baiJamjuree = Bai_Jamjuree({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-bai-jamjuree",
=======
const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
>>>>>>> Stashed changes
  display: "swap",
});

export const metadata: Metadata = {
<<<<<<< Updated upstream
  title: "EVENTO",
  description: "Smart Multi-Vendor Event Planning & Booking Platform",
=======
  title: "Evento — Premium Event Management Platform",
  description: "Manage events, vendors, bookings and earnings with Evento's all-in-one platform.",
>>>>>>> Stashed changes
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
<<<<<<< Updated upstream
      className={`${baiJamjuree.variable} h-full antialiased`}
      suppressHydrationWarning
=======
      className={`${plusJakartaSans.variable} h-full antialiased`}
>>>>>>> Stashed changes
    >
      <body className={baiJamjuree.className} suppressHydrationWarning>
        <ReduxProvider>
          <AuthInitializer>{children}</AuthInitializer>
        </ReduxProvider>

        <FacebookSdkLoader />
      </body>
    </html>
  );
}