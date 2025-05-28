import { url } from "../../config";

export const submit = async (
  objA,
  objB,
  timeObjA,
  timeObjB,
  feedback,
  pageLoadTime,
  requestStartTime,
  reviews
) => {


  let token = localStorage.getItem("token");


  const response = await fetch(`${url}/user_study_feedback/`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({
      objA,
      objB,
      timeObjA,
      timeObjB,
      feedback,
      pageLoadTime,
      requestStartTime,
      reviews
    }),
  });

  const data = await response.json();


  return data;
};
