/** Exact UI messages. Unknown text is preserved, never partially translated. */
export const vietnameseExtra: Record<string, string> = {
  "AI Agent 集成指南": "Hướng dẫn cho AI Agent",
  "一键复制 Markdown，交给编程 Agent 阅读并集成到现有应用。包含接口、示例、流式输出、任务轮询和验收清单。": "Sao chép bản Markdown để đưa cho coding agent tích hợp vào app hiện tại. Gồm API, ví dụ, streaming, theo dõi tác vụ và checklist kiểm thử.",
  "复制完整指南": "Sao chép toàn bộ hướng dẫn",
  "始终使用 YOUR_API_KEY 占位符，不包含真实密钥，即使页面已显示密钥。地址取自当前 API 服务。": "Luôn dùng YOUR_API_KEY làm giá trị mẫu, không kèm khóa thật dù trang đang hiện khóa. Địa chỉ lấy từ máy chủ API hiện tại.",
  "预览或手动复制": "Xem trước hoặc sao chép thủ công",
  "已复制 Agent 集成指南": "Đã sao chép hướng dẫn cho agent",
  "复制失败，请展开下方内容并手动复制。": "Không thể sao chép. Hãy mở nội dung bên dưới và sao chép thủ công.",
  "等待有效的 API 服务地址。": "Đang chờ địa chỉ máy chủ API hợp lệ.",
  "API 与文档": "API & Tài liệu",
  "复制连接地址，查看接口参数和调用示例，将服务接入其他应用。": "Sao chép địa chỉ kết nối, xem tham số và ví dụ gọi API để tích hợp vào ứng dụng khác.",
  "复制 Base URL": "Sao chép Base URL",
  "在兼容 OpenAI 的应用中填写此地址；已包含 /v1，无需重复添加。": "Điền địa chỉ này vào ứng dụng tương thích OpenAI. Đã có /v1, không cần thêm lần nữa.",
  "其他设备不能使用 localhost 或 127.0.0.1，请改为可访问的服务器 IP 或域名，并确认端口已开放。": "Thiết bị khác không dùng được localhost hoặc 127.0.0.1. Hãy thay bằng IP hoặc tên miền máy chủ có thể truy cập và bảo đảm cổng đã được mở.",
  "打开 Swagger 文档": "Mở tài liệu Swagger",
  "隐藏 API Key": "Ẩn API Key",
  "显示 API Key": "Hiện API Key",
  "复制 API Key": "Sao chép API Key",
  "请勿分享管理员密钥。需要分发给其他人时，请在设置中创建专用用户密钥。示例默认使用 YOUR_API_KEY 占位符。": "Không chia sẻ khóa quản trị viên. Để cấp quyền cho người khác, hãy tạo khóa người dùng riêng trong Cài đặt. Ví dụ mặc định dùng YOUR_API_KEY làm giá trị mẫu.",
  "复制示例": "Sao chép ví dụ",
  "发行说明保留上游原文，不自动翻译。":
    "Ghi chú phát hành được giữ nguyên văn từ dự án gốc, không dịch tự động.",
  导入: "Nhập",
  图片: "Ảnh",
  历史记录: "Lịch sử",
  生成: "Tạo",
  时间: "Thời gian",
  密码: "Mật khẩu",
  任务: "Tác vụ",
  名称: "Tên",
  复制失败: "Sao chép thất bại",
  英文安装指令: "Hướng dẫn cài đặt tiếng Anh",
  新增: "Thêm mới",
  修复: "Sửa lỗi",
  调整: "Điều chỉnh",
  文档: "Tài liệu",
  'curl {0}/chat/completions \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer {1}" \\\n  -d \'{"model":"gpt-5-mini","messages":[{"role":"user","content":"你好"}]}\'':
    'curl {0}/chat/completions \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer {1}" \\\n  -d \'{"model":"gpt-5-mini","messages":[{"role":"user","content":"Xin chào"}]}\'',
  'curl {0}/responses \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer {1}" \\\n  -d \'{"model":"gpt-5-mini","input":"生成一张未来城市图片"}\'':
    'curl {0}/responses \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer {1}" \\\n  -d \'{"model":"gpt-5-mini","input":"Tạo một bức ảnh thành phố tương lai"}\'',
  'curl {0}/search \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer {1}" \\\n  -d \'{"prompt":"搜索 chatgpt2api 最新使用方式"}\'':
    'curl {0}/search \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer {1}" \\\n  -d \'{"prompt":"Tìm cách sử dụng chatgpt2api mới nhất"}\'',
  'curl {0}/images/generations \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer {1}" \\\n  -d \'{"model":"gpt-image-2","prompt":"一张极简产品海报","n":1}\'':
    'curl {0}/images/generations \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer {1}" \\\n  -d \'{"model":"gpt-image-2","prompt":"Một áp phích sản phẩm tối giản","n":1}\'',
  'curl {0}/images/edits \\\n  -H "Authorization: Bearer {1}" \\\n  -F "model=gpt-image-2" \\\n  -F "prompt=改成赛博朋克夜景" \\\n  -F "image=@./input.png"':
    'curl {0}/images/edits \\\n  -H "Authorization: Bearer {1}" \\\n  -F "model=gpt-image-2" \\\n  -F "prompt=Đổi thành cảnh đêm cyberpunk" \\\n  -F "image=@./input.png"',
  'curl {0}/ppt/generations \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer {1}" \\\n  -d \'{"prompt":"制作一份 8 页以内的季度业务汇报 PPT","base64_images":[]}\'':
    'curl {0}/ppt/generations \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer {1}" \\\n  -d \'{"prompt":"Tạo PPT báo cáo kinh doanh quý không quá 8 trang","base64_images":[]}\'',
  'curl {0}/psd/generations \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer {1}" \\\n  -d \'{"prompt":"按原图位置拆分海报元素并合成可编辑 PSD","base64_images":["data:image/png;base64,..."]}\'':
    'curl {0}/psd/generations \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer {1}" \\\n  -d \'{"prompt":"Tách các thành phần áp phích theo vị trí gốc và ghép thành PSD có thể chỉnh sửa","base64_images":["data:image/png;base64,..."]}\'',
  "支持 http/https/socks5/socks5h，socks5 会转为 socks5h。带认证格式：协议://账号:密码@主机:端口，也可直接粘贴 主机:端口:账号:密码。":
    "Hỗ trợ http/https/socks5/socks5h; socks5 được chuyển thành socks5h. Dùng dạng giao-thức://tài-khoản:mật-khẩu@máy-chủ:cổng hoặc máy-chủ:cổng:tài-khoản:mật-khẩu.",
  "资源代理 URL": "URL proxy tài nguyên",
  重置会话状态码: "Mã trạng thái đặt lại phiên",
  "默认 403，只对 Cloudflare/挑战类错误触发。":
    "Mặc định 403, chỉ kích hoạt với lỗi Cloudflare hoặc yêu cầu xác minh.",
  "跳过 SSL 校验": "Bỏ qua xác minh SSL",
  测试当前清障代理: "Kiểm tra proxy clearance hiện tại",
  "代理可用：HTTP {0}，用时 {1} ms，来源 {2}":
    "Proxy hoạt động: HTTP {0}, mất {1} ms, nguồn {2}",
  "Clearance 模式": "Chế độ clearance",
  不启用: "Không bật",
  "手动 Cookie": "Cookie thủ công",
  超时秒数: "Thời gian chờ (giây)",
  刷新间隔秒数: "Chu kỳ làm mới (giây)",
  "单独 cf_clearance": "cf_clearance riêng",
  "启动时预热 Clearance": "Chuẩn bị clearance khi khởi động",
  "测试目标 URL": "URL đích kiểm tra",
  "测试 Clearance": "Kiểm tra clearance",
  "Clearance 可用：{0}，用时 {1} ms": "Clearance hoạt động: {0}, mất {1} ms",
  "Clearance 不可用：{0}（用时 {1} ms）":
    "Clearance không hoạt động: {0} (mất {1} ms)",
  "为系统中的出站请求配置统一代理，保存后会立即生效。":
    "Cấu hình proxy chung cho các yêu cầu gửi ra từ hệ thống. Có hiệu lực ngay sau khi lưu.",
  代理地址: "Địa chỉ proxy",
  "留空表示不使用代理。请按完整地址填写，例如 `http://127.0.0.1:7890`、`http://用户名:密码@127.0.0.1:7890` 或 `socks5://127.0.0.1:7890`。":
    "Để trống để không dùng proxy. Nhập địa chỉ đầy đủ, ví dụ `http://127.0.0.1:7890`, `http://user:password@127.0.0.1:7890` hoặc `socks5://127.0.0.1:7890`.",
  上游代理配置: "Cấu hình proxy upstream",
  "为 chatgpt.com 的请求配置出网代理，适合国内服务器部署；Sub2API / CPA 请求不受影响。":
    "Cấu hình proxy cho yêu cầu đến chatgpt.com, phù hợp khi máy chủ cần proxy để truy cập; không ảnh hưởng yêu cầu Sub2API / CPA.",
  启用代理: "Bật proxy",
  "关闭后 chatgpt.com 请求会直连。保存后立即生效，无需重启。":
    "Khi tắt, yêu cầu đến chatgpt.com kết nối trực tiếp. Có hiệu lực ngay sau khi lưu, không cần khởi động lại.",
  支持: "Hỗ trợ ",
  测试连通: "Kiểm tra kết nối",
  "读取到 {0} 个分组": "Đã tải {0} nhóm",
  "读取成功，共 {0} 个 OpenAI 账号": "Tải thành công {0} tài khoản OpenAI",
  "Sub2API 连接管理": "Quản lý kết nối Sub2API",
  "配置 Sub2API 服务器后，可查询其中的 OpenAI OAuth 账号并批量导入本地号池。":
    "Sau khi cấu hình máy chủ Sub2API, bạn có thể tra cứu tài khoản OpenAI OAuth và nhập hàng loạt vào kho tài khoản cục bộ.",
  "暂无 Sub2API 连接": "Chưa có kết nối Sub2API",
  "点击「添加连接」保存你的 Sub2API 信息。":
    "Nhấn “Thêm kết nối” để lưu thông tin Sub2API.",
  "· 分组 {0}": "· Nhóm {0}",
  "输入 Sub2API 地址和管理员账户（或 Admin API Key），保存为一个连接。":
    "Nhập địa chỉ Sub2API và tài khoản quản trị (hoặc Admin API Key), rồi lưu kết nối.",
  "点击某个连接的「同步」会拉取其中 platform=openai 且 type=oauth 的账号列表。":
    "Nhấn “Đồng bộ” trên kết nối để tải các tài khoản có platform=openai và type=oauth.",
  "勾选需要的账号后后端会并发拉取 access_token，自动导入本地号池并刷新状态。":
    "Sau khi chọn tài khoản, máy chủ lấy access_token đồng thời, tự nhập vào kho cục bộ và làm mới trạng thái.",
  "仅会读取 sub2api 凭据中的 access_token；refresh_token 等字段不会写入本地。":
    "Chỉ đọc access_token trong thông tin xác thực Sub2API; refresh_token và các trường khác không được lưu cục bộ.",
  "Sub2API 地址": "Địa chỉ Sub2API",
  认证方式: "Phương thức xác thực",
  "管理员邮箱 + 密码": "Email quản trị viên + mật khẩu",
  管理员邮箱: "Email quản trị viên",
  "分组（可选）": "Nhóm (tùy chọn)",
  "全部分组（不限制）": "Tất cả nhóm (không giới hạn)",
  未分组: "Chưa phân nhóm",
  "同步时会用分组 ID 过滤，留空 = 同步所有 OpenAI OAuth 账号。":
    "Dùng ID nhóm để lọc khi đồng bộ; để trống để đồng bộ mọi tài khoản OpenAI OAuth.",
  "添加完连接后可在编辑对话框里点「拉取分组」选择具体分组。":
    "Sau khi thêm kết nối, nhấn “Tải nhóm” trong hộp thoại chỉnh sửa để chọn nhóm cụ thể.",
  没有匹配的账号: "Không có tài khoản phù hợp",
  "· 过期 {0}": "· Hết hạn {0}",
  用户密钥管理: "Quản lý khóa người dùng",
  "为普通用户创建专用密钥；普通用户只能进入画图页，不能查看设置和号池。":
    "Tạo khóa riêng cho người dùng. Người dùng chỉ truy cập trang tạo ảnh, không xem được cài đặt và kho tài khoản.",
  创建用户密钥: "Tạo khóa người dùng",
  "新密钥仅展示一次，请立即保存：":
    "Khóa mới chỉ hiển thị một lần. Hãy lưu ngay: ",
  复制: "Sao chép",
  "暂无普通用户密钥。点击右上角按钮后即可创建并分发给其他人。":
    "Chưa có khóa người dùng. Nhấn nút ở góc trên bên phải để tạo và cấp khóa cho người khác.",
  最近使用: "Lần dùng gần nhất",
  "可选填写一个备注名称，方便区分不同使用者；创建后会生成一条只能查看一次的原始密钥。":
    "Có thể nhập tên ghi chú để phân biệt người dùng. Khóa gốc sau khi tạo chỉ hiển thị một lần.",
  创建: "Tạo",
  删除用户密钥: "Xóa khóa người dùng",
  "确认删除用户密钥「{0}」吗？删除后该密钥将无法继续调用接口。":
    "Xóa khóa người dùng “{0}”? Sau khi xóa, khóa này không thể tiếp tục gọi API.",
  编辑用户密钥: "Chỉnh sửa khóa người dùng",
  "可以修改备注名称；如需更换专用密钥，直接填写新的原始密钥即可。留空则保持当前密钥不变。":
    "Có thể sửa tên ghi chú. Để đổi khóa, nhập khóa gốc mới; để trống để giữ khóa hiện tại.",
  "新的专用密钥（可选）": "Khóa riêng mới (tùy chọn)",
  "保存后旧密钥会立即失效，新密钥生效。系统仍只保存哈希，不会回显当前密钥。":
    "Sau khi lưu, khóa cũ hết hiệu lực ngay và khóa mới bắt đầu có hiệu lực. Hệ thống chỉ lưu giá trị băm, không hiển thị khóa hiện tại.",
  "WebDAV 连接可用：HTTP {0}": "Kết nối WebDAV hoạt động: HTTP {0}",
  "WebDAV 连接失败：{0}": "Kết nối WebDAV thất bại: {0}",
  "同步完成：上传 {0}，跳过 {1}，失败 {2}":
    "Đồng bộ hoàn tất: tải lên {0}, bỏ qua {1}, thất bại {2}",
  "备份已完成：{0}": "Sao lưu hoàn tất: {0}",
  "R2 连接正常（HTTP {0}）": "Kết nối R2 hoạt động (HTTP {0})",
  "读取成功，共 {0} 个远程账号": "Tải thành công {0} tài khoản từ xa",
  "{0} 至 {1}": "{0} đến {1}",
  图片预览: "Xem trước ảnh",
  "请求失败 ({0})": "Yêu cầu thất bại ({0})",
  "第 {0} 轮": "Lượt {0}",
  "第 {0} - {1} 条，共 {2} 条": "Mục {0}–{1}, tổng {2} mục",
  "个，跳过": "mục, bỏ qua",
  轮: "lượt",
  图片访问地址: "Địa chỉ truy cập ảnh",
  "用于生成图片结果的访问前缀地址。": "Địa chỉ tiền tố để truy cập ảnh đã tạo.",
  默认请求上游模型名称: "Mô hình upstream mặc định",
  "gpt-image-2 发起图片请求时使用的上游模型名称，默认 gpt-5-5。":
    "Mô hình upstream dùng khi gpt-image-2 gửi yêu cầu tạo ảnh, mặc định là gpt-5-5.",
  默认思考强度: "Mức suy luận mặc định",
  "Auto（不传递）": "Tự động (không gửi tham số)",
  "模型名称以 -standard、-extended 或 -max 结尾时，模型后缀优先。":
    "Nếu tên mô hình kết thúc bằng -standard, -extended hoặc -max, hậu tố mô hình được ưu tiên.",
  图片自动清理: "Tự động dọn ảnh",
  "自动删除多少天前的本地图片。": "Tự động xóa ảnh cục bộ cũ hơn số ngày này.",
  图片轮询超时: "Thời gian chờ kết quả ảnh",
  "单位秒，等待上游图片结果的最长时间。":
    "Đơn vị giây, thời gian tối đa chờ kết quả ảnh từ upstream.",
  单账号图片并发: "Số yêu cầu ảnh đồng thời mỗi tài khoản",
  "限制每个账号同时处理的图片请求数量，默认 3。":
    "Giới hạn số yêu cầu ảnh mỗi tài khoản xử lý đồng thời, mặc định là 3.",
  自动移除异常账号: "Tự động xóa tài khoản lỗi",
  刷新时检测并移除: "Phát hiện và xóa khi làm mới",
  图片二次确认机制: "Xác nhận ảnh lần hai",
  "打开后能稍微提升获取图片的成功率。":
    "Bật để tăng nhẹ tỷ lệ lấy ảnh thành công.",
  出图后移除本地对话: "Xóa hội thoại sau khi tạo ảnh",
  "成功拿到图片后，异步隐藏 ChatGPT 侧对应的本地对话记录。":
    "Sau khi lấy ảnh thành công, ẩn hội thoại tương ứng trên ChatGPT ở chế độ nền.",
  没出图也移除本地对话: "Xóa hội thoại cả khi không tạo được ảnh",
  "失败、超时或只返回文本时也一并隐藏对话记录（打开后包含出图成功的情况）。":
    "Ẩn hội thoại cả khi thất bại, hết thời gian chờ hoặc chỉ nhận được văn bản (bao gồm cả trường hợp tạo ảnh thành công).",
  图片超时继续等待时间: "Thời gian chờ thêm khi tạo ảnh quá hạn",
  '单位秒，超时后点击"继续等待"额外等待的时间。':
    "Đơn vị giây, thời gian chờ thêm khi nhấn “Tiếp tục chờ” sau khi quá hạn.",
  图片二次确认等待时间: "Thời gian chờ xác nhận ảnh lần hai",
  "单位秒，找到图片后等待多久再次确认。需配合图片二次确认机制使用。":
    "Đơn vị giây, thời gian chờ sau khi tìm thấy ảnh để xác nhận lại. Dùng cùng cơ chế xác nhận ảnh lần hai.",
  刷新后自动尝试移除异常状态: "Tự động thử khôi phục tài khoản sau khi làm mới",
  "开启后刷新时自动尝试密码登录恢复账号。":
    "Khi bật, quá trình làm mới sẽ thử đăng nhập bằng mật khẩu để khôi phục tài khoản.",
  自动移除限流账号: "Tự động xóa tài khoản bị giới hạn",
  控制台日志级别: "Mức nhật ký console",
  "不选择时使用默认 info / warning / error。":
    "Nếu không chọn, dùng mặc định info / warning / error.",
  全局附加指令: "Chỉ dẫn bổ sung toàn cục",
  "每次请求都会作为 system 消息注入，可用于审核用户提示词、避免违规内容、统一约束模型行为或固定角色设定。":
    "Được thêm dưới dạng tin nhắn system vào mỗi yêu cầu để kiểm duyệt lời nhắc, tránh nội dung vi phạm, thống nhất hành vi hoặc vai trò của mô hình.",
  敏感词: "Từ khóa nhạy cảm",
  "只要用户请求包含任意敏感词，就直接返回拒绝。":
    "Từ chối ngay nếu yêu cầu chứa bất kỳ từ khóa nhạy cảm nào.",
  "启用 WebDAV 图片存储": "Bật lưu trữ ảnh WebDAV",
  "测试 WebDAV": "Kiểm tra WebDAV",
  全量同步: "Đồng bộ toàn bộ",
  "生成时只处理本次新图片；全量同步用于把已有本地图片补传到 WebDAV。":
    "Khi tạo ảnh chỉ xử lý ảnh mới; đồng bộ toàn bộ để tải thêm các ảnh cục bộ hiện có lên WebDAV.",
  "当前待保存模式：": "Chế độ sắp lưu: ",
  "修改后需要点保存，或通过测试/同步按钮自动保存。":
    "Sau khi sửa, nhấn Lưu hoặc dùng nút Kiểm tra/Đồng bộ để tự động lưu.",
  保存模式: "Chế độ lưu",
  用户名: "Tên người dùng",
  远端目录: "Thư mục từ xa",
  公开访问前缀: "Tiền tố truy cập công khai",
  "留空时返回本应用 /images/... 代理地址；填入后直接返回公开图片地址。":
    "Để trống để trả về địa chỉ proxy /images/... của ứng dụng; nếu điền, trả về trực tiếp địa chỉ ảnh công khai.",
  "启用 AI 审核": "Bật kiểm duyệt AI",
  "开启后会在请求进入生图账号前先调用审核模型，审核不通过会直接拒绝，减少违规提示词触达账号造成风控或封号的风险。":
    "Kiểm duyệt yêu cầu trước khi gửi đến tài khoản tạo ảnh. Yêu cầu không đạt sẽ bị từ chối để giảm nguy cơ tài khoản bị hạn chế hoặc khóa do lời nhắc vi phạm.",
  审核提示词: "Lời nhắc kiểm duyệt",
  "名称（可选）": "Tên (tùy chọn)",
  "CPA 地址": "Địa chỉ CPA",
  "CPA 连接管理": "Quản lý kết nối CPA",
  "先配置连接，再按需查询远程账号并选择导入到本地号池。":
    "Cấu hình kết nối, sau đó tra cứu và chọn tài khoản từ xa để nhập vào kho tài khoản cục bộ.",
  个连接: " kết nối",
  "暂无 CPA 连接": "Chưa có kết nối CPA",
  "点击「添加连接」保存你的 CLIProxyAPI 信息。":
    "Nhấn “Thêm kết nối” để lưu thông tin CLIProxyAPI.",
  同步: "Đồng bộ",
  导入任务: "Tác vụ nhập",
  "，已处理": ", đã xử lý ",
  使用说明: "Hướng dẫn sử dụng",
  "页面进入后先读取系统里已配置的 CPA 连接。":
    "Trang sẽ tải các kết nối CPA đã cấu hình trong hệ thống.",
  "点击某个连接的「同步」后，会先读取远程账号列表并展示给前端选择。":
    "Nhấn “Đồng bộ” trên kết nối để tải danh sách tài khoản từ xa và chọn trên giao diện.",
  "确认选择后，后端后台下载对应 access_token 并导入本地号池。":
    "Sau khi xác nhận, máy chủ tải access_token tương ứng ở chế độ nền và nhập vào kho tài khoản cục bộ.",
  "前端只轮询导入进度，不直接参与 download。":
    "Giao diện chỉ kiểm tra tiến độ nhập, không trực tiếp tải dữ liệu.",
  选择要导入的账号: "Chọn tài khoản cần nhập",
  "来自 {0}": "Từ {0}",
  "/ 页": "/ trang",
  筛选结果: "Kết quả lọc",
  个: " mục",
  已选: "Đã chọn",
  没有匹配的远程账号: "Không có tài khoản từ xa phù hợp",
  上一页: "Trang trước",
  下一页: "Trang sau",
  导入选中账号: "Nhập tài khoản đã chọn",
  "清障代理可用（{0} ms，HTTP {1}）":
    "Proxy clearance hoạt động ({0} ms, HTTP {1})",
  "清障代理不可用：{0}": "Proxy clearance không hoạt động: {0}",
  "Clearance 获取成功（{0} ms）": "Lấy clearance thành công ({0} ms)",
  "Clearance 获取失败：{0}": "Lấy clearance thất bại: {0}",
  "FlareSolverr 清障": "Clearance bằng FlareSolverr",
  "默认关闭。用于上游请求遇到 Cloudflare 拦截后获取 clearance，可配合 WARP / Privoxy 代理链路重试。":
    "Mặc định tắt. Lấy clearance khi yêu cầu upstream bị Cloudflare chặn; có thể thử lại qua chuỗi proxy WARP / Privoxy.",
  "代理优先级：账号代理 &gt; FlareSolverr 代理链路 &gt; 显式代理 &gt; 全局代理。Cookie / cf_clearance 不会在接口响应中明文返回。":
    "Thứ tự ưu tiên proxy: tài khoản > chuỗi FlareSolverr > proxy chỉ định > proxy toàn cục. Cookie / cf_clearance không được trả về dạng rõ trong phản hồi API.",
  "使用 FlareSolverr 模式前，请先通过 Docker 启动 flaresolverr、privoxy、warp-proxy 等相关容器；容器内 URL 通常填写 http://flaresolverr:8191。":
    "Trước khi dùng FlareSolverr, hãy khởi động các container flaresolverr, privoxy và warp-proxy bằng Docker; URL trong container thường là http://flaresolverr:8191.",
  "启用 FlareSolverr 清障": "Bật clearance bằng FlareSolverr",
  出站模式: "Chế độ kết nối ra",
  直连: "Trực tiếp",
  "单代理/WARP": "Một proxy / WARP",
  "WARP compose 默认使用 single_proxy。":
    "WARP compose mặc định dùng single_proxy.",
  "清障代理 URL": "URL proxy clearance",
  "{0} 不是图片文件": "{0} không phải là tệp ảnh",
  "{0} 超过 10MB": "{0} vượt quá 10 MB",
  "{0} 读取失败": "Không thể đọc {0}",
  超高: "Rất cao",
  "移除 {0}": "Xóa {0}",
  "{0} 任务": "Tác vụ {0}",
  暂无记录: "Chưa có lịch sử",
  需求: "Yêu cầu",
  参考图: "Ảnh tham chiếu",
  清空图片: "Xóa tất cả ảnh",
  生成状态: "Trạng thái tạo",
  已执行: "Thời gian đã chạy",
  生成结果: "Kết quả",
  暂无任务: "Chưa có tác vụ",
  利用ChatGPT先进的网页搜索功能进行搜索:
    "Tìm kiếm trên web bằng tính năng tìm kiếm nâng cao của ChatGPT",
  复用配置: "Dùng lại cấu hình",
  本轮参考图: "Ảnh tham chiếu của lượt này",
  "预览参考图 {0}": "Xem trước ảnh tham chiếu {0}",
  "参考图 {0}": "Ảnh tham chiếu {0}",
  等待当前对话中的前序任务完成:
    "Đang chờ tác vụ trước trong cuộc trò chuyện hoàn tất",
  结果: "Kết quả",
  继续等待: "Tiếp tục chờ",
  重新生成这一张: "Tạo lại ảnh này",
  忽略错误: "Bỏ qua lỗi",
  全部重新生成: "Tạo lại tất cả",
  "其中 {0} 张未成功生成": "Có {0} ảnh chưa tạo thành công",
  "已继续等待 {0} 秒": "Đã chờ thêm {0} giây",
  令牌名称: "Tên token",
  调用耗时: "Thời gian xử lý",
  简述: "Tóm tắt",
  参数: "Tham số",
  说明: "Mô tả",
  接口接入说明: "Hướng dẫn kết nối API",
  "第三方应用按 OpenAI 兼容接口接入；文件任务接口也使用同一套鉴权方式。":
    "Ứng dụng bên thứ ba kết nối qua API tương thích OpenAI; API tác vụ tệp dùng cùng phương thức xác thực.",
  服务地址: "Địa chỉ máy chủ",
  请求头: "Header yêu cầu",
  "常用模型，也可请求 /v1/models 获取":
    "Các mô hình phổ biến; có thể lấy danh sách qua /v1/models",
  输入参数: "Tham số đầu vào",
  输出参数: "Tham số đầu ra",
  调用示例: "Ví dụ sử dụng",
  "R2 备份管理": "Quản lý sao lưu R2",
  "将关键数据定时备份到 Cloudflare R2，支持可选加密、轮替、手动执行与历史清理。":
    "Sao lưu dữ liệu quan trọng định kỳ lên Cloudflare R2, hỗ trợ mã hóa tùy chọn, luân phiên bản sao, chạy thủ công và dọn lịch sử.",
  "账号与用户密钥会从当前存储后端导出逻辑快照，不依赖底层是 `json`、`sqlite`、`postgres` 还是 `git`。图片目录默认不备份，避免备份体积过大。":
    "Tài khoản và khóa người dùng được xuất thành bản chụp dữ liệu từ hệ thống lưu trữ hiện tại, dù dùng `json`, `sqlite`, `postgres` hay `git`. Thư mục ảnh không được sao lưu mặc định để tránh bản sao quá lớn.",
  启用定时备份: "Bật sao lưu định kỳ",
  启用备份加密: "Bật mã hóa bản sao lưu",
  "Bucket 名称": "Tên bucket",
  备份前缀: "Tiền tố sao lưu",
  "R2 内对象前缀，例如 `backups/prod`。":
    "Tiền tố đối tượng trong R2, ví dụ `backups/prod`.",
  定时备份间隔: "Chu kỳ sao lưu",
  "单位分钟，服务启动后会按此间隔自动轮询执行。":
    "Đơn vị phút. Sau khi khởi động, dịch vụ tự động sao lưu theo chu kỳ này.",
  保留备份数量: "Số bản sao lưu giữ lại",
  "成功上传后自动删除更旧的备份。填 `0` 表示不自动轮替。":
    "Tự xóa bản sao cũ sau khi tải lên thành công. Nhập `0` để không tự động luân phiên.",
  加密口令: "Mật khẩu mã hóa",
  "仅在启用加密时使用。请妥善保管，否则无法解密备份内容。":
    "Chỉ dùng khi bật mã hóa. Hãy giữ mật khẩu cẩn thận; thiếu mật khẩu sẽ không thể giải mã bản sao lưu.",
  备份内容: "Nội dung sao lưu",
  "按组件勾选需要进入备份包的数据。":
    "Chọn các thành phần dữ liệu cần đưa vào bản sao lưu.",
  最近开始: "Lần bắt đầu gần nhất",
  最近完成: "Lần hoàn tất gần nhất",
  最近对象: "Đối tượng gần nhất",
  最近错误: "Lỗi gần nhất",
  测试连接: "Kiểm tra kết nối",
  刷新列表: "Làm mới danh sách",
  立即备份: "Sao lưu ngay",
  历史备份: "Lịch sử sao lưu",
  "支持查看对象信息并直接删除远端备份。":
    "Xem thông tin đối tượng và xóa trực tiếp bản sao lưu từ xa.",
  "暂无远端备份记录。保存配置并执行一次手动备份后会出现在这里。":
    "Chưa có bản sao lưu từ xa. Hãy lưu cấu hình và chạy sao lưu thủ công để bản sao xuất hiện tại đây.",
  已加密: "Đã mã hóa",
  大小: "Kích thước",
  更新时间: "Thời gian cập nhật",
  "对象 key": "Khóa đối tượng",
  备份详情: "Chi tiết sao lưu",
  "暂时无法读取备份详情；如果这是加密备份，请确认当前已填写正确的加密口令并先保存配置。":
    "Chưa thể đọc chi tiết bản sao lưu. Nếu bản sao được mã hóa, hãy nhập đúng mật khẩu mã hóa và lưu cấu hình trước.",
  对象名称: "Tên đối tượng",
  触发方式: "Cách kích hoạt",
  应用版本: "Phiên bản ứng dụng",
  存储后端: "Hệ thống lưu trữ",
  文件内容: "Nội dung tệp",
  快照内容: "Nội dung bản chụp",
  记录数: "Số bản ghi",
  "代理可用（{0} ms，HTTP {1}）": "Proxy hoạt động ({0} ms, HTTP {1})",
  "代理不可用：{0}": "Proxy không hoạt động: {0}",
  "管理员登录密钥继续从部署配置读取，不再在此页面展示；如需分发给其他人，请在下方创建普通用户密钥。":
    "Khóa đăng nhập quản trị viên được đọc từ cấu hình triển khai và không hiển thị tại đây. Để cấp quyền cho người khác, hãy tạo khóa người dùng bên dưới.",
  账号刷新间隔: "Chu kỳ làm mới tài khoản",
  "单位分钟，控制账号自动刷新频率。":
    "Đơn vị phút, quy định tần suất tự động làm mới tài khoản.",
  全局代理: "Proxy toàn cục",
  "留空表示不使用代理。支持协议://账号:密码@主机:端口，也可直接粘贴代理商的 主机:端口:账号:密码；示例 http://user:pass@127.0.0.1:7890、127.0.0.1:7890:user:pass。账号密码含 @/: 等特殊字符时需 URL 编码。":
    "Để trống để không dùng proxy. Hỗ trợ giao-thức://tài-khoản:mật-khẩu@máy-chủ:cổng hoặc máy-chủ:cổng:tài-khoản:mật-khẩu; ví dụ http://user:pass@127.0.0.1:7890 hoặc 127.0.0.1:7890:user:pass. Cần mã hóa URL nếu tài khoản hoặc mật khẩu chứa ký tự đặc biệt như @/:.",
  "代理可用：HTTP {0}，用时 {1} ms": "Proxy hoạt động: HTTP {0}, mất {1} ms",
  "代理不可用：{0}（用时 {1} ms）": "Proxy không hoạt động: {0} (mất {1} ms)",
  测试代理: "Kiểm tra proxy",
};
