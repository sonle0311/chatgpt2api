"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Brand } from "@/components/brand";
import { Input } from "@/components/ui/input";
import { HeaderActions } from "@/components/header-actions";
import { useI18n } from "@/i18n";
import { login } from "@/lib/api";
import { useRedirectIfAuthenticated } from "@/lib/use-auth-guard";
import { getDefaultRouteForRole, setStoredAuthSession } from "@/store/auth";

export default function LoginPage() {
  const router = useRouter();
  const [authKey, setAuthKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const { isCheckingAuth } = useRedirectIfAuthenticated();
  const { text, locale } = useI18n();
  const vi = locale === "vi-VN";

  const handleLogin = async () => {
    if (isSubmitting) return;
    const normalizedAuthKey = authKey.trim();
    if (!normalizedAuthKey) {
      toast.error(text("请输入 密钥"));
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await login(normalizedAuthKey);
      await setStoredAuthSession({
        key: normalizedAuthKey,
        role: data.role,
        subjectId: data.subject_id,
        name: data.name,
      });
      router.replace(getDefaultRouteForRole(data.role));
    } catch (error) {
      const message = error instanceof Error ? error.message : text("登录失败");
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="grid min-h-[calc(100vh-1rem)] w-full place-items-center px-4 py-6">
        <LoaderCircle className="size-5 animate-spin text-stone-400" />
      </div>
    );
  }

  return (
    <div className="login-page">
      <section className="login-story">
        <Brand />
        <div className="login-story-copy">
          <span className="page-eyebrow">YOUR CREATIVE WORKSPACE</span>
          <h2>
            {vi ? (
              <>
                Ý tưởng của bạn.
                <br />
                Khả năng không giới hạn.
              </>
            ) : (
              <>
                您的创意。
                <br />
                无限的可能。
              </>
            )}
          </h2>
          <p>
            {vi
              ? "Một không gian để sáng tạo hình ảnh, quản lý tài khoản và kết nối những ứng dụng bạn yêu thích."
              : "在一个空间中创作图片、管理账号，并连接您喜爱的应用。"}
          </p>
          <div className="login-features">
            <span>
              <Check size={14} />
              {vi ? "Tạo & chỉnh sửa ảnh" : "创作与编辑图片"}
            </span>
            <span>
              <Check size={14} />
              {vi ? "Quản lý tập trung" : "集中管理"}
            </span>
            <span>
              <Check size={14} />
              {vi ? "Kết nối API" : "API 接入"}
            </span>
          </div>
        </div>
        <p className="login-story-footer">
          chatgpt2api · Create. Connect. Build.
        </p>
      </section>
      <section className="login-form-panel">
        <HeaderActions className="login-actions" showGithubText={false} />
        <form
          className="login-form"
          onSubmit={(event) => {
            event.preventDefault();
            void handleLogin();
          }}
        >
          <div className="mb-10 md:hidden">
            <Brand />
          </div>
          <div className="login-key-icon">
            <LockKeyhole size={20} strokeWidth={1.6} />
          </div>
          <h1>{text("欢迎回来")}</h1>
          <p>{text("输入密钥后继续使用账号管理和图片生成功能。")}</p>
          <div className="login-form-fields">
            <label htmlFor="auth-key">{text("密钥")}</label>
            <div className="relative">
              <Input
                id="auth-key"
                type={showKey ? "text" : "password"}
                autoComplete="current-password"
                value={authKey}
                onChange={(event) => setAuthKey(event.target.value)}
                placeholder={text("请输入密钥")}
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:text-foreground"
                aria-label={
                  vi
                    ? showKey
                      ? "Ẩn khóa truy cập"
                      : "Hiện khóa truy cập"
                    : showKey
                      ? "隐藏密钥"
                      : "显示密钥"
                }
                aria-pressed={showKey}
                onClick={() => setShowKey((value) => !value)}
              >
                {showKey ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : null}
              {isSubmitting
                ? vi
                  ? "Đang đăng nhập…"
                  : "正在登录…"
                : text("登录")}
              {!isSubmitting && <ArrowRight className="ml-auto size-4" />}
            </Button>
          </div>
          <div className="login-form-note">
            <p>
              {vi
                ? "Sử dụng khóa truy cập do quản trị viên cung cấp để vào không gian làm việc."
                : "使用管理员提供的密钥进入工作空间。"}
            </p>
          </div>
        </form>
      </section>
    </div>
  );
}
