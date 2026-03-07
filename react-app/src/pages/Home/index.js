import React from "react";
import { Box, Paper, Typography, Grid, Chip } from "@mui/material";

const domainCards = [
  {
    title: "Monolith",
    endpoint: "/",
    status: "Active",
    color: "primary",
    description:
      "Legacy storefront remains online while services are extracted incrementally.",
  },
  {
    title: "Orders Service",
    endpoint: "/api/orders",
    status: "Ready",
    color: "success",
    description:
      "Routing target prepared for controlled cutover using ingress path policies.",
  },
  {
    title: "Products Service",
    endpoint: "/api/products",
    status: "Ready",
    color: "secondary",
    description:
      "Independent product domain can be shifted without frontend code changes.",
  },
];

export default function Home() {
  return (
    <Box sx={{ flexGrow: 1, maxWidth: 1200, mx: "auto" }}>
      <Paper
        elevation={0}
        sx={{
          px: { xs: 2, md: 3.5 },
          py: { xs: 2.2, md: 2.8 },
          border: "1px solid rgba(16, 42, 67, 0.1)",
          background:
            "linear-gradient(115deg, rgba(255,255,255,0.95) 0%, rgba(232,245,252,0.9) 100%)",
          animation: "panelRise 520ms ease-out both",
        }}
      >
        <Typography variant="subtitle2" color="secondary.main">
          Live Migration Dashboard
        </Typography>
        <Typography variant="h4" sx={{ mt: 0.4 }}>
          Strangler Fig Control Plane
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1.2, maxWidth: 760 }}>
          Monitor service boundaries, route ownership, and migration readiness
          from a single frontend view. This interface is optimized for gradual
          ingress-driven traffic shifts.
        </Typography>
      </Paper>

      <Grid container spacing={2.2} sx={{ mt: 0.5 }}>
        {domainCards.map((card, index) => (
          <Grid item xs={12} md={4} key={card.title}>
            <Paper
              elevation={0}
              sx={{
                p: 2.2,
                minHeight: 190,
                border: "1px solid rgba(16, 42, 67, 0.1)",
                animation: "panelRise 520ms ease-out both",
                animationDelay: `${120 + index * 100}ms`,
                display: "flex",
                flexDirection: "column",
                gap: 1.1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="h6" sx={{ fontSize: "1.05rem" }}>
                  {card.title}
                </Typography>
                <Chip size="small" color={card.color} label={card.status} />
              </Box>
              <Typography variant="subtitle2" color="text.secondary">
                Route
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "0.95rem",
                }}
              >
                {card.endpoint}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: "auto" }}>
                {card.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
