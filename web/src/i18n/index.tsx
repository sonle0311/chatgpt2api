"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Locale = "zh-CN" | "vi-VN";

const LOCALE_STORAGE_KEY = "chatgpt2api-locale";

const messages = {
  "zh-CN": {
    "meta.title": "ChatGPT 号池管理",
    "language.switch": "切换语言",
    "language.zh": "中文",
    "language.vi": "Tiếng Việt",
    "theme.toggle": "切换主题",
  },
  "vi-VN": {
    "meta.title": "Quản lý tài khoản ChatGPT",
    "language.switch": "Đổi ngôn ngữ",
    "language.zh": "中文",
    "language.vi": "Tiếng Việt",
    "theme.toggle": "Đổi giao diện sáng/tối",
  },
} as const;

type MessageKey = keyof (typeof messages)["zh-CN"];

const vietnameseText: Record<string, string> = {
  "ChatGPT 号池管理": "Quản lý tài khoản ChatGPT",
  "欢迎回来": "Chào mừng trở lại",
  "输入密钥后继续使用账号管理和图片生成功能。": "Nhập khóa để tiếp tục quản lý tài khoản và tạo ảnh.",
  "密钥": "Khóa truy cập",
  "请输入密钥": "Nhập khóa truy cập",
  "请输入 密钥": "Vui lòng nhập khóa truy cập",
  "登录": "Đăng nhập",
  "登录失败": "Đăng nhập thất bại",
  "退出": "Đăng xuất",
  "打开导航": "Mở điều hướng",
  "切换主题": "Đổi giao diện sáng/tối",
  "查看版本更新": "Xem cập nhật phiên bản",
  "版本更新": "Cập nhật phiên bản",
  "当前版本": "Phiên bản hiện tại",
  "最新版本": "Phiên bản mới nhất",
  "检查中...": "Đang kiểm tra...",
  "检查更新": "Kiểm tra cập nhật",
  "未发布": "Chưa phát hành",
  "最新": "Mới nhất",
  "当前": "Hiện tại",
  "前往 GitHub 更新": "Mở GitHub để cập nhật",
  "生图": "Tạo ảnh",
  "画图": "Vẽ ảnh",
  "号池管理": "Quản lý tài khoản",
  "图片管理": "Quản lý ảnh",
  "日志管理": "Quản lý nhật ký",
  "调试": "Gỡ lỗi",
  "设置": "Cài đặt",
  "管理员": "Quản trị viên",
  "普通用户": "Người dùng",
  "无限画布": "Canvas vô hạn",
  "跳转到三方应用": "Mở ứng dụng bên thứ ba",
  "取消": "Hủy",
  "继续跳转": "Tiếp tục mở",
  "完整跳转地址": "Địa chỉ chuyển đến đầy đủ",
  "加载中...": "Đang tải...",
  "刷新": "Làm mới",
  "搜索": "Tìm kiếm",
  "保存": "Lưu",
  "删除": "Xóa",
  "编辑": "Chỉnh sửa",
  "关闭": "Đóng",
  "确认": "Xác nhận",
  "成功": "Thành công",
  "失败": "Thất bại",
  "正常": "Bình thường",
  "限流": "Bị giới hạn",
  "异常": "Bất thường",
  "禁用": "Đã vô hiệu hóa",
  "全部状态": "Tất cả trạng thái",
  "全部类型": "Tất cả loại",
  "搜索邮箱": "Tìm email",
  "账户总数": "Tổng số tài khoản",
  "剩余额度": "Hạn mức còn lại",
  "正常账户": "Tài khoản bình thường",
  "限流账户": "Tài khoản bị giới hạn",
  "异常账户": "Tài khoản bất thường",
  "禁用账户": "Tài khoản đã vô hiệu hóa",
  "导入账户": "Nhập tài khoản",
  "导入账号 JSON": "Nhập JSON tài khoản",
  "导入完成": "Nhập thành công",
  "完成导入": "Hoàn tất nhập",
  "获取 session": "Lấy session",
  "打开授权页面": "Mở trang ủy quyền",
  "重新生成": "Tạo lại",
  "上传": "Tải lên",
  "上传图片": "Tải ảnh lên",
  "添加参考图": "Thêm ảnh tham chiếu",
  "生成图片": "Tạo ảnh",
  "编辑图片": "Chỉnh sửa ảnh",
  "文生图": "Tạo ảnh từ văn bản",
  "编辑图": "Chỉnh sửa ảnh",
  "加入编辑": "Thêm vào chỉnh sửa",
  "下载": "Tải xuống",
  "下载图片": "Tải ảnh xuống",
  "预览图片": "Xem trước ảnh",
  "删除图片": "Xóa ảnh",
  "删除所选图片": "Xóa ảnh đã chọn",
  "删除匹配日期的图片": "Xóa ảnh khớp ngày",
  "添加标签": "Thêm nhãn",
  "输入标签名": "Nhập tên nhãn",
  "标签": "Nhãn",
  "图片地址已复制": "Đã sao chép địa chỉ ảnh",
  "图片已删除": "Đã xóa ảnh",
  "加载图片失败": "Tải ảnh thất bại",
  "删除图片失败": "Xóa ảnh thất bại",
  "下载失败": "Tải xuống thất bại",
  "压缩失败": "Nén thất bại",
  "清理失败": "Dọn dẹp thất bại",
  "设置标签失败": "Đặt nhãn thất bại",
  "删除标签失败": "Xóa nhãn thất bại",
  "存储信息加载失败": "Tải thông tin lưu trữ thất bại",
  "加载存储信息...": "Đang tải thông tin lưu trữ...",
  "输入你想要生成的画面，也可直接粘贴图片": "Mô tả ảnh bạn muốn tạo, hoặc dán ảnh trực tiếp",
  "描述你希望如何修改参考图": "Mô tả cách bạn muốn chỉnh sửa ảnh tham chiếu",
  "自动": "Tự động",
  "低": "Thấp",
  "中": "Trung bình",
  "高": "Cao",
  "生成中": "Đang tạo",
  "处理中": "Đang xử lý",
  "已完成": "Hoàn thành",
  "排队中": "Đang xếp hàng",
  "超时": "Hết thời gian chờ",
  "接收图片中": "Đang nhận ảnh",
  "确认可用账号": "Đang xác nhận tài khoản khả dụng",
  "获取 token": "Đang lấy token",
  "预热首页": "Đang khởi động trang chủ",
  "启动生成": "Bắt đầu tạo",
  "准备会话": "Đang chuẩn bị phiên",
  "删除会话": "Xóa phiên",
  "重命名会话": "Đổi tên phiên",
  "删除提示词记录": "Xóa lịch sử lời nhắc",
  "删除生成结果": "Xóa kết quả tạo",
  "清空历史记录": "Xóa toàn bộ lịch sử",
  "删除对话": "Xóa cuộc trò chuyện",
  "滚动到最新消息": "Cuộn đến tin mới nhất",
  "请输入提示词": "Vui lòng nhập lời nhắc",
  "生成图片失败": "Tạo ảnh thất bại",
  "生成失败": "Tạo thất bại",
  "读取参考图失败": "Không thể đọc ảnh tham chiếu",
  "读取结果图失败": "Không thể đọc ảnh kết quả",
  "读取会话记录失败": "Không thể đọc lịch sử phiên",
  "重命名失败": "Đổi tên thất bại",
  "续轮询失败": "Không thể tiếp tục thăm dò",
  "日志": "Nhật ký",
  "调用日志": "Nhật ký gọi API",
  "账号管理日志": "Nhật ký quản lý tài khoản",
  "查询": "Tra cứu",
  "清除筛选条件": "Xóa bộ lọc",
  "本页全选": "Chọn toàn trang",
  "全选结果": "Chọn toàn bộ kết quả",
  "取消选择": "Bỏ chọn",
  "删除所选": "Xóa mục đã chọn",
  "删除日志": "Xóa nhật ký",
  "删除所选日志": "Xóa nhật ký đã chọn",
  "查看详情": "Xem chi tiết",
  "日志详情": "Chi tiết nhật ký",
  "没有找到日志": "Không tìm thấy nhật ký",
  "加载日志失败": "Tải nhật ký thất bại",
  "删除日志失败": "Xóa nhật ký thất bại",
  "基础设置": "Cài đặt cơ bản",
  "代理设置": "Cài đặt proxy",
  "备份设置": "Cài đặt sao lưu",
  "用户密钥": "Khóa người dùng",
  "对话": "Trò chuyện",
  "搜索网页": "Tìm kiếm web",
  "搜索中...": "Đang tìm kiếm...",
  "来源": "Nguồn",
  "发送": "Gửi",
  "清空": "Xóa",
  "选择图片": "Chọn ảnh",
  "请求": "Yêu cầu",
  "思考强度": "Mức suy luận",
  "默认": "Mặc định",
  "暂无对话消息": "Chưa có tin nhắn trò chuyện",
  "PPT生成": "Tạo PPT",
  "PSD生成": "Tạo PSD",
  "删除历史记录": "Xóa lịch sử",
  "确认删除这条历史记录吗？": "Bạn có chắc muốn xóa mục lịch sử này?",
  "确认清空当前类型的历史记录吗？": "Bạn có chắc muốn xóa toàn bộ lịch sử loại này?",
  "素材包": "Gói tài nguyên",
  "PPT 文件": "Tệp PPT",
  "PSD 文件": "Tệp PSD",
};

const vietnamesePatterns: Array<[RegExp, string]> = [
  [/^共 (\d+) 条$/, "Tổng $1 mục"],
  [/^已选 (\d+) 条$/, "Đã chọn $1 mục"],
  [/^第 (\d+) \/ (\d+) 页，共 (\d+) 条$/, "Trang $1 / $2, tổng $3 mục"],
  [/^已删除 (\d+) 条日志$/, "Đã xóa $1 nhật ký"],
  [/^已删除 (\d+) 张图片$/, "Đã xóa $1 ảnh"],
  [/^已下载 (\d+) 张图片$/, "Đã tải $1 ảnh"],
  [/^已处理 (\d+)\/(\d+)$/, "Đã xử lý $1/$2"],
  [/^参考图 (\d+)$/, "Ảnh tham chiếu $1"],
  [/^移除参考图 (.+)$/, "Xóa ảnh tham chiếu $1"],
  [/^预览参考图 (.+)$/, "Xem trước ảnh tham chiếu $1"],
  [/^移除 (.+)$/, "Xóa $1"],
];

function normalizeLocale(value: string | null | undefined): Locale | null {
  const language = String(value || "").trim().toLowerCase();
  if (!language) return null;
  if (language === "vi" || language.startsWith("vi-")) return "vi-VN";
  if (language === "zh" || language.startsWith("zh-")) return "zh-CN";
  return null;
}

export function detectBrowserLocale(): Locale {
  if (typeof window === "undefined") return "zh-CN";
  for (const language of navigator.languages || [navigator.language]) {
    const locale = normalizeLocale(language);
    if (locale) return locale;
  }
  return "zh-CN";
}

export function getStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  try {
    return normalizeLocale(window.localStorage.getItem(LOCALE_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function translateVisibleText(value: string, locale: Locale): string {
  if (locale !== "vi-VN" || !value) return value;
  const exact = vietnameseText[value.trim()];
  if (exact) return value.replace(value.trim(), exact);
  for (const [pattern, translated] of vietnamesePatterns) {
    if (pattern.test(value.trim())) return value.replace(value.trim(), value.trim().replace(pattern, translated));
  }
  return value;
}

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey) => string;
  formatDate: (value: Date | number | string, options?: Intl.DateTimeFormatOptions) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const textSources = new WeakMap<Text, string>();
const attributeSources = new WeakMap<Element, Map<string, string>>();
const localizedAttributes = ["aria-label", "title", "placeholder", "alt"];

function shouldSkipText(node: Text): boolean {
  const parent = node.parentElement;
  if (!parent) return true;
  return ["CODE", "PRE", "SCRIPT", "STYLE", "TEXTAREA"].includes(parent.tagName) || parent.isContentEditable;
}

function containsChinese(value: string): boolean {
  return /[\u3400-\u9fff]/.test(value);
}

function localizeTextNode(node: Text, locale: Locale) {
  if (shouldSkipText(node)) return;
  const current = node.data;
  const previous = textSources.get(node);
  const source = previous && (current === translateVisibleText(previous, locale) || !containsChinese(current)) ? previous : current;
  textSources.set(node, source);
  const translated = translateVisibleText(source, locale);
  if (current !== translated) node.data = translated;
}

function localizeElement(element: Element, locale: Locale) {
  for (const attribute of localizedAttributes) {
    const current = element.getAttribute(attribute);
    if (!current) continue;
    const attributes = attributeSources.get(element) || new Map<string, string>();
    const previous = attributes.get(attribute);
    const source = previous && (current === translateVisibleText(previous, locale) || !containsChinese(current)) ? previous : current;
    attributes.set(attribute, source);
    attributeSources.set(element, attributes);
    const translated = translateVisibleText(source, locale);
    if (current !== translated) element.setAttribute(attribute, translated);
  }
}

function localizeSubtree(root: Node, locale: Locale) {
  if (root.nodeType === Node.TEXT_NODE) localizeTextNode(root as Text, locale);
  if (root.nodeType === Node.ELEMENT_NODE) localizeElement(root as Element, locale);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  let current = walker.nextNode();
  while (current) {
    if (current.nodeType === Node.TEXT_NODE) localizeTextNode(current as Text, locale);
    else localizeElement(current as Element, locale);
    current = walker.nextNode();
  }
}

function LocalizedDocument({ locale }: { locale: Locale }) {
  useEffect(() => {
    const root = document.body;
    document.documentElement.lang = locale;
    localizeSubtree(root, locale);
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") localizeTextNode(mutation.target as Text, locale);
        if (mutation.type === "attributes") localizeElement(mutation.target as Element, locale);
        for (const node of mutation.addedNodes) localizeSubtree(node, locale);
      }
    });
    observer.observe(root, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: localizedAttributes });
    return () => observer.disconnect();
  }, [locale]);
  return null;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, updateLocale] = useState<Locale>("zh-CN");

  useEffect(() => {
    updateLocale(getStoredLocale() || detectBrowserLocale());
  }, []);

  const setLocale = useCallback((nextLocale: Locale) => {
    updateLocale(nextLocale);
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
    } catch {
      // Locale still changes for the current page when storage is unavailable.
    }
  }, []);

  const value = useMemo<I18nContextValue>(() => ({
    locale,
    setLocale,
    t: (key) => messages[locale][key],
    formatDate: (date, options) => new Intl.DateTimeFormat(locale, options).format(new Date(date)),
  }), [locale, setLocale]);

  useEffect(() => {
    document.title = value.t("meta.title");
  }, [value]);

  return <I18nContext.Provider value={value}><LocalizedDocument locale={locale} />{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside I18nProvider");
  return context;
}
