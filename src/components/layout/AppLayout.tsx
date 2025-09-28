// src/components/layout/AppLayout.tsx
import { Box } from "@mui/material";
import React from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

interface AppLayoutProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  onLoginClick: () => void;
  onLogout: () => void;
  onAddPostClick: () => void;
}

export default function AppLayout({
  children,
  isAuthenticated,
  onLoginClick,
  onLogout,
  onAddPostClick,
}: AppLayoutProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh", // Garante que o layout ocupe a tela toda
      }}
    >
      <Navbar
        isAuthenticated={isAuthenticated}
        onLoginClick={onLoginClick}
        onLogout={onLogout}
        onAddPostClick={onAddPostClick}
      />
      <Box component="main" sx={{ flexGrow: 1 }}>
        {" "}
        {/* Conteúdo principal cresce para empurrar o footer */}
        {children}
      </Box>
      <Footer />
    </Box>
  );
}
