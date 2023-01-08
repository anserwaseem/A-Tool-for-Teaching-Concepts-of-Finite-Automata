import {
  AppBar,
  Container,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Menu,
  Button,
  Link,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Pages } from "../../enums/Pages";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import "./css/Navbar.css";

const pages = Object.values(Pages);

export function NavBar() {
  console.log("re rendering Navbar");

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar
      position="static"
      className="navbar"
      sx={{
        bgcolor: "secondary.main",
      }}
    >
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <Box
            component="img"
            alt="logo"
            src="/logo192.png"
            maxWidth={"30px"}
            sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
          />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to={process.env.PUBLIC_URL}
            sx={{
              mr: 7,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 500,
              fontSize: "1.5rem",
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Automadeasy
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <Link
                  component={RouterLink}
                  to={`${process.env.PUBLIC_URL}/${page}`}
                  underline="none"
                  key={page}
                >
                  <Button
                    key={page}
                    onClick={handleCloseNavMenu}
                    sx={{
                      paddingRight: 5,
                      display: "block",
                      textTransform: "capitalize",
                      fontSize: "1rem",
                    }}
                  >
                    {page}
                  </Button>
                </Link>
              ))}
            </Menu>
          </Box>

          <Box
            component="img"
            alt="logo"
            src="/logo192.png"
            maxWidth={"30px"}
            className="navbar-mobile-logo"
            sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
          />
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to={process.env.PUBLIC_URL}
            className="navbar-mobile-title"
            sx={{
              mr: 7,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 500,
              fontSize: "1.5rem",
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Automadeasy
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Link
                component={RouterLink}
                to={`${process.env.PUBLIC_URL}/${page}`}
                key={page}
              >
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    color: "white",
                    display: "block",
                    textTransform: "capitalize",
                    fontSize: "1rem",
                  }}
                >
                  {page}
                </Button>
              </Link>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavBar;
