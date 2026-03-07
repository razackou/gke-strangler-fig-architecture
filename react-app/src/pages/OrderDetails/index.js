import React, { useState, useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import { ORDERS_API_URL } from "../../config/api";
import { Box, Paper, Grid, Typography, Chip } from "@mui/material";

export default function OrderDetails() {
  const match = useRouteMatch();

  const [hasErrors, setErrors] = useState(false);
  const [order, setOrder] = useState({});

  const orderId = match.params.id;

  async function fetchOrder(orderId) {
    try {
      const response = await fetch(
        `${ORDERS_API_URL}/${encodeURIComponent(orderId)}`,
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch order: ${response.status}`);
      }
      const order = await response.json();
      setOrder(order);
    } catch (err) {
      setErrors(true);
    }
  }

  useEffect(() => {
    fetchOrder(orderId);
  }, [orderId]);

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 1000, mx: "auto" }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 2.4 },
          mb: 2,
          border: "1px solid rgba(16, 42, 67, 0.1)",
          animation: "panelRise 420ms ease-out both",
        }}
      >
        <Typography variant="subtitle2" color="success.main">
          Orders Detail Route
        </Typography>
        <Typography variant="h5">Order Trace</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.8 }}>
          Source endpoint:{" "}
          <Box
            component="span"
            sx={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {ORDERS_API_URL}/{"{id}"}
          </Box>
        </Typography>
      </Paper>
      {hasErrors && (
        <Paper
          elevation={0}
          sx={{
            background: "#ffe9e7",
            border: "1px solid #f3c8c3",
            padding: (theme) => theme.spacing(3, 2),
          }}
        >
          <Typography component="p">
            An error has occurred, please try reloading the page.
          </Typography>
        </Paper>
      )}
      {!hasErrors && (
        <Paper
          elevation={0}
          sx={{
            padding: (theme) => theme.spacing(3, 2),
            border: "1px solid rgba(16, 42, 67, 0.1)",
            animation: "panelRise 520ms ease-out both",
          }}
        >
          <Grid
            container
            spacing={3}
            justifyContent="flex-start"
            alignItems="stretch"
          >
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h5">{order.id || "Order"}</Typography>
              <Chip
                label="Live"
                color="success"
                size="small"
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Date
              </Typography>
              <Typography component="p" sx={{ mb: 1.2 }}>
                {order.date}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Cost
              </Typography>
              <Typography component="p">${order.cost}</Typography>
            </Grid>
            <Grid item md={6} xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Order Items
              </Typography>
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => (
                  <Typography
                    key={item}
                    sx={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "0.92rem",
                    }}
                  >
                    - {item}
                  </Typography>
                ))
              ) : (
                <Typography color="text.secondary">No items listed.</Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Route Signature
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "0.9rem",
                }}
              >
                GET {ORDERS_API_URL}/{encodeURIComponent(orderId)}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
}
