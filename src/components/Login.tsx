import { Link } from "react-router-dom";
import { Box } from "@mui/material";

export default function Login() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "50vh",
      }}
    >
      <Link to="http://localhost:8888">Login</Link>
    </Box>
  );
}
