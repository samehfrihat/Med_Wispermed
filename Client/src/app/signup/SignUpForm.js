import React from "react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { url } from "../../config";
import "../login/login.css";
import { Box } from "@mui/system";
import Stack from "@mui/material/Stack";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { isEmail, isEmpty } from "../../utils/validators";
import { useTheme } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import { Button, CircularProgress, TextField, Select } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Logo from "../../components/Logo";
import StyledLink from "../../components/StyledLink";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const levels = [
  { value: "beginner", label: "Beginner [A1,A2]" },
  { value: "intermediate", label: "Intermediate [B1,B2]" },
  { value: "advanced", label: "Advanced [C1,C2]" },
];

const languages = ["Arabic", "English", "German"];

const SignUpForm = () => {
  const theme = useTheme();
  const [language, setLanguage] = React.useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [response, setResponse] = useState({});

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    specialistIn: "",
    language: "",
    level: "",
    experience:"",

  });

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    if (isEmpty(data.language)) {
      errors.language = "language is required";
    } else {
      setOpen(false);
    }
  };

  const [errors, setErrors] = useState({});
  //let token = JSON.parse(localStorage.getItem("token"));
  const token = localStorage.getItem("token");
  
  const onChangeLanguage = (e) => {
    setLanguage(
      // On autofill we get a stringified value.
      typeof value === "string" ? e.target.value.split(",") : e.target.value
    );

    const newData = { ...data };
    newData[e.target.name] = e.target.value;
    setData(newData);
  };


  // access check
  useEffect(() => {
    if (token) {
      if (token.status === 200) {
        history.push({ pathname: "/" });
      }
    }
  });

  useEffect(() => {
    if (response["status"] === 200) {
      history.push("/login");
    }
    setLoading(false);
  }, [response, history]);

  const onSubmit = (e) => {

    e.preventDefault();

    const errors = {};

    if (isEmpty(data.email)) {
      errors.email = "Email is required";
    } else if (!isEmail(data.email)) {
      errors.email = "Email is not valid";
    }

    if (isEmpty(data.password)) {
      errors.password = "Password is required";
    }
    if (isEmpty(data.name)) {
      errors.name = "userName is required";
    }
  
    if (isEmpty(data.specialistIn)) {
      errors.specialistIn = "specialistIn is required";
    }

    // if (isEmpty(data.experience)) {
    //   errors.experience = "Years Of Experience is required";
    // }

    console.log('testx', e, errors)

    if (Object.keys(errors).length) {
      setErrors(errors);
      return;
    }
    setErrors({});

    fetch(`${url}/signup/`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res , 'resssss')
        setResponse(res);
      });

    setLoading(true);
  };

  const handle = (e) => {
    const newData = { ...data };
    newData[e.target.name] = e.target.value;
    setData(newData);
  };

  return (
    <div className="bg">
      <Box className="containers" id="container">
        <form onSubmit={onSubmit}>
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <Logo />
            <Typography color="#546e7a" variant="h6">
              Create new Account
            </Typography>

            <StyledLink to="/login">already have account?</StyledLink>
          </Box>
          <Box>
            <Stack alignItems="stretch" mb={2} spacing={2}>
              <TextField
                type="email"
                label="Email"
                value={data.email}
                onChange={handle}
                name="email"
                size={"small"}
                margin="dense"
                error={errors.email}
                helpertext={errors.email}
              />
              <TextField
                type="password"
                label="Password"
                value={data.password}
                onChange={handle}
                name="password"
                size={"small"}
                margin="dense"
                error={errors.password}
                helpertext={errors.password}
              />
              <TextField
                label="Username"
                value={data.name}
                onChange={handle}
                name="name"
                size={"small"}
                margin="dense"
                error={errors.name}
                helpertext={errors.name}
              />

{/* <TextField
                label="Years Of Experience"
                value={data.experience}
                type='number'
                onChange={handle}
                name="experience"
                size={"small"}
                margin="dense"
                error={errors.experience}
                helpertext={errors.experience}
              /> */}

             

              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name={"specialistIn"}
                  value={data.specialistIn}
                  label="specialistIn"
                  size={"small"}
                  onChange={handle}
                  error={errors.specialistIn}
                  helpertext={errors.specialistIn}
                >
                  <MenuItem value="doctor">Doctor</MenuItem>
                  <MenuItem value="patient">Patient</MenuItem>
                  <MenuItem value="nurse">Nurse</MenuItem>
                  <MenuItem value="scientist">Scientist</MenuItem>
                </Select>
              </FormControl>

{/* 
              <FormControl fullWidth sx={{ m: 1, minWidth: 120 }}>
                <Box
                  sx={{
                    fontSize: 12,
                    margin: 2,
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <IconButton
                    sx={{
                      background: "#1CBDEF",
                      borderRadius: 8,
                      width: 30,
                      height: 30,
                    }}
                    onClick={handleClickOpen}
                  >
                    <AddIcon sx={{ fontSize: 15, color: "#fff" }}></AddIcon>
                  </IconButton>
                  <Box sx={{ padding: 1 }}> Add Language </Box>
                </Box>
              </FormControl> */}
            </Stack>

            {(response["status"] === 400 || response["status"] === 401) && (
              <Box
                sx={{
                  padding: 1.5,
                  borderRadius: 1,
                  color: "#dc2626",
                  border: "solid 1px #fecaca",
                  marginBottom: 2,
                  fontSize: 14,
                  background: "#fef2f2",
                }}
              >
                {response["error"]}
              </Box>
            )}

            <Stack spacing={1}>
              <Button
                startIcon={loading ? <CircularProgress size={14} /> : undefined}
                disabled={loading}
                type="submit"
                color="pallete1"
                variant="contained"
                sx={{ borderRadius: 50 }}
                disableElevation
              >
                Create Account
              </Button>
            </Stack>
          </Box>

          <Dialog
            sx={{ m: 1, minWidth: 200 }}
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle>{"Languages"}</DialogTitle>
            <DialogContent>
              <DialogContentText
                sx={{ display: "flex", flexDirection: "column", padding: 2 }}
                id="alert-dialog-slide-description"
              >
                <FormControl sx={{ m: 1, minWidth: 250 }} size="small">
                  <InputLabel id="demo-multiple-select-label">
                    Languages
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    name={"language"}
                    value={language || ["en"]}
                    label="language"
                    size={"small"}
                    onChange={onChangeLanguage}
                    multiple
                    MenuProps={MenuProps}
                    error={errors.language}
                  >
                    {languages.map((language) => (
                      <MenuItem key={language} value={language}>
                        {language}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 250 }} size="small">
                  <InputLabel id="demo-level-label">Level</InputLabel>
                  <Select
                    id="demo-level"
                    labelId="demo-level-label"
                    name={"level"}
                    value={data.level}
                    label="level"
                    size={"small"}
                    onChange={handle}
                    MenuProps={MenuProps}
                  >
                    {levels.map((l) => (
                      <MenuItem key={l.value} value={l.value}>
                        {l.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </DialogContentText>
            </DialogContent>
            <DialogActions
              sx={{
                justifyContent: "center",
              }}
            >
              <Button
                style={{}}
                startIcon={loading ? <CircularProgress size={14} /> : undefined}
                disabled={loading}
                type="submit"
                color="pallete1"
                variant="contained"
                disableElevation
                onClick={handleClose}
                sx={{ borderRadius: 50 }}
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </form>
      </Box>
    </div>
  );
};

export default SignUpForm;
