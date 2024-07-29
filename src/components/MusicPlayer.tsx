import { Card, Box } from "@mui/material";
import SpotifyPlayer from "react-spotify-web-playback";
import toast from "react-hot-toast";
import { useContext, useState } from "react";
import { AppContext } from "../App";
import AddSongMenu from "./AddSongMenu";

export default function MusicPlayer() {
  const { songsOnPlayer, spotifyApi } = useContext(AppContext);
  const token = spotifyApi.getAccessToken();
  const [currentSong, setCurrentSong] = useState("");
  return (
    <Card
      sx={{
        display: "flex",
        padding: 1,
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <SpotifyPlayer
          token={token!}
          uris={songsOnPlayer}
          play={true}
          layout="responsive"
          hideAttribution={true}
          callback={(state) => {
            setCurrentSong(state.track.uri);
            if (state.error === "Authentication failed") {
              toast("Token expired please login again");
              localStorage.removeItem("token");
              window.location.reload();
            }
          }}
        />
        <Box>
          {" "}
          <AddSongMenu currentSong={currentSong} />
        </Box>
      </Box>
    </Card>
  );
}
