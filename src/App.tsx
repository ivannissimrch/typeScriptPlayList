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
import getPlayListSongs from "./helpers/loaders/getPlayListSongs";
import getPlayLists from "./helpers/loaders/getPlayLists";
const spotifyApi = new SpotifyWebApi();

type StateType = {
  songsOnPlayer: string | string[];
  spotifyApi: SpotifyWebApi.SpotifyWebApiJs;
  playSelectedSong: (selectedSong: string) => void;
  playAllSongsOnPlayList: (playList: string[]) => void;
  updateSongToAdd: (lastPlayingSong: string) => void;
  getSongToAdd: () => string;
};

export const AppContext = createContext<StateType>({} as StateType);

export default function App() {
  const [spotifyToken, setSpotifyToken] = useState(localStorageToken());
  let songToAdd = "";
  spotifyApi.setAccessToken(localStorageToken());
  const [songsOnPlayer, setSongsOnPlayer] = useState<string | string[]>([""]);

  useEffect(() => {
    //get the token from the spotify Api server
    const tokenFromApi = getAuthParamsFromHash();
    window.location.hash = ";";
    if (tokenFromApi) {
      //store spotify token on local storage
      localStorage.setItem("token", tokenFromApi);
      setSpotifyToken(tokenFromApi);
    }
  }, []);

  async function playSelectedSong(selectedSong: string) {
    setSongsOnPlayer(selectedSong);
  }

  async function playAllSongsOnPlayList(playList: string[]) {
    setSongsOnPlayer(playList);
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
          loader: () => getPlayLists(spotifyApi),
          element: <LibraryPage />,
        },
        {
          path: "/library/:playlistId",
          loader: ({ params }) => {
            return getPlayListSongs(params, spotifyApi);
          },
          element: <PlayListPage />,
        },
      ],
    },
  ]);
  return (
    <AppContext.Provider
      value={{
        songsOnPlayer,
        spotifyApi,
        playSelectedSong,
        updateSongToAdd,
        getSongToAdd,
        playAllSongsOnPlayList,
      }}
    >
      <RouterProvider router={router} />
    </AppContext.Provider>
  );
}
