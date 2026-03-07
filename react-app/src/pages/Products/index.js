import React, { useState, useEffect } from "react";
import { PRODUCTS_API_URL } from "../../config/api";
import {
  Box,
  Paper,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Typography,
  Chip,
} from "@mui/material";

export default function Products() {
  const [hasErrors, setErrors] = useState(false);
  const [products, setProducts] = useState([]);

  async function fetchData() {
    try {
      const response = await fetch(PRODUCTS_API_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      const products = await response.json();
      setProducts(products);
    } catch (err) {
      setErrors(true);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 1200, mx: "auto" }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 2.4 },
          mb: 2,
          border: "1px solid rgba(16, 42, 67, 0.1)",
          animation: "panelRise 420ms ease-out both",
        }}
      >
        <Typography variant="subtitle2" color="secondary.main">
          Products Domain
        </Typography>
        <Typography variant="h5">Catalog Route Monitor</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.8 }}>
          Source endpoint:{" "}
          <Box
            component="span"
            sx={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {PRODUCTS_API_URL}
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
        <Grid
          sx={{ margin: "0 auto" }}
          container
          spacing={3}
          justifyContent="flex-start"
          alignItems="stretch"
        >
          {products.map((product, index) => {
            return (
              <Grid key={product.id} item md={4} xs={12}>
                <Card
                  elevation={0}
                  sx={{
                    border: "1px solid rgba(16, 42, 67, 0.12)",
                    height: "100%",
                    animation: "panelRise 420ms ease-out both",
                    animationDelay: `${120 + index * 70}ms`,
                  }}
                >
                  <CardMedia
                    sx={{ height: 0, paddingTop: "56.25%" }}
                    image={product.picture}
                    title={product.name}
                  />
                  <CardContent
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {product.name}
                      </Typography>
                      <Chip
                        label="$"
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    </Box>
                    <Typography
                      sx={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: "0.9rem",
                      }}
                    >
                      {product.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${product.cost}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}
