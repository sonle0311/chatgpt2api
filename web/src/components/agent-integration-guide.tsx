"use client";

import { Bot, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";
import { buildAgentIntegrationGuide } from "@/lib/agent-integration-guide";

export function AgentIntegrationGuide({ serviceUrl }: { serviceUrl: string }) {
  const { locale, text } = useI18n();
  let guide = "";
  try {
    if (serviceUrl) guide = buildAgentIntegrationGuide(serviceUrl, locale);
  } catch {
    // Never export a document with an invalid or incomplete connection address.
  }

  const copyGuide = async () => {
    try {
      await navigator.clipboard.writeText(guide);
      toast.success(text("已复制 Agent 集成指南"));
    } catch {
      toast.error(text("复制失败，请展开下方内容并手动复制。"));
    }
  };

  return (
    <section
      aria-labelledby="agent-guide-title"
      className="rounded-xl border border-stone-200 bg-stone-50/70 p-4 dark:border-white/10 dark:bg-white/[0.03]"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <h2
            id="agent-guide-title"
            className="flex items-center gap-2 text-base font-semibold"
          >
            <Bot className="size-5" />
            {text("AI Agent 集成指南")}
          </h2>
          <p className="text-sm leading-6 text-stone-500">
            {text(
              "一键复制 Markdown，交给编程 Agent 阅读并集成到现有应用。包含接口、示例、流式输出、任务轮询和验收清单。",
            )}
          </p>
        </div>
        <Button
          type="button"
          disabled={!guide}
          onClick={() => void copyGuide()}
          className="shrink-0"
        >
          <Copy className="size-4" />
          {text("复制完整指南")}
        </Button>
      </div>
      <p className="mt-3 text-xs leading-6 text-stone-500">
        {text(
          "始终使用 YOUR_API_KEY 占位符，不包含真实密钥，即使页面已显示密钥。地址取自当前 API 服务。",
        )}
      </p>
      {guide ? (
        <details className="mt-3">
          <summary className="cursor-pointer text-sm font-medium">
            {text("预览或手动复制")}
          </summary>
          <textarea
            aria-label={text("AI Agent 集成指南")}
            readOnly
            value={guide}
            spellCheck={false}
            className="mt-3 h-80 w-full resize-y rounded-lg border border-stone-200 bg-white p-3 font-mono text-xs leading-6 dark:border-white/10 dark:bg-stone-950"
          />
        </details>
      ) : (
        <p role="status" className="mt-2 text-xs text-stone-500">
          {text("等待有效的 API 服务地址。")}
        </p>
      )}
    </section>
  );
}
