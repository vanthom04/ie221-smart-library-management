import { useState, useEffect } from "react";
import { Link } from "react-router"; // Lưu ý: React Router v7 dùng "react-router" (hoặc "react-router-dom" tùy setup của nhóm)

const BookList = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // State cho thanh tìm kiếm
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // 1. Lấy danh sách Thể loại để đưa vào Dropdown lọc
  useEffect(() => {
    fetch("http://localhost:8000/api/v1/categories/")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Lỗi tải thể loại:", err));
  }, []);

  // 2. Hàm gọi API Tìm kiếm (Search API) mà chúng ta vừa viết
  const handleSearch = () => {
    // Dùng URL object để tự động gắn param ?title=...&category_id=...
    const url = new URL("http://localhost:8000/api/v1/books/search");
    if (searchTitle) url.searchParams.append("title", searchTitle);
    if (selectedCategory) url.searchParams.append("category_id", selectedCategory);

    fetch(url.toString())
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error("Lỗi tải sách:", err));
  };

  // Gọi handleSearch lần đầu khi vừa vào trang (để load toàn bộ sách)
  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* HEADER & THANH TÌM KIẾM (Search UI) */}
      <div className="bg-blue-50 p-8 rounded-xl shadow-sm mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">Khám Phá Thư Viện</h1>
        <p className="text-gray-600 mb-6">Hàng ngàn cuốn sách hấp dẫn đang chờ bạn khám phá</p>

        <div className="flex flex-col md:flex-row justify-center gap-3 max-w-3xl mx-auto">
          <input
            type="text"
            placeholder="Nhập tên sách bạn muốn tìm..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />
          <select
            className="px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Tất cả thể loại</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Tìm Kiếm
          </button>
        </div>
      </div>

      {/* DANH SÁCH SÁCH (Book List) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book.id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Ảnh bìa giả lập (vì DB nhóm bạn chưa có cột ảnh bìa) */}
              <div className="bg-gray-200 h-64 flex items-center justify-center text-gray-400">
                <span className="text-5xl">📚</span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800 line-clamp-1 mb-1" title={book.title}>
                  {book.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">
                  {book.description || "Chưa có mô tả cho cuốn sách này."}
                </p>
                <Link
                  to={`/books/${book.id}`}
                  className="block text-center w-full bg-gray-100 hover:bg-gray-200 text-blue-700 font-semibold py-2 rounded transition-colors"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            Không tìm thấy cuốn sách nào phù hợp với từ khóa của bạn. 😢
          </div>
        )}
      </div>
    </div>
  );
};

export default BookList;