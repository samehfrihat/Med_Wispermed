import { url } from "../../config";

export const SubmitDemographicForm = async (language, Gender,specialistIn) => {
  const response = await fetch(`${url}/saveSearchSettings/`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      language,
      Gender,
      specialistIn
      
    }),
  });

  const data = await response.json();

  return data;
};