import { url } from "../../config";
import objectToQueryString from "../../utils/objectToQueryString";

export const searchPubmed = async (params,token) => {
  // http://172.20.9.86:7777/search_concepts?concept_query=MESH:D003643
  

  const response = await fetch(
    `${url}/search_pubmed/?${objectToQueryString(
      params
    )}` ,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: token,
      },
    }
  );

  const data = await response.json();
  console.log('data ====',data )

  if (!response.ok) {
    // create error object and reject if not a 2xx response code
    let err = new Error("HTTP status code: " + response.status);
    err.data = data;
    err.status = response.status;
    throw err;
  }

  return data;
};
