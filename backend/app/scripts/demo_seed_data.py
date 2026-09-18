# ruff: noqa: E501
"""Dữ liệu mẫu phục vụ demo Smart Library.

Dữ liệu này chỉ nhằm mục đích demo chức năng, không phải metadata thư mục
chính thức của từng ấn bản sách.
"""

from __future__ import annotations

import os
from urllib.parse import quote_plus

from app.core.config import settings

DEMO_DEFAULT_PASSWORD = os.getenv("DEMO_DEFAULT_PASSWORD", "Demo123!@#")

DEMO_USERS = [
    {"full_name": "Quản trị viên Demo", "email": "demo.admin@example.com", "role": "admin"},
    {"full_name": "Nguyễn Minh Anh", "email": "demo.minhanh@example.com", "role": "user"},
    {"full_name": "Trần Gia Huy", "email": "demo.giahuy@example.com", "role": "user"},
]

CATEGORIES = [
    {
        "name": "Kỹ năng sống",
        "description": "Giao tiếp, thói quen, năng suất và phát triển bản thân.",
    },
    {
        "name": "Kinh tế - Quản trị",
        "description": "Kinh doanh, quản trị, tài chính, đầu tư và khởi nghiệp.",
    },
    {"name": "Văn học", "description": "Tiểu thuyết và tác phẩm văn học kinh điển, hiện đại."},
    {
        "name": "Khoa học - Công nghệ",
        "description": "Khoa học, lập trình, thuật toán và trí tuệ nhân tạo.",
    },
    {"name": "Lịch sử - Tiểu sử", "description": "Lịch sử, hồi ký và tiểu sử nhân vật."},
]

PUBLISHERS = [
    {"name": "NXB Trẻ", "address": "TP. Hồ Chí Minh"},
    {"name": "NXB Tổng hợp TP.HCM", "address": "TP. Hồ Chí Minh"},
    {"name": "NXB Thế Giới", "address": "Hà Nội"},
    {"name": "NXB Lao Động", "address": "Hà Nội"},
    {"name": "NXB Khoa học và Kỹ thuật", "address": "Hà Nội"},
    {"name": "NXB Văn Học", "address": "Hà Nội"},
]

AUTHORS = [
    {"name": "Dale Carnegie", "bio": "Tác giả về giao tiếp và phát triển bản thân."},
    {"name": "Stephen R. Covey", "bio": "Tác giả về hiệu quả cá nhân và lãnh đạo."},
    {"name": "James Clear", "bio": "Tác giả về thói quen và cải thiện bản thân."},
    {"name": "Cal Newport", "bio": "Tác giả về tập trung và năng suất."},
    {"name": "Jim Collins", "bio": "Tác giả và nhà nghiên cứu về quản trị."},
    {"name": "Eric Ries", "bio": "Tác giả về khởi nghiệp tinh gọn."},
    {"name": "Daniel Kahneman", "bio": "Tác giả về phán đoán và ra quyết định."},
    {"name": "Benjamin Graham", "bio": "Tác giả về đầu tư giá trị."},
    {"name": "Paulo Coelho", "bio": "Nhà văn Brazil."},
    {"name": "Haruki Murakami", "bio": "Nhà văn Nhật Bản."},
    {"name": "Ernest Hemingway", "bio": "Nhà văn Mỹ."},
    {"name": "Antoine de Saint-Exupéry", "bio": "Nhà văn và phi công người Pháp."},
    {"name": "Stephen Hawking", "bio": "Nhà vật lý lý thuyết và tác giả phổ biến khoa học."},
    {"name": "Robert C. Martin", "bio": "Tác giả về kỹ thuật phần mềm."},
    {"name": "Andrew Hunt", "bio": "Tác giả về nghề lập trình."},
    {"name": "David Thomas", "bio": "Tác giả về nghề lập trình."},
    {"name": "Stuart Russell", "bio": "Tác giả về trí tuệ nhân tạo."},
    {"name": "Peter Norvig", "bio": "Tác giả về trí tuệ nhân tạo."},
    {"name": "Yuval Noah Harari", "bio": "Tác giả về lịch sử và xã hội."},
    {"name": "Walter Isaacson", "bio": "Tác giả nhiều tác phẩm tiểu sử."},
]


def cover_url(text: str) -> str:
    return f"https://placehold.co/300x450/png?text={quote_plus(text)}"


BOOKS = [
    {
        "title": "Đắc Nhân Tâm",
        "isbn": "9786049000001",
        "description": "Các nguyên tắc giao tiếp, lắng nghe, thuyết phục và xây dựng quan hệ tích cực. Phù hợp với người muốn cải thiện cách ứng xử và tạo thiện cảm.",
        "category": "Kỹ năng sống",
        "publisher": "NXB Tổng hợp TP.HCM",
        "authors": ["Dale Carnegie"],
        "published_year": 1936,
        "quantity": 6,
        "cover_image_url": cover_url("Dac Nhan Tam"),
    },
    {
        "title": "7 Thói Quen Hiệu Quả",
        "isbn": "9786049000002",
        "description": "Các nguyên tắc chủ động, đặt mục tiêu, ưu tiên việc quan trọng, hợp tác và tự đổi mới để nâng cao hiệu quả cá nhân và lãnh đạo.",
        "category": "Kỹ năng sống",
        "publisher": "NXB Trẻ",
        "authors": ["Stephen R. Covey"],
        "published_year": 1989,
        "quantity": 5,
        "cover_image_url": cover_url("7 Thoi Quen"),
    },
    {
        "title": "Atomic Habits",
        "isbn": "9786049000003",
        "description": "Hướng dẫn xây dựng thói quen tốt bằng những thay đổi nhỏ, thiết kế môi trường và theo dõi tiến bộ để cải thiện kỷ luật và năng suất.",
        "category": "Kỹ năng sống",
        "publisher": "NXB Thế Giới",
        "authors": ["James Clear"],
        "published_year": 2018,
        "quantity": 7,
        "cover_image_url": cover_url("Atomic Habits"),
    },
    {
        "title": "Deep Work",
        "isbn": "9786049000004",
        "description": "Giải thích giá trị của khả năng tập trung sâu trong công việc tri thức và cách giảm xao nhãng để tăng chất lượng học tập và làm việc.",
        "category": "Kỹ năng sống",
        "publisher": "NXB Lao Động",
        "authors": ["Cal Newport"],
        "published_year": 2016,
        "quantity": 5,
        "cover_image_url": cover_url("Deep Work"),
    },
    {
        "title": "Từ Tốt Đến Vĩ Đại",
        "isbn": "9786049000005",
        "description": "Nghiên cứu các yếu tố giúp doanh nghiệp chuyển từ hoạt động tốt sang hiệu quả vượt trội bền vững qua lãnh đạo, con người và kỷ luật.",
        "category": "Kinh tế - Quản trị",
        "publisher": "NXB Trẻ",
        "authors": ["Jim Collins"],
        "published_year": 2001,
        "quantity": 5,
        "cover_image_url": cover_url("Tu Tot Den Vi Dai"),
    },
    {
        "title": "Khởi Nghiệp Tinh Gọn",
        "isbn": "9786049000006",
        "description": "Phương pháp xây dựng, đo lường và học hỏi để kiểm chứng ý tưởng kinh doanh nhanh chóng, phù hợp với startup và quản lý sản phẩm.",
        "category": "Kinh tế - Quản trị",
        "publisher": "NXB Thế Giới",
        "authors": ["Eric Ries"],
        "published_year": 2011,
        "quantity": 5,
        "cover_image_url": cover_url("Khoi Nghiep Tinh Gon"),
    },
    {
        "title": "Tư Duy Nhanh Và Chậm",
        "isbn": "9786049000007",
        "description": "Mô tả hai hệ thống tư duy trực giác và suy luận cùng những thiên kiến ảnh hưởng đến quyết định, kinh tế hành vi và nhận thức.",
        "category": "Kinh tế - Quản trị",
        "publisher": "NXB Thế Giới",
        "authors": ["Daniel Kahneman"],
        "published_year": 2011,
        "quantity": 6,
        "cover_image_url": cover_url("Tu Duy Nhanh Va Cham"),
    },
    {
        "title": "Nhà Đầu Tư Thông Minh",
        "isbn": "9786049000008",
        "description": "Triết lý đầu tư giá trị, biên an toàn và cách kiểm soát cảm xúc trước biến động thị trường, phù hợp với người học đầu tư dài hạn.",
        "category": "Kinh tế - Quản trị",
        "publisher": "NXB Lao Động",
        "authors": ["Benjamin Graham"],
        "published_year": 1949,
        "quantity": 5,
        "cover_image_url": cover_url("Nha Dau Tu Thong Minh"),
    },
    {
        "title": "Nhà Giả Kim",
        "isbn": "9786049000009",
        "description": "Câu chuyện hành trình theo đuổi ước mơ, khám phá bản thân và tìm ý nghĩa của những dấu hiệu trong cuộc sống.",
        "category": "Văn học",
        "publisher": "NXB Văn Học",
        "authors": ["Paulo Coelho"],
        "published_year": 1988,
        "quantity": 7,
        "cover_image_url": cover_url("Nha Gia Kim"),
    },
    {
        "title": "Rừng Na Uy",
        "isbn": "9786049000010",
        "description": "Tiểu thuyết về tuổi trẻ, tình yêu, mất mát và sự trưởng thành trong bối cảnh Nhật Bản hiện đại với trọng tâm là đời sống nội tâm.",
        "category": "Văn học",
        "publisher": "NXB Trẻ",
        "authors": ["Haruki Murakami"],
        "published_year": 1987,
        "quantity": 5,
        "cover_image_url": cover_url("Rung Na Uy"),
    },
    {
        "title": "Ông Già Và Biển Cả",
        "isbn": "9786049000011",
        "description": "Câu chuyện về một ngư dân già kiên trì chiến đấu với thiên nhiên và giới hạn bản thân, đề cao nghị lực và phẩm giá.",
        "category": "Văn học",
        "publisher": "NXB Văn Học",
        "authors": ["Ernest Hemingway"],
        "published_year": 1952,
        "quantity": 5,
        "cover_image_url": cover_url("Ong Gia Va Bien Ca"),
    },
    {
        "title": "Hoàng Tử Bé",
        "isbn": "9786049000012",
        "description": "Câu chuyện nhiều lớp ý nghĩa về tình bạn, trách nhiệm, tình yêu và cách con người nhìn thế giới, phù hợp với nhiều lứa tuổi.",
        "category": "Văn học",
        "publisher": "NXB Thế Giới",
        "authors": ["Antoine de Saint-Exupéry"],
        "published_year": 1943,
        "quantity": 6,
        "cover_image_url": cover_url("Hoang Tu Be"),
    },
    {
        "title": "Lược Sử Thời Gian",
        "isbn": "9786049000013",
        "description": "Giới thiệu các ý tưởng lớn về vũ trụ, thời gian, hố đen và nguồn gốc không gian theo cách phổ thông dễ tiếp cận.",
        "category": "Khoa học - Công nghệ",
        "publisher": "NXB Khoa học và Kỹ thuật",
        "authors": ["Stephen Hawking"],
        "published_year": 1988,
        "quantity": 5,
        "cover_image_url": cover_url("Luoc Su Thoi Gian"),
    },
    {
        "title": "Clean Code",
        "isbn": "9786049000014",
        "description": "Các nguyên tắc viết mã dễ đọc, dễ bảo trì, thiết kế hàm, đặt tên, xử lý lỗi và tổ chức mã nguồn cho kỹ sư phần mềm.",
        "category": "Khoa học - Công nghệ",
        "publisher": "NXB Khoa học và Kỹ thuật",
        "authors": ["Robert C. Martin"],
        "published_year": 2008,
        "quantity": 7,
        "cover_image_url": cover_url("Clean Code"),
    },
    {
        "title": "The Pragmatic Programmer",
        "isbn": "9786049000015",
        "description": "Các thực hành nghề nghiệp về thiết kế, debug, tự động hóa, kiểm thử và phát triển phần mềm bền vững cho lập trình viên.",
        "category": "Khoa học - Công nghệ",
        "publisher": "NXB Khoa học và Kỹ thuật",
        "authors": ["Andrew Hunt", "David Thomas"],
        "published_year": 1999,
        "quantity": 6,
        "cover_image_url": cover_url("Pragmatic Programmer"),
    },
    {
        "title": "Artificial Intelligence: A Modern Approach",
        "isbn": "9786049000016",
        "description": "Nền tảng trí tuệ nhân tạo gồm tìm kiếm, biểu diễn tri thức, xác suất, machine learning và tác tử thông minh.",
        "category": "Khoa học - Công nghệ",
        "publisher": "NXB Khoa học và Kỹ thuật",
        "authors": ["Stuart Russell", "Peter Norvig"],
        "published_year": 2020,
        "quantity": 5,
        "cover_image_url": cover_url("Artificial Intelligence"),
    },
    {
        "title": "Sapiens: Lược Sử Loài Người",
        "isbn": "9786049000017",
        "description": "Khái quát lịch sử phát triển của Homo sapiens qua cách mạng nhận thức, nông nghiệp và khoa học, kết nối lịch sử, kinh tế và văn hóa.",
        "category": "Lịch sử - Tiểu sử",
        "publisher": "NXB Thế Giới",
        "authors": ["Yuval Noah Harari"],
        "published_year": 2011,
        "quantity": 7,
        "cover_image_url": cover_url("Sapiens"),
    },
    {
        "title": "Homo Deus",
        "isbn": "9786049000018",
        "description": "Thảo luận tương lai của con người khi công nghệ, dữ liệu và trí tuệ nhân tạo ngày càng quan trọng đối với xã hội.",
        "category": "Lịch sử - Tiểu sử",
        "publisher": "NXB Thế Giới",
        "authors": ["Yuval Noah Harari"],
        "published_year": 2015,
        "quantity": 5,
        "cover_image_url": cover_url("Homo Deus"),
    },
    {
        "title": "Steve Jobs",
        "isbn": "9786049000019",
        "description": "Tiểu sử về hành trình sáng tạo, quản trị sản phẩm và xây dựng doanh nghiệp công nghệ của Steve Jobs, gắn với thiết kế và đổi mới.",
        "category": "Lịch sử - Tiểu sử",
        "publisher": "NXB Trẻ",
        "authors": ["Walter Isaacson"],
        "published_year": 2011,
        "quantity": 5,
        "cover_image_url": cover_url("Steve Jobs"),
    },
    {
        "title": "Leonardo da Vinci",
        "isbn": "9786049000020",
        "description": "Tiểu sử khám phá cách Leonardo kết hợp nghệ thuật, khoa học, quan sát tự nhiên và trí tò mò để tạo ra tư duy liên ngành sáng tạo.",
        "category": "Lịch sử - Tiểu sử",
        "publisher": "NXB Trẻ",
        "authors": ["Walter Isaacson"],
        "published_year": 2017,
        "quantity": 5,
        "cover_image_url": cover_url("Leonardo da Vinci"),
    },
]


def ensure_demo_seed_allowed() -> None:
    environment = settings.ENVIRONMENT.strip().lower()
    if environment in {"prod", "production"} and os.getenv("ALLOW_DEMO_SEED") != "1":
        raise RuntimeError(
            "Từ chối seed dữ liệu demo vào production. "
            "Nếu đây là DB demo riêng, đặt ALLOW_DEMO_SEED=1."
        )
