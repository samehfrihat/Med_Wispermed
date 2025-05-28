import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import objectToQueryString from "../utils/objectToQueryString";
import { castInt } from "../utils/castInt";
import { conceptsAsValues } from "../utils/concepts";
import queryString from "query-string";

const DEFAULT_CATEGORY = "Medical genetics";
export const QUERY_PARAMS_WHITE_LIST = [
  "query",
  "category",
  "medicalAbstracts",
  "clinicalTrials",
  "readability",
  "levelOfEvidence",
  "page",
  "year",
  "article_type",
  "concepts",
  "concepts_include",
  "pubmedQueryNum",
  "wpmQueryNum",
  "increase",
];

const useSearchForm = () => {
  const [taskBanner, setTaskBanner] = useState(null);
  const { search: searchLocation, ...loc } = useLocation();

  const history = useHistory();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const currentPathname = loc.pathname;
  const [params, setParams] = useState({
    medicalAbstracts: true,
  });
  const [isReady, setIsReady] = useState(false);

  const setupParams = (params, usePreviousParams = true) => {
    setQuery(params.query);

    setCategory(params.category);

    setParams((currentParams) => {
      currentParams = {
        ...(usePreviousParams ? currentParams : {}),
        pubmedQueryNum: currentParams.pubmedQueryNum,
        wpmQueryNum: currentParams.wpmQueryNum,
        ...params,
        ...QUERY_PARAMS_WHITE_LIST.reduce((acc, key) => {
          if (key in params) {
            if (key === "page") {
              acc[key] = castInt(params[key], 1);
            } else {
              acc[key] = params[key];
            }
          }
          return acc;
        }, {}),
      };

      if (currentParams.levelOfEvidence) {
        currentParams.levelOfEvidence = String(currentParams.levelOfEvidence)
          .split(",")
          .map((value) => parseInt(value))
          .filter((v) => !isNaN(v))
          .slice(0, 2);
      }

      if (currentParams.year) {
        currentParams.year = String(currentParams.year)
          .split(",")
          .map((value) => parseInt(value))
          .filter((v) => !isNaN(v))
          .slice(0, 2);
      }

      if (currentParams.concepts) {
        currentParams.concepts = String(currentParams.concepts).split(",");
      }

      if (
        currentParams.concepts == undefined &&
        currentParams.flag === undefined
      ) {
        currentParams.concepts = conceptsAsValues;
      }

      if (currentParams.concepts_include) {
        currentParams.concepts_include = String(
          currentParams.concepts_include
        ).split(",");
      }

      if (currentParams.concepts_include == undefined) {
        currentParams.concepts_include = [];
      }

      if (!currentParams.year || currentParams.year.length !== 2) {
        currentParams.year = undefined;
      }

      if (currentParams.article_type) {
        currentParams.article_type = String(currentParams.article_type).split(
          ","
        );
      }

      if (!currentParams.article_type) {
        currentParams.article_type = undefined;
      }

      if (currentParams.readability) {
        currentParams.readability = String(currentParams.readability).split(
          ","
        );
      }

      if (!currentParams.readability) {
        currentParams.readability = undefined;
      }
      if (currentParams.pubmedQueryNum !== undefined) {
        currentParams.pubmedQueryNum = parseInt(currentParams.pubmedQueryNum);
        if (isNaN(currentParams.pubmedQueryNum)) {
          currentParams.pubmedQueryNum = 0;
        }
      }

      if (currentParams.wpmQueryNum !== undefined) {
        currentParams.wpmQueryNum = parseInt(currentParams.wpmQueryNum);
        if (isNaN(currentParams.wpmQueryNum)) {
          currentParams.wpmQueryNum = 0;
        }
      }

      return currentParams;
    });
  };

  useEffect(() => {
    setupParams(queryString.parse(searchLocation));
    setIsReady(true);
  }, [searchLocation]);

  const resetFilters = () => {
    setupParams(
      {
        query: "",
        medicalAbstracts: true,
      },
      false
    );
  };

  const onSubmit = (extraParams = {}) => {
    // if (!query) {
    //   return;
    // }

    const allParams = {
      ...params,
      ...extraParams,
      query,
      category,
    };

    console.log('allParams' ,allParams)
    if (taskBanner === "WisPerMid" && extraParams.increase) {
      allParams.wpmQueryNum = (allParams.wpmQueryNum || 0) + 1;
    } else if (taskBanner === "Pubmed" && extraParams.increase) {
      allParams.pubmedQueryNum = (allParams.pubmedQueryNum || 0) + 1;
    }

    setParams(allParams);
    const queryString = objectToQueryString(allParams);

    if (
      currentPathname === "/search/pubmed" ||
      currentPathname === "/pubmed/result"
    ) {
      history.push({
        pathname: "/pubmed/result",
        search: queryString,
      });
    } else if (currentPathname === "/" || currentPathname === "/result") {
      console.log("test", history);
      history.push({
        pathname: "/result",
        search: queryString,
      });
    }
  };

  return {
    query,
    setQuery,
    category,
    setCategory,
    onSubmit,
    resetFilters,
    params,
    setTaskBanner,
    setParams: (params, updateURL = false) =>
      setParams((oldParams) =>
        // remove undefined
        Object.entries({ ...oldParams, ...params }).reduce(
          (acc, [key, value]) => {
            console.log("old ==", params);
            if (value !== undefined) {
              acc[key] = value;
            }
            return acc;
          },
          {}
        )
      ),
    isReady,
  };
};

export default useSearchForm;
