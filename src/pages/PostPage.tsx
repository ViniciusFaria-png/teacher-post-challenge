import { DateRange, Login, Person, School } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { signIn } from "../actions/auth";
import { getPosts } from "../actions/posts";
import type { IPost } from "../types/post";

export default function PostsWithAuth() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", senha: "" });
  const [loginLoading, setLoginLoading] = useState(false);

  // Verifica se já tem token ao carregar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      fetchPosts();
    }
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Iniciando busca de posts...");
      const postsData = await getPosts();
      console.log("Posts recebidos:", postsData);
      setPosts(postsData);
    } catch (err: any) {
      console.error("Erro detalhado ao buscar posts:", err);
      console.error("Status:", err?.response?.status);
      console.error("Data:", err?.response?.data);
      console.error("Message:", err?.message);

      let errorMessage = "Erro ao carregar os posts. ";
      if (err?.response?.status === 401) {
        errorMessage += "Token de autenticação inválido ou ausente.";
        setIsAuthenticated(false);
        localStorage.removeItem("token");
      } else if (err?.response?.status === 404) {
        errorMessage += "Endpoint não encontrado.";
      } else if (err?.response?.data?.message) {
        errorMessage += err.response.data.message;
      } else {
        errorMessage += err?.message || "Tente novamente.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoginLoading(true);
      setError(null);
      console.log("Tentando fazer login...");

      const result = await signIn(loginData);
      console.log("Login realizado com sucesso:", result);

      setIsAuthenticated(true);
      await fetchPosts();
    } catch (err: any) {
      console.error("Erro no login:", err);
      let errorMessage = "Erro ao fazer login. ";
      if (err?.response?.data?.message) {
        errorMessage += err.response.data.message;
      } else {
        errorMessage += err?.message || "Verifique suas credenciais.";
      }
      setError(errorMessage);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setPosts([]);
    setError(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Tela de login
  if (!isAuthenticated) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Login sx={{ fontSize: "3rem", color: "primary.main", mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              Fazer Login
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Entre com suas credenciais para ver os posts
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin}>
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
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loginLoading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loginLoading ? <CircularProgress size={24} /> : "Entrar"}
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  // Tela principal com posts
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "primary.main",
              mb: 1,
            }}
          >
            <School sx={{ fontSize: "3rem", mr: 2, verticalAlign: "middle" }} />
            Posts Educacionais
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Descubra conteúdos educacionais de qualidade
          </Typography>
        </Box>

        <Button variant="outlined" color="secondary" onClick={handleLogout}>
          Sair
        </Button>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
          <Button onClick={fetchPosts} size="small" sx={{ ml: 2 }}>
            Tentar Novamente
          </Button>
        </Alert>
      )}

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress size={60} />
        </Box>
      ) : posts.length === 0 ? (
        <Box textAlign="center" py={6}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Nenhum post encontrado
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Ainda não há posts publicados.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid item xs={12} md={6} lg={4} key={post.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition:
                    "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: (theme) => theme.shadows[8],
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography
                    variant="h5"
                    component="h2"
                    gutterBottom
                    sx={{
                      fontWeight: "bold",
                      color: "primary.main",
                      mb: 2,
                      lineHeight: 1.3,
                    }}
                  >
                    {post.titulo}
                  </Typography>

                  {post.resumo && (
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label="Resumo"
                        size="small"
                        color="secondary"
                        sx={{ mb: 1 }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontStyle: "italic",
                          lineHeight: 1.5,
                        }}
                      >
                        {post.resumo}
                      </Typography>
                    </Box>
                  )}

                  <Typography
                    variant="body1"
                    paragraph
                    sx={{
                      mb: 3,
                      lineHeight: 1.6,
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 4,
                      overflow: "hidden",
                    }}
                  >
                    {post.conteudo}
                  </Typography>

                  <Box sx={{ mt: "auto" }}>
                    <Divider sx={{ mb: 2 }} />

                    <Box
                      display="flex"
                      alignItems="center"
                      gap={2}
                      flexWrap="wrap"
                    >
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Person fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          ID Professor: {post.professorId}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" gap={0.5}>
                        <DateRange fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(post.createdAt)}
                        </Typography>
                      </Box>
                    </Box>

                    {post.updatedAt !== post.createdAt && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1, display: "block" }}
                      >
                        Atualizado em: {formatDate(post.updatedAt)}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ mt: 6, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          Total de posts: {posts.length}
        </Typography>
      </Box>
    </Container>
  );
}
