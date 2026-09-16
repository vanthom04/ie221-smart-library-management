import asyncio
from app.db.session import AsyncSessionLocal
from app.models.category import Category
from app.models.publisher import Publisher
from app.models.author import Author
from app.models.book import Book


async def seed_data():
    print("⏳ Đang kết nối Database và bơm dữ liệu...")

    # Mở một phiên làm việc (session) bất đồng bộ với Database
    async with AsyncSessionLocal() as session:
        try:
            # 1. Tạo dữ liệu Danh mục (Categories)
            cat_it = Category(name="Khoa học máy tính", description="Sách lập trình, thuật toán và AI")
            cat_psy = Category(name="Tâm lý học", description="Sách tâm lý học hành vi và nhận thức")
            cat_fic = Category(name="Tiểu thuyết", description="Sách văn học, tiểu thuyết hư cấu")

            session.add_all([cat_it, cat_psy, cat_fic])
            await session.commit()  # Lưu để lấy ID

            # 2. Tạo dữ liệu Nhà xuất bản (Publishers)
            pub_tre = Publisher(name="NXB Trẻ")
            pub_kd = Publisher(name="NXB Kim Đồng")
            pub_khoahoc = Publisher(name="NXB Khoa học Kỹ thuật")

            session.add_all([pub_tre, pub_kd, pub_khoahoc])
            await session.commit()

            # 3. Tạo dữ liệu Tác giả (Authors)
            auth_martin = Author(name="Robert C. Martin", bio="Kỹ sư phần mềm nổi tiếng, tác giả Clean Code")
            auth_kahneman = Author(name="Daniel Kahneman", bio="Nhà tâm lý học đoạt giải Nobel Kinh tế")
            auth_nna = Author(name="Nguyễn Nhật Ánh", bio="Nhà văn nổi tiếng của Việt Nam")

            session.add_all([auth_martin, auth_kahneman, auth_nna])
            await session.commit()

            # 4. Tạo dữ liệu Sách (Books)
            books = [
                Book(
                    title="Clean Code: A Handbook of Agile Software Craftsmanship",
                    description="Cuốn sách gối đầu giường cho mọi lập trình viên muốn viết code sạch.",
                    category_id=cat_it.id,
                    publisher_id=pub_khoahoc.id,
                    author_id=auth_martin.id
                ),
                Book(
                    title="Thinking, Fast and Slow",
                    description="Khám phá hai hệ thống tư duy chi phối quyết định của chúng ta.",
                    category_id=cat_psy.id,
                    publisher_id=pub_tre.id,
                    author_id=auth_kahneman.id
                ),
                Book(
                    title="Cho tôi xin một vé đi tuổi thơ",
                    description="Truyện ngắn về tuổi thơ đong đầy kỷ niệm.",
                    category_id=cat_fic.id,
                    publisher_id=pub_tre.id,
                    author_id=auth_nna.id
                ),
                Book(
                    title="The Clean Coder",
                    description="Quy tắc ứng xử dành cho lập trình viên chuyên nghiệp.",
                    category_id=cat_it.id,
                    publisher_id=pub_khoahoc.id,
                    author_id=auth_martin.id
                )
            ]

            session.add_all(books)
            await session.commit()

            print("✅ Bơm dữ liệu thành công! Hãy vào Neon hoặc API để kiểm tra.")

        except Exception as e:
            await session.rollback()
            print(f"❌ Có lỗi xảy ra: {e}")


if __name__ == "__main__":
    # Chạy hàm async
    asyncio.run(seed_data())