import Box from "@mui/material/Box";
import PersonIcon from "@mui/icons-material/Person";
import IconButton from "@mui/material/IconButton";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import useAuth from "../hooks/useAuth";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import Switch from "@mui/material/Switch";
import { useSettings } from "../contexts/SettingsProvider";
const StyledAvatar = styled(Avatar)(({ theme }) => ({
  background: theme.palette.profileButton.background,
}));
const ProfileButton = () => {
  const { isAuthorized, logout, user, isGuest } = useAuth();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { readability, switchReadability } = useSettings();
  const handleChange = (event) => {
    switchReadability(event.target.checked);
  };

  if (!isAuthorized) {
    return null;
  }

  return (
    <>
      <React.Fragment>
        <Box
          sx={{ display: "flex", alignItems: "center", textAlign: "center" }}
        >
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleClick}
              aria-controls={open ? "account-menu" : "account-menu1"}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <StyledAvatar>
                <PersonIcon />
              </StyledAvatar>
            </IconButton>
          </Tooltip>
        </Box>

        {!isGuest && (
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem>
              <Avatar />
              {user.name}
            </MenuItem>
            <MenuItem>{user.email}</MenuItem>

            <Divider />
            <MenuItem sx={{ color: "rgba(0, 0, 0, 0.6)" }}>
              Readability
              <Switch
                checked={readability}
                onChange={handleChange}
                inputProps={{ "aria-label": "controlled" }}
              />
            </MenuItem>

            <MenuItem component="a" href="/settings">
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={logout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        )}

        {isGuest && (
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                fonrSize: 12,
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem sx={{ color: "rgba(0, 0, 0, 0.6)" }}>
              <Avatar />
              Hi Guest
            </MenuItem>
            <Divider />
            <MenuItem sx={{ color: "rgba(0, 0, 0, 0.6)" }}>
              Readability
              <Switch
                checked={readability}
                onChange={handleChange}
                inputProps={{ "aria-label": "controlled" }}
              />
            </MenuItem>
            {/* <MenuItem>
              You Are A {user.specialistIn.toUpperCase()}

            </MenuItem> */}
            {/* <MenuItem divider>
              Level Of Expertise Is {user.levelOfExpertise.toUpperCase()}

            </MenuItem> */}

            <MenuItem onClick={logout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        )}
      </React.Fragment>
    </>
  );
};

export default ProfileButton;
