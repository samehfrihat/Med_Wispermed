import React, { useContext, useState } from "react";
import { Button, Stack, Container, Box,DialogContentText, Typography } from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbsUpDownIcon from "@mui/icons-material/ThumbsUpDown";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import IconButton from "@mui/material/IconButton";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbsUpDownOutlinedIcon from "@mui/icons-material/ThumbsUpDownOutlined";
import Tooltip from "@mui/material/Tooltip";
import { useHistory } from "react-router-dom";
import { useSelectedTask } from "../../contexts/SelectedTaskProvider"; // Import the context
import { selectRandomCase } from "../../utils/selectRandomCase";

const TaskDescription = () => {
  const navigate = useHistory();
  const {   setCurrentTask , setVisible } = useSelectedTask();

  const selectRandom = () => {
    // Determine the option based on the random number
    return Math.random() < 0.5 ? "WisPerMid" : "Pubmed";
  };

  const redirectToCaseA = () => {
    const selectedOption = selectRandomCase();
    setCurrentTask(selectedOption);
    setVisible(true)
    navigate.push(selectedOption.redirectUrl);
  };

  return (
    <Container maxWidth="sm">
      <Stack spacing={2} paddingTop={4}>
        <Typography variant="h5">Context:</Typography>
        <Typography variant="body1">
          Imagine you are a dermatologist interested in the field of
          dermatological oncology. You are a person who values both the accuracy
          of information and the efficiency of finding relevant information.
        </Typography>

        <Typography variant="h5">Task:</Typography>
        <Typography variant="body1">
          Imagine you have received two patients suffering from a certin type of
          skin cancer. You need to find the best treatment options for each of
          the two patients. You will use two different search engines to perform
          this task. Each search engine will be used for one patient.
        </Typography>

        <Typography variant="body1">
          For each task, you will be asked to find 10 relevant articles for the
          treatment to decide which treatment strategy is the best for this
          patient. Each article should have a high level of evidence. if you
          can't find 10 articles, you might skip to the next point at any time.
        </Typography>

        <Typography variant="body1">
          If you find a relevant article, please mark it as relevant using the thumbs up button: <ThumbUpAltIcon
                                    sx={{
                                      fontSize: 25,
                                      width: "0.8em",
                                      height: "0.8em",
                                    }}
                                  />. 
        </Typography>

        <Typography variant="body1">
          The search engine will note down the number of queries and time spent
          on the task.
        </Typography>
      </Stack>

      <Box sx={{ textAlign: "center" }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={redirectToCaseA}
          sx={{ width: "100%", margin: "auto", marginTop: 2 }}
        >
          Start
        </Button>
      </Box>
    </Container>
  );
};

export default TaskDescription;
