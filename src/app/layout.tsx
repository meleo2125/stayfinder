import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { AlertProvider } from "@/context/AlertContext";
import { HostAuthProvider } from '@/context/HostAuthContext';
import NotificationFeedWrapper from '@/components/NotificationFeedWrapper';

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "StayFinder - Find Your Perfect Stay",
  description: "Discover amazing properties for your next adventure. Book unique accommodations with StayFinder.",
  keywords: "property rental, vacation rental, accommodation, travel, booking, stay",
  authors: [{ name: "StayFinder Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#0f766e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <HostAuthProvider>
        <AuthProvider>
            <NotificationProvider>
              <AlertProvider>
                <NotificationFeedWrapper>
          {children}
                </NotificationFeedWrapper>
              </AlertProvider>
            </NotificationProvider>
        </AuthProvider>
        </HostAuthProvider>
      </body>
    </html>
  );
}
