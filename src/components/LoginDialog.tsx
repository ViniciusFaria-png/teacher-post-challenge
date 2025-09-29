// components/LoginDialog.tsx
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React from "react";

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  loginData: { email: string; senha: string };
  setLoginData: React.Dispatch<
    React.SetStateAction<{ email: string; senha: string }>
  >;
  loading: boolean;
  error: string | null;
}

export default function LoginDialog({
  open,
  onClose,
  onSubmit,
  loginData,
  setLoginData,
  loading,
  error,
}: LoginDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Acesso do Professor</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={loginData.email}
            onChange={(e) =>
              setLoginData((prev) => ({ ...prev, email: e.target.value }))
            }
            margin="normal"
            required
            disabled={loading}
            autoComplete="email"
          />

          <TextField
            fullWidth
            label="Senha"
            type="password"
            value={loginData.senha}
            onChange={(e) =>
              setLoginData((prev) => ({ ...prev, senha: e.target.value }))
            }
            margin="normal"
            required
            disabled={loading}
            autoComplete="current-password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Entrar"
            )}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
