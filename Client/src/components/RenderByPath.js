import { useRouteMatch } from "react-router-dom";

export function RenderByPath({ path, children }) {
  const router = useRouteMatch();

  if (!path.includes(router.path)) {
    return null;
  }
  return children;
}
