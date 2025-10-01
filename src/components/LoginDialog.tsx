import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

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
  onSignUp?: (data: { email: string; senha: string }) => Promise<void>;
}

export default function LoginDialog({
  open,
  onClose,
  onSubmit,
  loginData,
  setLoginData,
  loading,
  error,
  onSignUp,
}: LoginDialogProps) {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [signUpData, setSignUpData] = useState({
    email: "",
    senha: "",
    confirmSenha: "",
  });
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const handleClose = () => {
    setIsSignUpMode(false);
    setSignUpData({ email: "", senha: "", confirmSenha: "" });
    setSignUpError(null);
    setSignUpSuccess(false);
    onClose();
  };

  const handleToggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
    setSignUpError(null);
    setSignUpSuccess(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError(null);

    if (signUpData.senha !== signUpData.confirmSenha) {
      setSignUpError("As senhas não coincidem");
      return;
    }

    if (signUpData.senha.length < 6) {
      setSignUpError("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    if (!onSignUp) {
      setSignUpError("Função de cadastro não configurada");
      return;
    }

    setSignUpLoading(true);

    try {
      await onSignUp({
        email: signUpData.email,
        senha: signUpData.senha,
      });

      setSignUpSuccess(true);
      setSignUpData({ email: "", senha: "", confirmSenha: "" });

      setTimeout(() => {
        setIsSignUpMode(false);
        setSignUpSuccess(false);
      }, 2000);
    } catch (err) {
      setSignUpError(
        err instanceof Error
          ? err.message
          : "Erro ao criar conta. Tente novamente.",
      );
    } finally {
      setSignUpLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        {isSignUpMode ? "Criar Conta de Aluno" : "Acesso do Professor"}
      </DialogTitle>
      <DialogContent>
        {!isSignUpMode ? (
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

            {onSignUp && (
              <Box sx={{ textAlign: "center", mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Não tem uma conta de aluno?{" "}
                  <Link
                    component="button"
                    type="button"
                    variant="body2"
                    onClick={handleToggleMode}
                    sx={{ cursor: "pointer" }}
                    disabled={loading}
                  >
                    Crie uma agora
                  </Link>
                </Typography>
              </Box>
            )}
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSignUp} sx={{ mt: 1 }}>
            {signUpSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Conta criada com sucesso! Redirecionando para login...
              </Alert>
            )}

            {signUpError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {signUpError}
              </Alert>
            )}

            <Alert severity="info" sx={{ mb: 2 }}>
              Apenas alunos podem criar contas. Se você é professor, entre em
              contato com o administrador do sistema.
            </Alert>

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={signUpData.email}
              onChange={(e) =>
                setSignUpData((prev) => ({ ...prev, email: e.target.value }))
              }
              margin="normal"
              required
              disabled={signUpLoading || signUpSuccess}
              autoComplete="email"
            />

            <TextField
              fullWidth
              label="Senha"
              type="password"
              value={signUpData.senha}
              onChange={(e) =>
                setSignUpData((prev) => ({ ...prev, senha: e.target.value }))
              }
              margin="normal"
              required
              disabled={signUpLoading || signUpSuccess}
              autoComplete="new-password"
              helperText="Mínimo 6 caracteres"
            />

            <TextField
              fullWidth
              label="Confirmar Senha"
              type="password"
              value={signUpData.confirmSenha}
              onChange={(e) =>
                setSignUpData((prev) => ({
                  ...prev,
                  confirmSenha: e.target.value,
                }))
              }
              margin="normal"
              required
              disabled={signUpLoading || signUpSuccess}
              autoComplete="new-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={signUpLoading || signUpSuccess}
            >
              {signUpLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Criar Conta"
              )}
            </Button>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Já tem uma conta?{" "}
                <Link
                  component="button"
                  type="button"
                  variant="body2"
                  onClick={handleToggleMode}
                  sx={{ cursor: "pointer" }}
                  disabled={signUpLoading || signUpSuccess}
                >
                  Fazer login
                </Link>
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
