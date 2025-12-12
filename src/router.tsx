import { createBrowserRouter } from "react-router-dom";
import Default from "./layout/Default";
import NotFound from "./organism/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Default />,
    errorElement: <NotFound />,
    children: [
        {
        path: "chat/:chatId",
        element: <Default />,
      }
    ],
  },
]);

export default router;
