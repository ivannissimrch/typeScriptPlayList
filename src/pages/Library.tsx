import { Container } from "@mui/material";

export default function LibraryPage() {
  return (
    <Container
      sx={{
        display: "flex",
        alignItems: "stretch",
        justifyContent: "center",
        direction: "row",
        flexWrap: "wrap",
      }}
    >
      Display library
    </Container>
  );
}
