import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { ThemeScript } from "@/components/theme-script";
import { AppShell } from "@/components/app-shell";
import { I18nProvider } from "@/i18n";

export const metadata: Metadata = {
  title: "chatgpt2api · Không gian sáng tạo",
  description:
    "Tạo ảnh, quản lý tài khoản và kết nối API trong một không gian.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f7f9" },
    { media: "(prefers-color-scheme: dark)", color: "#101719" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi-VN" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="antialiased">
        <I18nProvider>
          <Toaster position="top-right" richColors offset={80} closeButton />
          <AppShell>{children}</AppShell>
        </I18nProvider>
      </body>
    </html>
  );
}
