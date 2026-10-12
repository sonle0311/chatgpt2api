const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");

// Compile the actual TS/TSX sources in memory: no generated files or browser required.
const root = path.resolve(__dirname, "../src");
const cache = new Map();
function loadSource(name) {
  const base = path.resolve(root, name);
  const file = [base, `${base}.ts`, `${base}.tsx`, `${base}/index.tsx`].find(
    (p) => fs.existsSync(p) && fs.statSync(p).isFile(),
  );
  assert.ok(file, `Cannot resolve ${name}`);
  if (cache.has(file)) return cache.get(file).exports;
  const module = { exports: {} };
  cache.set(file, module);
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    fileName: file,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  }).outputText;
  const localRequire = (spec) =>
    spec.startsWith("@/")
      ? loadSource(spec.slice(2))
      : spec.startsWith(".")
        ? loadSource(path.resolve(path.dirname(file), spec))
        : require(spec);
  vm.runInThisContext(`(function(exports, require, module) { ${code}\n})`, {
    filename: file,
  })(module.exports, localRequire, module);
  return module.exports;
}
const i18n = loadSource("i18n");
const han = /\p{Script=Han}/u;
const sourceFiles = [];
function walk(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (item.name !== "i18n") walk(file);
    } else if (/\.tsx?$/.test(file)) sourceFiles.push(file);
  }
}
walk(root);

test("all literal UI translation keys have complete Vietnamese translations", () => {
  const missing = [];
  for (const file of sourceFiles) {
    const source = ts.createSourceFile(
      file,
      fs.readFileSync(file, "utf8"),
      99,
      true,
      file.endsWith("tsx") ? 4 : 3,
    );
    function visit(node) {
      if (
        ts.isCallExpression(node) &&
        /^(text|translate|translateUi)$/.test(
          node.expression.getText(source),
        ) &&
        node.arguments[0] &&
        ts.isStringLiteralLike(node.arguments[0])
      ) {
        const key = node.arguments[0].text;
        if (han.test(i18n.translateVisibleText(key, "vi-VN")))
          missing.push(`${path.relative(root, file)}: ${key}`);
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
  assert.deepEqual(missing, []);
});

test("UI source does not add untranslated Chinese JSX, placeholders or labels", () => {
  const missing = [];
  for (const file of sourceFiles) {
    const source = ts.createSourceFile(
      file,
      fs.readFileSync(file, "utf8"),
      99,
      true,
      file.endsWith("tsx") ? 4 : 3,
    );
    function localized(node) {
      for (let parent = node.parent; parent; parent = parent.parent) {
        if (
          ts.isConditionalExpression(parent) &&
          /^(vi|isVi)$|locale/.test(parent.condition.getText(source))
        )
          return true;
        if (
          ts.isJsxElement(parent) &&
          parent.openingElement.tagName.getText(source) === "LocalizedText"
        )
          return true;
      }
      return false;
    }
    function visit(node) {
      const rawText = ts.isJsxText(node) && han.test(node.text);
      const rawAttribute =
        ts.isJsxAttribute(node) &&
        /^(title|placeholder|aria-label|alt|label|description)$/.test(
          node.name.text,
        ) &&
        node.initializer &&
        ts.isStringLiteral(node.initializer) &&
        han.test(node.initializer.text);
      if ((rawText || rawAttribute) && !localized(node))
        missing.push(
          `${path.relative(root, file)}:${source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1}`,
        );
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
  assert.deepEqual(missing, []);
});

test("formatting preserves user data and Chinese remains available", () => {
  const filename = "用户照片-$&-{1}.png";
  assert.equal(
    i18n.formatMessage("移除 {0}", "vi-VN", [filename]),
    `Xóa ${filename}`,
  );
  assert.equal(i18n.formatMessage("第 {0} 轮", "zh-CN", [2]), "第 2 轮");
  assert.equal(
    i18n.translateVisibleText("用户自己写的图片内容", "vi-VN"),
    "用户自己写的图片内容",
  );
  assert.equal(i18n.translateVisibleText("取消", "vi-VN"), "Hủy");
});

test("Vietnamese default ignores browser language; stored manual selection is honored", () => {
  global.window = { localStorage: { getItem: () => null } };
  assert.equal(i18n.getCurrentLocale(), "vi-VN");
  window.localStorage.getItem = () => "zh-CN";
  assert.equal(i18n.getCurrentLocale(), "zh-CN");
  window.localStorage.getItem = () => "vi-VN";
  assert.equal(i18n.getCurrentLocale(), "vi-VN");
  window.localStorage.getItem = () => {
    throw new Error("storage unavailable");
  };
  assert.equal(i18n.getCurrentLocale(), "vi-VN");
  delete global.window;
});

test("API requests default to Vietnamese and preserve an explicit language header", async () => {
  const { request } = loadSource("lib/request");
  const adapter = async (config) => ({
    data: config.headers.get("Accept-Language"),
    status: 200,
    statusText: "OK",
    headers: {},
    config,
  });
  assert.equal((await request.get("/test", { adapter })).data, "vi-VN");
  assert.equal(
    (
      await request.get("/test", {
        adapter,
        headers: { "Accept-Language": "zh-CN" },
      })
    ).data,
    "zh-CN",
  );
});

test("timeout actions recognize Vietnamese, Chinese and English errors", () => {
  const { isImageTimeoutError } = loadSource("lib/image-error");
  for (const message of [
    "生图超时",
    "Hết thời gian chờ",
    "Tạo ảnh quá hạn",
    "Image generation timed out",
    "timeout",
  ])
    assert.equal(isImageTimeoutError(message), true);
  assert.equal(isImageTimeoutError("Không đủ hạn mức"), false);
});

test("translation placeholders are preserved and catalog values contain no Chinese", () => {
  for (const name of ["i18n/index.tsx", "i18n/vi-extra.ts"]) {
    const source = ts.createSourceFile(
      name,
      fs.readFileSync(path.join(root, name), "utf8"),
      99,
      true,
      4,
    );
    function visit(node) {
      if (
        ts.isVariableDeclaration(node) &&
        ["vietnameseText", "vietnameseExtra"].includes(
          node.name.getText(source),
        )
      ) {
        for (const prop of node.initializer.properties) {
          const key = prop.name.text,
            value = prop.initializer.text;
          assert.equal(
            han.test(value),
            false,
            `Translation contains Chinese: ${key}`,
          );
          assert.deepEqual(
            (key.match(/\{\d+\}/g) || []).sort(),
            (value.match(/\{\d+\}/g) || []).sort(),
            `Missing placeholder: ${key}`,
          );
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
});

const render = (Component, props = {}, locale = "vi-VN") =>
  renderToStaticMarkup(
    React.createElement(
      i18n.I18nProvider,
      { initialLocale: locale },
      React.createElement(Component, props),
    ),
  );

test("agent guide is complete, localized and uses the actual service URL", () => {
  const { buildAgentIntegrationGuide } = loadSource(
    "lib/agent-integration-guide",
  );
  const vi = buildAgentIntegrationGuide("https://api.example.test/", "vi-VN");
  const zh = buildAgentIntegrationGuide("https://api.example.test/", "zh-CN");
  assert.equal(han.test(vi), false);
  assert.ok(han.test(zh));
  for (const guide of [vi, zh]) {
    for (const expected of [
      "https://api.example.test/v1",
      "/openapi.json",
      "YOUR_API_KEY",
      "CHATGPT2API_API_KEY",
      "Authorization: Bearer",
      "client_task_id",
      "missing_ids",
      "response.output_text.delta",
      "[DONE]",
      "429",
      "Retry-After",
      "b64_json",
    ])
      assert.ok(guide.includes(expected), expected);
    assert.ok(guide.includes("- [ ]"));
    assert.equal(
      (guide.match(/^```/gm) || []).length % 2,
      0,
      "Balanced Markdown fences",
    );
  }
  assert.ok(vi.includes("Accept-Language: vi-VN"));
  assert.ok(zh.includes("Accept-Language: zh-CN"));
  const code = vi.match(/```javascript\n([\s\S]*?)\n```/)[1];
  const parsed = ts.createSourceFile(
    "example.mjs",
    code,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.JS,
  );
  assert.deepEqual(parsed.parseDiagnostics, [], "Copied JavaScript must parse");
});

test("copied backend example runs with mocked HTTP and propagates API errors", async () => {
  const { buildAgentIntegrationGuide } = loadSource(
    "lib/agent-integration-guide",
  );
  const guide = buildAgentIntegrationGuide("https://api.example.test", "vi-VN");
  const code = guide.match(/```javascript\n([\s\S]*?)\n```/)[1];
  const calls = [];
  const replies = [
    { status: 200, body: { data: [{ id: "auto" }] } },
    {
      status: 200,
      body: { choices: [{ message: { content: "Test reply" } }] },
    },
    { status: 429, body: { error: { message: "Rate limited" } } },
    { status: 502, raw: "upstream unavailable" },
  ];
  const context = {
    process: {
      env: {
        CHATGPT2API_BASE_URL: "https://api.example.test/v1/",
        CHATGPT2API_API_KEY: "test-placeholder-not-a-real-key",
      },
    },
    AbortSignal,
    fetch: async (url, init) => {
      calls.push({ url, init });
      const reply = replies.shift();
      assert.ok(reply, "Must not retry generation requests automatically");
      return {
        ok: reply.status === 200,
        status: reply.status,
        text: async () => reply.raw ?? JSON.stringify(reply.body),
      };
    },
  };
  const client = await vm.runInNewContext(
    `(async () => { ${code}\nreturn { chat, models }; })()`,
    context,
  );
  assert.equal(
    calls.length,
    1,
    "Only the read-only model check runs on initialization",
  );
  assert.equal(calls[0].url, "https://api.example.test/v1/models");
  assert.equal(calls[0].init.method, "GET");
  assert.equal(
    await client.chat([{ role: "user", content: "Hello" }]),
    "Test reply",
  );
  assert.equal(calls[1].url, "https://api.example.test/v1/chat/completions");
  assert.equal(calls[1].init.headers["Accept-Language"], "vi-VN");
  assert.equal(JSON.parse(calls[1].init.body).stream, false);
  await assert.rejects(
    client.chat([]),
    (error) => error.status === 429 && error.message === "Rate limited",
  );
  await assert.rejects(
    client.chat([]),
    (error) => error.status === 502 && error.message === "API request failed",
  );
  assert.equal(calls.length, 4);
});

test("agent guide strips URL credentials and does not use the page auth key", () => {
  const { buildAgentIntegrationGuide } = loadSource(
    "lib/agent-integration-guide",
  );
  const guide = buildAgentIntegrationGuide(
    "https://secret-user:secret-pass@api.example.test/?token=private-token#private-fragment",
    "vi-VN",
  );
  for (const secret of [
    "secret-user",
    "secret-pass",
    "private-token",
    "private-fragment",
  ])
    assert.ok(!guide.includes(secret));
  assert.throws(() =>
    buildAgentIntegrationGuide("javascript:alert(1)", "vi-VN"),
  );
  assert.throws(() => buildAgentIntegrationGuide("", "vi-VN"));
  const component = fs.readFileSync(
    path.join(root, "components/agent-integration-guide.tsx"),
    "utf8",
  );
  assert.ok(
    !/getStoredAuth|authKey|showKey/.test(component),
    "Guide component must be independent of auth state",
  );
  assert.ok(component.includes("navigator.clipboard.writeText(guide)"));
});

test("documented agent endpoints exist in the backend", () => {
  const { buildAgentIntegrationGuide } = loadSource(
    "lib/agent-integration-guide",
  );
  const guide = buildAgentIntegrationGuide("https://api.example.test", "vi-VN");
  const backend = fs.readFileSync(
    path.resolve(root, "../../api/ai.py"),
    "utf8",
  );
  for (const endpoint of [
    "/v1/models",
    "/v1/chat/completions",
    "/v1/responses",
    "/v1/images/generations",
    "/v1/images/edits",
    "/v1/search",
    "/v1/ppt/generations",
    "/v1/psd/generations",
    "/v1/editable-file-tasks",
  ]) {
    assert.ok(guide.includes(endpoint), endpoint);
    assert.ok(backend.includes(`\"${endpoint}\"`), endpoint);
  }
});

test("agent guide preview and copy control render in both languages", () => {
  const { AgentIntegrationGuide } = loadSource(
    "components/agent-integration-guide",
  );
  const html = render(AgentIntegrationGuide, {
    serviceUrl: "https://api.example.test",
  });
  assert.ok(html.includes("Sao chép toàn bộ hướng dẫn"));
  assert.ok(html.includes("https://api.example.test/v1"));
  assert.ok(html.includes("YOUR_API_KEY"));
  assert.match(html, /<textarea\b[^>]*\breadonly=""/i);
  assert.equal(han.test(html), false);
  assert.ok(
    han.test(
      render(
        AgentIntegrationGuide,
        { serviceUrl: "https://api.example.test" },
        "zh-CN",
      ),
    ),
  );
  const empty = render(AgentIntegrationGuide, { serviceUrl: "" });
  assert.ok(empty.includes("disabled"));
  assert.ok(!empty.includes("<textarea"));
});

test("API URLs use the backend in development and current origin in production", () => {
  const { getApiUrls } = loadSource("lib/api-urls");
  assert.deepEqual(
    getApiUrls("http://127.0.0.1:8000/", "http://localhost:3000"),
    {
      service: "http://127.0.0.1:8000",
      openAI: "http://127.0.0.1:8000/v1",
      swagger: "http://127.0.0.1:8000/docs",
      schema: "http://127.0.0.1:8000/openapi.json",
    },
  );
  assert.equal(
    getApiUrls("", "https://api.example.test/").openAI,
    "https://api.example.test/v1",
  );
  assert.equal(getApiUrls("", "").openAI, "");
});

test("API docs show copy controls and backend docs links with placeholder credentials", () => {
  const config = loadSource("constants/common-env").default;
  const oldApiUrl = config.apiUrl;
  config.apiUrl = "http://127.0.0.1:8000";
  try {
    const { ApiDocsCard } = loadSource("app/settings/components/api-docs-card");
    const html = render(ApiDocsCard);
    assert.ok(html.includes('value="http://127.0.0.1:8000/v1"'));
    assert.ok(html.includes('href="http://127.0.0.1:8000/docs"'));
    assert.ok(html.includes('href="http://127.0.0.1:8000/openapi.json"'));
    for (const label of [
      "Sao chép Base URL",
      "Sao chép ví dụ",
      "Hiện API Key",
      "YOUR_API_KEY",
    ])
      assert.ok(html.includes(label));
    assert.equal(han.test(html), false);
  } finally {
    config.apiUrl = oldApiUrl;
  }
});

test("dedicated API docs page retains admin-only access", () => {
  const guard = loadSource("lib/use-auth-guard");
  const original = guard.useAuthGuard;
  const Page = loadSource("app/api-docs/page").default;
  try {
    for (const role of [null, "user", "admin"]) {
      guard.useAuthGuard = (roles) => {
        assert.deepEqual(roles, ["admin"]);
        return { isCheckingAuth: false, session: role ? { role } : null };
      };
      const html = render(Page);
      assert.equal(html.includes("Sao chép Base URL"), role === "admin");
    }
  } finally {
    guard.useAuthGuard = original;
  }
});

test("settings and debug screens render Vietnamese, with Chinese still selectable", () => {
  const { useSettingsStore } = loadSource("app/settings/store");
  // SSR uses Zustand's initial snapshot; seed only this isolated in-memory test module.
  const state = useSettingsStore.getInitialState();
  Object.assign(state, {
    isLoadingConfig: false,
    isLoadingPools: false,
    isLoadingBackups: false,
    config: {
      proxy_runtime: {
        enabled: false,
        egress_mode: "direct",
        reset_session_status_codes: [403],
        clearance: { mode: "none" },
      },
      backup: { include: {} },
      image_storage: {},
      ai_review: {},
    },
  });
  const cases = [
    [
      "app/settings/components/user-keys-card",
      "UserKeysCard",
      "Quản lý khóa người dùng",
    ],
    [
      "app/settings/components/sub2api-connections",
      "Sub2APIConnections",
      "Quản lý kết nối Sub2API",
    ],
    [
      "app/settings/components/proxy-settings",
      "ProxySettingsCard",
      "Cấu hình proxy upstream",
    ],
    [
      "app/settings/components/config-card",
      "ConfigCard",
      "Chu kỳ làm mới tài khoản",
    ],
    [
      "app/settings/components/proxy-runtime-card",
      "ProxyRuntimeCard",
      "Chế độ kết nối ra",
    ],
    [
      "app/settings/components/proxy-settings-card",
      "ProxySettingsCard",
      "Proxy toàn cục",
    ],
    [
      "app/settings/components/backup-settings-card",
      "BackupSettingsCard",
      "Quản lý sao lưu R2",
    ],
    [
      "app/settings/components/cpa-pools-card",
      "CPAPoolsCard",
      "Quản lý kết nối CPA",
    ],
    [
      "app/settings/components/api-docs-card",
      "ApiDocsCard",
      "Hướng dẫn kết nối API",
    ],
    ["app/debug/components/search-panel", "SearchPanel", "Tìm kiếm"],
    ["app/debug/components/chat-panel", "ChatPanel", "Mức suy luận"],
    ["app/debug/components/ppt-panel", "PptPanel", "PPT"],
    ["app/debug/components/psd-panel", "PsdPanel", "PSD"],
    [
      "app/debug/components/skill-panel",
      "SkillPanel",
      "Hướng dẫn cài đặt tiếng Việt",
    ],
  ];
  for (const [file, name, label] of cases) {
    const Component = loadSource(file)[name];
    assert.ok(Component, `${name} export`);
    const html = render(Component);
    const leftovers = html.match(/[\p{Script=Han}][^<]*/gu);
    assert.equal(leftovers, null, `${name}: ${leftovers?.join(" | ")}`);
    assert.ok(
      html.includes(label),
      `${name} must render real content, not just a loading spinner`,
    );
    assert.ok(
      han.test(render(Component, {}, "zh-CN")),
      `${name} Chinese locale`,
    );
  }
});

test("image progress and timeout controls render localized labels without changing prompts", () => {
  const { ImageResults } = loadSource("app/image/components/image-results");
  const props = {
    formatConversationTime: () => "10:00",
    selectedConversation: {
      id: "conversation",
      turns: [
        {
          id: "turn",
          mode: "generate",
          status: "generating",
          prompt: "USER_PROMPT",
          count: 1,
          ratio: "1:1",
          referenceImages: [],
          images: [
            {
              id: "image",
              status: "loading",
              progress: "getting_account",
              taskStatus: "running",
            },
          ],
        },
      ],
    },
  };
  let html = render(ImageResults, props);
  assert.equal(han.test(html), false);
  assert.ok(html.includes(i18n.translateVisibleText("确认可用账号", "vi-VN")));
  assert.ok(html.includes("Lượt 1"));
  assert.ok(render(ImageResults, props, "zh-CN").includes("确认可用账号"));
  const turn = props.selectedConversation.turns[0];
  turn.prompt = "用户照片与描述";
  turn.status = "error";
  turn.images = [
    {
      id: "image",
      taskId: "task",
      status: "error",
      error: "Hết thời gian chờ",
    },
  ];
  html = render(ImageResults, props);
  assert.ok(
    html.includes("用户照片与描述"),
    "User prompt must remain verbatim",
  );
  assert.ok(html.includes("Tiếp tục chờ"));
});
