import { Card, Box } from "@mui/material";
import SpotifyPlayer from "react-spotify-web-playback";
import toast from "react-hot-toast";
import { useContext } from "react";
import { AppContext } from "../App";

export default function MusicPlayer() {
  const { songOnPlayer, spotifyApi } = useContext(AppContext);
  const token = spotifyApi.getAccessToken();
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
          uris={songOnPlayer}
          play={true}
          layout="responsive"
          hideAttribution={true}
          callback={(state) => {
            if (state.error === "Authentication failed") {
              toast("Token expired please login again");
              localStorage.removeItem("token");
              window.location.reload();
            }
          }}
        />
        <Box></Box>
      </Box>
    </Card>
  );
}
