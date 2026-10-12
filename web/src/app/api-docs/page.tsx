"use client";

import { LoaderCircle } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { useI18n } from "@/i18n";
import { useAuthGuard } from "@/lib/use-auth-guard";
import { ApiDocsCard } from "@/app/settings/components/api-docs-card";

export default function ApiDocsPage() {
  const { text } = useI18n();
  const { isCheckingAuth, session } = useAuthGuard(["admin"]);

  if (isCheckingAuth || !session || session.role !== "admin") {
    return (
      <div className="flex min-h-[40vh] items-center justify-center" role="status" aria-label={text("加载中...")}>
        <LoaderCircle className="size-5 animate-spin text-stone-400" />
      </div>
    );
  }

  return (
    <>
      <PageHeading
        eyebrow="Developer tools"
        title={text("API 与文档")}
        description={text("复制连接地址，查看接口参数和调用示例，将服务接入其他应用。")}
      />
      <ApiDocsCard />
    </>
  );
}
