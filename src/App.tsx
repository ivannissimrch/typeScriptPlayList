import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/Home";
import SearchPage from "./pages/Search";
import LibraryPage from "./pages/Library";
import RootLayout from "./pages/Root";
import ErrorPage from "./pages/Error";
import PlayListPage from "./pages/PlayListPage";
import { useState, useEffect, createContext } from "react";
import Login from "./components/Login";
import localStorageToken from "./helpers/localStorageToken";

import SpotifyWebApi from "spotify-web-api-js";
import getAuthParamsFromHash from "./helpers/getAuthParamsFromHash";
const spotifyApi = new SpotifyWebApi();

type StateType = {
  songOnPlayer: string[];
  spotifyApi: SpotifyWebApi.SpotifyWebApiJs;
  playSelectedSong: (selectedSong: string[]) => void;
  updateSongToAdd: (lastPlayingSong: string) => void;
  getSongToAdd: () => string;
};

export const AppContext = createContext<StateType>({} as StateType);

export default function App() {
  const [spotifyToken, setSpotifyToken] = useState(localStorageToken());
  let songToAdd = "";
  spotifyApi.setAccessToken(localStorageToken());

  const [songOnPlayer, setSongOnPlayer] = useState([
    "spotify:track:3d2J1W0Msqt6z0TkF0ywLk",
    "spotify:track:3Xfg7AegXaDLoD5GOUMf2e",
    "spotify:track:0puoT9566xTWBoRw8qDKxk",
  ]);

  useEffect(() => {
    //get the token from the spotify Api server
    const tokenFromApi = getAuthParamsFromHash();
    window.location.hash = ";";
    if (tokenFromApi) {
      //this only runs the first time the app loads
      //store spotify token on local storage
      localStorage.setItem("token", tokenFromApi);
      setSpotifyToken(tokenFromApi);
    }
  }, []);

  async function playSelectedSong(selectedSong: string[]) {
    setSongOnPlayer(selectedSong);
  }

  function updateSongToAdd(lastPlayingSong: string) {
    songToAdd = lastPlayingSong;
  }

  function getSongToAdd() {
    return songToAdd;
  }

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
  return (
    <AppContext.Provider
      value={{
        songOnPlayer,
        spotifyApi,
        playSelectedSong,
        updateSongToAdd,
        getSongToAdd,
      }}
    >
      <RouterProvider router={router} />
    </AppContext.Provider>
  );
}
