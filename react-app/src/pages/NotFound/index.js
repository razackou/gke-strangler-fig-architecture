import React from "react";
import { Box, Paper, Typography } from "@mui/material";

export default function NotFound() {
  return (
    <Box sx={{ flexGrow: 1, maxWidth: 900, mx: "auto" }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 3 },
          border: "1px solid rgba(16, 42, 67, 0.12)",
          animation: "panelRise 420ms ease-out both",
        }}
      >
        <Typography variant="subtitle2" color="text.secondary">
          Route Miss
        </Typography>
        <Typography variant="h5" sx={{ mt: 0.6 }}>
          Page not found
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          This route does not map to an active service endpoint.
        </Typography>
      </Paper>
    </Box>
  );
}
