import { useEffect, useMemo } from "react";
import { useHistory } from "react-router";
import { url } from "../config";
import { useSelectedTask } from "../contexts/SelectedTaskProvider";

const getStorageObject = (name) => {
  try {
    return JSON.parse(localStorage.getItem(name));
  } catch (error) {}
};

export default function useAuth() {
  let user = useMemo(() => getStorageObject("user"), []);
  let token = useMemo(() => localStorage.getItem("token"), []);

  const history = useHistory();

  const isAuthorized = Boolean(token);
  const { clearCurrentTask } = useSelectedTask();
  const logout = () => {
    fetch(`${url}/logout/`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: token,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        clearCurrentTask();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        history.push("/login");
      });
  };

  return {
    token,
    isAuthorized,
    logout,
    user,
    isGuest: isAuthorized && Boolean(user.is_guest),
  };
}
