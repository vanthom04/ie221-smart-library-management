# BẢNG KHAI BÁO SỬ DỤNG TRÍ TUỆ NHÂN TẠO (AI DISCLOSURE)

## 1. THÔNG TIN CHUNG

- **Môn học:** Kỹ thuật lập trình Python (IE221)
- **Giảng viên hướng dẫn:** ThS. Nghi Hoàng Khoa
- **Tên đồ án:** Hệ Thống Quản Lý Thư Viện & Mượn Trả Sách Thông Minh
- **Nhóm thực hiện:** Nhóm 11

### Danh sách thành viên và Phân công công việc

| STT | Họ và tên       | MSSV     | Phụ trách chính      | Chi tiết công việc                                                                                                  | Tỷ lệ đóng góp |
| :-: | --------------- | -------- | -------------------- | ------------------------------------------------------------------------------------------------------------------- | :------------: |
|  1  | Trần Ngọc Tâm   | 25410300 | Book Catalog         | Quản lý sách, tác giả, thể loại, nhà xuất bản; CRUD và tích hợp giao diện danh mục, thuyết trình                    |      100%      |
|  2  | Hồ Thiên Phúc   | 25410284 | Dashboard Admin/User | Dashboard độc giả/admin, thống kê, thiết kế slide, Quay video demo                                                  |      100%      |
|  3  | Chu Văn Thơm    | 25410314 | IAM & Infrastructure | Xác thực, phân quyền, refresh token, setup và cấu hình dự án, tích hợp và hạ tầng, tổng hợp báo cáo, thiết kế slide |      100%      |
|  4  | Trần Bình Trọng | 25410324 | Borrowing Core       | Đặt trước, duyệt, mượn, trả, gia hạn, cập nhật tồn kho                                                              |      100%      |
|  5  | Lê Thanh Quốc   | 25410289 | AI & Recommendation  | AI embedding, semantic search, recommendation, thuyết trình                                                         |      100%      |

---

## 2. DỤNG CỤ &amp; MÔ HÌNH AI SỬ DỤNG

- **Công cụ AI:** Claude, ChatGPT/Codex, Gemini/Antigravity
- **Phạm vi hỗ trợ:** Gợi ý setup project, code, thiết kế CSDL, Thiết kế UI Web, viết tài liệu Markdown...

---

## 3. CÁC CÂU LỆNH (PROMPTS) VÀ KỸ NĂNG ÁP DỤNG

| STT | Tác vụ                              | Prompt đã dùng                                                                                                                                        | Công cụ           |
| :-: | :---------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------- |
|  1  | **Setup project**                   | Hỗ trợ khởi tạo và cấu hình dự án theo yêu cầu, công nghệ và cấu trúc source code đã thống nhất.                                                      | Claude            |
|  2  | **Thiết kế CSDL**                   | Phân tích yêu cầu và đề xuất CSDL phù hợp                                                                                                             | Claude            |
|  3  | **Phân tích source code & README**  | Phân tích source code hiện tại, đối chiếu chức năng thực tế và cập nhật README phù hợp với kiến trúc, công nghệ và trạng thái dự án.                  | Antigravity/Codex |
|  4  | **Borrowing Core**                  | Phân tích kiến trúc FastAPI/React hiện có; hỗ trợ triển khai và kiểm thử luồng đặt trước, duyệt, mượn, trả, gia hạn và database transaction           | ChatGPT           |
|  5  | **AI Search & Recommendation**      | Phân tích cách triển khai tìm kiếm ngữ nghĩa và gợi ý sách; giải thích embedding, cosine similarity, xếp hạng kết quả và hạn chế của semantic search. | ChatGPT           |
|  6  | **UI**                              | Dùng ChatGPT generate UI web, sau đó dùng Claude và ChatGPT để hỗ trợ sinh code UI từ hình ảnh                                                        | ChatGPT/Claude    |
|  7  | **Báo cáo & thuyết trình**          | Tổng hợp chức năng thực tế từ source code để xây dựng nội dung báo cáo, bố cục slide.                                                                 | ChatGPT           |
|  8  | **Hoàn thiện tài liệu & docstring** | Hỗ trợ chuẩn hóa docstring cho các class/function quan trọng và rà soát tài liệu bàn giao dựa trên source code hiện có.                               | ChatGPT           |
