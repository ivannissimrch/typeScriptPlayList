// This is part of the authentication code used to obtain a token from Spotify during login.
export default function getTokenFromUrl() {
  const urlHashParams = window.location.hash
    .substring(1)
    .split("&")
    .reduce((initial, item) => {
      const parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
      return initial;
    }, {} as Record<string, string | undefined>);

  return urlHashParams.access_token;
}
