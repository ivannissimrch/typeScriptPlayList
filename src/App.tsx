import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/Home";
import SearchPage from "./pages/Search";
import LibraryPage from "./pages/Library";
import RootLayout from "./pages/Root";
import ErrorPage from "./pages/Error";
import PlayListPage from "./pages/PlayListPage";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "",
          element: <HomePage />,
        },
        { path: "search", element: <SearchPage /> },
        {
          path: "library",
          element: <LibraryPage />,
        },
        {
          path: "/library/:playlistId",
          element: <PlayListPage />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}
