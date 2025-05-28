import React, { useEffect, useMemo, useState } from "react";
import { makeStyles } from "@mui/styles";
import {
  ListItem,
  ListItemText,
  List,
  Typography,
  Container,
  Stack,
  FormControl,
  Button,
  Box,
  TextField,
  IconButton,
} from "@mui/material";
import { submit } from "./api";
import { Link } from "react-router-dom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PauseIcon from "@mui/icons-material/Pause";
const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
  },
  listItem: {
    paddingTop: 0,
    paddingBottom: 0,
  },
}));

const TaskPage = () => {
  const classes = useStyles();

  const [data, setData] = useState({
    numA: "",
    numB: "",
    timeA: "",
    timeB: "",
    feedback: "",
  });
  const [numA, setNumA] = useState({});
  const [numB, setNumB] = useState({});
  const [timeA, setTimeA] = useState({});
  const [timeB, setTimeB] = useState({});
  const [done, setDone] = useState(false);
  let previousOption = null; // Initialize the previous option

  const selectRandom = () => {
    // Make a decision based on the random number
    let selectedOption;
    let redirectUrl = "";
    do {
      // Generate a random number between 0 and 1
      const randomNum = Math.random();

      // Set a threshold value (e.g., 0.5) to determine the selection
      const threshold = 0.5;

      if (randomNum < threshold) {
        selectedOption = "WisPerMid";
        redirectUrl = "/";
      } else {
        selectedOption = "Pubmed";
        redirectUrl = "/search/pubmed";
      }
    } while (selectedOption === previousOption); // Keep generating until it's different

    // Update the previous option
    previousOption = selectedOption;
    return {
      option: selectedOption,
      redirectUrl,
    };
  };
  const caseA = useMemo(selectRandom, []);
  const caseB = useMemo(selectRandom, []);

  const [pageLoadTime, setPageLoadTime] = useState(new Date());
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const [timerRunning, setTimerRunning] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [feedback, setFeedbackText] = useState("");

  // Function to start the timer
  const startTimer = () => {
    setTimerRunning(true);
    setStartTime(Date.now() - elapsedTime);
  };

  // Function to reset the timer
  const resetTimer = () => {
    setTimerRunning(false);
    setElapsedTime(0);
  };

  // Function to restart the timer (reset without pausing)
  const restartTimer = () => {
    setTimerRunning(true);
    setStartTime(Date.now());
    setElapsedTime(0);
  };

  // Function to pause the timer
  const pauseTimer = () => {
    setTimerRunning(false);
    setElapsedTime(Date.now() - startTime);
  };

  // Function to handle feedback input change
  const handleFeedbackChange = (event) => {
    setFeedbackText(event.target.value);
    if (timerRunning) {
      // Stop the timer when typing feedback
      setTimerRunning(false);
      setElapsedTime(Date.now() - startTime);
    }
  };

  // Update the timer every second if it's running
  useEffect(() => {
    let interval;
    if (timerRunning) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [timerRunning, startTime]);

  const handleSubmit = async () => {
    const requestStartTime = new Date();

    const objA = { numOfQueryA: numA, A: caseA.option };
    const objB = { numOfQueryB: numB, B: caseB.option };

    const timeObjA = { timeA: timeA, A: caseA.option };
    const timeObjB = { timeB: timeB, B: caseB.option };
    console.log(
      'new --',
      timeA,
      timeB,
      objA,
      objB,
      timeObjA,
      timeObjB,
      feedback,
      pageLoadTime.toString(),
      requestStartTime
    );

    const res = await submit(
      objA,
      objB,
      timeObjA,
      timeObjB,
      feedback,
      pageLoadTime.toString(),
      requestStartTime,
      reviews
    );
    if (res) {
      setDone(true);
    }
  };

  const [reviews , setReviews ] = useState({})

  const handleReviews =(e)=>{

    setReviews ((reviews)=>({ ...reviews , [e.target.name]: e.target.value}))
  }

  //   const handleChange = (e) => {
  //     const { name, value } = e.target;
  //     setData((prevData) => ({
  //       ...prevData,
  //       [name]: value,
  //     }));
  //   };

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

  return (
    <Container
      className={classes.container}
      sx={{ margin: 4, display: "flex" }}
    >
      <Stack spacing={2}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", padding: 1 }}>
            <AccessTimeIcon 
                              sx={{
                                mx:1
                              }}
            /> {formatTime(elapsedTime)}
            {timerRunning ? (
              <IconButton onClick={pauseTimer}>
                <PauseIcon
                  sx={{
                    width: "0.8em",
                    height: "0.8em",
                    mx:0
                  }}
                />
              </IconButton>
            ) : (
              <IconButton onClick={startTimer}>
                <PlayArrowIcon
                  sx={{
                    width: "0.9em",
                    height: "0.9em",
                    mx:0
                  }}
                />
              </IconButton>
            )}
            <IconButton onClick={resetTimer}>
              <RestartAltIcon
                sx={{
                  width: "0.9em",
                  height: "0.9em",
                  px:0,
                  mx:0
                }}
              />
            </IconButton>
          </Box>
        </Box>
        <Typography variant="h5">Persona :</Typography>
        <Typography variant="body1">
          Imagine you are a dermatologist interested in the field of
          dermatological oncology, with 1 year of clinical practice experience.
          You are a person who values both the accuracy of information and the
          efficiency of finding relevant information.
        </Typography>
        <Typography variant="h5">Scenario1 :</Typography>
        {}
        <Typography variant="body1">
        Imagine you have a patient who has received a first-time diagnosis of metastatic melanoma with brain metastasis. 
          </Typography>
          <Typography variant="body1">
           You need to find and
          review the best treatment options. You must use 10 relevant articles
          for the treatment to decide which treatment strategy is the best for
          this patient. Each article should have a high level of evidence. You
          will perform this task using {caseA.option}  search engine, which includes unique
          features such as the level of evidence and readability indicators.
        </Typography>
        <Typography variant="h5">Task Steps :</Typography>
        <List>
          <ListItem className={classes.listItem}>
            <ListItemText primaryTypographyProps={{ variant: "body1" }}>
              1- Start with the first search engine{" "}
              <Link
                to={caseA.redirectUrl}
                target="_blank"
                onClick={restartTimer}
              >
                Click here for search engine A
              </Link>
            </ListItemText>
          </ListItem>
          <ListItem className={classes.listItem}>
            <ListItemText
              primary="2- Use the search engine to find the relevant articles related to the treatment strategy that would fit the patient the best."
              primaryTypographyProps={{ variant: "body1" }}
            />
          </ListItem>
          <ListItem className={classes.listItem}>
            <ListItemText
              primary="3- The search engine will note down the number of queries and time spent on the task."
              primaryTypographyProps={{ variant: "body1" }}
            />
          </ListItem>
          <ListItem className={classes.listItem}>
            <ListItemText
              primary="4- If you can’t find 10 articles, you might skip to the next point at any time."
              primaryTypographyProps={{ variant: "body1" }}
            />
          </ListItem>
          <ListItem className={classes.listItem}>
            <ListItemText
              primary={
                <React.Fragment>
                  <Stack spacing={2} sx={{ fontWeight: "bold" }}>

                    <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                      <TextField
                        className={classes.textField}
                        label="Number of Queries (Task A)"
                        variant="outlined"
                        sx={{ margin: 1, width: "100%" }}
                        onChange={(e) => setNumA({ queryA: e.target.value })}
                        name="numA"
                        type='number'
                      />
                      <TextField
                        className={classes.textField}
                        label="Time Spent (Task A)"
                        variant="outlined"
                        sx={{ margin: 1, width: "100%" }}
                        onChange={(e) => setTimeA({ timeA: e.target.value })}
                        name="timeA"
                        type='number'
                      />
                    </Box>

                  </Stack>
                </React.Fragment>
              }
              primaryTypographyProps={{ variant: "body1" }}
            />
          </ListItem>        </List>

        <Typography variant="h5">Scenario2 :</Typography>
        <Typography variant="body1">
        Imagine you have a patient diagnosed with Stage III basal cell carcinoma.
          </Typography>
          <Typography variant="body1">
           You need to find and
          review the best treatment options. You must use 10 relevant articles
          for the treatment to decide which treatment strategy is the best for
          this patient. Each article should have a high level of evidence. You
          will perform this task using {caseB.option} search engine, which includes unique
          features such as the level of evidence and readability indicators.
        </Typography>
        <Typography variant="h5">Task Steps :</Typography>
        <List>
          <ListItem className={classes.listItem}>
            <ListItemText primaryTypographyProps={{ variant: "body1" }}>
              1- Start with the first search engine{" "}
              <Link
                to={caseB.redirectUrl}
                target="_blank"
                onClick={restartTimer}
              >
                Click here for search engine B
              </Link>
            </ListItemText>
          </ListItem>
          <ListItem className={classes.listItem}>
            <ListItemText
              primary="2- Use the search engine to find the relevant articles related to the treatment strategy that would fit the patient the best."
              primaryTypographyProps={{ variant: "body1" }}
            />
          </ListItem>
          <ListItem className={classes.listItem}>
            <ListItemText
              primary="3- The search engine will note down the number of queries and time spent on the task."
              primaryTypographyProps={{ variant: "body1" }}
            />
          </ListItem>
          <ListItem className={classes.listItem}>
            <ListItemText
              primary="4- If you can’t find 10 articles, you might skip to the next point at any time."
              primaryTypographyProps={{ variant: "body1" }}
            />
          </ListItem>

          <ListItem className={classes.listItem}>
            <ListItemText
              primary={
                <React.Fragment>
                  <Stack spacing={2} sx={{ fontWeight: "bold" }}>


                    <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                      <TextField
                        className={classes.textField}
                        label="Number of Queries (Task B)"
                        variant="outlined"
                        sx={{ margin: 1, width: "100%" }}
                        onChange={(e) => setNumB({ queryB: e.target.value })}
                        name="numB"
                        type='number'
                      />
                      <TextField
                        className={classes.textField}
                        type='number'
                        label="Time Spent (Task B)"
                        variant="outlined"
                        sx={{ margin: 1, width: "100%" }}
                        onChange={(e) => setTimeB({ timeB: e.target.value })}
                        name="timeB"
                      />
                    </Box>
                    <Stack paddingTop={2}>
                    <TextField
                        label="what did you like?"
                        variant="outlined"
                        sx={{ margin: 1, width: "100%" }}
                        onChange={handleReviews}
                        name="likes"
                      />
                                          <TextField
                        label="what did you not like?"
                        variant="outlined"
                        sx={{ margin: 1, width: "100%" }}
                        onChange={handleReviews}
                        name="notLikes"
                      />
                                          <TextField
                        label="what you missed?"
                        variant="outlined"
                        sx={{ margin: 1, width: "100%" }}
                        onChange={handleReviews}
                        name="missed"
                      />
                    </Stack>
<Box>                    Finally, please provide feedback on your overall experience
                    using the WisPerMed search engine.</Box>

                    <TextField
                      sx={{ padding: 1 }}
                      className={classes.textField}
                      label="Feedback"
                      name="feedback"
                      variant="outlined"
                      multiline
                      rows={4}
                      value={feedback}
                      onChange={handleFeedbackChange}
                    />
                  </Stack>
                </React.Fragment>
              }
              primaryTypographyProps={{ variant: "body1" }}
            />



          </ListItem>
        </List>
        <Box sx={{ paddingX: 2 }}>
          <Button onClick={handleSubmit} variant="contained">
            Submit
          </Button>
        </Box>
        {/* <Box> Page Load Time: {pageLoadTime.toString()}</Box> */}
        {done && (
          <Box p={1} sx={{ fontWeight: "bold", fontSize: "1.4rem" }}>
            Thank You , you are done !{" "}
          </Box>
        )}
      </Stack>
    </Container>
  );
};

export default TaskPage;
