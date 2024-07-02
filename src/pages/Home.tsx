import { Box } from "@mui/material";
import MusicPlayer from "../components/MusicPlayer";

export default function HomePage() {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight={500}
    >
      <MusicPlayer />
    </Box>
  );
}
