import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../App";

interface SearchListProps {
  searchResultsSongs: SpotifyApi.TrackObjectFull[];
}

export default function SearchList({ searchResultsSongs }: SearchListProps) {
  const navigate = useNavigate();
  const { playSelectedSong } = useContext(AppContext);

  function handleOnClick(song: SpotifyApi.TrackObjectFull) {
    playSelectedSong(song.uri);
    navigate("/");
  }

  return (
    <List dense sx={{ width: "100%", bgcolor: "background.paper" }}>
      {searchResultsSongs.map((song) => {
        return (
          <ListItem key={song.id} onClick={() => handleOnClick(song)}>
            <ListItemButton>
              <ListItemAvatar>
                <Avatar
                  variant="square"
                  alt="Album image"
                  src={song.album.images[0].url}
                />
              </ListItemAvatar>
              <ListItemText
                primary={`${song.name} ${song.album.artists[0].name} `}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
