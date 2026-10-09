from __future__ import annotations

from contextvars import ContextVar, Token
import re
from typing import Literal

Locale = Literal["zh-CN", "vi-VN"]

_request_locale: ContextVar[Locale] = ContextVar("request_locale", default="zh-CN")


def locale_from_accept_language(value: str | None) -> Locale:
    """Return the supported locale requested by an HTTP client.

    Vietnamese is selected only when explicitly requested. This preserves the
    previous Chinese responses for API clients that do not send a locale.
    """
    for item in str(value or "").split(","):
        language = item.split(";", 1)[0].strip().lower()
        if language == "vi" or language.startswith("vi-"):
            return "vi-VN"
        if language == "zh" or language.startswith("zh-"):
            return "zh-CN"
    return "zh-CN"


def set_request_locale(value: str | None) -> Token[Locale]:
    return _request_locale.set(locale_from_accept_language(value))


def reset_request_locale(token: Token[Locale]) -> None:
    _request_locale.reset(token)


def get_request_locale() -> Locale:
    return _request_locale.get()


# The existing API predates localization and has user-facing messages spread
# across routers and services. This table localizes those stable messages at
# the response boundary without changing response schemas or status codes.
_VI_MESSAGES = {
    "密钥无效或已失效，请重新登录": "Khóa không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.",
    "需要管理员权限才能执行这个操作": "Bạn cần quyền quản trị viên để thực hiện thao tác này.",
    "还没有检测到改动，请修改后再保存": "Chưa phát hiện thay đổi nào. Vui lòng chỉnh sửa trước khi lưu.",
    "这条用户密钥不存在，可能已经被删除": "Khóa người dùng này không tồn tại hoặc đã bị xóa.",
    "没有可导出的完整账号，需要同时有 access_token、refresh_token 和 id_token": "Không có tài khoản đầy đủ để xuất; cần access_token, refresh_token và id_token.",
    "检测到敏感词，拒绝本次任务": "Phát hiện từ nhạy cảm; yêu cầu này đã bị từ chối.",
    "AI 审核服务暂时不可用，请稍后重试": "Dịch vụ kiểm duyệt AI tạm thời không khả dụng. Vui lòng thử lại sau.",
    "AI 审核未通过，拒绝本次任务": "Yêu cầu không vượt qua kiểm duyệt AI và đã bị từ chối.",
    "启用 WebDAV 图片存储后必须填写 WebDAV URL": "Khi bật lưu ảnh WebDAV, bạn phải nhập URL WebDAV.",
    "启用 WebDAV 图片存储后必须填写 WebDAV 密码": "Khi bật lưu ảnh WebDAV, bạn phải nhập mật khẩu WebDAV.",
    "请输入新的专用密钥": "Vui lòng nhập khóa riêng mới.",
    "这个密钥和管理员密钥冲突了，请换一个新的密钥": "Khóa này trùng với khóa quản trị viên. Vui lòng dùng khóa khác.",
    "这个专用密钥已经存在，请换一个新的密钥": "Khóa riêng này đã tồn tại. Vui lòng dùng khóa khác.",
    "这个名称已经在使用中了，换一个更容易区分的名称吧": "Tên này đã được dùng. Vui lòng chọn tên dễ phân biệt hơn.",
    "图片 URL 解析失败": "Không thể phân tích URL ảnh.",
    "image not found": "Không tìm thấy ảnh.",
    "no images found": "Không tìm thấy ảnh nào.",
    "failed to create thumbnail": "Không thể tạo ảnh thu nhỏ.",
    "file not found": "Không tìm thấy tệp.",
    "path is required": "Cần cung cấp đường dẫn.",
    "tokens is required": "Cần cung cấp tokens.",
    "access_tokens is required": "Cần cung cấp access_tokens.",
    "access_token is required": "Cần cung cấp access_token.",
    "client_task_id is required": "Cần cung cấp client_task_id.",
    "base_url is required": "Cần cung cấp base_url.",
    "secret_key is required": "Cần cung cấp secret_key.",
    "pool not found": "Không tìm thấy nhóm tài khoản.",
    "server not found": "Không tìm thấy máy chủ.",
    "account not found": "Không tìm thấy tài khoản.",
    "progress not found": "Không tìm thấy tiến trình.",
    "task not found": "Không tìm thấy tác vụ.",
    "image file is required": "Cần cung cấp tệp ảnh.",
    "image file is empty": "Tệp ảnh trống.",
    "image file is too large": "Tệp ảnh quá lớn.",
    "invalid base64 image data": "Dữ liệu ảnh base64 không hợp lệ.",
    "unsupported image mime type": "Định dạng MIME của ảnh không được hỗ trợ.",
    "remote image URLs are not supported": "URL ảnh từ xa không được hỗ trợ.",
    "prompt is required": "Cần cung cấp lời nhắc.",
    "input text is required": "Cần cung cấp văn bản đầu vào.",
    "messages or prompt is required": "Cần cung cấp messages hoặc prompt.",
    "stream must be a boolean": "stream phải là giá trị boolean.",
    "n must be an integer": "n phải là số nguyên.",
    "n must be between 1 and 4": "n phải nằm trong khoảng từ 1 đến 4.",
    "invalid JSON body": "Nội dung JSON không hợp lệ.",
    "JSON body must be an object": "Nội dung JSON phải là một đối tượng.",
    "invalid image reference": "Tham chiếu ảnh không hợp lệ.",
    "image_url must point to an image": "image_url phải trỏ đến một ảnh.",
    "image URL is empty": "URL ảnh trống.",
    "image URL exceeds 50MB limit": "URL ảnh vượt quá giới hạn 50MB.",
    "image_url exceeds 10MB limit": "image_url vượt quá giới hạn 10MB.",
    "image_url returned empty content": "image_url trả về nội dung trống.",
    "image_url must be an http or https URL": "image_url phải là URL http hoặc https.",
    "no available image quota": "Không còn hạn mức tạo ảnh khả dụng.",
    "no available text account": "Không có tài khoản văn bản khả dụng.",
    "no available plus/team/pro account": "Không có tài khoản Plus, Team hoặc Pro khả dụng.",
    "image generation failed": "Tạo ảnh thất bại.",
    "response generation failed": "Tạo phản hồi thất bại.",
    "Field required": "Trường này là bắt buộc.",
    "Not Found": "Không tìm thấy.",
}

_ZH_MESSAGES = {
    "image not found": "未找到图片",
    "no images found": "未找到图片",
    "failed to create thumbnail": "创建缩略图失败",
    "file not found": "未找到文件",
    "path is required": "必须提供路径",
    "tokens is required": "必须提供 tokens",
    "access_tokens is required": "必须提供 access_tokens",
    "access_token is required": "必须提供 access_token",
    "client_task_id is required": "必须提供 client_task_id",
    "base_url is required": "必须提供 base_url",
    "secret_key is required": "必须提供 secret_key",
    "pool not found": "未找到号池",
    "server not found": "未找到服务器",
    "account not found": "未找到账号",
    "progress not found": "未找到进度记录",
    "task not found": "未找到任务",
    "image file is required": "必须提供图片文件",
    "image file is empty": "图片文件为空",
    "image file is too large": "图片文件过大",
    "invalid base64 image data": "Base64 图片数据无效",
    "unsupported image mime type": "不支持的图片 MIME 类型",
    "remote image URLs are not supported": "不支持远程图片 URL",
    "prompt is required": "必须提供提示词",
    "input text is required": "必须提供输入文本",
    "messages or prompt is required": "必须提供 messages 或 prompt",
    "stream must be a boolean": "stream 必须是布尔值",
    "n must be an integer": "n 必须是整数",
    "n must be between 1 and 4": "n 必须在 1 到 4 之间",
    "invalid JSON body": "JSON 请求体无效",
    "JSON body must be an object": "JSON 请求体必须是对象",
    "invalid image reference": "图片引用无效",
    "image_url must point to an image": "image_url 必须指向图片",
    "image URL is empty": "图片 URL 为空",
    "image URL exceeds 50MB limit": "图片 URL 超过 50MB 限制",
    "image_url exceeds 10MB limit": "image_url 超过 10MB 限制",
    "image_url returned empty content": "image_url 返回了空内容",
    "image_url must be an http or https URL": "image_url 必须是 http 或 https URL",
    "no available image quota": "没有可用的生图额度",
    "no available text account": "没有可用的文本账号",
    "no available plus/team/pro account": "没有可用的 Plus、Team 或 Pro 账号",
    "image generation failed": "图片生成失败",
    "response generation failed": "响应生成失败",
    "Field required": "此字段为必填项",
}

_VI_PATTERNS: tuple[tuple[re.Pattern[str], str], ...] = (
    (re.compile(r"^images supports up to (\d+) items$"), "images hỗ trợ tối đa $1 mục"),
    (re.compile(r"^image_url fetch failed: HTTP (\d+)$"), "Không thể tải image_url: HTTP $1"),
    (re.compile(r"^image_url fetch failed: (.+)$"), "Không thể tải image_url: $1"),
)


def translate_message(value: str, locale: Locale | None = None) -> str:
    """Translate known application messages while preserving unknown upstream text."""
    selected_locale = locale or get_request_locale()
    table = _VI_MESSAGES if selected_locale == "vi-VN" else _ZH_MESSAGES
    if value in table:
        return table[value]
    if selected_locale == "vi-VN":
        for pattern, replacement in _VI_PATTERNS:
            if pattern.match(value):
                return pattern.sub(replacement, value)
    return value


def localize_error_detail(value: object) -> object:
    if isinstance(value, str):
        return translate_message(value)
    if isinstance(value, list):
        return [localize_error_detail(item) for item in value]
    if isinstance(value, tuple):
        return [localize_error_detail(item) for item in value]
    if isinstance(value, dict):
        return {key: localize_error_detail(item) for key, item in value.items()}
    return value
