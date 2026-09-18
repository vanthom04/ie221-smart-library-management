import { RouterProvider } from "react-router"
import { router } from "./router/routes"

export const App = () => {
  return <RouterProvider router={router} />
}
