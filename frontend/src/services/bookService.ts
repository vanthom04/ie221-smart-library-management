import axios from "axios"

const API_URL = "http://127.0.0.1:8000/api/v1"

export const bookService = {
  // Hàm 1: Lấy danh sách toàn bộ sách
  getAllBooks: async () => {
    const response = await axios.get(`${API_URL}/books/`)
    return response.data
  },

  // Hàm 2: Tìm kiếm sách
  searchBooks: async (keyword: string) => {
    const response = await axios.get(`${API_URL}/books/search`, {
      params: { keyword }
    })
    return response.data
  },

  // Hàm 3: Lấy chi tiết sách theo ID
  getBookById: async (id: string | number) => {
    try {
      const response = await axios.get(`${API_URL}/books/${id}`)
      return response.data
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết sách:", error)
      throw error
    }
  }
}
