// This is part of the authentication code used to obtain a token from Spotify during login.
interface AuthParams {
  [key: string]: string;
}

export default function getAuthParamsFromHash() {
  return window.location.hash
    .substring(1)
    .split("&")
    .reduce((initial: AuthParams, item: string) => {
      const parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
      return initial;
    }, {});
}
