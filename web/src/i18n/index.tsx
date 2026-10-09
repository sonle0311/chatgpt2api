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
  "Access Token 导入完成": "Đã nhập Access Token",
  "Codex 认证 JSON 导入完成": "Đã nhập JSON xác thực Codex",
  "Codex 认证 JSON 解析失败": "Không thể phân tích JSON xác thực Codex",
  "OAuth 换 token 失败": "Không thể đổi token OAuth",
  "OAuth 登录已有账号": "Đăng nhập OAuth bằng tài khoản hiện có",
  "OAuth 登录已有账号（带自动刷新）": "Đăng nhập OAuth bằng tài khoản hiện có (tự động làm mới)",
  "OAuth 起始失败": "Không thể khởi tạo OAuth",
  "Session JSON 导入完成": "Đã nhập JSON phiên",
  "Session JSON 解析失败": "Không thể phân tích JSON phiên",
  "TXT 文件里没有读取到有效 Token": "Không tìm thấy token hợp lệ trong tệp TXT",
  "从 Sub2API 服务器导入": "Nhập từ máy chủ Sub2API",
  "从远程 CPA 服务器导入": "Nhập từ máy chủ CPA từ xa",
  "复制失败，请手动选择并复制": "Không thể sao chép; vui lòng chọn và sao chép thủ công",
  "导入 Access Token": "Nhập Access Token",
  "导入 Codex 认证 JSON": "Nhập JSON xác thực Codex",
  "导入 Session JSON": "Nhập JSON phiên",
  "导入账号 JSON 文件": "Nhập tệp JSON tài khoản",
  "导入账户失败": "Nhập tài khoản thất bại",
  "尚未读取到可导入的 Token。": "Chưa đọc được token nào có thể nhập.",
  "已打开 OpenAI 授权页面，请在登录后复制 callback URL 回来": "Đã mở trang ủy quyền OpenAI. Sau khi đăng nhập, hãy sao chép callback URL về đây.",
  "当前环境不支持自动复制，请手动选择并复制": "Môi trường hiện tại không hỗ trợ tự động sao chép; vui lòng sao chép thủ công.",
  "授权 URL 已复制到剪贴板": "Đã sao chép URL ủy quyền vào bộ nhớ tạm",
  "每行一个 Access Token...": "Một Access Token trên mỗi dòng...",
  "请先提供至少一个可用 Token": "Vui lòng cung cấp ít nhất một token khả dụng",
  "请先粘贴 Codex 认证 JSON": "Vui lòng dán JSON xác thực Codex trước",
  "请先粘贴完整 Session JSON": "Vui lòng dán JSON phiên đầy đủ trước",
  "请粘贴 callback URL 或 code": "Vui lòng dán callback URL hoặc code",
  "读取 TXT 文件失败": "Không thể đọc tệp TXT",
  "读取账号 JSON 文件失败": "Không thể đọc tệp JSON tài khoản",
  "账号 JSON 导入完成": "Đã nhập JSON tài khoản",
  "这些账号 JSON 文件里没有读取到可用 access_token": "Không tìm thấy access_token khả dụng trong các tệp JSON tài khoản này",
  "选择一种导入方式。导入成功后会自动拉取邮箱、类型和额度。": "Chọn một cách nhập. Sau khi thành công, hệ thống tự lấy email, loại và hạn mức.",
  "token 已复制": "Đã sao chép token",
  "删除账户失败": "Xóa tài khoản thất bại",
  "刷新完成": "Đã làm mới",
  "刷新结果为空": "Kết quả làm mới trống",
  "刷新账户失败": "Làm mới tài khoản thất bại",
  "加载模型列表失败": "Tải danh sách model thất bại",
  "加载账户失败": "Tải tài khoản thất bại",
  "尝试密码登录恢复账号": "Thử khôi phục tài khoản bằng đăng nhập mật khẩu",
  "已到恢复时间": "Đã đến thời điểm khôi phục",
  "当前无在途生图任务": "Hiện không có tác vụ tạo ảnh đang chạy",
  "恢复完成": "Khôi phục hoàn tất",
  "恢复流程已完成": "Quy trình khôi phục đã hoàn tất",
  "更新账号失败": "Cập nhật tài khoản thất bại",
  "模型名已复制": "Đã sao chép tên model",
  "正在刷新账号信息...": "Đang làm mới thông tin tài khoản...",
  "正在尝试恢复异常账号...": "Đang thử khôi phục tài khoản bất thường...",
  "没有需要刷新的账户": "Không có tài khoản cần làm mới",
  "测试代理失败": "Kiểm tra proxy thất bại",
  "留空走全局代理，例如 http://127.0.0.1:7890": "Để trống để dùng proxy toàn cục, ví dụ http://127.0.0.1:7890",
  "移除异常状态完成": "Đã xóa trạng thái bất thường",
  "请先填写代理地址": "Vui lòng nhập địa chỉ proxy trước",
  "请先选择要删除的账户": "Vui lòng chọn tài khoản cần xóa trước",
  "请先选择要恢复的账户": "Vui lòng chọn tài khoản cần khôi phục trước",
  "账号信息已更新": "Thông tin tài khoản đã được cập nhật",
  "跳过": "Bỏ qua",
  "选中账号中没有异常账号": "Không có tài khoản bất thường trong mục đã chọn",
  "重新登录失败": "Đăng nhập lại thất bại",
  "删除会话失败": "Xóa phiên thất bại",
  "已创建新对话并开始处理": "Đã tạo cuộc trò chuyện mới và bắt đầu xử lý",
  "已加入当前参考图，继续输入描述即可编辑": "Đã thêm vào ảnh tham chiếu hiện tại; tiếp tục nhập mô tả để chỉnh sửa",
  "已加入当前对话队列": "Đã thêm vào hàng đợi cuộc trò chuyện hiện tại",
  "已加入重新生成队列": "Đã thêm vào hàng đợi tạo lại",
  "已发送到当前对话": "Đã gửi đến cuộc trò chuyện hiện tại",
  "已复用这条提示词配置": "Đã dùng lại cấu hình lời nhắc này",
  "已清空历史记录": "Đã xóa toàn bộ lịch sử",
  "未找到可用于继续编辑的参考图": "Không tìm thấy ảnh tham chiếu để tiếp tục chỉnh sửa",
  "未返回图片数据": "Không có dữ liệu ảnh được trả về",
  "清空历史记录失败": "Xóa toàn bộ lịch sử thất bại",
  "生图超时": "Tạo ảnh quá thời gian chờ",
  "生成结果已删除": "Đã xóa kết quả tạo",
  "确认删除全部图片历史记录吗？删除后无法恢复。": "Bạn có chắc muốn xóa toàn bộ lịch sử ảnh? Không thể khôi phục sau khi xóa.",
  "确认删除这条图片对话吗？删除后无法恢复。": "Bạn có chắc muốn xóa cuộc trò chuyện ảnh này? Không thể khôi phục sau khi xóa.",
  "确认删除这条提示词记录吗？对应生成结果会保留。": "Bạn có chắc muốn xóa lịch sử lời nhắc này? Kết quả tạo tương ứng vẫn được giữ.",
  "确认删除这条生成结果吗？对应提示词记录会保留。": "Bạn có chắc muốn xóa kết quả tạo này? Lịch sử lời nhắc tương ứng vẫn được giữ.",
  "页面刷新或任务中断，未找到可恢复的任务 ID": "Trang đã tải lại hoặc tác vụ bị gián đoạn; không tìm thấy ID tác vụ để khôi phục",
  "已启用": "Đã bật",
  "未启用": "Chưa bật",
  "已配置": "Đã cấu hình",
  "未配置": "Chưa cấu hình",
  "启用": "Bật",
  "保存修改": "Lưu thay đổi",
  "编辑连接": "Chỉnh sửa kết nối",
  "添加连接": "Thêm kết nối",
  "添加": "Thêm",
  "全选筛选结果": "Chọn tất cả kết quả lọc",
  "取消全选": "Bỏ chọn tất cả",
  "保存失败": "Lưu thất bại",
  "删除失败": "Xóa thất bại",
  "加载代理配置失败": "Tải cấu hình proxy thất bại",
  "代理配置已保存": "Đã lưu cấu hình proxy",
  "未知错误": "Lỗi không xác định",
  "加载 Sub2API 连接失败": "Tải kết nối Sub2API thất bại",
  "启动导入失败": "Không thể bắt đầu nhập",
  "导入任务已启动": "Tác vụ nhập đã bắt đầu",
  "拉取分组": "Lấy nhóm",
  "拉取分组失败": "Không thể lấy nhóm",
  "查询导入进度失败": "Không thể tra cứu tiến độ nhập",
  "连接已删除": "Đã xóa kết nối",
  "连接已更新": "Đã cập nhật kết nối",
  "连接已添加": "Đã thêm kết nối",
  "选择分组": "Chọn nhóm",
  "重新拉取": "Lấy lại",
  "管理员密码": "Mật khẩu quản trị viên",
  "请输入管理员密码": "Vui lòng nhập mật khẩu quản trị viên",
  "请输入管理员邮箱": "Vui lòng nhập email quản trị viên",
  "读取 Sub2API 账号失败": "Không thể đọc tài khoản Sub2API",
  "远端没有配置分组": "Máy chủ từ xa chưa cấu hình nhóm",
  "创建用户密钥失败": "Tạo khóa người dùng thất bại",
  "删除用户密钥失败": "Xóa khóa người dùng thất bại",
  "加载用户密钥失败": "Tải khóa người dùng thất bại",
  "已复制到剪贴板": "Đã sao chép vào bộ nhớ tạm",
  "已禁用": "Đã vô hiệu hóa",
  "更新用户密钥失败": "Cập nhật khóa người dùng thất bại",
  "用户名称已更新": "Tên người dùng đã được cập nhật",
  "用户密钥已创建": "Đã tạo khóa người dùng",
  "用户密钥已删除": "Đã xóa khóa người dùng",
  "用户密钥已启用": "Đã bật khóa người dùng",
  "用户密钥已更新": "Đã cập nhật khóa người dùng",
  "用户密钥已禁用": "Đã vô hiệu hóa khóa người dùng",
  "基础配置": "Cấu hình cơ bản",
  "备份": "Sao lưu",
  "接口接入": "Tích hợp API",
  "画布入口": "Lối vào canvas",
  "配置已保存": "Đã lưu cấu hình",
  "保存系统配置失败": "Không thể lưu cấu hình hệ thống",
  "加载系统配置失败": "Không thể tải cấu hình hệ thống",
  "加载备份列表失败": "Không thể tải danh sách sao lưu",
  "删除备份失败": "Xóa bản sao lưu thất bại",
  "备份已删除": "Đã xóa bản sao lưu",
  "执行备份失败": "Sao lưu thất bại",
  "测试 WebDAV 失败": "Kiểm tra WebDAV thất bại",
  "测试备份连接失败": "Kiểm tra kết nối sao lưu thất bại",
  "读取远程账号失败": "Không thể đọc tài khoản từ xa",
  "下载备份失败": "Tải bản sao lưu thất bại",
  "备份下载已开始": "Đã bắt đầu tải bản sao lưu",
  "备份中": "Đang sao lưu",
  "已包含": "Đã bao gồm",
  "最近失败": "Lần gần nhất thất bại",
  "最近成功": "Lần gần nhất thành công",
  "未执行": "Chưa thực hiện",
  "系统配置": "Cấu hình hệ thống",
  "账号快照": "Ảnh chụp tài khoản",
  "用户密钥快照": "Ảnh chụp khóa người dùng",
  "图片任务记录": "Lịch sử tác vụ ảnh",
  "图片文件目录": "Thư mục tệp ảnh",
  "调度与调用日志": "Nhật ký điều phối và gọi API",
  "缺失": "Thiếu",
  "读取备份详情失败": "Không thể đọc chi tiết bản sao lưu",
  "选择日期范围": "Chọn khoảng ngày",
  "上一张": "Ảnh trước",
  "下一张": "Ảnh sau",
  "修复": "Sửa lỗi",
  "新增": "Mới",
  "调整": "Điều chỉnh",
  "文档": "Tài liệu",
  "已获取最新版本信息": "Đã nhận thông tin phiên bản mới nhất",
  "获取最新版本信息失败": "Không thể lấy thông tin phiên bản mới nhất",
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

// Fragments cover dynamic strings that include counts, dates, filenames or
// server-provided values and therefore cannot be represented as exact keys.
const vietnameseFragments: Record<string, string> = {
  "账号管理": "quản lý tài khoản",
  "历史记录": "lịch sử",
  "图片": "ảnh",
  "账号": "tài khoản",
  "账户": "tài khoản",
  "生成": "tạo",
  "成功": "thành công",
  "失败": "thất bại",
  "删除": "xóa",
  "保存": "lưu",
  "加载": "tải",
  "刷新": "làm mới",
  "设置": "cài đặt",
  "日志": "nhật ký",
  "备份": "sao lưu",
  "连接": "kết nối",
  "代理": "proxy",
  "导入": "nhập",
  "导出": "xuất",
  "恢复": "khôi phục",
  "配置": "cấu hình",
  "任务": "tác vụ",
  "文件": "tệp",
  "地址": "địa chỉ",
  "名称": "tên",
  "密码": "mật khẩu",
  "用户": "người dùng",
  "管理员": "quản trị viên",
  "分组": "nhóm",
  "查询": "tra cứu",
  "详情": "chi tiết",
  "错误": "lỗi",
  "数据": "dữ liệu",
  "时间": "thời gian",
  "当前": "hiện tại",
  "全部": "tất cả",
  "选择": "chọn",
  "可用": "khả dụng",
  "不可用": "không khả dụng",
  "完成": "hoàn tất",
  "正在": "đang",
  "已": "đã",
  "未": "chưa",
};

const orderedVietnameseFragments = Object.entries(vietnameseFragments).sort(([left], [right]) => right.length - left.length);

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
  return orderedVietnameseFragments.reduce((translated, [source, target]) => translated.split(source).join(target), value);
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
