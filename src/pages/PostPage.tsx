import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { deletePost, getPosts } from "../actions/posts";
import PostCard from "../components/PostCard";
import AppLayout from "../components/layout/AppLayout";
import { useAuth } from "../hooks/useAuth";
import { paths } from "../routes/paths";
import type { IPost } from "../types/post";

export default function PostPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login, logout, user } = useAuth(); // Usar o AuthContext

  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para login dialog
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", senha: "" });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const postsData = await getPosts();
      setPosts(postsData);
    } catch (err) {
      setError("Erro ao carregar posts. Verifique sua conexão.");
      console.error("Erro ao buscar posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      await login(loginData.email, loginData.senha);
      setLoginOpen(false);
      setLoginData({ email: "", senha: "" });
    } catch (err) {
      setLoginError(
        err instanceof Error ? err.message : "Email ou senha inválidos.",
      );
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleDeletePost = async (post: IPost) => {
    if (
      !window.confirm(`Tem certeza que deseja excluir o post "${post.titulo}"?`)
    ) {
      return;
    }

    try {
      await deletePost(post.id);
      setPosts((prevPosts) => prevPosts.filter((p) => p.id !== post.id));
    } catch (err) {
      setError("Erro ao excluir o post. Tente novamente.");
      console.error("Erro ao excluir post:", err);
    }
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

    if (posts.length === 0) {
      return (
        <Box textAlign="center" py={10}>
          <Typography variant="h6" color="text.secondary">
            Nenhum post encontrado.
          </Typography>
          {isAuthenticated && (
            <Button
              variant="contained"
              onClick={() => navigate(paths.posts.create)}
              sx={{ mt: 2 }}
            >
              Criar Primeiro Post
            </Button>
          )}
        </Box>
      );
    }

    return (
      <Stack spacing={{ xs: 2, md: 3 }}>
        {posts.map((post) => (
          <Box key={post.id}>
            <PostCard
              post={post}
              isProfessor={isAuthenticated && user?.isProfessor === true}
              onView={(p) => navigate(paths.posts.details(p.id))}
              onEdit={(p) => navigate(paths.posts.edit(p.id))}
              onDelete={handleDeletePost}
            />
          </Box>
        ))}
      </Stack>
    );
  };

  return (
    <AppLayout
      isAuthenticated={isAuthenticated}
      onLoginClick={() => setLoginOpen(true)}
      onLogout={handleLogout}
      onAddPostClick={() => navigate(paths.posts.create)}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4 } }}>
        <Box mb={4}>
          <Typography variant="h3" component="h1" gutterBottom>
            Blog EducaTech
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Compartilhando conhecimento educacional
          </Typography>
        </Box>

        {renderContent()}
      </Container>

      {/* Login Dialog */}
      <Dialog
        open={loginOpen}
        onClose={() => {
          setLoginOpen(false);
          setLoginError(null);
          setLoginData({ email: "", senha: "" });
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Acesso do Professor</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
            {loginError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {loginError}
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
              disabled={loginLoading}
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
              disabled={loginLoading}
              autoComplete="current-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
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
