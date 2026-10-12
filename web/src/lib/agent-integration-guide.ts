import type { Locale } from "@/i18n";
import { getApiUrls } from "./api-urls";

const fenced = (language: string, content: string) =>
  `\`\`\`${language}\n${content}\n\`\`\``;

/** Pure, credential-free export. Never accepts an API key or an auth session. */
export function buildAgentIntegrationGuide(
  serviceUrl: string,
  locale: Locale,
): string {
  const url = new URL(serviceUrl);
  if (!["http:", "https:"].includes(url.protocol))
    throw new Error("Unsupported API URL");
  // Do not carry credentials, tokens in query strings, or fragments into a prompt.
  url.username = "";
  url.password = "";
  url.search = "";
  url.hash = "";
  const urls = getApiUrls(url.toString(), "");
  const l = (vi: string, zh: string) => (locale === "vi-VN" ? vi : zh);
  const json = (value: unknown) =>
    fenced("json", JSON.stringify(value, null, 2));
  const sections: string[] = [];
  const add = (title: string, body: string) =>
    sections.push(`## ${title}\n\n${body}`);

  sections.push(
    l(
      "# Hướng dẫn tích hợp chatgpt2api dành cho AI Agent",
      "# 面向 AI Agent 的 chatgpt2api 集成指南",
    ),
  );
  sections.push(
    l(
      "Bạn là coding agent đang tích hợp chatgpt2api vào ứng dụng của tôi. Trước tiên đọc cấu trúc repo, framework, cách quản lý cấu hình, xác thực và kiểm thử hiện tại. Tái sử dụng quy ước sẵn có; không viết lại app hay sửa phần không liên quan. Nếu chưa rõ chức năng cần tích hợp, hỏi tôi chọn chat, tạo/sửa ảnh, tìm kiếm hay PPT/PSD. Chỉ triển khai chức năng đã được yêu cầu.",
      "你是负责将 chatgpt2api 集成到我的应用的 coding agent。先阅读仓库结构、框架、配置、鉴权和测试方式，复用现有约定，不重写应用或修改无关功能。如果需求不明确，先询问要集成对话、生图/编辑图、搜索还是 PPT/PSD。只实现已请求的功能。",
    ),
  );

  add(
    l("1. Kết nối và phạm vi tương thích", "1. 连接与兼容范围"),
    [
      `- Service URL: ${urls.service}`,
      `- OpenAI Base URL: ${urls.openAI}`,
      `- Swagger: ${urls.swagger}`,
      `- OpenAPI JSON: ${urls.schema}`,
      l(
        "Base URL cho client tương thích OpenAI đã chứa /v1. Khi dùng HTTP trực tiếp: nối service URL với đường dẫn đầy đủ /v1/...; không tạo /v1/v1. Đây là máy chủ chatgpt2api tương thích một phần giao thức OpenAI, không phải API chính thức của OpenAI. Không mặc định mọi tham số, tool, model hoặc endpoint của OpenAI đều được hỗ trợ. Đối chiếu schema và phản hồi thực tế; schema có thể chưa mô tả đầy đủ endpoint dùng multipart hoặc phản hồi động.",
        "OpenAI 兼容客户端的 Base URL 已含 /v1。直接 HTTP 调用时将服务地址与完整 /v1/... 路径拼接，避免 /v1/v1。这是部分兼容 OpenAI 协议的 chatgpt2api 服务，不是 OpenAI 官方 API。不要假设支持所有 OpenAI 参数、工具、模型或接口；核对 schema 和实际响应。multipart 或动态响应可能未在 schema 中完整描述。",
      ),
      l(
        "localhost/127.0.0.1 chỉ trỏ đến máy đang chạy app/agent. Nếu app ở máy khác, container hoặc dịch vụ cloud, hãy yêu cầu địa chỉ máy chủ truy cập được từ môi trường đó. Không tự mở cổng hay tắt xác thực. Không dùng URL lưu trữ ảnh làm API Base URL.",
        "localhost/127.0.0.1 指的是应用或 agent 所在机器。跨机器、容器或云端部署时，先获取该环境可访问的服务地址。不要自行开放端口或关闭鉴权。图片存储地址不是 API Base URL。",
      ),
    ].join("\n\n"),
  );

  add(
    l("2. Cấu hình và bảo vệ khóa", "2. 配置与密钥保护"),
    [
      fenced(
        "dotenv",
        `CHATGPT2API_BASE_URL=${urls.openAI}\nCHATGPT2API_API_KEY=YOUR_API_KEY\nCHATGPT2API_TIMEOUT_MS=180000`,
      ),
      l(
        "Đây là mẫu .env.example; 180000 ms chỉ là timeout đề xuất cho client, không phải cam kết của máy chủ. Lấy khóa người dùng riêng do quản trị viên cấp qua cơ chế secret của môi trường; không yêu cầu dán khóa vào cuộc trò chuyện. Không dùng access_token/refresh_token của tài khoản ChatGPT làm khóa API. Không nhúng khóa vào frontend, NEXT_PUBLIC_*, VITE_*, mobile bundle, URL, log, git hoặc tài liệu. Gọi dịch vụ qua backend của app; bảo vệ endpoint backend bằng xác thực người dùng và giới hạn sử dụng. Không tự tạo hoặc thay khóa quản trị.",
        "这是 .env.example 模板；180000 ms 只是客户端建议超时，不是服务端保证。通过环境的 secret 机制配置管理员分配的专用用户密钥，不要求把密钥贴进对话。不要将 ChatGPT 账号的 access_token/refresh_token 当作 API Key。不要把密钥放进前端、NEXT_PUBLIC_*、VITE_*、移动端包、URL、日志、git 或文档。通过应用后端调用服务，并为该后端添加用户鉴权和使用限制。不要自行创建或替换管理员密钥。",
      ),
      fenced(
        "http",
        `Authorization: Bearer YOUR_API_KEY\nAccept-Language: ${locale}\nContent-Type: application/json`,
      ),
      l(
        "Dùng Bearer trên các endpoint /v1 bên dưới. Với FormData/multipart, để HTTP client tự đặt Content-Type cùng boundary. Khóa dùng cho API không đồng nghĩa với quyền quản trị; không tích hợp các endpoint quản lý tài khoản hoặc cài đặt nếu không được yêu cầu.",
        "以下 /v1 接口使用 Bearer 鉴权。FormData/multipart 请求让 HTTP 客户端自行设置带 boundary 的 Content-Type。API Key 不等于管理员权限；未被要求时不要集成账号或设置管理接口。",
      ),
    ].join("\n\n"),
  );

  add(
    l("3. Endpoint và hợp đồng dữ liệu", "3. 接口与数据约定"),
    [
      l(
        "Các đường dẫn dưới đây tính từ Service URL. Ví dụ JSON chỉ minh họa cấu trúc, không phải kết quả chạy thật.",
        "以下路径相对于 Service URL。JSON 示例只说明结构，不是实际调用结果。",
      ),
      "### GET /v1/models",
      l(
        "Kiểm tra kết nối/xác thực và lấy data[].id. Chọn model theo danh sách máy chủ; danh sách có model không bảo đảm tài khoản hiện tại còn hạn mức.",
        "检查连接与鉴权并读取 data[].id。根据服务端列表选择模型；出现在列表中不保证当前账号有可用额度。",
      ),
      json({ object: "list", data: [{ id: "auto", object: "model" }] }),
      "### POST /v1/chat/completions",
      json({
        model: "auto",
        messages: [{ role: "user", content: "Hello" }],
        stream: false,
      }),
      json({
        choices: [
          {
            index: 0,
            message: { role: "assistant", content: "Hello!" },
            finish_reason: "stop",
          },
        ],
      }),
      l(
        "Đọc choices[0].message.content, kiểm tra trường có tồn tại; không giả định luôn có usage. Gửi lịch sử qua messages theo nhu cầu app, không tự giả định có session phía server.",
        "读取 choices[0].message.content 并检查字段是否存在，不假设总有 usage。按应用需求通过 messages 发送历史，不假设服务端自动保存会话。",
      ),
      "### POST /v1/responses",
      json({ model: "auto", input: "Hello", stream: false }),
      json({
        id: "resp_example",
        status: "completed",
        output: [
          {
            type: "message",
            role: "assistant",
            content: [{ type: "output_text", text: "Hello!" }],
          },
        ],
      }),
      l(
        "Với HTTP JSON, lấy text từ output[].content[] có type=output_text; không chỉ trông chờ thuộc tính output_text tiện ích của SDK. Chỉ dùng tools sau khi xác minh loại tool được hỗ trợ.",
        "对于原始 HTTP JSON，读取 output[].content[] 中 type=output_text 的 text；不要仅依赖 SDK 的 output_text 便捷属性。使用 tools 前先确认支持的工具类型。",
      ),
      "### POST /v1/images/generations",
      json({
        model: "gpt-image-2",
        prompt: "A minimal product poster",
        n: 1,
        quality: "auto",
        response_format: "b64_json",
        stream: false,
      }),
      json({
        created: 1700000000,
        data: [{ b64_json: "<base64-image-bytes>" }],
      }),
      l(
        "prompt bắt buộc; n là số nguyên 1–4. size tùy chọn; không tự giả định mọi kích thước/quality được hỗ trợ. Xử lý data[].b64_json hoặc data[].url theo response_format/cấu hình. Đây là kết quả ảnh trực tiếp khi stream=false, không phải task ID của PPT/PSD. Không ghi base64 vào log; xác minh MIME khi lưu/hiển thị. Kết quả có thể không đủ n ảnh: xử lý rõ trường hợp thiếu hoặc lỗi.",
        "prompt 必填；n 为 1–4 的整数。size 可选，不假设任意尺寸或 quality 都受支持。按 response_format/配置处理 data[].b64_json 或 data[].url。stream=false 时返回图片结果，不是 PPT/PSD 的任务 ID。不要记录 base64 日志；保存或显示时核实 MIME。结果可能少于 n 张，需明确处理缺失与失败。",
      ),
      "### POST /v1/images/edits",
      l(
        "Ưu tiên multipart/form-data với image (tệp), prompt, model=gpt-image-2, n=1 và stream=false. Endpoint cũng nhận JSON chứa tham chiếu ảnh; xác minh định dạng nếu dùng. Không tự đặt Content-Type cho FormData.",
        "优先使用 multipart/form-data：image 文件、prompt、model=gpt-image-2、n=1、stream=false。也支持含图片引用的 JSON，使用前确认具体格式。FormData 不手动设置 Content-Type。",
      ),
      fenced(
        "bash",
        'curl "$CHATGPT2API_BASE_URL/images/edits" \\\n  -H "Authorization: Bearer $CHATGPT2API_API_KEY" \\\n  -F "model=gpt-image-2" -F "n=1" -F "stream=false" \\\n  -F "prompt=Change the background to blue" -F "image=@./input.png"',
      ),
      l(
        "Kết quả giống endpoint tạo ảnh. Máy chủ giới hạn mỗi ảnh tham chiếu ở 50 MiB; proxy hoặc môi trường triển khai có thể đặt giới hạn thấp hơn.",
        "返回结构与生图接口相同。服务端每张参考图上限为 50 MiB，代理或部署环境可能限制更低。",
      ),
      "### POST /v1/search",
      json({ prompt: "Find documentation for chatgpt2api" }),
      json({
        answer: "Example answer",
        sources: [{ title: "Example source", url: "https://example.com" }],
      }),
      l(
        "Hiển thị answer và sources nếu có; kiểm tra cấu trúc phản hồi thực tế. Không đưa trường nội bộ như _account_email vào giao diện người dùng hoặc log công khai.",
        "显示 answer 和可用的 sources，并检查实际响应结构。不向终端用户或公开日志暴露 _account_email 等内部字段。",
      ),
      "### POST /v1/ppt/generations · POST /v1/psd/generations",
      json({
        prompt: "Create a quarterly report presentation",
        base64_images: [],
        client_task_id: "unique-id-for-this-logical-job",
      }),
      json({
        id: "unique-id-for-this-logical-job",
        taskId: "unique-id-for-this-logical-job",
        kind: "ppt",
        status: "queued",
      }),
      l(
        "Ví dụ trên dành cho PPT. Với PSD, base64_images phải có ít nhất một ảnh base64/data URL hợp lệ. Lưu client_task_id trước khi gửi; nếu thử lại cùng một tác vụ, dùng lại ID đó. Tác vụ mới phải dùng ID mới, kể cả khi đổi giữa PPT và PSD. Không coi phản hồi queued là hoàn tất.",
        "以上示例用于 PPT。PSD 的 base64_images 至少包含一张有效的 base64/data URL 图片。发送前保存 client_task_id；重试同一个逻辑任务时复用该 ID。新任务必须换 ID，包括 PPT 与 PSD 之间切换。queued 不代表完成。",
      ),
      "### GET /v1/editable-file-tasks?ids=<task_id>",
      json({
        items: [
          {
            id: "task_example",
            taskId: "task_example",
            kind: "ppt",
            status: "success",
            result: {
              primary_url: `${urls.service}/files/example/result.pptx`,
              zip_url: `${urls.service}/files/example/assets.zip`,
            },
          },
        ],
        missing_ids: [],
      }),
      l(
        "Dùng cùng danh tính/khóa để gửi và tra cứu. Poll có khoảng nghỉ (đề xuất 2 giây, không phải quy định API), giới hạn tổng thời gian và cho phép dừng. queued/running: tiếp tục chờ; success: lấy result.primary_url và result.zip_url; error: hiển thị error rồi dừng. Nếu missing_ids có ID cần tìm, dừng và báo không tìm thấy/khác danh tính; không tự gửi lại tác vụ mới.",
        "提交和查询使用同一身份/密钥。有间隔地轮询（建议 2 秒，不是 API 规定），限制总等待时间并允许停止。queued/running 继续等待；success 获取 result.primary_url 和 result.zip_url；error 显示 error 并停止。若 missing_ids 包含目标 ID，停止并报告不存在或身份不一致，不自动提交新任务。",
      ),
      "### GET /files/{file_path}",
      l(
        "Dùng URL trả về trong result, không tự ghép đường dẫn tệp. Endpoint tải tệp hiện không yêu cầu Bearer; coi URL kết quả là thông tin cần bảo vệ. Không gửi API key đến host lưu trữ bên ngoài. Dừng poll/abort phía client không đồng nghĩa hủy tác vụ đang chạy trên máy chủ; không bịa endpoint cancel.",
        "使用 result 返回的 URL，不自行拼接文件路径。文件下载接口当前不要求 Bearer，应保护结果 URL。不要把 API Key 发给外部存储主机。停止轮询或客户端 abort 不等于取消服务端任务；不要虚构 cancel 接口。",
      ),
    ].join("\n\n"),
  );

  add(
    l("4. Ví dụ Node.js: gọi từ backend", "4. Node.js 后端调用示例"),
    [
      l(
        "Mẫu JavaScript dùng fetch tích hợp sẵn và biến môi trường. Điều chỉnh cho framework của app, không chuyển khóa ra trình duyệt. Không tự chạy yêu cầu sinh nội dung trong quá trình kiểm thử nếu chưa được phép.",
        "JavaScript 示例使用内置 fetch 与环境变量。按应用框架调整，不将密钥传给浏览器。未经允许，测试时不要实际发起内容生成请求。",
      ),
      fenced(
        "javascript",
        `const baseURL = process.env.CHATGPT2API_BASE_URL?.replace(/\\/+$/, "");
const apiKey = process.env.CHATGPT2API_API_KEY;
if (!baseURL || !apiKey || apiKey === "YOUR_API_KEY") {
  throw new Error("Configure CHATGPT2API_BASE_URL and CHATGPT2API_API_KEY on the server");
}
const timeoutMs = Number(process.env.CHATGPT2API_TIMEOUT_MS || 180000);
if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) throw new Error("Invalid timeout");

async function callApi(path, body) {
  const response = await fetch(baseURL + path, {
    method: body === undefined ? "GET" : "POST",
    headers: {
      Authorization: "Bearer " + apiKey,
      "Accept-Language": "${locale}",
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    signal: AbortSignal.timeout(timeoutMs),
  });
  const raw = await response.text();
  let data;
  try { data = JSON.parse(raw); } catch { data = null; }
  if (!response.ok) {
    const message = data?.error?.message || data?.detail?.error || "API request failed";
    const error = new Error(String(message));
    error.status = response.status;
    throw error;
  }
  if (!data) throw new Error("Expected a JSON response");
  return data;
}

// Read-only connection check:
const models = await callApi("/models");
// Only run generation after the user requests it:
async function chat(messages) {
  const data = await callApi("/chat/completions", {
    model: "auto", messages, stream: false,
  });
  const content = data.choices?.[0]?.message?.content;
  if (typeof content !== "string") throw new Error("Missing assistant content");
  return content;
}`,
      ),
    ].join("\n\n"),
  );

  add(
    l("5. Streaming và trạng thái giao diện", "5. 流式输出与界面状态"),
    l(
      "Bắt đầu bằng stream=false. Khi app cần streaming, dùng stream=true cho chat/responses và đọc text/event-stream bằng SSE parser, không gọi response.json(). Bộ đọc phải ghép chunk và xử lý nhiều event trong một chunk, CRLF/LF, UTF-8 bị chia nhỏ, keep-alive và lỗi giữa luồng. Chat: nối choices[].delta.content; xử lý finish_reason và [DONE]. Responses: đọc type=response.output_text.delta và delta; type=response.completed chứa response cuối. Hai định dạng không thay thế cho nhau. Với ảnh, chưa bật streaming nếu chưa kiểm tra schema event riêng. Luôn có trạng thái loading/error/empty/success, cho phép ngừng chờ và không giữ UI ở loading vô hạn.",
      "先实现 stream=false。应用需要流式输出时，为 chat/responses 使用 stream=true，以 SSE parser 读取 text/event-stream，不调用 response.json()。解析器需处理跨 chunk 数据、单 chunk 多事件、CRLF/LF、分段 UTF-8、keep-alive 和流中错误。Chat 拼接 choices[].delta.content，处理 finish_reason 和 [DONE]。Responses 读取 type=response.output_text.delta 的 delta，type=response.completed 包含最终 response；两种格式不可混用。图片流式输出需先验证专用事件格式。提供 loading/error/empty/success 状态，允许停止等待，避免无限 loading。",
    ),
  );

  add(
    l("6. Lỗi, timeout và retry", "6. 错误、超时与重试"),
    [
      json({
        error: {
          message: "Example error",
          type: "invalid_request_error",
          param: null,
          code: "bad_request",
        },
      }),
      l(
        "Đọc HTTP status và error.message; dự phòng detail/error nếu proxy hoặc upstream trả cấu trúc khác. Không dựa vào câu lỗi tiếng Việt/Trung để quyết định logic. 400/422: sửa payload, không retry mù; 401: kiểm tra khóa; 403: kiểm tra quyền/chính sách; 429: có thể hết hạn mức, tôn trọng Retry-After nếu có, không retry liên tục; 5xx/lỗi mạng: báo rõ và giới hạn retry. Chỉ tự retry các thao tác đọc an toàn với backoff. Không tự retry POST tạo ảnh/chat sau timeout vì tác vụ có thể vẫn chạy và tiêu tốn hạn mức. Riêng PPT/PSD có client_task_id để tra cứu/tiếp tục cùng tác vụ. Timeout client không chứng minh server đã hủy xử lý. Thông báo cho người dùng phải lọc khóa và chi tiết nội bộ.",
        "根据 HTTP status 与 error.message 处理；代理或上游可能返回 detail/error 等其他结构。不要依赖越南语/中文错误文案判断逻辑。400/422 修正 payload，不盲目重试；401 检查密钥；403 检查权限或策略；429 可能额度耗尽，若有 Retry-After 则遵守，不连续重试；5xx/网络错误需明确报告并限制重试。只对安全的读取操作自动退避重试。图片/对话 POST 超时后不要自动重发，任务可能仍运行并消耗额度。PPT/PSD 可通过 client_task_id 查询或继续同一任务。客户端超时不代表服务端已取消处理。向用户显示错误前过滤密钥和内部细节。",
      ),
    ].join("\n\n"),
  );

  add(
    l("7. Checklist nghiệm thu và bàn giao", "7. 验收与交付清单"),
    l(
      "- [ ] Đọc repo và thống nhất chức năng trước khi sửa; giữ thay đổi không liên quan của người dùng.\n- [ ] Base URL đúng môi trường, không lặp /v1; khóa chỉ có ở server/secret store; .env thật không vào git.\n- [ ] Kiểm tra /models, thiếu cấu hình, khóa sai, 400/422, 429, 5xx, lỗi mạng và timeout bằng mock.\n- [ ] Có test ánh xạ JSON, SSE nếu dùng, ảnh b64_json/url, PPT/PSD queued → running → success/error và missing_ids.\n- [ ] Không lộ khóa, _account_email hay nội dung nhạy cảm trong log/UI.\n- [ ] Mặc định không chạy thử tạo ảnh/tài liệu thật để tránh tiêu tốn hạn mức; xin phép trước.\n- [ ] Chạy typecheck/test/build theo repo; báo rõ kiểm tra nào đã chạy và chưa chạy.\n- [ ] Bàn giao tệp đã sửa, biến môi trường, cách chạy, ví dụ sử dụng và hạn chế còn lại; không khẳng định tích hợp hoạt động nếu chưa kiểm chứng.",
      "- [ ] 修改前阅读仓库并确认功能，保留用户无关改动。\n- [ ] Base URL 与环境匹配，不重复 /v1；密钥仅在服务端/secret store；真实 .env 不提交 git。\n- [ ] 用 mock 测试 /models、缺少配置、错误密钥、400/422、429、5xx、网络错误和超时。\n- [ ] 测试 JSON 映射、所用 SSE、b64_json/url、PPT/PSD queued → running → success/error 与 missing_ids。\n- [ ] 日志/UI 不暴露密钥、_account_email 或敏感内容。\n- [ ] 默认不实际生成图片或文件，避免消耗额度；先获得许可。\n- [ ] 按仓库规范运行 typecheck/test/build，说明哪些已执行、哪些未执行。\n- [ ] 交付修改文件、环境变量、运行方式、示例和限制；未经验证不声称集成成功。",
    ),
  );
  return sections.join("\n\n") + "\n";
}
