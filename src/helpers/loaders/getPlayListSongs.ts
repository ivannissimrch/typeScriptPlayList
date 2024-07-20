export default async function getPlayListSongs({ playlistId }, spotifyApi) {
  const response = await spotifyApi.getPlaylistTracks(playlistId);
  return response.items;
}
