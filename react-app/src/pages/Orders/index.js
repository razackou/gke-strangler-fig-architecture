import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { ORDERS_API_URL } from "../../config/api";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
} from "@mui/material";

export default function Orders() {
  const history = useHistory();

  const [hasErrors, setErrors] = useState(false);
  const [orders, setOrders] = useState([]);

  async function fetchOrders() {
    try {
      const response = await fetch(ORDERS_API_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }
      const orders = await response.json();
      setOrders(orders);
    } catch (err) {
      setErrors(true);
    }
  }

  useEffect(() => {
    fetchOrders();
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
        <Typography variant="subtitle2" color="success.main">
          Orders Domain
        </Typography>
        <Typography variant="h5">Transaction Stream</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.8 }}>
          Source endpoint:{" "}
          <Box
            component="span"
            sx={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {ORDERS_API_URL}
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
            overflowX: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1.2,
            }}
          >
            <Typography variant="h6">Orders</Typography>
            <Chip
              label={`${orders.length} records`}
              color="primary"
              size="small"
              variant="outlined"
            />
          </Box>
          <Table sx={{ minWidth: "650px" }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                  Order Id
                </TableCell>
                <TableCell sx={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                  Date
                </TableCell>
                <TableCell sx={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                  Total Items
                </TableCell>
                <TableCell sx={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                  Cost
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow
                  hover
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "rgba(0, 168, 181, 0.08)",
                    },
                  }}
                  key={order.id}
                  onClick={() => {
                    history.push(`/orders/${order.id}`);
                  }}
                >
                  <TableCell component="th" scope="row">
                    {order.id}
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    {(order.items && order.items.length) || 0}
                  </TableCell>
                  <TableCell>${order.cost}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
}
