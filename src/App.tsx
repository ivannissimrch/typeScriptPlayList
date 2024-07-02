import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/Home";
import SearchPage from "./pages/Search";
import LibraryPage from "./pages/Library";
import RootLayout from "./pages/Root";
import ErrorPage from "./pages/Error";
import PlayListPage from "./pages/PlayListPage";

import { useState, useEffect } from "react";
import Login from "./components/Login";
import localStorageToken from "./helpers/localStorageToken";
import getTokenFromUrl from "./helpers/getTokenFromUrl";

export default function App() {
  const [spotifyToken, setSpotifyToken] = useState(localStorageToken());

  useEffect(() => {
    //get the token from the spofity Api server
    const tokenFromApi = getTokenFromUrl().access_token;
    window.location.hash = ";";
    if (tokenFromApi) {
      //this only runs the first time the app loads
      //store spotify token on local storage
      localStorage.setItem("token", tokenFromApi);
      setSpotifyToken(tokenFromApi);
    }
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "",
          element: !spotifyToken ? <Login /> : <HomePage />,
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
