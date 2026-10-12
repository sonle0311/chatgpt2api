"use client";

import { useI18n } from "@/i18n";
import { PageHeading } from "@/components/page-heading";

export function SettingsHeader() {
  const { text, locale } = useI18n();
  return (
    <PageHeading eyebrow="Preferences" title={text("设置")} description={locale === "vi-VN" ? "Tùy chỉnh không gian làm việc, kết nối và quyền truy cập." : "管理工作空间、连接与访问权限。"} />
  );
}
