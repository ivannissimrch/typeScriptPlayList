import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import {
  Avatar,
  CircularProgress,
  InputBase,
  ListItemAvatar,
  Paper,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useContext, useState, FormEvent, ChangeEvent } from "react";
import { AppContext } from "../App";
import toast from "react-hot-toast";
import CancelIcon from "@mui/icons-material/Cancel";
import { handleExpiredToken } from "../helpers/handleExpiredToken";

type AddMenuProps = {
  currentSong: string;
};

interface PlayListWithTracksInterface
  extends SpotifyApi.PlaylistObjectSimplified {
  songsOnPlayList: SpotifyApi.PlaylistTrackObject[];
}

export default function AddSongMenu({ currentSong }: AddMenuProps) {
  const { spotifyApi } = useContext(AppContext);
  const [playListWithTracks, setPlayListWithTracks] = useState<
    PlayListWithTracksInterface[]
  >([]);
  const [state, setState] = useState({
    bottom: false,
  });
  const [playListName, setPlayListName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const showFetchingDataMessage = <CircularProgress />;

  async function fetchPlayList() {
    try {
      setIsLoading(true);
      const playListData = await spotifyApi.getUserPlaylists();
      const playlistAndSongs = await Promise.all(
        playListData.items.map(async (list) => {
          const { items } = await spotifyApi.getPlaylistTracks(list.id);
          const songsOnPlayList = items;
          return { ...list, songsOnPlayList };
        })
      );

      setPlayListWithTracks(playlistAndSongs);
      setIsLoading(false);
    } catch (error) {
      handleExpiredToken(error);
    }
  }

  const toggleDrawer = (anchor: string, open: boolean) => () => {
    setState({ ...state, [anchor]: open });
    if (open) {
      fetchPlayList();
    }
  };

  const list = (anchor: string) => {
    return (
      <Box
        sx={{ width: anchor === "bottom" ? "auto" : 250 }}
        role="presentation"
      >
        <List>
          {playListWithTracks.map((list) => {
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
                      alt={`{list.name}`}
                      src={list.images !== null ? list.images[0].url : ""}
                      variant="square"
                    />
                  </ListItemAvatar>

                  <ListItemText primary={list.name} />
                  {included && (
                    <ListItemText primary="Song is already on list" />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    );
  };

  async function handleListItemClick(
    selectedPlayList: SpotifyApi.PlaylistObjectSimplified
  ) {
    try {
      const song = await spotifyApi.getMyCurrentPlayingTrack();
      const songToAdd = song?.item?.uri as string;
      const { items } = await spotifyApi.getPlaylistTracks(selectedPlayList.id);
      const songsOnPlayList = items;

      if (songsOnPlayList.some((song) => song.track.uri === songToAdd)) {
        toast("Song is already on this list");
        return;
      }

      await spotifyApi.addTracksToPlaylist(selectedPlayList.id, [songToAdd]);
      toast("Song Added to Playlist");
      setState((prev) => ({ ...prev, bottom: false }));
    } catch (error) {
      handleExpiredToken(error);
    }
  }

  function handleNewPlaylistInputChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setPlayListName(event.target.value);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault();
      setIsLoading(true);
      const song = await spotifyApi.getMyCurrentPlayingTrack();
      const songToAdd = song?.item?.uri as string;

      if (
        playListWithTracks.some(
          (list) => list.name.toUpperCase() === playListName.toUpperCase()
        )
      ) {
        toast("Cannot use this name");
        setIsLoading(false);
        setPlayListName("");
        setState((prev) => ({ ...prev, bottom: false }));
        return;
      }

      const userId = await spotifyApi.getMe();
      const playList = await spotifyApi.createPlaylist(`${userId.id}`, {
        name: playListName,
      });

      await spotifyApi.addTracksToPlaylist(playList.id, [songToAdd]);
      setPlayListName("");
      setIsLoading(false);
      toast("Song Added to Playlist");
      setState((prev) => ({ ...prev, bottom: false }));
    } catch (error) {
      handleExpiredToken(error);
    }
  }

  return (
    <>
      <Button onClick={toggleDrawer("bottom", true)}>
        <MoreVertIcon />
      </Button>
      <Drawer
        anchor={"bottom"}
        open={state["bottom"]}
        onClose={toggleDrawer("bottom", false)}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            padding: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h5">Add To PlayList</Typography>

            <Button onClick={toggleDrawer("bottom", false)}>
              <CancelIcon />
            </Button>
          </Box>
          <Paper component="form" onSubmit={handleSubmit}>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Create playlist and add song"
              inputProps={{ "aria-label": "Create new playlist" }}
              onChange={handleNewPlaylistInputChange}
              value={playListName}
            />
          </Paper>
          <Typography variant="h6">Save in</Typography>
          {isLoading && showFetchingDataMessage}
          {!isLoading && <Box>{list("bottom")}</Box>}
        </Box>
      </Drawer>
    </>
  );
}
