import { Add, Login, Logout, School } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router";
import { paths } from "../../routes/paths";

interface NavbarProps {
  isAuthenticated: boolean;
  onLoginClick: () => void;
  onLogout: () => void;
}

export default function Navbar({
  isAuthenticated,
  onLoginClick,
  onLogout,
}: NavbarProps) {
  const navigate = useNavigate();

  const handleAddPostClick = () => {
    navigate(paths.posts.create);
  };

  return (
    <AppBar position="sticky">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <School sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Blog EducaTech
          </Typography>

          <School sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Blog EducaTech
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }} />

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {isAuthenticated ? (
              <>
                <Button
                  color="inherit"
                  onClick={handleAddPostClick}
                  startIcon={<Add />}
                  sx={{ display: { xs: "none", sm: "inline-flex" } }}
                >
                  Adicionar Post
                </Button>
                <Button
                  color="inherit"
                  onClick={onLogout}
                  startIcon={<Logout />}
                  sx={{ display: { xs: "none", sm: "inline-flex" } }}
                >
                  Logout
                </Button>

                <Box sx={{ display: { xs: "flex", sm: "none" }, gap: 1 }}>
                  <Tooltip title="Adicionar Post">
                    <IconButton color="inherit" onClick={handleAddPostClick}>
                      <Add />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Logout">
                    <IconButton color="inherit" onClick={onLogout}>
                      <Logout />
                    </IconButton>
                  </Tooltip>
                </Box>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  onClick={onLoginClick}
                  startIcon={<Login />}
                  sx={{ display: { xs: "none", sm: "inline-flex" } }}
                >
                  Sign In
                </Button>

                <Tooltip title="Sign In">
                  <IconButton
                    color="inherit"
                    onClick={onLoginClick}
                    sx={{ display: { sm: "none" } }}
                  >
                    <Login />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
