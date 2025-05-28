import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";

const StyledLink = styled(Link)(({ theme, background }) => ({
  fontSize: 14,
  color: theme.palette.loginButton.color,
}));

export default StyledLink;
