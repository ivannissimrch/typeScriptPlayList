import { Box, Container, Paper, InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import toast from "react-hot-toast";
import SearchList from "../components/SearchList";
import { HttpError } from "../helpers/handleExpiredToken";

export default function SearchPage() {
  const [searchResults, setSearchResults] =
    useState<SpotifyApi.TrackObjectFull[]>();
  const [songToSearch, setSongToSearch] = useState("");
  const { spotifyApi } = useContext(AppContext);
  const navigate = useNavigate();

  function handleOnChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setSongToSearch(event.target.value);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault();
      const results = await spotifyApi.searchTracks(songToSearch);
      setSearchResults(results.tracks.items);
      setSongToSearch("");
    } catch (error: unknown) {
      if ((error as HttpError).status === 401) {
        toast("Token expired please login again");
        localStorage.removeItem("token");
        navigate("/");
        window.location.reload();
      } else {
        throw error;
      }
    }
  }

  return (
    <Box
      sx={{
        p: "8px 8px",
        m: "4px 4px",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            margin: "8px 8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
          onSubmit={handleSubmit}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search Song"
            inputProps={{ "aria-label": "search Song" }}
            onChange={handleOnChange}
            value={songToSearch}
            id="searchSongBar"
          />
          <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
        <Box
          sx={{
            p: "0px 0px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          {searchResults && <SearchList searchResultsSongs={searchResults} />}
        </Box>
      </Container>
    </Box>
  );
}
