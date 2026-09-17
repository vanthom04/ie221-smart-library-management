from typing import Any, Dict, List
from sqlalchemy.ext.asyncio import AsyncSession

# 24 cuốn sách được định nghĩa chuẩn theo PoC verification
MOCK_BOOKS: List[Dict[str, Any]] = [
    {"book_id": 101, "title": "Python Crash Course", "author": "Eric Matthes", "category": "Programming", "publisher": "No Starch Press", "isbn": "978-1593279288", "description": "A hands-on, project-based introduction to programming in Python for beginners."},
    {"book_id": 102, "title": "Automate the Boring Stuff with Python", "author": "Al Sweigart", "category": "Programming", "publisher": "No Starch Press", "isbn": "978-1593279929", "description": "Practical programming for total beginners. Learn how to use Python to write programs that automate tasks."},
    {"book_id": 103, "title": "Effective Python: 90 Specific Ways to Write Better Python", "author": "Brett Slatkin", "category": "Programming", "publisher": "Addison-Wesley", "isbn": "978-0134853987", "description": "Idiomatic Python techniques, design patterns, best practices, and code optimization."},
    {"book_id": 104, "title": "Fluent Python", "author": "Luciano Ramalho", "category": "Programming", "publisher": "O'Reilly Media", "isbn": "978-1491946008", "description": "Clear guide through Python's best language features, data model, generators, and metaprogramming."},
    {"book_id": 105, "title": "Lập Trình Python Cơ Bản Đến Nâng Cao", "author": "Nguyễn Văn A", "category": "Programming", "publisher": "NXB Khoa Học Kỹ Thuật", "isbn": "978-6046712345", "description": "Giáo trình toàn diện học lập trình Python, cú pháp cơ bản, xử lý dữ liệu và thuật toán cho sinh viên."},
    {"book_id": 106, "title": "Clean Code: A Handbook of Agile Software Craftsmanship", "author": "Robert C. Martin", "category": "Software Engineering", "publisher": "Prentice Hall", "isbn": "978-0132350884", "description": "How to write clean, maintainable software and professional design principles."},
    {"book_id": 107, "title": "Design Patterns: Elements of Reusable Object-Oriented Software", "author": "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides", "category": "Software Engineering", "publisher": "Addison-Wesley", "isbn": "978-0201633610", "description": "Classic software engineering design patterns, object-oriented solutions, and software architectures."},
    {"book_id": 108, "title": "Building Microservices", "author": "Sam Newman", "category": "Software Engineering", "publisher": "O'Reilly Media", "isbn": "978-1492034025", "description": "Designing fine-grained systems, distributed systems architecture, service integration, and deployment."},
    {"book_id": 109, "title": "Refactoring: Improving the Design of Existing Code", "author": "Martin Fowler", "category": "Software Engineering", "publisher": "Addison-Wesley", "isbn": "978-0134757599", "description": "Techniques for restructuring existing computer code without changing its external behavior."},
    {"book_id": 110, "title": "Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow", "author": "Aurélien Géron", "category": "Machine Learning", "publisher": "O'Reilly Media", "isbn": "978-1492032649", "description": "Practical concepts and tools for building intelligent systems, training models, and neural networks."},
    {"book_id": 111, "title": "Deep Learning", "author": "Ian Goodfellow, Yoshua Bengio, Aaron Courville", "category": "Deep Learning", "publisher": "MIT Press", "isbn": "978-0262035613", "description": "Comprehensive mathematical and conceptual textbook on deep neural networks, generative modeling, and optimization."},
    {"book_id": 112, "title": "Pattern Recognition and Machine Learning", "author": "Christopher M. Bishop", "category": "Machine Learning", "publisher": "Springer", "isbn": "978-0387310732", "description": "Comprehensive statistical machine learning reference covering Bayesian models and probabilistic inference."},
    {"book_id": 113, "title": "Artificial Intelligence: A Modern Approach", "author": "Stuart Russell, Peter Norvig", "category": "Artificial Intelligence", "publisher": "Pearson", "isbn": "978-0136042594", "description": "The definitive university textbook covering AI fundamentals, search algorithms, logic, and intelligent agents."},
    {"book_id": 114, "title": "Nhập Môn Học Máy và Trí Tuệ Nhân Tạo", "author": "Trần Văn B", "category": "Artificial Intelligence", "publisher": "NXB Đại Học Quốc Gia", "isbn": "978-6047712346", "description": "Tài liệu cơ bản về thuật toán machine learning, hồi quy, phân loại, mạng nơ-ron và ứng dụng thực tiễn."},
    {"book_id": 115, "title": "Database System Concepts", "author": "Abraham Silberschatz, Henry F. Korth, S. Sudarshan", "category": "Database", "publisher": "McGraw-Hill", "isbn": "978-0078022159", "description": "Fundamental concepts of database management, SQL, relational design, indexing, transactions, and concurrency."},
    {"book_id": 116, "title": "Designing Data-Intensive Applications", "author": "Martin Kleppmann", "category": "Database", "publisher": "O'Reilly Media", "isbn": "978-1449373320", "description": "The big ideas behind reliable, scalable, and maintainable distributed data systems, storage engines, and replication."},
    {"book_id": 117, "title": "High Performance MySQL", "author": "Silvia Botros, Jeremy Tinley", "category": "Database", "publisher": "O'Reilly Media", "isbn": "978-1492080510", "description": "Optimization, backup, replication, indexing strategies, and database architecture tuning for MySQL."},
    {"book_id": 118, "title": "The Lean Startup", "author": "Eric Ries", "category": "Business", "publisher": "Crown Business", "isbn": "978-0307887894", "description": "How constant innovation creates radically successful businesses, agile entrepreneurship, and validation."},
    {"book_id": 119, "title": "Good to Great: Why Some Companies Make the Leap and Others Don't", "author": "Jim Collins", "category": "Business", "publisher": "HarperBusiness", "isbn": "978-0066620992", "description": "Management study of company culture, disciplined people, disciplined thought, and long-term corporate success."},
    {"book_id": 120, "title": "Zero to One: Notes on Startups, or How to Build the Future", "author": "Peter Thiel, Blake Masters", "category": "Business", "publisher": "Currency", "isbn": "978-0804139298", "description": "Philosophy on technology progress, building monopolies, startup execution, and future investments."},
    {"book_id": 121, "title": "Sapiens: A Brief History of Humankind", "author": "Yuval Noah Harari", "category": "History", "publisher": "Harper", "isbn": "978-0062316097", "description": "Survey of the history of humankind from the archaic human species in the Stone Age up to the twenty-first century."},
    {"book_id": 122, "title": "Guns, Germs, and Steel: The Fates of Human Societies", "author": "Jared Diamond", "category": "History", "publisher": "W. W. Norton", "isbn": "978-0393317558", "description": "Transdisciplinary explanation of why Eurasian and North African civilizations survived and conquered others."},
    {"book_id": 123, "title": "Đắc Nhân Tâm (How to Win Friends and Influence People)", "author": "Dale Carnegie", "category": "Literature", "publisher": "NXB Tổng Hợp TP.HCM", "isbn": "978-6045882345", "description": "Nghệ thuật giao tiếp, thấu hiểu con người, tạo thiện cảm và kỹ năng ứng xử kinh điển trong cuộc sống."},
    {"book_id": 124, "title": "Nhà Giả Kim (The Alchemist)", "author": "Paulo Coelho", "category": "Literature", "publisher": "NXB Hội Nhà Văn", "isbn": "978-6045382346", "description": "Tiểu thuyết triết lý về hành trình theo đuổi ước mơ, lắng nghe tiếng gọi trái tim và định mệnh của chàng chăn cừu Santiago."},
]


class BookDataProvider:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_all_books(self) -> List[Dict[str, Any]]:
        return MOCK_BOOKS

    async def get_books_by_ids(self, book_ids: List[int]) -> List[Dict[str, Any]]:
        lookup = {b["book_id"]: b for b in MOCK_BOOKS}
        return [lookup[bid] for bid in book_ids if bid in lookup]