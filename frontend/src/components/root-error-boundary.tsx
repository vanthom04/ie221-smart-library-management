import { isRouteErrorResponse, useRouteError } from "react-router"

export const RootErrorBoundary = () => {
  const error = useRouteError()

  let title = "Đã xảy ra lỗi"
  let message = "Đã có lỗi không mong muốn xảy ra. Vui lòng thử lại sau."

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = "404 - Không tìm thấy trang"
      message = "Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển."
    } else {
      title = `${error.status} - Lỗi hệ thống`
      message = error.statusText || message
    }
  } else if (error instanceof Error) {
    message = error.message
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <div className="max-w-md rounded-lg bg-white p-6 shadow-md">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
        <button
          onClick={() => (window.location.href = "/")}
          className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Trở về trang chủ
        </button>
      </div>
    </div>
  )
}
