// This is part of the authentication code used to obtain a token from Spotify during login.
interface Token {
  [key: string]: string;
}

export default function getTokenFromUrl() {
  return window.location.hash
    .substring(1)
    .split("&")
    .reduce((initial: Token, item: string) => {
      console.log(initial);
      console.log(item);
      const parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
      return initial;
    }, {});
}
