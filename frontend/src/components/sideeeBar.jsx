import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
} from "@mui/material";
import { Article, Drafts, Add, AccountCircle } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

const drawerWidth = 240;

export default function Sidebar({ user }) {
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          top: "9vh",
          width: drawerWidth,
          boxSizing: "border-box",
          height: "93vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
      }}
    >
      <Box>
        <List>
          <ListItem button onClick={() => navigate("/dashboard")}>
            <ListItemIcon>
              <Article />
            </ListItemIcon>
            <ListItemText primary="Sessions" />
          </ListItem>
          <ListItem button onClick={() => navigate("/dashboard/drafts")}>
            <ListItemIcon>
              <Drafts />
            </ListItemIcon>
            <ListItemText primary="Drafts" />
          </ListItem>
          <ListItem button onClick={() => navigate("/dashboard/new")}>
            <ListItemIcon>
              <Add />
            </ListItemIcon>

            <ListItemText primary="New Session" />
          </ListItem>
        </List>
      </Box>

      {/* Profile section */}
      <Box p={2} borderTop="1px solid #ccc">
        <Typography variant="body2" color="textSecondary">
          <AccountCircle
            fontSize="small"
            sx={{ verticalAlign: "middle", mr: 1 }}
          />
          {user?.email || "Guest User"}
        </Typography>
      </Box>
    </Drawer>
  );
}
