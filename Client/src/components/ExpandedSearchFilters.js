import * as React from "react";

import { Popover } from "./Popover";
import dayjs from "dayjs";

import { Box, alpha, darken } from "@mui/system";
// import * as allMUI from "@mui/system";
import customParseFormat from "dayjs/plugin/customParseFormat";
import minMax from "dayjs/plugin/minMax";
import ReadabilityFilter from "./ReadabilityFilter";
import LOEFilter from "./LOEFilter";
import ArticleTypeFilter from "./ArticleTypeFilter";
import DateFilter from "./DateFilter";
import { Button, IconButton } from "@mui/material";
import ConceptsFilter from "./Layout/ConceptsFilter";

import CloseIcon from "@mui/icons-material/Close";
import ConceptsIncludeFilter from "./ConceptsIncludeFilter";
import { useSettings } from "../contexts/SettingsProvider";
dayjs.extend(customParseFormat);
dayjs.extend(minMax);

export default function ExpandedSearchFilters({ search, tabs, allEntities }) {
  const LE_marks = [
    {
      label: "1a",
      value: 0,
    },
    {
      label: "1b",
      value: 1,
    },
    {
      label: "2a",
      value: 2,
    },
    {
      label: "2b",
      value: 3,
    },
    {
      label: "3a",
      value: 4,
    },
    {
      label: "3b",
      value: 5,
    },
    {
      label: "4",
      value: 6,
    },
  ];
  const { readability, switchReadability } = useSettings();
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleReset = (reset, resetVal) => {
    if (reset === "readability") {
      const newVal = search.params.readability.filter(
        (val) => val !== resetVal
      );
      console.log("newVal", newVal);
      search.onSubmit({
        [reset]: newVal,
      });
    } else if (reset === "concepts_include") {
      const newVal = search.params.concepts_include.filter(
        (val) => val !== resetVal
      );
      search.onSubmit({
        [reset]: newVal,
      });
    } else {
      search.onSubmit({
        [reset]: resetVal,
      });
    }

    // search.setParams({
    //   gender: undefined,
    // });
  };

  // const handleMouseLeave = () => {
  //   setIsHovered(false);
  // }; 
 

  const selectedConceptes = React.useMemo(() => {
    if (!search.params.concepts_include) {
      return;
    }

    return search.params.concepts_include.map((concept) => ({
      id: concept,
      name: allEntities?.[concept]?.entity || concept,
    }));
  }, [search.params.concepts_include, allEntities]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          gap: 1,
          padding: 1,
          flexWrap: "wrap",
        }}
      >
        {!!readability && (
          <Popover label="Readability">
            <ReadabilityFilter search={search} />
          </Popover>
        )}
        <Popover label="Level of evidence">
          <LOEFilter search={search} />
        </Popover>
        <Popover label="Article Type">
          <ArticleTypeFilter search={search} />
        </Popover>
        <Popover label="Date">
          <DateFilter search={search} />
        </Popover>
        <Popover label="Bio Concepts">
          <ConceptsFilter search={search} />
        </Popover>
        <Popover label="Include Concepts">
          <ConceptsIncludeFilter search={search} tabs={tabs} />
        </Popover>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          gap: 1,
          padding: 1,
        }}
      >
        {!!search.params.readability && (
          <Box>
            {search.params.readability.map((item, index) => (
              <FilterButton
                color="#808080"
                onClick={() => handleReset("readability", item)}
                label={item}
              />
            ))}
          </Box>
        )}

        {search.params.article_type && (
          <Box>
            <FilterButton
              color="#d3bea5"
              onClick={() => handleReset("article_type")}
              label={search.params.article_type}
            />
          </Box>
        )}

        {!!search.params.levelOfEvidence && (
          <Box>
            <FilterButton
              color="#917a7a"
              onClick={() => handleReset("levelOfEvidence")}
              label={
                "LoE: " +
                LE_marks.find(
                  (item) => item.value === search.params.levelOfEvidence[0]
                ).label +
                "  -  " +
                LE_marks.find(
                  (item) => item.value === search.params.levelOfEvidence[1]
                ).label
              }
            />
          </Box>
        )}

        {!!search.params.year && (
          <Box>
            {/* <Button variant="contained" sx={{borderRadius:12 , background:"#808080"}} > {search.params.readability} </Button> */}
            <FilterButton
              color="#9e9e9e"
              onClick={() => handleReset("year")}
              label={search.params.year[0] + " - " + search.params.year[1]}
            />
          </Box>
        )}

        {!!selectedConceptes && !!tabs?.length && (
          <Box display="flex" gap={1} flexWrap={"wrap"}>
            {selectedConceptes.map((item, index) => (
              <FilterButton
                color="#9e6b6bdb"
                onClick={() => handleReset("concepts_include", item.id)}
                label={item.name}
              />
            ))}
          </Box>
        )}
      </Box>
    </>
  );
}

const FilterButton = ({ color, onClick, label }) => {
  return (
    <Button
      variant={"outlined"}
      sx={{
        borderRadius: 12,
        marginX: 0.2,
        background: color,
        color: "#fff",
        display: "inline-flex",
        alignItems: "center",
        position: "relative",
        "&:hover": {
          borderColor: darken(color, 0.1),
          background: alpha(color, 0.8),
        },
      }}
    >
      <IconButton
        component="span"
        onClick={onClick}
        size="small"
        sx={{
          p: 0,
          marginRight: 0.5,
          marginLeft: -1,
          "&:hover": {
            color: "#fff",
          },
        }}
      >
        <CloseIcon sx={{ fontSize: 18 }} />
      </IconButton>
      {label}
    </Button>
  );
};
