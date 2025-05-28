import * as React from "react";
import { useEffect } from "react";
import { Box } from "@mui/system";
import Stack from "@mui/material/Stack";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { url } from "../../config";
import { useSettings } from "../../contexts/SettingsProvider";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Slide from "@mui/material/Slide";
import DialogContentText from "@mui/material/DialogContentText";

import {
  Typography,
  CircularProgress,
  TextField,
  Select,
  Grid,
} from "@mui/material";

import Logo from "../../components/Logo";
import StyledLink from "../../components/StyledLink";
import { Label, PasswordOutlined } from "@mui/icons-material";
import ProfileButton from "../../components/ProfileButton";
import { Link } from "react-router-dom";
import { useState } from "react";
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

const languages = ["Arabic", "English", "German"];
const levels = [
  { value: "beginner", label: "Beginner [A1,A2]" },
  { value: "intermediate", label: "Intermediate [B1,B2]" },
  { value: "advanced", label: "Advanced [C1,C2]" },
];
const Settings = () => {
  const theme = useTheme();
  const [language, setLanguage] = React.useState([]);
  const [loading, setLoading] = useState(false);
  const { settings, setSettings, isSaving, saveSettings } = useSettings();
console.log('settings' ,settings)
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
      setOpen(false);
  };

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  const onChangeLanguage = (e) => {
     const language =
      typeof e.target.value === "string"
        ? e.target.value.split(",")
        : e.target.value;

    setLanguage(language[0]);

    setSettings({ ...settings, language: language });

  }; 
  const onChange = (e) => {
    setSettings({ ...settings,[ e.target.name] : e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    saveSettings();
  };

  const [selectedIndex, setSelectedIndex] = useState(0);
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  return (
    <>

      <form onSubmit={onSubmit}>
        <Box
          sx={{ display: "flex", justifyContent: "space-between", padding: 1 }}
          component="header"
        >
          <Stack alignItems="center" direction="row" spacing={2}>
            <Link to="/">
              <Logo width="50px" height="50px" />
            </Link>
            <h3>Account Settings</h3>
          </Stack>
          <Stack  spacing={1} alignItems="center">
            <div id="header-nav-placeholder" />
            <ProfileButton />
          </Stack>
        </Box>
        <Divider />
        <Box display="flex" style={{ padding: "80px" }}>
          <Box role="presentation">
            <List>
              {["Account", "Password"].map((text, index) => (
                <ListItem key={text} disablePadding>
                  <ListItemButton
                    selected={selectedIndex === index}
                    onClick={(event) => handleListItemClick(event, index)}
                  >
                    <ListItemIcon>
                      {index % 2 === 0 ? <InboxIcon /> : <PasswordOutlined />}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
          <Divider
            sx={{ mx: 4 }}
            orientation="vertical"
            variant="middle"
            flexItem
          />
          {selectedIndex === 0 && (
            <Box justifyContent="center">
              <Grid container spacing={2}>
                <Grid container item xs={6}>
                  <TextField
                    fullWidth
                    type="email"
                    label="Email"
                    value={settings.email || ""}
                    onChange={onChange}
                    name="email"
                    size={"small"}
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="name"
                    label="Username"
                    value={settings.name || ""}
                    onChange={onChange}
                    name="name"
                    size={"small"}
                    margin="dense"
                  />
                </Grid>

                <Grid item xs={6}>
                  <FormControl size="small" fullWidth >
                    <InputLabel id="demo-simple-select-label">
                      Status
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name={"specialistIn"}
                      value={settings.specialistIn || "doctor"}
                      label="Status"
                      size={"small"}
                      onChange={onChange}
                      fullWidth
                    >
                      <MenuItem value="doctor">Doctor</MenuItem>
                      <MenuItem value="patient">Patient</MenuItem>
                      <MenuItem value="nurse">Nurse</MenuItem>
                      <MenuItem value="scientist">Scientist</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl size="small" fullWidth>
                 

                    <FormControl fullWidth sx={{ m: 1, minWidth: 120 }}>
                <Box
                  sx={{
                    fontSize: 12,
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
              </FormControl>

                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    startIcon={
                      isSaving ? <CircularProgress size={14} /> : undefined
                    }
                    disabled={isSaving}
                    type="submit"
                    color="pallete1"
                    variant="contained"
                    sx={{ borderRadius: 50 }}
                    disableElevation
                  >
                    Update Data
                  </Button>
                </Grid>
              </Grid>

              {/* show error */}
              {/* {response["status"] === 400 && <p>{response["error"]}</p>} */}
            </Box>
          )}
        </Box>
{open &&
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
                    value={settings.language || ["en"]}
                    label="language"
                    size={"small"}
                    onChange={onChangeLanguage}
                    multiple
                    MenuProps={MenuProps}
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
                    value={settings.level}
                    label="level"
                    size={"small"}
                    onChange={onChange}
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
}
      </form>
    </>
  );
};

export default Settings;
