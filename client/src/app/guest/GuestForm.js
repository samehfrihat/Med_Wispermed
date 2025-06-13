import "../login/login.css";
import React from "react";
import { useEffect, useState } from "react";
import { Box } from "@mui/system";
import Stack from "@mui/material/Stack";
import Spinner from "../../components/Spinner";
import { useHistory } from "react-router";
import { saveSearchSettings } from "./api";
import Logo from "../../components/Logo";
import { styled } from "@mui/material/styles";
import {
  Typography,
  TextField,
  CircularProgress,
  Button,
  Select,
  useTheme,
  Link as MuiLink,
} from "@mui/material";
import { Link } from "react-router-dom";

import StyledLink from "../../components/StyledLink";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { url } from "../../config";
import useAuth from "../../hooks/useAuth";

const GuestForm = () => {
  const [loading, setLoading] = useState(false);
  const [guest, setGuest] = useState(false);
  const [response, setResponse] = useState({});
  const [data, setData] = useState({ specialistIn: "", levelOfExpertise: "" });

  const history = useHistory();

  const theme = useTheme();

  useEffect(() => {
    if (response["status"] === 200) {
      window.location.reload(false);
      history.push({ pathname: "/" });
    }
    setLoading(false);
  }, [response, history]);

  if (guest) {
    history.push("/");
    return null;
  }

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
     

      fetch(`${url}/guest/`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((res) => {
          setLoading(false);
          localStorage.setItem("user", JSON.stringify(res.user));
          localStorage.setItem("token", res.token);
          setResponse(res);
          setGuest(true);
        });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handle = (e) => {
    const newData = { ...data };
    newData[e.target.name] = e.target.value;
    console.log(e.target.name);
    setData(newData);
  };
  return (
    <div className="bg">
      <form onSubmit={onSubmit} className="containers" id="container">
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <Logo />
          <Typography variant="h6" color="#546e7a">
            Login as guests
          </Typography>
        </Box>

        <Box>
          <Stack alignItems="stretch" mb={2} spacing={2}>
            <FormControl size="small" fullWidth>
              <InputLabel id="demo-simple-select-label">Status</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name={"specialistIn"}
                value={data.specialistIn}
                label="specialistIn"
                size={"small"}
                onChange={handle}
              >
                <MenuItem value="Doctor">Doctor</MenuItem>
                <MenuItem value="Patient">Patient</MenuItem>
                <MenuItem value="Nurse">Nurse</MenuItem>
                <MenuItem value="Scientist">Scientist</MenuItem>
              </Select>
            </FormControl>

            {/* <FormControl name="levelOfExpertise" size="small" fullWidth>
              <InputLabel id="demo-simple-select-label">
                Level of expertise
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name={"levelOfExpertise"}
                value={data.levelOfExpertise}
                label="levelOfExpertise"
                size={"small"}
                onChange={handle}
              >
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="expert">Expert</MenuItem>
              </Select>
            </FormControl> */}
          </Stack>

          <Button
            startIcon={loading ? <CircularProgress size={14} /> : undefined}
            disabled={loading}
            type="submit"
            color="pallete2"
            variant="contained"
            sx={{ borderRadius: 50 }}
            disableElevation
            fullWidth
          >
            Save And Continue
          </Button>
          <Box sx={{ fontSize: "12px", color: "#b0bec5", margin: 2 }}>
            Create account for more efficiency and ultimate results !
          </Box>
          <Stack spacing={1}>
            <Link
              component={Button}
              variant="contained"
              sx={{ borderRadius: 50 }}
              to="/signup"
              disableElevation
              color="pallete2"
            >
              Create Account
            </Link>

            <Box sx={{ fontSize: "12px", color: "#b0bec5", margin: 2 }}>
              Already have an account ?{" "}
              <Link component={MuiLink} color="pallete2.main" to="/login">
                SignIn
              </Link>
            </Box>
          </Stack>
        </Box>
        {response["status"] === 400 && <p>{response["error"]}</p>}
      </form>
    </div>
  );
};

export default GuestForm;