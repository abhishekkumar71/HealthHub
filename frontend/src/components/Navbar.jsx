import * as React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Button,
  Box,
  Container,
  Slide,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import PropTypes from "prop-types";
import axios from "axios";

function HideOnScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  window: PropTypes.func,
};

export default function Navbar({ setAuthOpen, setAuthMode, user, setUser }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  
;

  const handleLogout = async () => {
    try {
      await axios.get("https://healthhub-backend-sldu.onrender.com/logout", { withCredentials: true });
      setUser(null);
      navigate("/");
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const hideAuthLinks = ["/dashboard", "/new", "/edit"].some(
    (path) => location.pathname.startsWith(path)
  );

  const navLinks = [
    {
      name: "Explore",
      action: () => {
        navigate("/explore");
      },
    },
    {
      name: "Dashboard",
      action: () => {
        if (user) {
          navigate("/dashboard");
        } else {
          setAuthMode("login");
          setAuthOpen(true);
        }
      },
    },
    {
      name:"Create Session",
     action: () => {
        if (user) {
          navigate("/dashboard/new");
        } else {
          setAuthMode("login");
          setAuthOpen(true);
        }
      },
    }
  ];

  return (
    <HideOnScroll>
      <AppBar sx={{ backgroundColor: "#075b07", width: "100%", top: "0" ,position:"fixed",zIndex:(theme)=>theme.zIndex.drawer+1}}>
        <Container>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2,":hover":{cursor:"pointer"} }} onClick={()=>navigate("/")}>
              <img
                src="/logo.png"
                alt="logo"
                style={{ height: "40px", borderRadius: "10px" }}
              />
              <Typography variant="h6" sx={{ color: "white" }}>
                HealthHub
              </Typography>
            </Box>

            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton onClick={handleOpenNavMenu} color="inherit">
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorElNav}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
              >
                {navLinks.map((link) => (
                  <Button
                    key={link.name}
                    onClick={link.action}
                    sx={{ color: "white", textTransform: "none" }}
                  >
                    {link.name}
                  </Button>
                ))}

                {!user &&
                  !hideAuthLinks && [
                    <MenuItem
                      key="login"
                      onClick={() => {
                        setAuthOpen(true);
                        setAuthMode("login");
                        handleCloseNavMenu();
                      }}
                    >
                      <Typography>Login</Typography>
                    </MenuItem>,
                    <MenuItem
                      key="register"
                      onClick={() => {
                        setAuthOpen(true);
                        setAuthMode("register");
                        handleCloseNavMenu();
                      }}
                    >
                      <Typography>Register</Typography>
                    </MenuItem>,
                  ]}

              </Menu>
            </Box>

            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
              {navLinks.map((link) => (
                <Button
                  key={link.name}
                  onClick={link.action}
                  sx={{ color: "white", textTransform: "none" }}
                >
                  {link.name}
                </Button>
              ))}

              {!user && !hideAuthLinks && (
                <>
                  <Button
                    sx={{ color: "white", textTransform: "none" }}
                    onClick={() => {
                      setAuthOpen(true);
                      setAuthMode("login");
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    sx={{ color: "white", textTransform: "none" }}
                    onClick={() => {
                      console.log("cllicked");
                      setAuthOpen(true);
                      setAuthMode("register");
                    }}
                  >
                    Register
                  </Button>
                </>
              )}
              {user && (
                
                <Button
                  onClick={handleLogout}
                  sx={{ color: "white", textTransform: "none", ml: 2 }}
                >
                  Logout
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
}
