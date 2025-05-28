import { url } from "../../config";

export const submit = async (formData) => {
  const response = await fetch(`${url}/user_study_feedback/`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
data:formData
      
    }),
  });

  const data = await response.json();

  return data;
};