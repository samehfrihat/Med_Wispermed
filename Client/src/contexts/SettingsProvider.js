import { createContext, useContext, useEffect, useState } from "react";
import { url } from "../config";
import useAuth from "../hooks/useAuth";

const Context = createContext();

export default function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [readability, setReadability] = useState(() => {
    let val = Number(localStorage.getItem("readability"));
    val = isNaN(val) ? 0 : val;
    val = Boolean(val);

    console.log(val, "RRR");
    return val;
  });
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      return;
    }
    fetch(`${url}/get_user_info`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (!Array.isArray(json["language"])) {
          json["language"] = [json["language"]];
        }
        if (!json["specialistIn"]) {
          json["specialistIn"] = "";
        }
        setSettings(json);
        setLoading(false);
        console.log("json", json);
      })
      .catch((e) => {
        setLoading(true);
      });
  }, [token]);

  const saveSettings = () => {
    console.log(JSON.stringify(settings));
    setIsSaving(true);
    fetch(`${url}/update_user_info`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(settings),
    })
      .then((res) => res.json())
      .then((res) => {
        setIsSaving(false);
      })
      .catch(() => {
        setIsSaving(false);
      });
  };

  const switchReadability = () => {
    setReadability((readability) => {
      readability = !readability;

      localStorage.setItem("readability", readability ? 1 : 0);
      return readability;
    });
  };

  return (
    <Context.Provider
      value={{
        settings,
        setSettings,
        saveSettings,
        isSaving,
        readability,
        switchReadability,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useSettings() {
  return useContext(Context);
}
