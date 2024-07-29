import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
} from "@mui/material";
import { useNavigate, useParams, useLoaderData } from "react-router-dom";
import { useState, useContext } from "react";
import { AppContext } from "../App";

function trackIsEpisode(
  track: SpotifyApi.PlaylistTrackObject["track"]
): track is SpotifyApi.EpisodeObjectFull {
  return track.type === "episode";
}

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
                    trackIsEpisode(song.track)
                      ? song.track.images[0].url
                      : song.track.album.images[0].url
                  }
                />
              </ListItemAvatar>
              <ListItemText
                primary={`${song.track.name} ${
                  "show" in song.track
                    ? song.track.show.publisher
                    : song.track.album.artists[0].name
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
