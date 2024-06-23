//get spotify token from local storage

export default function localStorageToken() {
  const token = localStorage.getItem("token");
  return token;
}
