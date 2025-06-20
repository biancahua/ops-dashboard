import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import { LoadingProvider } from "./components/LoadingContext";
import { LoadingPage } from "./components/LoadingPage";
import Providers from "./components/Provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ops Dashboard",
  description: "Operations dashboard for health metrics and attention queue management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <Providers>
          <LoadingProvider>
            <LoadingPage />
            <Navigation />
            <main className="min-h-screen">
              {children}
            </main>
          </LoadingProvider>
        </Providers>
      </body>
    </html>
  );
}
