import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Avatar,
  Box,
  ListItemAvatar,
} from "@mui/material";
import HeadPhonesImage from "../assets/images/headphones.jpg";
import { type PlayListsWithTracks } from "./AddSongMenu";

interface ListProps {
  playListsWithTracks: PlayListsWithTracks[];
  currentSong: string;
  handleListItemClick: (list: SpotifyApi.PlaylistObjectSimplified) => void;
}

export default function PlaylistList({
  playListsWithTracks,
  currentSong,
  handleListItemClick,
}: ListProps) {
  return (
    <Box sx={{ width: "auto" }} role="presentation">
      <List>
        {playListsWithTracks.map((list) => {
          const included = list.songsOnPlayList.some(
            (list) => list.track.uri === currentSong
          );

          return (
            <ListItem
              key={list.id}
              disablePadding
              onClick={() => handleListItemClick(list)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleListItemClick(list);
                }
              }}
            >
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar
                    alt={list.name}
                    src={
                      list.images === null
                        ? HeadPhonesImage
                        : list.images[0].url
                    }
                    variant="square"
                  />
                </ListItemAvatar>

                <ListItemText primary={list.name} />
                {included && <ListItemText primary="Song is already on list" />}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
