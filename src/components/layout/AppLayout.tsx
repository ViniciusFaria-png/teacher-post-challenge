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
}: AppLayoutProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Navbar
        isAuthenticated={isAuthenticated}
        onLoginClick={onLoginClick}
        onLogout={onLogout}
      />
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
}
