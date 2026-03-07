import React from "react";
import {
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  ListItem,
  ListItemText,
  Box,
  Chip,
  Button,
  Divider,
  useMediaQuery,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  NavLink,
} from "react-router-dom";

//Import Pages
import Home from "../../pages/Home";
import Products from "../../pages/Products";
import Orders from "../../pages/Orders";
import OrderDetails from "../../pages/OrderDetails";
import NotFound from "../../pages/NotFound";

const drawerWidth = 260;

export default function ClippedDrawer() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const appbarGradient = theme.custom?.appbarGradient;
  const drawerBg = theme.custom?.drawerBg;

  const navItems = [
    { to: "/", label: "Overview" },
    { to: "/products", label: "Products Domain" },
    { to: "/orders", label: "Orders Domain" },
  ];

  const drawerContent = (
    <>
      <Toolbar
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
        }}
      >
        <Box>
          <Typography variant="subtitle2" color="secondary.main">
            Traffic Gateway
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Ingress Console
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <Box sx={{ px: 2, py: 1.5 }}>
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          <Chip
            size="small"
            label="Monolith"
            color="primary"
            variant="outlined"
          />
          <Chip
            size="small"
            label="Orders"
            color="success"
            variant="outlined"
          />
          <Chip
            size="small"
            label="Products"
            color="secondary"
            variant="outlined"
          />
        </Stack>
      </Box>
      <Divider />
      <List sx={{ px: 1.2, py: 1 }}>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.to}
            component={NavLink}
            exact={item.to === "/"}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            activeClassName="Mui-selected"
            sx={{
              borderRadius: 2,
              color: "text.secondary",
              mb: 0.6,
              "&.Mui-selected": {
                color: "primary.main",
                backgroundColor: "rgba(15, 76, 129, 0.1)",
                "& .MuiListItemText-primary": {
                  fontWeight: 600,
                },
              },
            }}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Router>
        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            background: appbarGradient,
            boxShadow: "0 10px 30px rgba(16, 42, 67, 0.18)",
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ color: "rgba(255,255,255,0.85)" }}
              >
                Strangler Fig Migration View
              </Typography>
              <Typography variant="h6" noWrap sx={{ fontWeight: 700 }}>
                Fancy Store Ops Console
              </Typography>
            </Box>
            {!isDesktop && (
              <Button
                onClick={() => setMobileOpen(true)}
                size="small"
                sx={{
                  color: "#ffffff",
                  borderColor: "rgba(255,255,255,0.45)",
                }}
                variant="outlined"
              >
                Menu
              </Button>
            )}
          </Toolbar>
        </AppBar>

        <Drawer
          variant="temporary"
          open={!isDesktop && mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRight: "1px solid rgba(16, 42, 67, 0.12)",
              backgroundColor: drawerBg,
            },
          }}
        >
          {drawerContent}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRight: "1px solid rgba(16, 42, 67, 0.12)",
              backgroundColor: drawerBg,
            },
          }}
        >
          {drawerContent}
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, md: 3 },
            mt: 1,
            animation: "panelRise 420ms ease-out both",
          }}
        >
          <Toolbar />
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/products">
              <Products />
            </Route>
            <Route path="/orders/:id">
              <OrderDetails />
            </Route>
            <Route path="/orders">
              <Orders />
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
        </Box>
      </Router>
    </Box>
  );
}
