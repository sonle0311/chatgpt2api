"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  Code2,
  ExternalLink,
  FileClock,
  ImagePlus,
  Images,
  LogOut,
  Menu,
  Settings2,
  UsersRound,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { HeaderActions } from "@/components/header-actions";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import webConfig from "@/constants/common-env";
import { fetchThirdPartyApps, type ThirdPartyAppsSettings } from "@/lib/api";
import { getValidatedAuthSession } from "@/lib/auth-session";
import { clearStoredAuthSession, type StoredAuthSession } from "@/store/auth";
import { useI18n } from "@/i18n";

const adminNavItems = [
  { href: "/image", label: "生图", icon: ImagePlus },
  { href: "/accounts", label: "号池管理", icon: UsersRound },
  { href: "/image-manager", label: "图片管理", icon: Images },
  { href: "/logs", label: "日志管理", icon: FileClock },
  { href: "/debug", label: "调试", icon: Code2 },
  { href: "/api-docs", label: "API 与文档", icon: BookOpen },
  { href: "/settings", label: "设置", icon: Settings2 },
];

const userNavItems = [{ href: "/image", label: "画图", icon: ImagePlus }];

function buildThirdPartyHref(appUrl: string, baseUrl: string, apiKey: string) {
  const url = appUrl.trim();
  try {
    const target = new URL(url);
    target.searchParams.set("apiKey", apiKey);
    target.searchParams.set("baseUrl", baseUrl);
    return target.toString();
  } catch {
    return `${url}${url.includes("?") ? "&" : "?"}apiKey=${encodeURIComponent(apiKey)}&baseUrl=${encodeURIComponent(baseUrl)}`;
  }
}

export function TopNav() {
  const { text, locale } = useI18n();
  const pathname = usePathname().replace(/\/$/, "") || "/";
  const router = useRouter();
  const [session, setSession] = useState<StoredAuthSession | null | undefined>(
    undefined,
  );
  const [thirdPartyApps, setThirdPartyApps] =
    useState<ThirdPartyAppsSettings | null>(null);
  const [isCanvasDialogOpen, setIsCanvasDialogOpen] = useState(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (pathname === "/login") {
        if (!active) {
          return;
        }
        setSession(null);
        return;
      }

      const storedSession = await getValidatedAuthSession();
      if (!active) {
        return;
      }
      setSession(storedSession);
    };

    void load();
    return () => {
      active = false;
    };
  }, [pathname]);

  useEffect(() => {
    if (!session) {
      setThirdPartyApps(null);
      return;
    }
    let active = true;
    const load = async () => {
      try {
        const data = await fetchThirdPartyApps();
        if (active) {
          setThirdPartyApps(data.third_party_apps);
        }
      } catch {
        if (active) {
          setThirdPartyApps(null);
        }
      }
    };
    const reload = () => void load();

    void load();
    window.addEventListener("third-party-apps-updated", reload);
    return () => {
      active = false;
      window.removeEventListener("third-party-apps-updated", reload);
    };
  }, [session]);

  const handleLogout = async () => {
    await clearStoredAuthSession();
    router.replace("/login");
  };

  if (pathname === "/login" || session === undefined || !session) {
    return null;
  }

  const navItems = (
    session.role === "admin" ? adminNavItems : userNavItems
  ).map((item) => ({
    ...item,
    label: text(item.label),
  }));
  const roleLabel = text(session.role === "admin" ? "管理员" : "普通用户");
  const displayName = session.name.trim() || roleLabel;
  const baseUrl = webConfig.apiUrl.replace(/\/$/, "") || window.location.origin;
  const canvas = thirdPartyApps?.infinite_canvas;
  const canvasHref =
    canvas?.enabled && canvas.url.trim()
      ? buildThirdPartyHref(canvas.url, baseUrl, session.key)
      : "";
  const canvasDisplayHref = canvasHref ? decodeURIComponent(canvasHref) : "";

  const handleCanvasOpen = () => {
    if (!canvasHref) {
      return;
    }
    setIsCanvasDialogOpen(true);
  };

  const confirmCanvasOpen = () => {
    if (canvasHref) {
      window.open(canvasHref, "_blank", "noopener,noreferrer");
    }
    setIsCanvasDialogOpen(false);
  };

  return (
    <>
      <aside className="workspace-sidebar">
        <Link href="/image" className="sidebar-brand">
          <Brand />
        </Link>
        <nav
          className="workspace-nav"
          aria-label={locale === "vi-VN" ? "Điều hướng chính" : "主导航"}
        >
          <p className="nav-section-label">
            {locale === "vi-VN" ? "KHÔNG GIAN LÀM VIỆC" : "工作空间"}
          </p>
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="workspace-nav-link"
              aria-current={pathname === href ? "page" : undefined}
            >
              <Icon size={19} strokeWidth={1.7} />
              <span>{label}</span>
              {pathname === href && <span className="nav-active-dot" />}
            </Link>
          ))}
          {canvasHref && (
            <button
              type="button"
              className="workspace-nav-link"
              onClick={handleCanvasOpen}
            >
              <ExternalLink size={19} />
              <span>{text("无限画布")}</span>
              <ArrowUpRight size={14} />
            </button>
          )}
        </nav>
        <div className="sidebar-bottom">
          {session.role === "admin" && (
            <Link href="/api-docs" className="sidebar-api-card">
              <Code2 size={20} />
              <span>
                {locale === "vi-VN" ? "Kết nối ứng dụng" : "连接应用"}
                <small>
                  {locale === "vi-VN"
                    ? "Base URL & tài liệu API"
                    : "Base URL 与 API 文档"}
                </small>
              </span>
              <ArrowUpRight size={16} />
            </Link>
          )}
          <div className="sidebar-version">
            WORKSPACE <span>v{webConfig.appVersion}</span>
          </div>
          <div className="workspace-profile">
            <span className="profile-avatar">
              {displayName.slice(0, 1).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{displayName}</p>
              <span>{roleLabel}</span>
            </div>
            <button
              type="button"
              className="profile-logout"
              onClick={() => void handleLogout()}
              title={text("退出")}
              aria-label={text("退出")}
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>
      <header className="workspace-topbar">
        <div className="flex min-w-0 items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label={text("打开导航")}
              >
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="workspace-mobile-menu">
              <SheetHeader>
                <SheetTitle>
                  <Brand />
                </SheetTitle>
                <p className="text-xs text-muted-foreground">
                  {roleLabel} · {displayName}
                </p>
              </SheetHeader>
              <nav className="workspace-nav">
                <p className="nav-section-label">
                  {locale === "vi-VN" ? "KHÔNG GIAN LÀM VIỆC" : "工作空间"}
                </p>
                {navItems.map(({ href, label, icon: Icon }) => (
                  <SheetClose asChild key={href}>
                    <Link
                      href={href}
                      className="workspace-nav-link"
                      aria-current={pathname === href ? "page" : undefined}
                    >
                      <Icon size={19} />
                      <span>{label}</span>
                    </Link>
                  </SheetClose>
                ))}
                {canvasHref && (
                  <SheetClose asChild>
                    <button
                      type="button"
                      className="workspace-nav-link"
                      onClick={handleCanvasOpen}
                    >
                      <ExternalLink size={19} />
                      <span>{text("无限画布")}</span>
                    </button>
                  </SheetClose>
                )}
              </nav>
              <SheetFooter>
                <Button variant="outline" onClick={() => void handleLogout()}>
                  <LogOut size={16} />
                  {text("退出")}
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          <div className="workspace-breadcrumb">
            <span className="hidden sm:inline">Workspace</span>
            <ChevronRight className="hidden sm:block" size={14} />
            <strong>
              {navItems.find((item) => item.href === pathname)?.label ||
                "chatgpt2api"}
            </strong>
          </div>
        </div>
        <HeaderActions showGithubText={false} />
      </header>
      <Dialog open={isCanvasDialogOpen} onOpenChange={setIsCanvasDialogOpen}>
        <DialogContent showCloseButton={false} className="rounded-2xl p-6">
          <DialogHeader className="gap-2">
            <DialogTitle>{text("跳转到三方应用")}</DialogTitle>
            <DialogDescription className="text-sm leading-6">
              {text(
                "该入口仅供个人测试使用，建议自行本机部署后再长期使用。跳转地址会默认带上本项目地址和当前密钥，用于自动填充连接信息；如果不放心，可以取消后手动前往应用并自行输入。",
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <div className="text-xs font-medium text-stone-500">
              {text("完整跳转地址")}
            </div>
            <div className="max-h-28 overflow-auto break-all rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 font-mono text-xs leading-5 text-stone-700">
              {canvasDisplayHref}
            </div>
          </div>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-stone-200 bg-white text-stone-700"
              >
                {text("取消")}
              </Button>
            </DialogClose>
            <Button
              type="button"
              className="rounded-xl bg-stone-950 text-white hover:bg-stone-800"
              onClick={confirmCanvasOpen}
            >
              {text("继续跳转")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
