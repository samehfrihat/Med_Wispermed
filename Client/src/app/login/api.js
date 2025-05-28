import { url } from "../../config";

export const login = async (email, password) => {
  const response = await fetch(`${url}/login/`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    // create error object and reject if not a 2xx response code
    let err = new Error("HTTP status code: " + response.status);
    err.data = data;
    err.status = response.status;
    throw err;
  }


  return data;
};
