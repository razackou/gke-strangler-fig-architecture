import React from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";

import ClippedDrawer from "./components/ClippedDrawer";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ClippedDrawer />
    </ThemeProvider>
  );
}

export default App;
