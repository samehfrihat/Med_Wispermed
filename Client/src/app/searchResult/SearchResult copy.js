import * as React from "react";
import { useState, useEffect } from "react";
import { url } from "../../config";
import { useHistory } from "react-router";
import useAuth from "../../hooks/useAuth";
import objectToQueryString from "../../utils/objectToQueryString";

import {useSearch} from "../../context/SearchProvider";
import { LoadingSkeleton } from "../../components/LoadingSkeleton";
import { useTheme } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { matchEntitiesInText } from "./matchEntitiesInText";
import {
  DialogContentText,
  Box,
  Container,
  Stack,
  Tooltip,
} from "@mui/material";

import Pagination from "@mui/material/Pagination";
import { styled } from "@mui/material/styles";
import { searchPubmed } from "../searchPubmed/api";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbsUpDownIcon from "@mui/icons-material/ThumbsUpDown";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import IconButton from "@mui/material/IconButton";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbsUpDownOutlinedIcon from "@mui/icons-material/ThumbsUpDownOutlined";
import { useSettings } from "../../contexts/SettingsProvider";
const StyledContainer = styled(Container)(({ theme }) => ({
  [theme.breakpoints.up("lg")]: {
    marginLeft: "150px",
    marginRight: 0,
  },
}));

const SearchResult = () => {
  const { token, guest } = useAuth();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [newPages, setPages] = useState([]);
  const [pagination, setPagination] = useState({});
  const [relevance, setRelevnace] = useState({});
  const [feedback, setFeedback] = useState({});
  const search = useSearch();
  const theme = useTheme();
  const [count, setCount] = React.useState(1);
  const [expanded, setExpanded] = React.useState({});
  const handleChange = (event, page) => {
    setLoading(true);
    search.onSubmit({
      page,
    });
  };
  const [tabs, setTabs] = React.useState([]);
  const { readability, setReadability } = useSettings();
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

  const HighlightedText = ({
    concepts = [],
    textToHighlight,
    startsOn = 0,
    font,
  }) => {
    let conceptsArray = JSON.parse(concepts);

    conceptsArray.sort((a, b) => {
      return a.start - b.start;
    });

    // let index = 0;
    // conceptsArray = conceptsArray.map((t) => {
    //   const indexOf = textToHighlight.substring(index).indexOf(t.entity);
    //   console.log(indexOf, index,)
    //   const total = t.entity.length - 1;

    //   const start = index + indexOf;
    //   index = index + indexOf + total;
    //   const end = start + total;

    //   return {
    //     ...t,
    //     start: index,
    //     end: end,
    //   };
    // });

    //const match = matchEntitiesInText();
    const { text, matchedEntities } = matchEntitiesInText(
      conceptsArray,
      textToHighlight,
      0
    );

    console.log("---------");
    return (
      <div
        style={{ fontWeight: 400, fontSize: font }}
        dangerouslySetInnerHTML={{
          __html: text,
        }}
      />
    );
  };

  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: "1px solid rgba(0, 0, 0, .125)",
  }));

  const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    // border: `1px solid ${theme.palette.divider}`,
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
  }));

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

  const BootstrapButton = styled(Button)({
    boxShadow: "none",
    textTransform: "none",
    fontSize: 16,
    padding: "6px 12px",
    border: "1px solid",
    lineHeight: 1.5,
    color: "#c4bebe",
    borderColor: "#c4bebe",
    borderRadius: 10,
    "&.MuiButton-contained": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      borderColor: theme.palette.primary.main,
    },
  });

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

  const readabilityMarks = [
    {
      value: 0,
      label: "Easy",
      color: "#108a4f",
    },
    {
      value: 25,
      label: "Medium",
      color: "#88d04dff",
    },
    {
      value: 50,
      label: "Hard",
      color: "#fcd02f",
    },
    {
      value: 75,
      label: "Expert",
      color: "#f47117",
    },
    {
      value: 100,
      label: "All",
    },
  ];

  const fetchpages = async (search) => {
    try {
      setLoading(true);
      let redirect_url = "";

      if (search.params.medicalAbstracts || search.params.clinicalTrials) {
        redirect_url = `${url}/search_query/?${objectToQueryString(
          search.params
        )}`;
        const response = await fetch(redirect_url, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: token,
          },
        });

        const json = await response.json();
        const readabilityMarksTable = readabilityMarks.reduce(
          (acc, readabilityMark) => {
            acc[readabilityMark.label.toLowerCase()] = readabilityMark.value;
            return acc;
          },
          {}
        );
        setCount(json.pagination.total_pages);

        const LE_marks_MAP = {};
        for (let i = 0; i < LE_marks.length; i++) {
          LE_marks_MAP[LE_marks[i].value] = LE_marks[i].label;
        }

        const data = json.data.map((item) => {
          return {
            ...item,
            time: item.timestamp || item.publication_date,
            loe: LE_marks_MAP[item.loe],
          };
        });
        setPages(data.slice(0, 1));

        setPagination(json.pagination);

        setLoading(false);

        try {
          const tabs = [];

          for (let item of data) {
            if (!item.concepts) {
              continue;
            }
            const concepts = JSON.parse(item.concepts);

            for (let concept of concepts) {
              let tab = tabs.find((t) => t.type == concept.type);

              if (!tab) {
                tab = {
                  type: concept.type,
                  entities: [],
                };

                tabs.push(tab);
              }

              let entity = tab.entities.find(
                (entity) => entity.id === concept.id
              );

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
              // setTab(tabs?.[0].type);

              // setEntities(
              //   tabs.flatMap((tab) => tab.entities.map((entity) => entity.entity))
              // );
              // console.log(tabs);

              setLoading(false);
            })
            .catch((error) => {
              console.error("Error fetching file:", error);
            });
        } catch (error) {
          console.error(error);
        }
      } else {
        const data = await searchPubmed(search.params, token);

        setCount(data.pagination.total_pages);
        setPages(data.data);

        setPagination(data.pagination);
        setFeedback(data.document_feedback);
        // console.log("data.document_feedback ======== ", data.document_feedback);
        data.document_feedback.forEach((element) => {
          setRelevnace((relevanceDict) => ({
            ...relevanceDict,
            [element.pmid]: element.score,
          }));
        });

        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const handleNonRelevantClick = (relevance, score, pmid) => {
    fetch(`${url}/document_feedback/`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        pmid: pmid,
        query: search.params.query,
        rank: score,
        score: relevance,
      }),
    });

    setRelevnace((relevanceDict) => ({
      ...relevanceDict,
      [pmid]: relevance,
    }));
  };
  useEffect(() => {
    if (!search.isReady) {
      return;
    }
    if (search.params.query) {
      setLoading(true);
      fetchpages(search);
    }
    //go to main page if you didn't enter a query
    else {
      history.push({ pathname: "/" });
    }
  }, [search.params, search.isReady]);

  useEffect(() => {
    if (!token || !search.params.query || !newPages) {
      return;
    }

    fetch(`${url}/search_data/`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        query: search.params.query,
        pages: newPages,
      }),
    });
  }, [newPages, search.params, token]);

  const fetchArticle = (article_url, title, user) => {
    fetch(`${url}/get_article/`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        ...user,
        search_Query: search.params.query,
        url: article_url,
        title: title,
      }),
    });
  };

  const getData = (article_url, title, pmid) => {
    if (article_url) {
      let user;
      if (search.params.query && token) {
        user = { email: token.email };
      } else {
        user = { guest: "Guest" };
      }
      fetchArticle(article_url, title, user);
    } else {
      window.location.replace("https://pubmed.ncbi.nlm.nih.gov/" + pmid);
    }
  };

  return (
    <>
      <>
        <Box className="result">
          <StyledContainer
            sx={{
              marginY: 4,
            }}
            maxWidth="md"
            className="docs"
          >
            {loading && (
              <Stack alignItems="stretch" spacing={2}>
                <LoadingSkeleton />
                <LoadingSkeleton />
                <LoadingSkeleton />
                <LoadingSkeleton />
                <LoadingSkeleton />
              </Stack>
            )}
            {newPages && (
              <Box
                sx={{
                  marginBottom: 2,
                  fontSize: 12,
                  fontStyle: "italic",
                  color: "#6b7280",
                }}
              >
                Showing <b>{newPages.length}</b> of <b>{pagination.total}</b>{" "}
                results
              </Box>
            )}
            {!!newPages && !loading && (
              <Box
                sx={{
                  margin: -2,
                }}
              >
                {newPages.map((doc, index) => (
                  <Box
                    sx={{
                      padding: 2,
                      borderRadius: 2,
                      "&:hover": {
                        background: "#f3f4f6",
                      },
                    }}
                    className="block"
                  >
                    <a
                      key={index}
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(event) =>
                        getData(doc.url, doc.brief_title || doc.title, doc.pmid)
                      }
                    >
                      <div key={index} className="task">
                        <h3>{doc.brief_title || doc.title}</h3>
                        <p>{doc.brief_summary || doc.Abstract}</p>
                      </div>
                    </a>

                    <Box
                      style={{
                        margin: "20px 0 0 0",
                      }}
                    >
                      {doc.authors && (
                        <Box
                          sx={{
                            fontSize: " .9rem",
                            color: "#4D8055",
                            // marginLeft: 2,
                          }}
                        >
                          {doc.authors.map((author, index) =>
                            index === doc.authors.length - 1
                              ? author
                              : author + ", "
                          )}
                        </Box>
                      )}

                      {(doc.publication_date || doc.timestamp) && (
                        <Box
                          sx={{
                            display: "flex",
                            fontSize: " .9rem",
                          }}
                        >
                          {doc.publication_date
                            ? doc.publication_date
                            : doc.timestamp}
                        </Box>
                      )}
                      <Stack spacing={1}>
                        <Box
                          sx={{
                            display: "flex",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flex: 1,
                              justifyContent: "flex-start",
                            }}
                          >
                            {doc.pmid && (
                              <Box
                                sx={{
                                  display: "flex",
                                  fontSize: " .9rem",
                                  color: "#4D8055",
                                }}
                              >
                                PMID :{doc.pmid} /
                              </Box>
                            )}

                            {doc.publication_types && (
                              <Box
                                sx={{
                                  fontSize: " .9rem",
                                  color: "#4D8055",
                                }}
                              >
                                publication_types :
                                {doc.publication_types.map(
                                  (publication_type, index) =>
                                    index === doc.publication_types.length - 1
                                      ? publication_type + " / "
                                      : publication_type + ", "
                                )}
                              </Box>
                            )}

                            {doc.citations && (
                              <Box
                                sx={{
                                  fontSize: " .9rem",
                                  color: "#4D8055",
                                }}
                              >
                                Citations Num :{doc.citations.length}
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Stack>
                      {/* 
                      {doc.abstract && (
                        <Box sx={{ fontSize: " 0.9rem", paddingY: 1 }}>
                          {`${doc.abstract.substring(0, 200)} , ...`}
                        </Box>
                      )} */}

                      {doc.abstract && (
                        <Accordion
                          sx={{ PaddingY: 1 }}
                          expanded={expanded[doc._id] === true}
                          key={doc._id}
                          onChange={() => {
                            setExpanded((expanded) => ({
                              ...expanded,
                              [doc._id]: !expanded[doc._id],
                            }));
                          }}
                        >
                          <AccordionSummary
                            aria-controls="panel1d-content"
                            id="panel1d-header"
                          >
                            {/* <Box sx={{ fontSize: " 0.9rem", paddingY: 1 }}>
                              {`${doc.abstract.substring(0, 150)} , ...`}
                            </Box> */}
                            {/* <HighlightedText
                              font={15}
                              concepts={doc.concepts}
                              startsOn={doc.title.length - 1}
                              textToHighlight={`${doc.abstract.substring(
                                0,
                                150
                              )} ...`}
                            /> */}
                          </AccordionSummary>
                          <AccordionDetails>
                            <HighlightedText
                              font={15}
                              startsOn={doc.title.length - 1}
                              concepts={doc.concepts}
                              textToHighlight={doc.abstract}
                            />

                            <Box sx={{ fontSize: " 0.9rem" }}>
                              {doc.abstract}
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      )}

                      {!search.params.medicalAbstracts &&
                        !search.params.clinicalTrials && (
                          <Box
                            sx={{ display: "flex", justifyContent: "flex-end" }}
                          >
                            <Tooltip title="Relevant">
                              <IconButton
                                onClick={() =>
                                  handleNonRelevantClick(1, index, doc.pmid)
                                }
                              >
                                {relevance[doc.pmid] === 1 ? (
                                  <ThumbUpAltIcon
                                    sx={{
                                      fontSize: 25,
                                      width: "0.8em",
                                      height: "0.8em",
                                    }}
                                  />
                                ) : (
                                  <ThumbUpOffAltIcon
                                    sx={{
                                      width: "0.9em",
                                      height: "0.9em",
                                    }}
                                  />
                                )}
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Partial Relevant">
                              <IconButton
                                onClick={() =>
                                  handleNonRelevantClick(2, index, doc.pmid)
                                }
                              >
                                {" "}
                                {relevance[doc.pmid] === 2 ? (
                                  <ThumbsUpDownIcon
                                    sx={{
                                      fontSize: 25,
                                      width: "0.8em",
                                      height: "0.8em",
                                    }}
                                  />
                                ) : (
                                  <ThumbsUpDownOutlinedIcon
                                    sx={{
                                      width: "0.9em",
                                      height: "0.9em",
                                    }}
                                  />
                                )}
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Non-Relevant">
                              <IconButton
                                onClick={() =>
                                  handleNonRelevantClick(0, index, doc.pmid)
                                }
                              >
                                {" "}
                                {relevance[doc.pmid] === 0 ? (
                                  <ThumbDownAltIcon
                                    sx={{
                                      width: "0.9em",
                                      height: "0.9em",
                                    }}
                                  />
                                ) : (
                                  <ThumbDownOffAltIcon
                                    sx={{
                                      width: "0.9em",
                                      height: "0.9em",
                                    }}
                                  />
                                )}
                              </IconButton>
                            </Tooltip>
                          </Box>
                        )}

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-start",
                          paddingTop: 2,
                          fontSize: " .9rem",
                          color: "#4D8055",
                        }}
                      >
                        {doc.loe && (
                          <div>
                            <DialogContentText
                              sx={{
                                fontSize: " .9rem",
                                fontWeight: "bold",
                                paddingY: 1,
                              }}
                            >
                              Level of Evidence{" "}
                            </DialogContentText>
                            {String(doc.loe)}
                          </div>
                        )}
              
                        {doc.readability && readability &&  (
                          <div>
                            <DialogContentText
                              sx={{
                                fontSize: " .9rem",
                                fontWeight: "bold",
                                paddingY: 1,
                              }}
                            >
                              Readability
                            </DialogContentText>
                            {/* {doc.readability} */}

                            <BootstrapButton
                              sx={{
                                "&:hover": {
                                  //you want this to be the same as the backgroundColor above
                                  backgroundColor: readabilityMarks.find(
                                    (mark) =>
                                      mark.label.toLowerCase() ===
                                      doc.readability
                                  ).color,
                                },
                                color: "#fff",
                                background: readabilityMarks.find(
                                  (mark) =>
                                    mark.label.toLowerCase() === doc.readability
                                ).color,
                              }}
                            >
                              {doc.readability}
                            </BootstrapButton>
                          </div>
                        )}
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}

            {newPages.length === 0 && !loading && (
              <Box
                sx={{
                  color: "#6b7280",
                }}
                component={"h3"}
              >
                Your search{" "}
                <Box
                  component="span"
                  sx={{
                    color: "#1e293b",
                  }}
                >
                  ({search.params.query})
                </Box>{" "}
                did not match any document
              </Box>
            )}

            {newPages.length > 0 && (
              <Pagination
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
                count={count}
                page={search.params.page}
                onChange={handleChange}
              />
            )}
          </StyledContainer>
        </Box>
      </>
    </>
  );
};

export default SearchResult;
