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
        <Typography variant="h5">Kontext:</Typography>
        <Typography variant="body1">
        Stellen Sie sich vor, Sie sind Dermatologe und interessieren sich für das Gebiet der dermatologischen Onkologie. Sie sind eine Person, die sowohl Wert auf die Genauigkeit der Informationen als auch auf die Effizienz beim Finden relevanter Informationen legt.
        </Typography>

        <Typography variant="h5">Aufgabe:</Typography>
        <Typography variant="body1">
        Stellen Sie sich vor, Ihnen wurden zwei Patienten zugeteilt, die jeweils an einer bestimmten Art von Hautkrebs leiden. Sie müssen die besten Behandlungsoptionen für jeden der beiden Patienten finden. Sie werden dazu zwei verschiedene Suchmaschinen verwenden. Jede Suchmaschine wird für einen Patienten verwendet.
          </Typography>

        <Typography variant="body1">
        Für jede Aufgabe sollen Sie 10 relevante Artikel zur Behandlung finden, um zu entscheiden, welche Behandlungsstrategie für diesen Patienten die beste ist. Jeder Artikel sollte ein hohes Evidenzniveau haben. Wenn Sie keine 10 Artikel finden können, können Sie jederzeit zum nächsten Punkt übergehen.
          </Typography>

        <Typography variant="body1">
        Wenn Sie einen relevanten Artikel finden, markieren Sie diesen bitte als relevant mit dem Daumen-hoch-Button: <ThumbUpAltIcon
                                    sx={{
                                      fontSize: 25,
                                      width: "0.8em",
                                      height: "0.8em",
                                    }}
                                  />. 
        </Typography>

        <Typography variant="body1">
        Die Suchmaschine wird die Anzahl der Anfragen und die für die Aufgabe aufgewendete Zeit notieren.
        </Typography>

        <Typography variant="body1">
        Die Suchmaschine wurde, wie auch andere frei verfügbare Suchmaschinen wie PubMed, in Englischer Sprache entwickelt.
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
          STARTEN
        </Button>
      </Box>
    </Container>
  );
};

export default TaskDescription;
