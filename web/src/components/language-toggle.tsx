"use client";

import { Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useI18n, type Locale } from "@/i18n";

const locales: Array<{ value: Locale; label: string }> = [
  { value: "zh-CN", label: "中文" },
  { value: "vi-VN", label: "Tiếng Việt" },
];

export function LanguageToggle() {
  const { locale, setLocale, t } = useI18n();
  const nextLocale = locale === "zh-CN" ? "vi-VN" : "zh-CN";

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="h-8 gap-1.5 px-2 text-xs text-stone-500 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white"
      onClick={() => setLocale(nextLocale)}
      title={t("language.switch")}
      aria-label={t("language.switch")}
    >
      <Languages className="size-4" />
      <span>{locales.find((item) => item.value === locale)?.label}</span>
    </Button>
  );
}
