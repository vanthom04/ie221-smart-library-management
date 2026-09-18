/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/axios"

export const bookAPI = {
  getAll: () => api.get<any[]>("/books/"),
  create: (data: any) => api.post<any>("/books/", data),
  update: (id: string, data: any) => api.put<any>(`/books/${id}`, data),
  delete: (id: string) => api.delete<any>(`/books/${id}`)
}

export const categoryAPI = {
  getAll: () => api.get<any[]>("/categories/"),
  create: (data: any) => api.post<any>("/categories/", data),
  update: (id: string, data: any) => api.put<any>(`/categories/${id}`, data),
  delete: (id: string) => api.delete<any>(`/categories/${id}`)
}

export const authorAPI = {
  getAll: () => api.get<any[]>("/authors/"),
  create: (data: any) => api.post<any>("/authors/", data),
  update: (id: string, data: any) => api.put<any>(`/authors/${id}`, data),
  delete: (id: string) => api.delete<any>(`/authors/${id}`)
}

export const publisherAPI = {
  getAll: () => api.get<any[]>("/publishers/"),
  create: (data: any) => api.post<any>("/publishers/", data),
  update: (id: string, data: any) => api.put<any>(`/publishers/${id}`, data),
  delete: (id: string) => api.delete<any>(`/publishers/${id}`)
}