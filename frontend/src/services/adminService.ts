// frontend/src/services/adminService.ts
import axios from "axios"

const API_URL = "http://localhost:8000/api/v1"

export const authorAPI = {
  getAll: async () => {
    const res = await axios.get(`${API_URL}/authors/`)
    return (res as any).data
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create: async (data: any) => {
    const res = await axios.post(`${API_URL}/authors/`, data)
    return (res as any).data
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update: async (id: string, data: any) => {
    const res = await axios.put(`${API_URL}/authors/${id}`, data)
    return (res as any).data
  },
  delete: async (id: string) => {
    const res = await axios.delete(`${API_URL}/authors/${id}`)
    return (res as any).data
  },
}

export const categoryAPI = {
  getAll: async () => {
    const res = await axios.get(`${API_URL}/categories/`)
    return (res as any).data
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create: async (data: any) => {
    const res = await axios.post(`${API_URL}/categories/`, data)
    return (res as any).data
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update: async (id: string, data: any) => {
    const res = await axios.put(`${API_URL}/categories/${id}`, data)
    return (res as any).data
  },
  delete: async (id: string) => {
    const res = await axios.delete(`${API_URL}/categories/${id}`)
    return (res as any).data
  },
}

export const publisherAPI = {
  getAll: async () => {
    const res = await axios.get(`${API_URL}/publishers/`)
    return (res as any).data
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create: async (data: any) => {
    const res = await axios.post(`${API_URL}/publishers/`, data)
    return (res as any).data
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update: async (id: string, data: any) => {
    const res = await axios.put(`${API_URL}/publishers/${id}`, data)
    return (res as any).data
  },
  delete: async (id: string) => {
    const res = await axios.delete(`${API_URL}/publishers/${id}`)
    return (res as any).data
  },
}

export const bookAPI = {
  getAll: async () => {
    const res = await axios.get(`${API_URL}/books/`)
    return (res as any).data
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create: async (data: any) => {
    const res = await axios.post(`${API_URL}/books/`, data)
    return (res as any).data
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update: async (id: string, data: any) => {
    const res = await axios.put(`${API_URL}/books/${id}`, data)
    return (res as any).data
  },
  delete: async (id: string) => {
    const res = await axios.delete(`${API_URL}/books/${id}`)
    return (res as any).data
  },
}