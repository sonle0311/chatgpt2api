from __future__ import annotations

from services.i18n import (
    get_request_locale,
    locale_from_accept_language,
    localize_error_detail,
    reset_request_locale,
    set_request_locale,
    translate_message,
)


def test_accept_language_prefers_vietnamese() -> None:
    assert locale_from_accept_language("vi-VN,vi;q=0.9,zh-CN;q=0.8") == "vi-VN"
    assert locale_from_accept_language("zh-TW,zh;q=0.9") == "zh-CN"
    assert locale_from_accept_language("en-US,en;q=0.9") == "zh-CN"


def test_translates_known_application_messages_to_vietnamese() -> None:
    token = set_request_locale("vi-VN")
    try:
        assert get_request_locale() == "vi-VN"
        assert translate_message("密钥无效或已失效，请重新登录") == "Khóa không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại."
        assert localize_error_detail({"error": "image file is too large"}) == {"error": "Tệp ảnh quá lớn."}
    finally:
        reset_request_locale(token)


def test_keeps_unknown_upstream_messages_unchanged() -> None:
    token = set_request_locale("vi-VN")
    try:
        assert translate_message("upstream temporarily unavailable") == "upstream temporarily unavailable"
    finally:
        reset_request_locale(token)


def test_chinese_is_the_backwards_compatible_default() -> None:
    token = set_request_locale(None)
    try:
        assert translate_message("image not found") == "未找到图片"
    finally:
        reset_request_locale(token)
