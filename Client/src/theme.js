import { createTheme } from "@mui/material/styles";
import {
  borderRadius,
  fontSize,
  fontWeight,
  letterSpacing,
  textTransform,
} from "@mui/system";
export const theme = createTheme({
  palette: {
    profileButton: {
      background: "#1876D1",
      text: "#fff",
    },
    loginButton: {
      color: "#616161",
    },
    createButton: {
      background: "#1CBDEF",
      borderRadius: "20px",
      color: "#FFFFFF",
      fontSize: "12px",
      fontWeight: "bold",
      padding: "12px 45px",
      letterSpacing: "1px",
      textTransform: "uppercase",
      transition: "transform 80ms ease-in",
      marginTop: "5px",
      textDecoration: "none",
      minWidth: "250px",
    },

    pallete1: {
      main: "#1CBDEF",
      contrastText: "#fff",
    },
    pallete2: {
      main: "#08AA86",
      contrastText: "#fff",
    }, 
  },
  backgroundTheme: {},
});
