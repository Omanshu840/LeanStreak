import type { Metadata, Viewport } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { AuthSessionProvider } from "@/components/providers/AuthSessionProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "LeanStreak",
  description: "Build healthy habits, one streak at a time.",
  manifest: `${BASE_PATH}/manifest.webmanifest`,
  icons: {
    icon: [
      { url: `${BASE_PATH}/favicon.ico`, type: "image/x-icon" },
      { url: `${BASE_PATH}/icons/icon-192.png`, type: "image/png", sizes: "192x192" },
      { url: `${BASE_PATH}/icons/icon-512.png`, type: "image/png", sizes: "512x512" },
    ],
    shortcut: [{ url: `${BASE_PATH}/favicon.ico`, type: "image/x-icon" }],
    apple: [{ url: `${BASE_PATH}/icons/apple-touch-icon.png`, sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LeanStreak",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#dfe5ef" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1524" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakarta.variable} ${geistMono.variable} antialiased`}>
        <AuthSessionProvider>
          <QueryProvider>{children}</QueryProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
