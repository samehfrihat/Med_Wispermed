import * as React from "react";
import "./search.css";
import Box from "@mui/material/Box";

import SearchForm from "../../components/SearchForm";
import Image from "../../components/Image";
import { Slide } from "@mui/material";

import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Fab from "@mui/material/Fab";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Avatar from "@mui/material/Avatar";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import MoreIcon from "@mui/icons-material/MoreVert";
import { useEffect, useMemo, useState } from "react";
import { makeStyles } from "@mui/styles";
import {
  Container,
  Stack,
  FormControl,
  Button,
  TextField,
} from "@mui/material";
import { submit } from "./api";
import { Link } from "react-router-dom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PauseIcon from "@mui/icons-material/Pause";
import TaskBanner from "../../components/TaskBanner";
import { useSearch } from "../../contexts/SearchProvider";


const Search = () => {
  const search = useSearch();
  const [timerRunning, setTimerRunning] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [feedback, setFeedbackText] = useState("");

  const [numA, setNumA] = useState({});
  const [timeA, setTimeA] = useState({});
  const caseA = "";

  if (window.location.href === "/") {
    caseA = "WisPerMid";
  }

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

  useEffect(()=>{
    search.resetFilters()
  },[])

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

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div className="container" style={{ marginTop: "10vh" }}>
          <Box sx={{ paddingBottom: "8vh" }}>
            <Image src="../WisPerMed.png" />
          </Box>
          <SearchForm {...search} hasCategory={false} />

        </div>
      </div>
    </div>
  );
};

export default Search;
