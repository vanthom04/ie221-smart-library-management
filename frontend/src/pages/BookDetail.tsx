import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router'; // Lấy ID từ URL
import { bookService } from '../services/bookService';

export default function BookDetail() {
  const { id } = useParams(); // Lấy số id từ link web
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) return;
      try {
        const data = await bookService.getBookById(id);
        setBook(data);
      } catch (error) {
        console.error("Không tìm thấy sách", error);
      }
      setLoading(false);
    };
    fetchBook();
  }, [id]);

  if (loading) return <div className="p-10 text-center text-gray-500 text-lg">Đang tải thông tin sách...</div>;
  if (!book) return <div className="p-10 text-center text-red-500 text-lg">Không tìm thấy cuốn sách này!</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <Link to="/books" className="text-blue-600 hover:underline mb-6 inline-block">
        &larr; Quay lại danh sách
      </Link>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{book.title}</h1>
        <div className="flex gap-4 text-sm text-gray-500 mb-8 border-b pb-4">
          <span>ID: #{book.id}</span>
          <span>•</span>
          {/* Tạm thời hiển thị ID, phần tên Danh mục/Tác giả sẽ làm ở các bước nâng cao sau */}
          <span>Danh mục ID: {book.category_id || 'Trống'}</span>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Mô tả nội dung:</h3>
          <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
            {book.description || "Cuốn sách này hiện chưa có mô tả chi tiết."}
          </p>
        </div>
      </div>
    </div>
  );
}