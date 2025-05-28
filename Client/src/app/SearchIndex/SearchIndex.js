import * as React from "react";

import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Pagination from "@mui/material/Pagination";
import FormControl from "@mui/material/FormControl";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {
  Button,
  Divider,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CustomizedTabPanel from "../../components/CustomizedTabPanel";
import { searchConcept } from "./api";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import CircularProgress from "@mui/material/CircularProgress";
const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));
const ITEMS_PER_PAGE = 10; // Number of articles per page

const colors = ["#7aecec", "#bfeeb7", "#007bff"];

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const SearchIndex = () => {
  const [expanded, setExpanded] = React.useState({});

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const [tabs, setTabs] = React.useState([]);

  const [query, setQuery] = React.useState({});

  const [tab, setTab] = React.useState();
  const [loading, setLoading] = React.useState(false);

  const [data, setData] = React.useState([]);
  const [entities, setEntities] = React.useState([]);

  const [selected, setSelected] = React.useState({});

  const highlightedEntitiesWithTypes = React.useMemo(() => {
    const visited = {};
    const result = [];
    for (let tab of tabs) {
      for (let entity of tab.entities) {
        if (entity !== undefined && visited[entity.entity]) {
          continue;
        }

        result.push(entity);
      }
    }

    return result;
  }, [tabs]);

  const selectedTabContent = React.useMemo(() => {
    return tabs.find((t) => t.type === tab);
  }, [tabs, tab]);

  const onSubmit = async () => {
    try {
      setLoading(true);
      const data = await searchConcept(query);
      setData(data);

      const tabs = [];

      for (let item of data) {
        if (!item._source.concepts) {
          continue;
        }
        const concepts = JSON.parse(item._source.concepts);

        for (let concept of concepts) {
          let tab = tabs.find((t) => t.type == concept.type);

          if (!tab) {
            tab = {
              type: concept.type,
              entities: [],
            };

            tabs.push(tab);
          }

          let entity = tab.entities.find((entity) => entity.id === concept.id);

          if (!entity) {
            entity = { ...concept, frequency: 0 };
            tab.entities.push(entity);
          }
          entity.frequency++;
        }
      }

      tabs.forEach((tab) => {
        tab.entities.sort((a, b) => b.frequency - a.frequency);
      });

      // console.log('tabs =========',tabs)

      // Assuming tabs is your array with entities

      // Read the content of the .txt file
      fetch("/mesh_lut.txt") // Adjust the path as needed
        .then((response) => response.text())
        .then((txtContent) => {
          // Split the content into lines
          const lines = txtContent.split("\n");

          // Create a mapping of IDs to entity names
          const idToEntityMap = {};
          lines.forEach((line) => {
            const [id, entity] = line.split("||");
            idToEntityMap[id] = entity;
          });

          // console.log('idToEntityMap ======',idToEntityMap['D009369'])

          // Update entities with entity names
          tabs.forEach((tab) => {
            tab.entities.forEach((entity) => {
              entity.id = entity.id.split("MESH:").pop();
              const entityId = entity.id;

              // console.log('idToEntityMap[entityId] ' , idToEntityMap[entityId] , entityId )

              if (idToEntityMap[entityId]) {
                entity.entity = idToEntityMap[entityId];
              }
            });
          });

          setTabs(tabs);
          setTab(tabs?.[0].type);

          setEntities(
            tabs.flatMap((tab) => tab.entities.map((entity) => entity.entity))
          );
          console.log("tabs", tabs);

          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching file:", error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const HighlightedText = ({ concepts = [], textToHighlight, font }) => {
    const wordBoundaryRegex = /\b\w+\b/g; // Regular expression to match whole words

    // Create a dictionary for faster lookup
    const conceptsDict = concepts.reduce((dict, entity) => {
      dict[entity.entity] = entity;
      return dict;
    }, {});

    // console.log('conceptsDict ==' , conceptsDict)

    const highlightedText = textToHighlight.replace(
      wordBoundaryRegex,
      (word) => {
        if (conceptsDict[word]) {
          const { entity, type } = conceptsDict[word];

          // Define a mapping from types to colors
          const typeToColor = {
            Disease: "#7aecec",
            Drug: "#bfeeb7",
            Species: "#feca74",
            HLA: "#ff9561",
            Gene: "#aa9cfc",
            CellLine: "#c887fb",
          };

          // Get the color based on the type or use a default color
          const color = typeToColor[type] || "#7aecec";

          return `<span class="highlighted" style=" background-color: ${color};">${entity} </span>
              <span class="highlighted-type" style=" background-color: ${color};">${type}</span>`;
        }
        return word;
      }
    );

    return (
      <div
        style={{ fontWeight: 400, fontSize: font }}
        dangerouslySetInnerHTML={{
          __html: highlightedText,
        }}
      />
    );
  };

  const [currentPage, setCurrentPage] = React.useState(1);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const displayedArticles = React.useMemo(() => {
    const displayedArticles =
      Object.values(selected).filter(Boolean).length > 0
        ? data.filter((article) => {
            if (!article._source.concepts) {
              return false;
            }
            return JSON.parse(article._source.concepts)?.some(
              (entity) => !!selected[entity.id + entity.entity]
            );
          })
        : data;

    return displayedArticles;
  }, [currentPage, data, selected]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const paginatedData = displayedArticles.slice(startIndex, endIndex);

  const handleReset = () => {
    window.location.reload(); // Refresh the page to reset everything
  };

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        // alignItems: "center",
        justifyContent: "center",
        p: 6,
        // m: 1,
        // width: "100%",
        // maxWidth: 800 ,
        flexShrink: 0,
      }}
    >
      <Box
        component="form"
        noValidate
        sx={{ display: "flex", justifyContent: "flex-start" }}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        //   onChange={setChange}
      >
        <FormControl sx={{ minWidth: 650, justifyContent: "flex-start" }}>
          <Box sx={{ marginY: 1, fontWeight: 700, fontSize: "24px" }}>
            {" "}
            Elastic Search For Pubmed{" "}
          </Box>
          <TextField
            name="typein"
            label="Type in eg. Melanoma"
            fullWidth
            sx={{ marginY: 1 }}
            onChange={(e) => setQuery({ query: e.target.value })}
          ></TextField>
          <TextField
            name="mesh"
            label="Concept Combinations eg. MESH:D003643"
            fullWidth
            sx={{ marginY: 1 }}
            onChange={(e) => setQuery({ concept_query: e.target.value })}
          ></TextField>
          <Stack spacing={1}>
            <Button
              name="search"
              type="submit"
              variant="contained"
              sx={{
                maxWidth: "120px",
              }}
            >
              {" "}
              Search
            </Button>
            <Button
              name="reset"
              variant="outlined"
              sx={{
                maxWidth: "120px",
              }}
              onClick={handleReset}
            >
              {" "}
              Reset
            </Button>
            {loading && (
              <CircularProgress sx={{ marginLeft: 2 }} color="inherit" />
            )}
          </Stack>
        </FormControl>
      </Box>
      <Box
        sx={{
          margin: 2,
          width: "100%",
        }}
      >
        {/* {sections.length > 0 && ( */}
        <Divider variant="middle" />
        {/* //   )} */}
      </Box>

      {!!tabs.length && !!tab && (
        <Box sx={{ border: "1px solid #f5f5f5", padding: "1rem" }}>
          <Tabs value={tab} onChange={(e, tab) => setTab(tab)}>
            {tabs.map((tab) => (
              <Tab key={tab.type} label={tab.type} value={tab.type} />
            ))}
          </Tabs>
          {!!selectedTabContent && (
            <CustomizedTabPanel
              key={tab}
              tab={tab}
              data={selectedTabContent}
              selected={selected}
              setSelected={setSelected}
            />
          )}
        </Box>
      )}

      <Box>
        {paginatedData &&
          paginatedData.map((article) => (
            <Box sx={{ padding: 2 }}>
              <HighlightedText
                font={22}
                concepts={highlightedEntitiesWithTypes}
                textToHighlight={article._source.title}
              />

              {article._source.abstract && (
                <Accordion
                  sx={{ padding: 2, marginY: 2 }}
                  expanded={expanded[article._id] === true}
                  key={article._id}
                  onChange={() => {
                    setExpanded((expanded) => ({
                      ...expanded,
                      [article._id]: !expanded[article._id],
                    }));
                  }}
                >
                  <AccordionSummary
                    aria-controls="panel1d-content"
                    id="panel1d-header"
                  >
                    <HighlightedText
                      font={15}
                      concepts={highlightedEntitiesWithTypes}
                      textToHighlight={`${article._source.abstract.substring(
                        0,
                        150
                      )} ...`}
                    />
                  </AccordionSummary>
                  <AccordionDetails>
                    <HighlightedText
                      concepts={highlightedEntitiesWithTypes}
                      textToHighlight={article._source.abstract}
                    />
                  </AccordionDetails>
                </Accordion>
              )}
              <Box sx={{ padding: 2 }}>
                PMID :
                <Link
                  href={`https://pubmed.ncbi.nlm.nih.gov/${article._source.pmid}`}
                  underline="none"
                >
                  {article._source.pmid}
                </Link>
                In : {article._source.journal.ISOAbbreviation} ,{" "}
                {article._source.timestamp}
              </Box>
              <Divider />
            </Box>
          ))}
      </Box>

      {data && (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
          <Pagination
            count={Math.ceil(displayedArticles.length / ITEMS_PER_PAGE)}
            page={currentPage}
            onChange={(event, newPage) => handlePageChange(newPage)}
          />
        </Box>
      )}
    </Box>
  );
};

export default SearchIndex;
