# Song ngữ Trung - Việt cho ChatGPT2API

## Mục tiêu

Thêm lựa chọn ngôn ngữ `zh-CN` và `vi-VN` cho toàn bộ giao diện web và các thông báo lỗi do backend tạo ra. Ứng dụng dùng ngôn ngữ trình duyệt cho người dùng mới, nhưng ưu tiên lựa chọn đã lưu sau khi người dùng tự đổi ngôn ngữ.

Thay đổi không được làm thay đổi API fields, trạng thái dữ liệu lưu trữ, tên model, nội dung prompt hoặc định dạng lỗi tương thích OpenAI/Anthropic.

## Phạm vi

- Dịch toàn bộ chuỗi người dùng nhìn thấy của frontend: trang đăng nhập, điều hướng, account, tạo và quản lý ảnh, logs, settings, debug, dialog, toast, placeholders và aria labels.
- Dịch các lỗi/thông báo do backend chủ động tạo cho hai locale.
- Giữ nguyên lỗi kỹ thuật từ upstream để không mất thông tin chẩn đoán.
- Chuẩn hóa cách hiển thị các trạng thái backend hiện có, ví dụ `正常`, `限流`, `异常`, `禁用`, ở frontend mà không đổi dữ liệu API.

Không bao gồm dịch README, tài liệu triển khai, tên endpoint, request/response field hay prompt/dữ liệu do người dùng gửi.

## Kiến trúc frontend

Tạo module i18n nội bộ, không bổ sung dependency. Nó gồm:

- Kiểu `Locale` giới hạn `zh-CN` và `vi-VN`.
- Hai dictionary cùng schema: `web/src/i18n/messages/zh-CN.ts` và `web/src/i18n/messages/vi-VN.ts`.
- Hàm `t(key, params?)` có type-safe key và interpolation cho các thông báo có biến.
- `I18nProvider` client-side cung cấp locale, translator và thao tác đổi locale.
- Storage riêng cho preference locale, tách khỏi dữ liệu xác thực.

Provider xác định locale theo thứ tự:

1. Locale người dùng đã lưu.
2. `navigator.languages` hoặc `navigator.language`, map các biến thể tiếng Việt sang `vi-VN`; các giá trị khác dùng `zh-CN`.
3. `zh-CN` nếu browser không cung cấp giá trị hợp lệ.

`RootLayout` bọc ứng dụng bằng provider. Provider đồng bộ `document.documentElement.lang`, để các component truy xuất locale qua hook `useI18n()`, và cung cấp `formatDate` dựa vào locale đang chọn.

Mọi chuỗi giao diện phải được React render qua `t(...)` hoặc helper dịch thuần. Provider **không được** dùng `MutationObserver`, `node.data`, `setAttribute` hay bất kỳ thao tác nào khác để quét và sửa DOM sau khi React render. Điều này giữ nguyên quyền sở hữu DOM của React, tránh lỗi reconciliation khi component thay đổi trạng thái (ví dụ nút OAuth đổi icon thành loading).

Thành phần chọn ngôn ngữ xuất hiện trong `HeaderActions`, nên có mặt ở login và thanh điều hướng. Nhãn hiển thị là `中文` và `Tiếng Việt`; đổi ngôn ngữ có hiệu lực lập tức và được lưu cho phiên sau.

## Luồng request và backend

Axios interceptor đọc locale hiện tại từ storage/context frontend và thêm header chuẩn `Accept-Language` với `vi-VN` hoặc `zh-CN` vào mọi request, trừ khi caller đã đặt header riêng.

Backend thêm middleware xác định locale từ `Accept-Language`, chuẩn hóa về `vi-VN` hoặc `zh-CN`, rồi lưu trong `ContextVar` theo request. Module i18n backend có:

- `translate(key, **params)` trả về câu phù hợp với locale của request.
- Hai dictionary có cùng key cho tiếng Trung và tiếng Việt.
- Fallback an toàn sang tiếng Trung khi thiếu key hoặc request ngoài ngữ cảnh HTTP.

Các lỗi chủ động tạo từ route, service và validation sẽ chuyển dần từ string literal sang message key. Error handler hiện có tiếp tục quyết định envelope JSON cho OpenAI, Anthropic và API dashboard; chỉ nội dung `detail.error`/`message` thay đổi theo locale. Chuỗi trả về từ upstream không được dịch hoặc biến đổi.

## Tương thích và xử lý lỗi

- `Accept-Language` là bổ sung tương thích ngược; client cũ không gửi header tiếp tục nhận tiếng Trung.
- Không đổi status code, tên field hay cấu trúc response hiện hữu.
- Nếu dictionary frontend thiếu key, hiển thị key hoặc fallback tiếng Trung trong development để phát hiện thiếu bản dịch; production fallback tiếng Trung để không chặn thao tác.
- Các trường trạng thái backend vẫn giữ giá trị gốc; frontend map giá trị không xác định thành nhãn gốc thay vì làm hỏng UI.
- Các thông báo lỗi include chi tiết kỹ thuật chỉ dịch phần tiền tố do ứng dụng tạo, giữ nguyên status/code/chi tiết upstream.

## Dialog nhập tài khoản

Dialog nhập tài khoản có bố cục cột với chiều cao tối đa theo viewport. Header và footer luôn nằm trong dialog; phần thân là vùng `overflow-y-auto` duy nhất. Footer chứa nút hủy và thao tác chính, không bị che bởi nội dung dài như URL OAuth hoặc textarea callback. Bố cục phải hoạt động ở màn hình thấp và khi DevTools làm hẹp viewport.

## Kiểm thử

- Unit test frontend: nhận diện locale browser, ưu tiên stored preference, lưu locale khi đổi, fallback dictionary và formatting ngày giờ.
- Unit test request: Axios thêm `Accept-Language` đúng và không ghi đè header caller đặt rõ ràng.
- Unit test backend: parser header, fallback locale, lỗi đại diện (`invalid key`, `admin required`, `not found`, validation) ở cả hai ngôn ngữ.
- Regression test: envelope lỗi OpenAI và Anthropic giữ nguyên schema/status code.
- Smoke test UI: login hiển thị được cả hai ngôn ngữ, bộ chọn đổi ngôn ngữ không mất session.
- Smoke test OAuth dialog: khi URL ủy quyền và callback dài, nội dung cuộn được và nút `Hoàn tất nhập` vẫn luôn truy cập được.
- Regression test: bấm `Mở trang ủy quyền` khi locale là tiếng Việt không tạo lỗi `insertBefore`/`NotFoundError`.
- Chạy type-check/lint hoặc Next build, Python tests phù hợp và kiểm tra các chuỗi người dùng còn hard-code.

## Tiêu chí hoàn thành

1. Người dùng mới dùng tiếng Việt nếu browser ưu tiên tiếng Việt; ngược lại dùng tiếng Trung.
2. Người dùng có thể đổi Trung/Việt ở login và sau khi đăng nhập; lựa chọn được giữ qua reload.
3. Toàn bộ chuỗi UI và toast do frontend tạo có bản dịch cho hai ngôn ngữ.
4. Các thông báo backend chủ động tạo trả đúng ngôn ngữ theo `Accept-Language` mà vẫn giữ API contract.
5. Tên model, payload API, dữ liệu và lỗi upstream không bị thay đổi ngoài phần localization do ứng dụng sở hữu.
