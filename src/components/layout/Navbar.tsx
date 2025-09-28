// src/components/layout/Navbar.tsx
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

interface NavbarProps {
  isAuthenticated: boolean;
  onLoginClick: () => void;
  onLogout: () => void;
  onAddPostClick: () => void; // Ação para criar post
}

export default function Navbar({
  isAuthenticated,
  onLoginClick,
  onLogout,
  onAddPostClick,
}: NavbarProps) {
  return (
    <AppBar position="sticky">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* Logo e Nome */}
          <School sx={{ display: "flex", mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" }, // Oculta em telas pequenas
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
              flexGrow: 1,
            }}
          >
            Blog EducaTech
          </Typography>

          {/* Logo Mobile (ocupa espaço para o menu ir para a direita) */}
          <Typography
            variant="h5"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
          />

          {/* Botões de Ação */}
          <Box>
            {isAuthenticated ? (
              <>
                {/* Botão para telas grandes */}
                <Button
                  color="inherit"
                  onClick={onAddPostClick}
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

                {/* Ícones para telas pequenas */}
                <Tooltip title="Adicionar Post">
                  <IconButton
                    color="inherit"
                    onClick={onAddPostClick}
                    sx={{ display: { sm: "none" } }}
                  >
                    <Add />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Logout">
                  <IconButton
                    color="inherit"
                    onClick={onLogout}
                    sx={{ display: { sm: "none" } }}
                  >
                    <Logout />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <>
                {/* Botão para telas grandes */}
                <Button
                  color="inherit"
                  onClick={onLoginClick}
                  startIcon={<Login />}
                  sx={{ display: { xs: "none", sm: "inline-flex" } }}
                >
                  Sign In
                </Button>
                {/* Ícone para telas pequenas */}
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
