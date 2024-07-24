import { useLoaderData, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
} from "@mui/material";
import HeadPhonesImage from "../assets/images/headphones.jpg";

export default function LibraryPage() {
  const lists = useLoaderData() as SpotifyApi.PlaylistObjectSimplified[];
  const navigate = useNavigate();

  function handleItemClick(id: string) {
    navigate(`/library/${id}`);
  }

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
      {lists.map((list) => {
        return (
          <Card
            sx={{ width: 250, margin: "10px 10px" }}
            key={list.id}
            onClick={() => handleItemClick(list.id)}
          >
            <CardActionArea>
              <CardMedia
                component="img"
                height="250"
                width="250"
                image={
                  list.images === null ? HeadPhonesImage : list.images[0].url
                }
                alt="playlist image"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {list.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {list.type}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        );
      })}
    </Container>
  );
}
