import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/axios"
import type { BookItem, FilterOption } from "../types"
import { useSemanticSearch } from "./use-semantic-search"

interface CatalogBook {
  id: string
  title: string
  isbn: string
  description: string | null
  category_id: string
  author_id: string | null
  publisher_id: string | null
  quantity: number
  available_quantity: number
}

interface NamedRecord {
  id: string
  name: string
}

const toOptions = (values: string[]): FilterOption[] =>
  [...new Set(values.filter(Boolean))].map((value) => ({
    id: value,
    label: value,
    count: values.filter((item) => item === value).length
  }))

export const useSearchBooks = (query: string) => {
  const catalog = useQuery({
    queryKey: ["search-catalog"],
    queryFn: async () => {
      const [books, categories, authors, publishers] = await Promise.all([
        api.get<CatalogBook[]>("/books/search"),
        api.get<NamedRecord[]>("/categories/"),
        api.get<NamedRecord[]>("/authors/"),
        api.get<NamedRecord[]>("/publishers/")
      ])
      return { books, categories, authors, publishers }
    }
  })
  const semantic = useSemanticSearch(query)
  const catalogData = catalog.data
  const catalogBooks = catalogData?.books ?? []
  const catalogById = new Map(catalogBooks.map((book) => [book.id, book]))
  const categoryNames = new Map(catalogData?.categories.map((item) => [item.id, item.name]))
  const authorNames = new Map(catalogData?.authors.map((item) => [item.id, item.name]))
  const publisherNames = new Map(catalogData?.publishers.map((item) => [item.id, item.name]))

  const source = query.trim()
    ? (semantic.data?.results ?? []).map((result) => ({
        book: catalogById.get(result.book_id),
        id: result.book_id,
        title: result.title,
        isbn: result.isbn,
        author: result.author,
        category: result.category,
        publisher: result.publisher
      }))
    : catalogBooks.map((book) => ({
        book,
        id: book.id,
        title: book.title,
        isbn: book.isbn,
        author: book.author_id ? authorNames.get(book.author_id) : null,
        category: categoryNames.get(book.category_id),
        publisher: book.publisher_id ? publisherNames.get(book.publisher_id) : null
      }))

  const books: BookItem[] = source.map((item) => ({
    id: item.id,
    title: item.title,
    author: item.author || "",
    category: item.category || "Chưa phân loại",
    categoryTone: "blue",
    publisher: item.publisher || "",
    publishYear: 0,
    isbn: item.isbn || item.book?.isbn || "",
    pages: 0,
    language: "",
    availableCount: item.book?.available_quantity ?? 0,
    totalCount: item.book?.quantity ?? 0,
    shelfLocation: { floor: "", shelf: "", row: "", callNumber: "" },
    description: item.book?.description || "",
    cover: {
      gradient: "from-blue-700 via-indigo-600 to-violet-600",
      textClass: "text-white",
      titleLines: [item.title]
    }
  }))

  return {
    books,
    categoryOptions: toOptions(books.map((book) => book.category)),
    authorOptions: toOptions(books.map((book) => book.author)),
    publisherOptions: toOptions(books.map((book) => book.publisher)),
    isPending: query.trim() ? semantic.isPending || catalog.isPending : catalog.isPending,
    isError: query.trim() ? semantic.isError || catalog.isError : catalog.isError
  }
}
