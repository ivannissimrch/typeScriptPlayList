import { useLoaderData } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@mui/material";
import { useState, useContext } from "react";
import { AppContext } from "../App";

export default function PlayListPage() {
  const songs = useLoaderData() as SpotifyApi.PlaylistTrackObject[];
  const navigate = useNavigate();
  const { playlistId } = useParams();
  const { playSelectedSong, spotifyApi, playAllSongsOnPlayList } =
    useContext(AppContext);
  const [songsOnPlayList, setSongsOnPlayList] =
    useState<SpotifyApi.PlaylistTrackObject[]>(songs);

  function handlePlayAllSongsOnList() {
    const listOfSongs = songs.map((song) => song.track.uri);
    playAllSongsOnPlayList(listOfSongs);
    navigate("/");
  }

  function handlePlaySong(selectedSong: SpotifyApi.PlaylistTrackObject) {
    playSelectedSong(selectedSong.track.uri);
    navigate("/");
  }

  function handleDelete(selectedSong: SpotifyApi.PlaylistTrackObject) {
    const updatedSongs = songsOnPlayList.filter(
      (song) => song.track.uri !== selectedSong.track.uri
    );
    setSongsOnPlayList(updatedSongs);
    if (typeof playlistId === "string") {
      spotifyApi.removeTracksFromPlaylist(playlistId, [selectedSong.track.uri]);
    }
  }

  return (
    <List
      dense
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Button onClick={handlePlayAllSongsOnList}>Play all</Button>
      {songsOnPlayList.map((song) => {
        return (
          <ListItem key={song.track.id}>
            <ListItemButton onClick={() => handlePlaySong(song)}>
              <ListItemAvatar>
                <Avatar
                  variant="square"
                  alt="Album image"
                  src={
                    (song.track as SpotifyApi.TrackObjectFull).album.images[0]
                      .url
                  }
                />
              </ListItemAvatar>
              <ListItemText
                primary={`${song.track.name} ${
                  (song.track as SpotifyApi.TrackObjectFull).album.artists[0]
                    .name
                } `}
              />
            </ListItemButton>
            <Button onClick={() => handleDelete(song)}>Delete</Button>
          </ListItem>
        );
      })}
    </List>
  );
}
