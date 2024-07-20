import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../App";

interface SearchListProps {
  searchResultsSongs: SpotifyApi.TrackSearchResponse;
}

export default function SearchList({ searchResultsSongs }: SearchListProps) {
  const navigate = useNavigate();
  const { playSelectedSong } = useContext(AppContext);

  function handleOnClick(song: SpotifyApi.TrackObjectFull) {
    playSelectedSong([song.uri]);
    navigate("/");
  }

  return (
    <List dense sx={{ width: "100%", bgcolor: "background.paper" }}>
      {searchResultsSongs.tracks.items.map((song) => {
        const labelId = `checkbox-list-secondary-label-${song}`;
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
                id={labelId}
                primary={`${song.name} ${song.album.artists[0].name} `}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
