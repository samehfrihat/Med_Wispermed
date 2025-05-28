import React, { useContext, useEffect, useMemo, useState } from "react";
import "./../app/searchPubmed/search.css";
import Box from "@mui/material/Box";
import objectToQueryString from "../utils/objectToQueryString";
import qs from "qs";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { makeStyles } from "@mui/styles";
import { useHistory } from "react-router";
import { Container, Stack, Button, TextField } from "@mui/material";

import { submit } from "../app/TaskPage/api";
import { useSearch } from "../contexts/SearchProvider";
import { TASK_CASES, selectRandomCase } from "../utils/selectRandomCase";
import {
  SelectedOptionProvider,
  useSelectedTask,
} from "../contexts/SelectedTaskProvider";

// Function to format elapsed time (convert milliseconds to HH:MM:SS)
const formatTime = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const formatNumber = (number) => (number < 10 ? `0${number}` : `${number}`);

  const formattedTime = `${formatNumber(hours)}:${formatNumber(
    minutes % 60
  )}:${formatNumber(seconds % 60)}`;
  return formattedTime;
};


function TaskBannerInternal() {

  const history = useHistory();

  const [task, setTask] = useState(1);
  const pageLoadTime = useMemo(() => new Date(), []);

  const searchQ = useSearch();
  const [numA, setNumA] = useState({});
  const [timers, setTimers] = useState({});

  const [numB, setNumB] = useState({});
  const { currentTask, setCurrentTask , relevanceCount, setRelevanceCount } = useSelectedTask();


  const data = {
    numA: numA,
    numB: numB,
    timers: timers,
    pageLoadTime: pageLoadTime,
  };

  const wpmQueryNum = searchQ.params.wpmQueryNum;
  const pubmedQueryNum = searchQ.params.pubmedQueryNum;

  const queryNum =
    currentTask.option === "WisPerMid" ? wpmQueryNum : pubmedQueryNum;

  useEffect(() => {
    searchQ.setTaskBanner(currentTask.option);
  }, [currentTask.option]);

  const submitTask = () => {
    switch (task) {
      case 1:
        setTask(2);
        setRelevanceCount(0, true)
        setNumA({ queryA: queryNum, option: currentTask.option });
        if (currentTask.option === "WisPerMid") {
          setCurrentTask(selectRandomCase());
          searchQ.setParams({
            wpmQueryNum: 0,
          });
          history.push("/search/pubmed");
        } else if (currentTask.option === "Pubmed") {
          setCurrentTask(selectRandomCase());
          searchQ.setParams({
            pubmedQueryNum: 0,
          });
          history.push("/");
        }
        break;
      case 2:
        setTask(3);
        const numB = { queryB: queryNum, option: currentTask.option };
        setNumB(numB);
        history.push({
          pathname: "/studycase/feedback/",
          search: qs.stringify(
            {
              ...data,
              numB,
            },
            { encodeValuesOnly: true }
          ),
        });
        break;

      default:
        history.push({
          pathname: "/studycase/feedback/",
          search: qs.stringify(data, { encodeValuesOnly: true }),
        });
    }
  };
    const relevance = localStorage.getItem('relevance')

  return (
    <>
      <Box sx={{ height: "280px" }}></Box>

      {task === 1 && (
        <Box
          position="fixed"
          color="primary"
          sx={{
            borderTopWidth: 4,
            borderColor: "rgba(4, 167, 230, 0.3)",
            borderTopStyle: "solid",
            bottom: 0,
            left: 0,
            height: "280px",
            width: "100%",
            overflow: "scroll",
            backgroundColor: "#f5f5f5",
          }}
        >
          <Box> 
            {/* <Box sx={{ flexGrow: 1 }}> */
            /* {currentTask.option} */}
            <Container
              sx={{ display: "flex", textAlign: "start" }}
              scroll={true}
            >
              <Stack paddingTop={2} spacing={2}>
                <Typography variant="h5">Patient 1:</Typography>
                {}
                <Typography variant="body1">
                Der Patient wurde erstmals mit metastasierendem Melanom mit Hirnmetastasen diagnostiziert.
                </Typography>
                <Typography variant="body1">
                Bitte versuchen Sie, 10 relevante Artikel zu möglichen Behandlungen mit dieser Suchmaschine zu finden.
                </Typography>
                <ListItem style={{display:'none'}} >
                      <ListItemText
                        primary={
                          <React.Fragment>
                            <Stack spacing={2} sx={{ fontWeight: "bold" }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "flex-start",
                                }}
                              >
                                <TextField
                                  required

                                  label="Number of Queries (Task A)"
                                  variant="outlined"
                                  disabled
                                  sx={{ margin: 1, width: "100%" }}
                                  value={queryNum || 0}
                                  // onChange={(e) =>
                                  //   // setNumA({ queryA: e.target.value , option: currentTask.option  })

                                  // }
                                  name="numA"
                                  type="number"
                                  defaultValue={0}
                                  inputProps={{ min: 0 }}
                                />
                                <Timer
                                  onChange={(time) =>
                                    setTimers((timers) => ({
                                      ...timers,
                                      1: String(time),
                                    }))
                                  }
                                  label="Time Spent (Task A)"
                                />
                              </Box>
                            </Stack>
                          </React.Fragment>
                        }
                        primaryTypographyProps={{ variant: "body1" }}
                      />
                    </ListItem>
                
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitTask();
                  }}
                >
                  <Box>
                  <Typography variant="body1">Anzahl relevanter Artikel: {relevanceCount}</Typography>
                    {/* <Box >Anzahl relevanter Artikel: {relevanceCount}</Box> */}
                    <Button variant="outlined" sx={{marginTop:2}} type="submit">NÄCHSTER PATIENT</Button>
                  </Box>
                </form>
              </Stack>
            </Container>
            {/* </Box> */}
          </Box>
        </Box>
      )}

      {task === 2 && (
        <Box
          position="fixed"
          color="primary"
          sx={{
            borderTopWidth: 4,
            borderColor: "rgba(4, 167, 230, 0.3)",
            borderTopStyle: "solid",
            bottom: 0,
            left: 0,
            height: "280px",
            width: "100%",
            overflow: "scroll",
            backgroundColor: "#f5f5f5",
          }}
        >
          {/* <Box sx={{ flexGrow: 1 }}> */}
          <Container
            sx={{ display: "flex", textAlign: "start" }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitTask();
              }}
            >
              <Stack paddingTop={2} spacing={2}>
                <Typography variant="h5">Patient 2:</Typography>
                <Typography variant="body1">
                Der Patient wurde mit Basalzellkarzinom im Stadium III diagnostiziert.
                </Typography>
                <Typography variant="body1">
                Bitte versuchen Sie, 10 relevante Artikel zu möglichen Behandlungen mit dieser Suchmaschine zu finden.
                </Typography>

                 <ListItem style={{display:"none"}}>
                    <ListItemText
                      primary={
                        <React.Fragment>
                          <Stack spacing={2} sx={{ fontWeight: "bold" }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "flex-start",
                              }}
                            >
                              <TextField
                                required
                                label="Number of Queries (Task B)"
                                variant="outlined"
                                sx={{ margin: 1, width: "100%" }}
                                disabled
                                value={queryNum || 0}
                                // onChange={(e) =>
                                //   // setNumB({ queryB: e.target.value ,option: currentTask.option  })
                                //   setNumB({queryB:searchQ.queryNum ,option: currentTask.option  })
                                // }
                                name="numB"
                                type="number"
                                defaultValue={0}
                                inputProps={{ min: 0 }}
                              />
                              <Timer
                                onChange={(time) =>
                                  setTimers((timers) => ({
                                    ...timers,
                                    2: String(time),
                                  }))
                                }
                                label="Time Spent (Task B)"
                              />
                            </Box>
                          </Stack>
                        </React.Fragment>
                      }
                      primaryTypographyProps={{ variant: "body1" }}
                    />
                  </ListItem>
                  <Box>
                  <Typography variant="body1">Anzahl relevanter Artikel: {relevanceCount}</Typography>
                  {/*   <Box >Anzahl relevanter Artikel: {relevanceCount}</Box>*/}
                    <Button variant="outlined"  sx={{marginTop:2}}  type="submit">NÄCHSTER</Button>
                  </Box>
              </Stack>
            </form>
          </Container>
        </Box>
      )}
    </>
  );
}
function Timer({ label, onChange }) {
  const [elapsed, setElapsed] = useState({
    startedOn: 0,
  });

  React.useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;

      setElapsed(Date.now() - startTime);
      onChange(elapsed);
    }, 1000);

    return () => {
      onChange(Date.now() - startTime);
      clearInterval(interval);
    };
  }, []);

  return (
    <TextField
      label={label}
      variant="outlined"
      sx={{ margin: 1, width: "100%" }}
      //   onChange={(e) => setTimeB({ timeB: e.target.value })}
      disabled
      value={formatTime(elapsed)}
    />
  );
}

export default function TaskBanner(){
  const { visible } = useSelectedTask();

if(!visible){
return null
}
  return <TaskBannerInternal/>
}
