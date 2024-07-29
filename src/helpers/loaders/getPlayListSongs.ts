import { Params } from "react-router-dom";
import SpotifyWebApi from "spotify-web-api-js";

export default async function getPlayListSongs(
  { playlistId }: Params<string>,
  spotifyApi: SpotifyWebApi.SpotifyWebApiJs
) {
  if (playlistId !== undefined) {
    const response = await spotifyApi.getPlaylistTracks(playlistId);
    return response.items;
  }
}
