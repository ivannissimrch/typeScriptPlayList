import { useRouteError } from "react-router-dom";
export default function ErrorPage() {
  const error = useRouteError() as Error;
  return <div>{error.message ? error.message : "Page not found"}</div>;
}
