import SpotifyWebApi from "spotify-web-api-js";

export default async function getPlayList(
  spotifyApi: SpotifyWebApi.SpotifyWebApiJs
) {
  const response = await spotifyApi.getUserPlaylists();
  return response.items;
}
