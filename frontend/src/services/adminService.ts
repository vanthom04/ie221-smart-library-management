// frontend/src/services/adminService.ts

const API_URL = "http://localhost:8000/api/v1";

export const categoryAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/categories/`);
    if (!response.ok) throw new Error("Lỗi khi tải danh sách");
    return response.json();
  },
  create: async (data: { name: string; description: string }) => {
    const response = await fetch(`${API_URL}/categories/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Lỗi khi tạo mới");
    return response.json();
  },
  update: async (id: number, data: { name: string; description: string }) => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Lỗi khi cập nhật");
    return response.json();
  },
  delete: async (id: number) => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Lỗi khi xóa");
    return response.text();
  }
};

export const authorAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/authors/`);
    if (!response.ok) throw new Error("Lỗi khi tải danh sách tác giả");
    return response.json();
  },
  create: async (data: { name: string; bio: string }) => {
    const response = await fetch(`${API_URL}/authors/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Lỗi khi thêm tác giả");
    return response.json();
  },
  update: async (id: number, data: { name: string; bio: string }) => {
    const response = await fetch(`${API_URL}/authors/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Lỗi khi cập nhật tác giả");
    return response.json();
  },
  delete: async (id: number) => {
    const response = await fetch(`${API_URL}/authors/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Lỗi khi xóa tác giả");
    return true;
  }
};

export const publisherAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/publishers/`);
    if (!response.ok) throw new Error("Lỗi khi tải danh sách NXB");
    return response.json();
  },
  create: async (data: { name: string; address: string }) => {
    const response = await fetch(`${API_URL}/publishers/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Lỗi khi thêm NXB");
    return response.json();
  },
  update: async (id: number, data: { name: string; address: string }) => {
    const response = await fetch(`${API_URL}/publishers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Lỗi khi cập nhật NXB");
    return response.json();
  },
  delete: async (id: number) => {
    const response = await fetch(`${API_URL}/publishers/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Lỗi khi xóa NXB");
    return true;
  }
};

// ĐÂY LÀ MẢNH GHÉP BOSS SÁCH BỊ THIẾU NÈ:
export const bookAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/books/`);
    if (!response.ok) throw new Error("Lỗi khi tải danh sách Sách");
    return response.json();
  },
  create: async (data: any) => {
    const response = await fetch(`${API_URL}/books/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Lỗi khi thêm Sách");
    return response.json();
  },
  update: async (id: number, data: any) => {
    const response = await fetch(`${API_URL}/books/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Lỗi khi cập nhật Sách");
    return response.json();
  },
  delete: async (id: number) => {
    const response = await fetch(`${API_URL}/books/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Lỗi khi xóa Sách");
    return true;
  }
};