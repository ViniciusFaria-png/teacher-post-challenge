// src/components/layout/Footer.tsx
import { School } from "@mui/icons-material";
import { Box, Container, Link, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto", // Essencial para o "sticky footer"
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
          <School color="action" fontSize="small" />
          <Typography variant="body2" color="text.secondary" align="center">
            {"© "}
            {new Date().getFullYear()}{" "}
            <Link color="inherit" href="#">
              Blog EducaTech
            </Link>
            . Todos os direitos reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
