import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
import localStorageToken from "../helpers/localStorageToken";

export default function RootLayout() {
  const spotifyToken = localStorageToken();
  return (
    <>
      {spotifyToken && <Navbar />}
      <Outlet />
      <Toaster />
    </>
  );
}
