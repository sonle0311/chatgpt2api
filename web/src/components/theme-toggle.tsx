"use client";

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { useI18n } from "@/i18n";

export function ThemeToggle() {
  const { t } = useI18n();
  return (
    <AnimatedThemeToggler
      aria-label={t("theme.toggle")}
      title={t("theme.toggle")}
      variant="circle"
      className="inline-flex size-8 shrink-0 items-center justify-center text-stone-500 transition hover:text-stone-900 dark:text-stone-300 dark:hover:text-white [&_svg]:size-4"
    />
  );
}
