// src/pages/PostPage.tsx
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { signIn } from "../actions/auth";
import { getPosts } from "../actions/posts";
import PostCard from "../components/PostCard";
import AppLayout from "../components/layout/AppLayout"; // Importa o novo Layout
import { paths } from "../routes/paths";
import type { IPost } from "../types/post";

export default function PostPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lógica de autenticação e modal
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", senha: "" });
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
    const token = localStorage.getItem("token");
    if (token) setIsAuthenticated(true);
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const postsData = await getPosts();
      setPosts(postsData);
    } catch (err) {
      setError("Erro ao carregar posts. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setError(null);
    try {
      await signIn(loginData);
      localStorage.setItem("token", "dummy-token"); // Simula a obtenção de um token
      setIsAuthenticated(true);
      setLoginOpen(false);
      setLoginData({ email: "", senha: "" });
    } catch (err) {
      setError("Email ou senha inválidos.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box textAlign="center" py={10}>
          <CircularProgress size={60} />
          <Typography mt={2}>Carregando publicações...</Typography>
        </Box>
      );
    }
    if (error) {
      return (
        <Alert severity="error" sx={{ m: 3 }}>
          {error}
          <Button onClick={fetchPosts} size="small" sx={{ ml: 2 }}>
            Tentar novamente
          </Button>
        </Alert>
      );
    }
    return (
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <PostCard
              post={post}
              isProfessor={isAuthenticated}
              onView={(p) => navigate(paths.posts.details(p.id))}
              onEdit={(p) => navigate(paths.posts.edit(p.id))}
              onDelete={(p) => console.log("Apagar", p.id)}
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <AppLayout
      isAuthenticated={isAuthenticated}
      onLoginClick={() => setLoginOpen(true)}
      onLogout={handleLogout}
      onAddPostClick={() => console.log("Abrir modal/página de criar post")}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4 } }}>
        {renderContent()}
      </Container>

      {/* O Dialog de Login continua sendo gerenciado pela página */}
      <Dialog
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Acesso do Professor</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData((p) => ({ ...p, email: e.target.value }))
              }
              margin="normal"
              required
              disabled={loginLoading}
            />
            <TextField
              fullWidth
              label="Senha"
              type="password"
              value={loginData.senha}
              onChange={(e) =>
                setLoginData((p) => ({ ...p, senha: e.target.value }))
              }
              margin="normal"
              required
              disabled={loginLoading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, py: 1.5 }}
              disabled={loginLoading}
            >
              {loginLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Entrar"
              )}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
