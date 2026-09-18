import { NavLink, Outlet } from "react-router"

const AdminLayout = () => {
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `w-full text-left p-2 rounded block hover:bg-gray-700 transition-colors ${isActive ? "bg-blue-600" : ""}`

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex w-64 flex-col bg-gray-800 text-white">
        <div className="border-b border-gray-700 p-4 text-2xl font-bold">Admin Dashboard</div>
        <nav className="flex-1 space-y-2 p-4">
          <NavLink to="/admin/dashboard" className={getNavLinkClass}>
            📊 Tổng quan Dashboard
          </NavLink>

          <NavLink to="/admin/reservations" className={getNavLinkClass}>
            📋 Quản lý Đặt trước
          </NavLink>

          <NavLink to="/admin/borrows" className={getNavLinkClass}>
            📖 Quản lý Mượn / Trả
          </NavLink>

          <NavLink to="/admin/books" className={getNavLinkClass}>
            📚 Quản lý Sách
          </NavLink>

          <NavLink to="/admin" end className={getNavLinkClass}>
            📑 Quản lý Thể loại
          </NavLink>

          <NavLink to="/admin/authors" className={getNavLinkClass}>
            ✍️ Quản lý Tác giả
          </NavLink>

          <NavLink to="/admin/publishers" className={getNavLinkClass}>
            🏢 Nhà xuất bản
          </NavLink>

          <div className="mt-4 border-t border-gray-700 pt-4">
            <NavLink to="/" className={getNavLinkClass}>
              🏠 Về trang độc giả
            </NavLink>
          </div>
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout
