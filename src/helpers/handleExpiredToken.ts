import toast from "react-hot-toast";
interface HttpError extends Error {
  status?: number;
}

export function handleExpiredToken(error: HttpError) {
  if (error.status === 401) {
    toast("Token expired please login again");
    localStorage.removeItem("token");
    window.location.reload();
  } else {
    throw error;
  }
}
