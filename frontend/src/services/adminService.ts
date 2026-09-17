import { api } from "../lib/axios"

export const authorAPI = {
  getAll: async () => api.get<any[]>("/authors/"),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create: async (data: any) => api.post<any>("/authors/", data),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update: async (id: string, data: any) => api.put<any>(`/authors/${id}`, data),
  delete: async (id: string) => api.delete<any>(`/authors/${id}`),
}

export const categoryAPI = {
  getAll: async () => api.get<any[]>("/categories/"),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create: async (data: any) => api.post<any>("/categories/", data),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update: async (id: string, data: any) => api.put<any>(`/categories/${id}`, data),
  delete: async (id: string) => api.delete<any>(`/categories/${id}`),
}

export const publisherAPI = {
  getAll: async () => api.get<any[]>("/publishers/"),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create: async (data: any) => api.post<any>("/publishers/", data),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update: async (id: string, data: any) => api.put<any>(`/publishers/${id}`, data),
  delete: async (id: string) => api.delete<any>(`/publishers/${id}`),
}

export const bookAPI = {
  getAll: async () => api.get<any[]>("/books/"),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create: async (data: any) => api.post<any>("/books/", data),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update: async (id: string, data: any) => api.put<any>(`/books/${id}`, data),
  delete: async (id: string) => api.delete<any>(`/books/${id}`),
}