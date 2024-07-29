import {
  CircularProgress,
  InputBase,
  Paper,
  Typography,
  Box,
  Drawer,
  Button,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CancelIcon from "@mui/icons-material/Cancel";
import { useContext, useState, FormEvent, ChangeEvent } from "react";
import toast from "react-hot-toast";
import { AppContext } from "../App";
import { handleExpiredToken } from "../helpers/handleExpiredToken";
import PlaylistList from "./PlaylistList";

type AddMenuProps = {
  currentSong: string;
};

export interface PlayListsWithTracks
  extends SpotifyApi.PlaylistObjectSimplified {
  songsOnPlayList: SpotifyApi.PlaylistTrackObject[];
}

export default function AddSongMenu({ currentSong }: AddMenuProps) {
  const { spotifyApi } = useContext(AppContext);
  const [playListsWithTracks, setPlayListsWithTracks] = useState<
    PlayListsWithTracks[]
  >([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [playListName, setPlayListName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const showFetchingDataMessage = <CircularProgress />;

  async function fetchPlayLists() {
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

      setPlayListsWithTracks(playlistAndSongs);
      setIsLoading(false);
    } catch (error) {
      handleExpiredToken(error);
    }
  }

  function toggleMenu(open: boolean) {
    return () => {
      setIsMenuOpen(open);
      if (open) {
        fetchPlayLists();
      }
    };
  }

  async function handleListItemClick(
    selectedPlayList: SpotifyApi.PlaylistObjectSimplified
  ) {
    try {
      const song = await spotifyApi.getMyCurrentPlayingTrack();
      const songToAdd = song.item?.uri;
      if (!songToAdd) {
        return;
      }
      const { items } = await spotifyApi.getPlaylistTracks(selectedPlayList.id);
      const songsOnPlayList = items;

      if (songsOnPlayList.some((song) => song.track.uri === songToAdd)) {
        toast("Song is already on this list");
        return;
      }

      await spotifyApi.addTracksToPlaylist(selectedPlayList.id, [songToAdd]);
      toast("Song Added to Playlist");
      setIsMenuOpen(false);
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
      const songToAdd = song.item?.uri;
      if (!songToAdd) {
        return;
      }

      if (
        playListsWithTracks.some(
          (list) => list.name.toUpperCase() === playListName.toUpperCase()
        )
      ) {
        toast("Cannot use this name");
        setIsLoading(false);
        setPlayListName("");
        setIsMenuOpen(false);
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
      setIsMenuOpen(false);
    } catch (error) {
      handleExpiredToken(error);
    }
  }

  return (
    <>
      <Button onClick={toggleMenu(true)}>
        <MoreVertIcon />
      </Button>
      <Drawer anchor={"bottom"} open={isMenuOpen} onClose={toggleMenu(false)}>
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

            <Button onClick={toggleMenu(false)}>
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
          {!isLoading && (
            <PlaylistList
              playListsWithTracks={playListsWithTracks}
              currentSong={currentSong}
              handleListItemClick={handleListItemClick}
            />
          )}
        </Box>
      </Drawer>
    </>
  );
}
