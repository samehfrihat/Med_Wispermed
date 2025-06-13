import * as React from "react";
import { useState, useEffect,useRef } from "react";
import MUIPopover from "@mui/material/Popover";
import { url } from "../../config";
import { useHistory } from "react-router";
import useAuth from "../../hooks/useAuth";
import objectToQueryString from "../../utils/objectToQueryString";
import { LoadingSkeleton } from "../../components/LoadingSkeleton";
import { useTheme } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import ButtonGroup from '@mui/material/ButtonGroup';
import { useLocation } from "react-router-dom";
import { Popover } from "./../../components/Popover";
import { Typography } from '@mui/material';
import axios from 'axios';
import Xarrow from 'react-xarrows';
import { useXarrow } from 'react-xarrows';

import {
  DialogContentText,
  Box,
  Container,
  Stack,
  Tooltip,
} from "@mui/material";

import ReactWordcloud from "react-wordcloud";

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
import Layout from "../../components/Layout";
import { useSearch } from "../../contexts/SearchProvider";

import { useSettings } from "../../contexts/SettingsProvider";
import { useSelectedTask } from "../../contexts/SelectedTaskProvider";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import zIndex from "@mui/material/styles/zIndex";




const typeDetails = {
  Gene: [
    ["Description", "estrogen receptor 1"],
    ["Location", "6q25.1-q25.2"],
    ["Organism", "Homo sapiens"],
    ["Alias", "ER, ESR, ESRA, ESTRR, Era, NR3A1"],
  ],

  Disease: [
    ["Neoplasms"],
    [
      "Description",
      "New abnormal growth of tissue. Malignant neoplasms show a greater degree of anaplasia and have the properties of invasion and metastasis, compared to benign neoplasms.",
    ],
  ],
  Mutation: [["Identifier", "p.F404L"]],
  Species: [
    ["Homo Sapiens"],
    ["Rank", "species"],
    ["Species", "sapiens"],
    ["Genus", "Homo"],
    ["Division", "Primates"],
  ],
  Cellline: [["Identifier", "CVCL_2676"]],
  Chemical: [["Description", "N/A"]],
};

const LE_marks = [
  {
    label: "1a",
    value: 0,
    description:
      "Background information on the topic, sourced from systematic reviews of randomized controlled trials.",
  },
  {
    label: "1b",
    value: 1,
    description: "Data derived from individual randomized controlled trials.",
  },
  {
    label: "2a",
    value: 2,
    description: "Insights from systematic reviews of cohort studies.",
  },
  {
    label: "2b",
    value: 3,
    description:
      "Details from individual cohort studies or low-quality randomized controlled trials.",
  },
  {
    label: "3a",
    value: 4,
    description: "Information from systematic reviews of case-control studies.",
  },
  {
    label: "3b",
    value: 5,
    description: "Data from individual case-control studies.",
  },
  {
    label: "4",
    value: 6,
    description:
      "Observations from case series or poor quality cohort and case-control studies.",
  },
];

const AnimatedDots = () => {
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev < 3 ? prev + 1 : 1));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const dots = '●'.repeat(dotCount);

  return (
    <Typography sx={{ mt: 2, fontStyle: 'italic', color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
      {/* 图标图片 */}
      <Box component="img"
        src="/llm.png" // 替换成你的图片地址
        alt="icon"
        sx={{ width: 30, height: 30, mr: 1 }}
      />

      {/* 动态圆点 */}
      <Box
        component="span"
        sx={{
          display: 'inline-block',
          fontSize: '1.5rem',
          ml: 1,
          letterSpacing: 1,
          color: 'green',
        }}
      >
        {dots}
      </Box>
    </Typography>
  );
};

function splitIntoSentences(text) {
  const resluts = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  return resluts
};



const CLOUD_SIZE = 200;

const SearchResult = ({ state }) => {
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
  const [clicked, setClicked] = useState(false);
  const handleChange = (event, page) => {
    setLoading(true);
    search.onSubmit({
      ...search.params,
      page,
    });
  };

  const { relevanceCount, setRelevanceCount } = useSelectedTask();

  const [tabs, setTabs] = React.useState([]);

  const [hoveredDocId, setHoveredDocId] = useState("");

  const handleDocumentHover = (docId) => {
    setHoveredDocId(docId);
  };

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
  const { readability, switchReadability } = useSettings();

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
    fontSize: 15,
    padding: "6px 12px",
    border: "1px solid",
    lineHeight: 1.1,
    color: "#c4bebe",
    borderColor: "#c4bebe",
    borderRadius: 10,
    "&.MuiButton-contained": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      borderColor: theme.palette.primary.main,
    },
  });

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
    // {
    //   value: 100,
    //   label: "All",
    // },
  ];

  const location = useLocation();
  const currentPathname = location.pathname;
  const [allEntities, setAllEntities] = useState({});
  const findReadabilityMarkColor = (readability) => {
    const readabilityMark = readabilityMarks.find((mark) => {
      return mark.label.toLowerCase() === String(readability).toLowerCase();
    });

    return readabilityMark?.color || "black";
  };

  const highlightDoc = (item) => {
    const conceptsArray = JSON.parse(item.concepts);
    let sortedItems = conceptsArray.sort(
      (a, b) => parseInt(a.start) - parseInt(b.start)
    );
    let abstract = "";
    let accAbstract = "";
    let title = "";
    let index = 0;

    sortedItems.map((concept) => {
      if (
        concept.start > item.title.length &&
        (search.params.concepts || []).includes(
          String(concept.type).toLowerCase()
        )
      ) {
        let end = parseInt(concept.end) - item.title.length;
        if (
          item.abstract[end] === concept.entity[concept.entity.length - 1] &&
          item.abstract[end - 1] === concept.entity[concept.entity.length - 2]
        ) {
          end++;
        }

        abstract += item.abstract
          .substring(index, end)
          .replace(concept.entity, highlighterm(concept));

        accAbstract += item.accAbstract
          .substring(index, end)
          .replace(concept.entity, highlighterm(concept));

        index = end;
      }
    });
    abstract += item.abstract.substring(index, item.abstract.length);
    accAbstract += item.accAbstract.substring(index, item.accAbstract.length);
    item.abstract = abstract;
    item.accAbstract = accAbstract;
  };

  const filter = (data) => {
    data.map((item) => {
      highlightDoc(item);
    });
  };
  // Define a mapping from types to colors

  const typeToColor = {
    Disease: "#ff9800",
    Drug: "#4caf50",
    Chemical: "#4caf50",
    Species: "#2196f3",
    HLA: "#5d4037",
    Mutation: "#5d4037",
    Gene: "#673ab7",
    CellLine: "#50b4b4",
  };
  const typeBGColor = {
    Disease: "#ffe0b2",
    Drug: "#c8e6c9",
    Chemical: "#c8e6c9",
    Species: "#dcf1fc",
    HLA: "#d7ccc8",
    Mutation: "#d7ccc8",
    Gene: "#e1bee7",
    CellLine: "#b2ebf2",
  };

  const highlighterm = ({ entity, type, id }) => {
    const color = typeToColor[type] || "#7aecec";
    const BGcolor = typeBGColor[type] || "#7aecec";

    // const replacement = `<span class="highlighted" style=" background-color: ${BGcolor}; color: ${color};">${term} </span> <span class="highlighted-type" style=" background-color: ${BGcolor}; color: ${color};"> ${type}</span>`;
    const replacement = `<span class="highlighted highlighted__word" data-entity="${entity}"
    data-color="${color}"
    data-id="${id}"
    data-type="${type}"  style="background-color: transparent; color: ${color};">${entity}</span>`; //transparent //

    return replacement;
  };

  const fetchpages = async (search) => {
    try {
      setLoading(true);
      let redirect_url = "";
      let savedEntities = {};
      // 获取本地缓存的Entities
      try {
        savedEntities = JSON.parse(localStorage.getItem("entities"));
        if (!savedEntities || typeof savedEntities !== "object") {
          savedEntities = {};
        }
      } catch (error) {
        savedEntities = {};
      }
      
      if (currentPathname === "/result") {
        // 配置查询路径
        redirect_url = `${url}/search_query/?${objectToQueryString(
          search.params
        )}`;

        // 进行查询
        const response = await fetch(redirect_url, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: token,
          },
        });

        // 格式化结果为JSON
        const json = await response.json();

        const readabilityMarksTable = readabilityMarks.reduce(
          (acc, readabilityMark) => {
            acc[readabilityMark.label.toLowerCase()] = readabilityMark.value;
            return acc;
          },
          {}
        );

        json.data = json.data;
        setCount(json.pagination.total_pages);

        const LE_marks_MAP = {};
        for (let i = 0; i < LE_marks.length; i++) {
          LE_marks_MAP[LE_marks[i].value] = LE_marks[i].label;
        }

        function truncateByWords(text, maxCharLimit) {
          return text.slice(0, maxCharLimit).split(' ').slice(0,-1).join(' ');
        }

        const data = json.data.map((item) => {
          return {
            ...item,
            time: item.timestamp || item.publication_date,
            loe: LE_marks_MAP[item.LoE],
            accAbstract: truncateByWords(item.abstract, 210),
            // FOR SUMMARIZATION
            abstract_s: item.abstract,
            loading: false,
            selectedAspect: 'Objective',
            summaries: []
          };
        });

        try {
          const tabs = [];

          for (let item of data) {
            if (!item.concepts) {
              continue;
            }
            const concepts = JSON.parse(item.concepts);

            for (let concept of concepts) {
              let tab = tabs.find((t) => t.type === concept.type);

              if (!tab) {
                tab = {
                  type: concept.type,
                  entities: [],
                };

                tabs.push(tab);
              }

              let entity = tab.entities.find(
                (entity) => entity.entity == concept.entity
              );

              if (!entity) {
                entity = { ...concept, frequency: 0 };
                tab.entities.push(entity);
                if (!savedEntities[entity.id]) {
                  savedEntities[entity.id] = entity;
                }
              }

              entity.frequency++;
            }
            
          }

          tabs.forEach((tab) => {
            tab.entities.sort((a, b) => b.frequency - a.frequency);
          });

          localStorage.setItem("entities", JSON.stringify(savedEntities));

          setAllEntities(savedEntities);

          fetch("/mesh_lut.txt").then((response) => response.text()).then((txtContent) => {
              // Split the content into lines
              const lines = txtContent.split("\n");
              // Create a mapping of IDs to entity names
              const idToEntityMap = {};
              lines.forEach((line) => {
                const [id, entity] = line.split("||");
                idToEntityMap[id] = entity;
              });

              // Update entities with entity names
              tabs.forEach((tab) => {
                if (tab.type === "Disease") {
                  const uniqueEntityIds = new Set(); // Use a Set to store unique entity IDs

                  const tabEntities = [];

                  tab.entities.forEach((entity) => {
                    const entityId = entity.id;
                    let tempEntityId = "";
                    if (entity.id.includes("MESH:")) {
                      tempEntityId = entity.id.includes("MESH:")
                        ? entity.id.split("MESH:").pop()
                        : entity.id;
                    }

                    // const tempEntityId = entity.id;

                    if (!uniqueEntityIds.has(tempEntityId)) {
                      uniqueEntityIds.add(tempEntityId); // Add the entityId to the Set
                      if (idToEntityMap[tempEntityId]) {
                        entity.entity = idToEntityMap[tempEntityId];
                      }
                      tabEntities.push(entity);
                    }

                    entity.id = entityId;
                  });

                  tab.entities = tabEntities;
                } else {
                  tab.entities = Array.from(
                    new Map(
                      tab.entities.map((entity) => [entity.id, entity])
                    ).values()
                  );
                }
              });

              setTabs(tabs);
              setLoading(false);
            }).catch((error) => {
              console.error("Error fetching file:", error);
            });
        } catch (error) {
          console.error(error);
        }

        setPages(data);
        filter(data);
        setPagination(json.pagination);
        setLoading(false);
      } else if (currentPathname === "/pubmed/result") {
        console.log("searchPubmed");
        const data = await searchPubmed(search.params, token);

        setCount(data.pagination.total_pages);
        setPages(data.data);
        console.log("data.data", data.data);
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

  const handleNonRelevantClick = (relevanceScore, score, pmid) => {
    if (relevanceScore === relevance[pmid]) {
      return;
    }

    if (relevanceScore === 1) {
      console.log("relevance[pmid] 11");
      setRelevanceCount();
    } else {
      setRelevanceCount(-1);
    }

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
        score: relevanceScore,
      }),
    });

    setRelevnace((relevanceDict) => ({
      ...relevanceDict,
      [pmid]: relevanceScore,
    }));
  };


  useEffect(() => {
    if (!search.isReady) {
      return;
    }
    console.log("search.params.query", search.params.query);
    if (search.params.query) {
      setLoading(true);
      fetchpages(search);
    }
    //go to main page if you didn't enter a query
    else {
      history.push({ pathname: "/" });
    }
  }, [search.params, search.isReady]);

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
      const link = "https://pubmed.ncbi.nlm.nih.gov/" + pmid;
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };

  

  const handleClose = () => {
    setAnchorEl(null);
  };

  let [wordCloudData, setWordCloudData] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const viewWordCloud = (event, entities, id) => {
    if (!entities?.length) {
      setWordCloudData(null);
      setHoveredDocId(null);
      setAnchorEl(null);
      return;
    }
    const wordCounts = {};
    const entitiesIds = {};

    if (entities) {
      JSON.parse(entities).forEach((entity) => {
        if (wordCounts[entity.entity]) {
          wordCounts[entity.entity]++;
        } else {
          wordCounts[entity.entity] = 1;
          entitiesIds[entity.entity] = entity.id;
        }
      });
    }

    const wordCloud = Object.keys(wordCounts).map((entity) => ({
      text: entity,
      value: wordCounts[entity],
      id: entitiesIds[entity],
    }));

    wordCloud.push({
      text: "code",
      value: entitiesIds,
    });

    setWordCloudData(wordCloud);
    setHoveredDocId(id);
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const loc = useLocation();
  const [wordCloudClickId, setWordCloudClickId] = useState();
  const hideWordCloud = () => {
    handleDocumentHover(null);
    setAnchorEl(undefined);
    setWordCloudClickId(undefined);
  };

  useEffect(() => {
    const onClick = (e) => {
      const element = e.target;
      if (!element.classList.contains("highlighted__word")) {
        return;
      }
      e.stopPropagation();
      e.preventDefault();

      const type = element.getAttribute("data-type");
      const id = element.getAttribute("data-id");
      const color = element.getAttribute("data-color");

      setTypeDialog({
        open: true,
        type,
        color,
        id,
      });
    };

    document.addEventListener("click", onClick, {
      capture: true,
    });

    return () => {
      document.removeEventListener("click", onClick, {
        capture: true,
      });
    };
  }, [newPages]);
  const [typeDialog, setTypeDialog] = useState({
    open: false,
    type: "",
  });
  const leaveTimer = React.useRef();



  const Summarize = async (index, pmid, abstract) => {
    const cacheKey = `summary_${pmid}`;

    // 1. 从缓存读取
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      const parsed = JSON.parse(cachedData);

      setPages(prevPages => {
        const updatedPages = [...prevPages];
        updatedPages[index] = {
          ...updatedPages[index],
          loading: false,
          summaries: parsed,
          selectedAspect: parsed?.[0]?.aspect || null,
        };
        return updatedPages;
      });

      return; // 已命中缓存，跳过 API 调用
    }

    // 2. 未命中缓存，开始加载
    setPages(prevPages => {
      const updatedPages = [...prevPages];
      updatedPages[index] = {
        ...updatedPages[index],
        loading: true,
        summaries: [],
        selectedAspect: null,
      };
      return updatedPages;
    });

    const payload = { pmid, abstract };

    try {
      const res = await axios.post('http://127.0.0.1:8886/summarize', payload);

      // 3. 写入缓存
      localStorage.setItem(cacheKey, JSON.stringify(res.data));

      // 4. 更新页面状态
      setPages(prevPages => {
        const updatedPages = [...prevPages];
        updatedPages[index] = {
          ...updatedPages[index],
          loading: false,
          summaries: res.data,
          selectedAspect: res.data?.[0]?.aspect || null,
        };
        return updatedPages;
      });

    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [hoverMap, setHoverMap] = useState({});
  const arrowDelayTimer = useRef({});
  return (
    <>
      <>
        <Layout tabs={tabs} allEntities={allEntities} />
        <Dialog
          open={typeDialog.open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          onClose={() =>
            setTypeDialog((dialog) => ({ ...dialog, open: false }))
          }
        >
          <MeshPreview
            onClose={() =>
              setTypeDialog((dialog) => ({ ...dialog, open: false }))
            }
            color={typeDialog.color}
            type={typeDialog.type}
            id={typeDialog.id}
          />
        </Dialog>
        <WordCloudPopover
          data={wordCloudData}
          leaveTimerRef={leaveTimer}
          onSelect={(selection) =>
            search.onSubmit({
              concepts_include: selection,
            })
          }
          selected={search.params.concepts_include || []}
          anchorEl={anchorEl}
          open={open}
          handleClose={() => {
            const scrollY = window.scrollY;

            hideWordCloud(); // 控制 open=false，不卸载组件

            setTimeout(() => {
              setAnchorEl(null); // 延迟移除 anchor
              window.scrollTo({ top: scrollY }); // 恢复滚动位置，防止跳动
            }, 0);
          }}
          onHide={hideWordCloud}
          onSubmit={search.onSubmit}
        />

        <Box className="result">
          <Box
            sx={{
              marginY: 4,
              marginLeft: '80px',
              paddingLeft: 0,
            }}
            md={{
              marginY: 4,
              marginLeft: '80px',
              paddingLeft: 0,
            }}
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
              <Box sx={{margin: -2}}>
                {
                newPages.map((doc, index) => (
                  // Abstarct + Summaries
                  <Box
                    display="flex"
                    flexDirection={{ xs: 'column', md: 'row' }}
                    gap={2}
                  >
                    <Box 
                      flex={1}
                      key={index}
                      sx={{
                        width: { xs: '85%', md: '70%' },  // ✅ 放在 sx 内
                        padding: 2,
                        borderRadius: 2,
                        "&:hover": { background: "#f3f4f6" },
                      }}
                      onMouseLeave={() => {
                        leaveTimer.current = setTimeout(() => {
                          setWordCloudClickId(undefined);
                          handleDocumentHover(null);
                          hideWordCloud(); // 只控制显隐
                        }, 100);
                      }}

                      onClick={() => {
                        setWordCloudClickId(doc.title);
                        handleDocumentHover(null);
                        setAnchorEl(undefined);
                        setWordCloudClickId(undefined);
                      }}
                      onMouseEnter={(e) => {
                        clearTimeout(leaveTimer.current);
                        if (doc.title === wordCloudClickId) {
                          return;
                        }
                        viewWordCloud(e, doc.concepts, doc.pmid);
                      }}
                    >
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2}>
                      <Box flex={1}>
                        <a
                          key={index}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(event) => getData(doc.url, doc.brief_title || doc.title, doc.pmid)}
                        >
                          <div className="task">
                            <h3>
                              <Box dangerouslySetInnerHTML={{ __html: doc.brief_title || doc.title }} />
                            </h3>
                            <p>{doc.brief_summary || doc.Abstract}</p>
                          </div>
                        </a>
                      </Box>

                      

                      <Button
                        variant="contained"
                        color="primary"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();  // 同样阻止 click 冒泡
                          Summarize(index, doc.pmid, splitIntoSentences(doc.abstract_s));
                        }}
                        style={{
                          zIndex: 9999
                        }}
                      >
                        SUM
                      </Button>
                    </Box>

                    <Box style={{margin: "20px 0 0 0"}}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          {doc.authors && (
                            <Box
                              sx={{
                                fontSize: " .9rem",
                                color: "#4D8055",
                                marginRight: 2,
                              }}
                            >
                              {`${doc.authors[0]} ${
                                doc.authors.length > 1
                                  ? `& ${doc.authors[doc.authors.length - 1]}`
                                  : "/"
                              }`}
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
                          
                        </Box>
                        

                        <Box
                          sx={{
                            flex: 1,
                            display: "flex",
                            justifyContent: "flex-start",
                          }}
                        >
                          {doc.pmid && (
                            <Box
                              sx={{
                                fontSize: " .9rem",
                                color: "#4D8055",
                                flexShrink: 0,
                                marginRight: 1,
                              }}
                            >
                              PMID : {doc.pmid}
                            </Box>
                          )}
                        </Box>
  

                        <Box>
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
                                  index !== doc.publication_types.length - 1
                                    ? publication_type + " , "
                                    : publication_type + " . "
                              )}
                            </Box>
                          )}
                        </Box>
                            
                        {doc.abstract && (

                          <Accordion
                            sx={{ PaddingY: 1, zIndex:999}}
                            expanded={expanded[doc.pmid] === true}
                            key={doc.pmid}
                            onClick={() => {
                              setExpanded((expanded) => ({
                                ...expanded,
                                [doc.pmid]: !expanded[doc.pmid],
                              }));
                            }}
                          >
                            
                            <AccordionSummary
                              aria-controls="panel1d-content"
                              id="panel1d-header"
                            >
                              {loc.pathname === "/result" && (
                                <Box
                                  dangerouslySetInnerHTML={{
                                    __html: doc.accAbstract,
                                  }}
                                  sx={{ fontSize: " 0.9rem", paddingY: 1 }}
                                ></Box>
                              )}

                              {loc.pathname === "/pubmed/result" && (
                                <Box sx={{ fontSize: " 0.9rem", paddingY: 1 }}>
                                  {" "}
                                  {`${doc.abstract.substring(0, 150)} , ...`}
                                </Box>
                              )}
                            </AccordionSummary>

                            <AccordionDetails

                              sx={{
                                backgroundColor: 'transparent',
                                position: 'relative',
                                zIndex: 1,
                                overflow: 'visible', // 避免裁剪 SVG 箭头
                              }}

                              onMouseEnter={(event) => {
                                // event.stopPropagation();
                              }}
                              onClick={(event) => {
                                // event.stopPropagation();
                                setWordCloudClickId(doc.title);
                                hideWordCloud();
                              }}
                            >
                              {loc.pathname === "/result" && (() => {

                                

                                const selected = doc.summaries.find(s => s.aspect === doc.selectedAspect);
                                const sentences = splitIntoSentences(doc.abstract);

                                return (
                                  <Box sx={{ fontSize: "0.9rem", py: 1 }}>
                                    {sentences.map((sentence, i) => (
                                        <Box
                                          key={`target-${index}-${i}`} 
                                          id={`target-${index}-${i}`}
                                          component="span"
                                          dangerouslySetInnerHTML={{ __html: sentence + " " }}
                                          sx={{
                                            backgroundColor: selected?.indexes?.includes(i) ? '#fcf3cf' : 'transparent',
                                            borderRadius: '4px',
                                            px: 0.5,
                                            display: 'inline', // 保持原本句子排列
                                          }}
                                        />
                   
                                    ))}
                                  </Box>
                                );
                              })()}



                              {loc.pathname === "/pubmed/result" && (
                                <Box sx={{ fontSize: " 0.9rem", paddingY: 1 }}>
                                  {doc.abstract}
                                </Box>
                              )}
                            </AccordionDetails>
                          </Accordion>
                        )}

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: " .9rem",
                            color: "#4D8055",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "flex-start",
                              gap: 3,
                            }}
                          >
                            {doc.loe && (
                              <div>
                                <DialogContentText
                                  sx={{
                                    fontSize: " .8rem",
                                    fontWeight: "bold",
                                    paddingY: 0.5,
                                    color: "#C05600",
                                  }}
                                >
                                  Level Of Evidence{" "}
                                </DialogContentText>
                                <LevelOfEvidenceMark value={String(doc.loe)} />
                              </div>
                            )}
                            {doc.readability && readability && (
                              <div>
                                <DialogContentText
                                  sx={{
                                    fontSize: " .8rem",
                                    fontWeight: "bold",
                                    paddingY: 0.5,
                                    color: "#C05600",
                                  }}
                                >
                                  Readability
                                </DialogContentText>
                                {/* {doc.readability} */}

                                <BootstrapButton
                                  size="small"
                                  sx={{
                                    "&:hover": {
                                      //you want this to be the same as the backgroundColor above
                                      backgroundColor: findReadabilityMarkColor(
                                        doc.readability
                                      ),
                                    },
                                    color: "#fff",
                                    background: findReadabilityMarkColor(
                                      doc.readability
                                    ),
                                  }}
                                >
                                  {doc.readability}
                                </BootstrapButton>
                              </div>
                            )}
                          </Box>

                          <Box>
                            <DialogContentText
                              sx={{
                                fontSize: " .8rem",
                                fontWeight: "bold",
                                paddingY: 0.5,
                                color: "#C05600",
                                textAlign: "center",
                              }}
                            >
                              Is Relevant
                            </DialogContentText>
                            <Box>
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
                          </Box>

                          
                        </Box>
                      </Box>
                    </Box>
                    
                    
                    {/* Summaries */}
                    <Box 
                      width={{ xs: '85%', md: '30%' }}
                      sx={{
                        padding: 2,
                        margin: 1,
                        borderRadius: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}
                    >

                      {/* Loading 状态 */}
                      {doc.loading && <AnimatedDots />}


                      {/* 顶部 aspect 按钮 */}
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                        {doc.summaries.map((s, i) => (
                          <Button
                            key={i}
                            variant={s.aspect === doc.selectedAspect ? 'contained' : 'outlined'}
                            onClick={() => {
                              const updatedPages = [...newPages];
                              updatedPages[index] = { ...updatedPages[index], selectedAspect: s.aspect };
                              setPages(updatedPages); 
                            }}
                            size="small"
                            sx={{ minWidth: 'auto', px: 0.5, py: 0.5, fontSize: '12px' }}
                          >
                            {s.aspect}
                          </Button>
                        ))}
                      </Box>

                      {/* Selected summary display */}
                      {(() => {
                        const selected = doc.summaries.find(s => s.aspect === doc.selectedAspect);
                        return selected ? (
                          <Box 
                            sx={{ 
                              p: 1, 
                              border: 1, 
                              borderColor: 'divider', 
                              borderRadius: 2, 
                              fontSize: 14,
                              backgroundColor: '#fafafa'
                            }}
                          >
                            <Box sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                              {selected.aspect}
                            </Box>


                            <Box
                              onMouseEnter={() => {
                                const docKey = `${index}-${doc.selectedAspect}`;
                                clearTimeout(arrowDelayTimer.current?.[docKey]);

                                arrowDelayTimer.current = {
                                  ...arrowDelayTimer.current,
                                  [docKey]: setTimeout(() => {
                                    setHoverMap((prev) => ({ ...prev, [docKey]: true }));
                                  }, 150), // 300ms 延迟显示箭头
                                };
                              }}

                              onMouseLeave={() => {
                                const docKey = `${index}-${doc.selectedAspect}`;
                                clearTimeout(arrowDelayTimer.current?.[docKey]);
                                setHoverMap((prev) => ({ ...prev, [docKey]: false }));
                              }}

                              key={`source-${index}-${doc.selectedAspect}`}
                              id={`source-${index}-${doc.selectedAspect}`}
                              sx={{ py: 1, whiteSpace: 'pre-line' }}
                            >
                              {selected.summary}
                            </Box>

                            
                            {hoverMap[`${index}-${doc.selectedAspect}`] && expanded[doc.pmid] &&
                              selected.indexes.map((sentenceIndex) => {
                                const sourceId = `source-${index}-${doc.selectedAspect}`
                                const targetId = `target-${index}-${sentenceIndex}`;
                                const sourceEl = document.getElementById(sourceId);
                                const targetEl = document.getElementById(targetId);
                                console.log(targetId, targetEl)
                                const isElementReady = (el) =>
                                  el && el.offsetWidth > 0 && el.offsetHeight > 0;

                                if (!isElementReady(sourceEl) || !isElementReady(targetEl)) return null;

                                return (
                                  <Xarrow
                                    key={`arrow-${sentenceIndex}`}
                                    start={sourceId}
                                    end={targetId}
                                    showHead
                                    dashness
                                    path="smooth"
                                    strokeWidth={1}
                                    color="blue"
                                    zIndex={9999}
                                  />
                                );
                              })
                            }



                            
                            <Box sx={{ typography: 'caption', color: 'text.secondary' }}>
                              Citations: {selected.indexes.join(', ')}
                            </Box>
                          </Box>
                        ) : null;
                      })()}
                    </Box>
                  </Box>
                ))
                }
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
                page={Number(search.params.page)}
                onChange={handleChange}
              />
            )}
          </Box>
        </Box>
      </>
    </>
  );
};

export default SearchResult;

function LevelOfEvidenceMark({ value }) {
  const colors = [
    {
      color: "#fff",
      bg: "#4CAF50",
    },
    {
      bg: "#8BC34A",
      color: "black",
    },
    {
      bg: "#FFC107",
      color: "black",
    },
    {
      bg: "#FF9800",
      color: "black",
    },
    {
      bg: "#F44336",
      color: "white",
    },
    {
      bg: "#FF5722",
      color: "white",
    },
    {
      bg: "#9E9E9E",
      color: "white",
    },
  ];
  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      {LE_marks.map((mark, index) => {
        const color = colors[Math.floor(index % colors.length)];
        return (
          <LEMark
            key={index}
            value={value}
            index={index}
            color={color}
            mark={mark}
          />
        );
      })}
    </Box>
  );
}

const WordCloud = ({ data, onSelect, selected }) => {
  const handleWordClick = (word) => {
    const clickedWordArray = [...selected];

    if (!clickedWordArray.includes(word.id)) {
      clickedWordArray.push(word.id);
    } else {
      Swal.fire({
        icon: "info",
        title: `Oops...`,
        text: `Bio concept ${word.text} already exist!`,
      });
      return;
    }
    onSelect(clickedWordArray);
  };

  return (
    <>
      <ReactWordcloud
        options={{
          rotations: [0],
          fontSizes: [14, 30],
        }}
        minSize={[CLOUD_SIZE, CLOUD_SIZE]}
        size={[CLOUD_SIZE, CLOUD_SIZE]}
        words={data}
        callbacks={{
          onWordClick: (word) => handleWordClick(word),
        }}
      />
    </>
  );
};

const LEMark = ({ mark, color, index, value }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? `mark-${index}` : undefined;

  return (
    <>
      <Box
        onMouseEnter={handleClick}
        onMouseLeave={handleClose}
        sx={{
          fontSize: 12,
          p: 1,
          py: 0.5,
          backgroundColor: color.bg,
          color: color.color,
          transform: mark.label === value && "scale(1.4)",
          fontWeight: 900,
          borderTopLeftRadius: index === 0 ? "5px" : undefined,
          borderBottomLeftRadius: index === 0 ? "5px" : undefined,

          borderTopRightRadius:
            index === LE_marks.length - 1 ? "5px" : undefined,
          borderBottomRightRadius:
            index === LE_marks.length - 1 ? "5px" : undefined,
          border:
            mark.label === value ? "1px solid #fff" : "1px solid transparent",

          borderRadius: mark.label === value ? "5px" : undefined,
        }}
      >
        {mark.label}

        <MUIPopover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          sx={{
            pointerEvents: "none",
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          disableRestoreFocus
        >
          <Box p={2}>{mark.description}</Box>
        </MUIPopover>
      </Box>
    </>
  );
};

const WordCloudPopover = ({
  data,
  selected,
  anchorEl,
  open,
  handleClose,
  onHide,
  onSubmit,
  leaveTimerRef,
}) => {
  const [isEntered, setIsEntered] = useState(false);

  return (
    <MUIPopover
      open={true} // 始终渲染 Popover，避免卸载引发跳动
      anchorEl={anchorEl}
      onClose={handleClose}
      disableScrollLock
      disableAutoFocus
      disableEnforceFocus
      disableRestoreFocus
      hideBackdrop
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      PaperProps={{
        onMouseEnter: (e) => {
          e.stopPropagation();
          setIsEntered(true);
          clearTimeout(leaveTimerRef.current);
        },
        onMouseLeave: () => {
          if (isEntered) {
            setTimeout(onHide, 5);
            setIsEntered(false);
          }
        },
        sx: {
          width: CLOUD_SIZE,
          height: CLOUD_SIZE,
          mt: 4,
          borderRadius: 1,
          pointerEvents: open ? "auto" : "none",
          visibility: open ? "visible" : "hidden", // 控制显隐
          opacity: open ? 1 : 0,
          transition: "opacity 0.2s ease-in-out",
        },
      }}
      sx={{
        pointerEvents: "none", // 允许内部 Paper 接收事件
      }}
    >
      <WordCloud
        selected={selected}
        data={data}
        onSelect={(selection) => {
          onSubmit({
            concepts_include: selection,
          });
          onHide();
        }}
      />
    </MUIPopover>
  );
};


const MeshPreview = ({ color, type, id, onClose }) => {
  const [isLoading, setIsLoading] = useState();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!id) {
      return;
    }
    setIsLoading(true);

    const fetchData = (db, id, onComplete) => {
      const controller = new AbortController();
      const signal = controller.signal;
      const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=${db}&id=${id}&retmode=json`;
      fetch(url, {
        method: "get",
        signal: signal,
      })
        .then((response) => response.json())
        .then(onComplete);

      return controller;
    };
    let _id = id.replace("MESH:", "");
    let db = type.toLowerCase();
    const types = {
      species: "taxonomy",
    };

    const readFields = {
      mesh: [[["ds_meshterms", 0]], ["ds_scopenote", "Description"]],
      taxonomy: [
        ["scientificname"],
        ["rank", "Rank"],
        ["genus", "Genus"],
        ["division", "Division"],
      ],
      gene: [
        ["name"],
        ["description", "Description"],
        ["maplocation", "Location"],
        [["organism", "scientificname"], "Organis"],
        ["otheraliases", "Alias"],
      ],
    };
    if (isNaN(Number(_id[0]))) {
      const ascii = _id.charCodeAt(0);
      _id = _id.substring(1, _id.length);
      _id = ascii + _id;
      db = "mesh";
    }

    console.log("FETCHING", db, type, id, _id)
    db = types[db] || db;

    const controller = fetchData(db, _id, (data) => {
      setIsLoading(false);
      if (!data?.result?.uids?.length) {
        return;
      }
      const record = data.result[data.result.uids[0]];

      const fields = readFields[db] || readFields.mesh;

      const _data = [];

      const readField = (keys, data) => {
        keys = Array.isArray(keys) ? keys : [keys];
        for (let key of keys) {
          data = data[key];
        }

        return data;
      };
      for (let field of fields) {
        console.log(field, data);
        let value = readField(field[0], record);
        if (Array.isArray(value)) {
          value = value.join(",");
        }

        if (field.length > 1) {
          _data.push([field[1], value]);
        } else {
          _data.push([value]);
        }
      }
      setData(_data);
    });
    return () => {
      controller.abort();
    };
  }, [id, type]);
  return (
    <>
      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            fontSize: 18,
          }}
        >
          {
            isLoading && <Box sx={{
              
              width:300,
              height:200, 
              display:"flex",
              alignItems:"center",
              justifyContent:"center"

            }}>
              <CircularProgress />
            </Box>
          }
          {
            !isLoading && <Box sx={{
              fontSize:24
            }}>
              {type}
            </Box>
          }
          {data.map(([name, value]) => {
            if (value === undefined) {
              return (
                <Box
                  sx={{
                    fontSize: 30,
                    fontWeight: "bold",
                    color: color || "#2196f3",
                  }}
                >
                  {name}
                </Box>
              );
            }
            return (
              <Box key={name} sx={{ display: "flex", gap: 2 }}>
                <Box
                  sx={{
                    fontWeight: "bold",
                    width: 140,
                    flexShrink: 0,
                  }}
                >
                  {name}
                </Box>
                <Box>{value}</Box>
              </Box>
            );
          })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} autoFocus>
          Close
        </Button>
      </DialogActions>
    </>
  );
};
