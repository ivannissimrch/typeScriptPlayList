import toast from "react-hot-toast";
export interface HttpError extends Error {
  status?: number;
}

export function handleExpiredToken(error: unknown) {
  if ((error as HttpError).status === 401) {
    toast("Token expired please login again");
    localStorage.removeItem("token");
    window.location.reload();
  } else {
    throw error;
  }
}
