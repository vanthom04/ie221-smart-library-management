import { useParams, useNavigate } from "react-router"
import { ArrowLeftIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          type="button"
          variant="ghost"
          onClick={() => navigate("/search")}
          className="-ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon /> Quay lại tìm kiếm
        </Button>
      </div>
      <h1 className="text-2xl font-bold sm:text-3xl">Chi tiết sách #{id}</h1>
    </div>
  )
}

export default BookDetailPage
