"use client";
import { useI18n } from "@/i18n";

import { EditableFilePanel } from "./editable-file-panel";

const defaultPrompt = "按原图位置拆分海报元素并合成可编辑 PSD，保留背景和每个元素图层位置，同时输出每个图层素材 zip。";

export function PsdPanel() {
  const { text: translate } = useI18n();
  return <EditableFilePanel title={translate("PSD生成")} kind="psd" endpoint="/v1/psd/generations" defaultPrompt={defaultPrompt} imageRequired />;
}
