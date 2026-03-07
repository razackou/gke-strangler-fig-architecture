import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0f4c81",
    },
    secondary: {
      main: "#00a8b5",
    },
    success: {
      main: "#4a9f2f",
    },
    background: {
      default: "#eef4f7",
      paper: "#ffffff",
    },
    text: {
      primary: "#102a43",
      secondary: "#486581",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    h4: {
      fontWeight: 700,
      letterSpacing: "0.02em",
    },
    h5: {
      fontWeight: 700,
    },
    subtitle2: {
      fontFamily: "'IBM Plex Mono', monospace",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      fontSize: "0.72rem",
    },
  },
  custom: {
    appbarGradient:
      "linear-gradient(120deg, rgba(11,60,93,0.95) 0%, rgba(15,76,129,0.95) 46%, rgba(0,168,181,0.9) 100%)",
    drawerBg: "#f4f9fc",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            "radial-gradient(circle at 15% 10%, #d8edf9 0%, #eef4f7 42%, #f8fbfd 100%)",
          minHeight: "100vh",
        },
        "@keyframes panelRise": {
          from: {
            opacity: 0,
            transform: "translateY(12px)",
          },
          to: {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
      },
    },
  },
});

export default theme;
