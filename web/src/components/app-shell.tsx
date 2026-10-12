"use client";

import { usePathname } from "next/navigation";
import { TopNav } from "@/components/top-nav";
import { useI18n } from "@/i18n";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname().replace(/\/$/, "") || "/";
  const { locale } = useI18n();
  if (pathname === "/login")
    return (
      <main id="main-content" className="login-shell">
        {children}
      </main>
    );
  return (
    <div className="workspace-shell">
      <a href="#main-content" className="skip-link">
        {locale === "vi-VN" ? "Đến nội dung chính" : "跳到主要内容"}
      </a>
      <TopNav />
      <main
        id="main-content"
        tabIndex={-1}
        className={`workspace-content${pathname === "/image" ? " workspace-content-studio" : ""}`}
      >
        {children}
      </main>
    </div>
  );
}
