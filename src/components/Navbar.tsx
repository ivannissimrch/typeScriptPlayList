import { AppBar, Toolbar, Tabs, Tab } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  let currentTabValue = 0;
  if (pathname.startsWith("/") || pathname.startsWith(" ")) {
    currentTabValue = 0;
  }
  if (pathname.startsWith("/search")) {
    currentTabValue = 1;
  }
  if (pathname.startsWith("/library")) {
    currentTabValue = 2;
  }

  function handleLogout() {
    navigate("/");
    localStorage.removeItem("token");
    window.location.reload();
  }

  return (
    <AppBar position="static">
      <Toolbar
        sx={{
          p: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Tabs
          sx={{
            p: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
          centered
          value={currentTabValue}
          indicatorColor="secondary"
        >
          <Tab
            value={0}
            label={
              <Link to="">
                <HomeIcon fontSize="large" sx={{ color: "white" }} />
              </Link>
            }
          />
          <Tab
            value={1}
            label={
              <Link to="search">
                <SearchIcon fontSize="large" sx={{ color: "white" }} />{" "}
              </Link>
            }
          />
          <Tab
            value={2}
            label={
              <Link to="library">
                <LibraryMusicIcon fontSize="large" sx={{ color: "white" }} />
              </Link>
            }
          />
          <Tab
            value={3}
            label={
              <Link to="/" onClick={handleLogout}>
                <LogoutIcon fontSize="large" sx={{ color: "white" }} />
              </Link>
            }
          />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
}
