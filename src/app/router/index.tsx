import { createBrowserRouter } from "react-router-dom";
import EditorPage from "../../pages/editor-page/EditorPage";
import HomePage from "../../pages/home-page/HomePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/editor",
    element: <EditorPage />,
  },
]);
