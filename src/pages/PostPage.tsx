import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Pagination,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { signUp } from "../actions/auth";
import { deletePost, getPosts, searchPosts } from "../actions/posts";
import LoginDialog from "../components/LoginDialog";
import PostCard from "../components/PostCard";
import AppLayout from "../components/layout/AppLayout";
import { useAuth } from "../hooks/useAuth";
import { paths } from "../routes/paths";
import type { IPost } from "../types/post";

const POSTS_PER_PAGE = 5;

export default function PostPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login, logout, user } = useAuth();

  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [viewAsGuest, setViewAsGuest] = useState(false);

  const [loginOpen, setLoginOpen] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", senha: "" });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const isProfessorView = user?.isProfessor && !viewAsGuest;

  useEffect(() => {
    fetchPosts();
  }, [user, viewAsGuest]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      let postsData = await getPosts();

      if (isProfessorView && user?.professorId) {
        postsData = postsData.filter(
          (post: IPost) =>
            String(post.professor_id) === String(user.professorId),
        );
      }

      const sortedPosts = postsData.sort((a: IPost, b: IPost) => {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });
      setPosts(sortedPosts);
      setCurrentPage(1);
    } catch (err) {
      setError("Erro ao carregar posts. Verifique sua conexão.");
      console.error("Erro ao buscar posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 2 || query.length === 0) {
      try {
        setLoading(true);
        setError(null);
        let postsData =
          query.length === 0 ? await getPosts() : await searchPosts(query);

        if (isProfessorView && user?.professorId) {
          postsData = postsData.filter(
            (post: IPost) =>
              String(post.professor_id) === String(user.professorId),
          );
        }
        setPosts(postsData);
        setCurrentPage(1);
      } catch (err) {
        setError("Erro ao buscar posts. Tente novamente.");
        console.error("Erro ao buscar posts:", err);
      } finally {
        setLoading(false);
      }
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

  const handleSignUp = async (data: { email: string; senha: string }) => {
    await signUp(data);
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
      setPosts((prevPosts) => {
        const newPosts = prevPosts.filter((p) => p.id !== post.id);
        const totalPages = Math.ceil(newPosts.length / POSTS_PER_PAGE);
        if (currentPage > totalPages && totalPages > 0) {
          setCurrentPage(totalPages);
        }
        return newPosts;
      });
    } catch (err) {
      setError("Erro ao excluir o post. Tente novamente.");
      console.error("Erro ao excluir post:", err);
    }
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

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
            {isProfessorView
              ? "Você ainda não criou nenhum post."
              : "Nenhum post encontrado."}
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
      <>
        <Stack spacing={{ xs: 2, md: 3 }}>
          {currentPosts.map((post) => (
            <Box key={post.id}>
              <PostCard
                post={post}
                isProfessor={Boolean(isAuthenticated && isProfessorView)}
                currentProfessorId={user?.professorId}
                onView={(p) => navigate(paths.posts.details(p.id))}
                onEdit={(p) => navigate(paths.posts.edit(p.id))}
                onDelete={handleDeletePost}
              />
            </Box>
          ))}
        </Stack>

        {totalPages > 1 && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={4}
            mb={2}
          >
            <Stack spacing={2} alignItems="center">
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
                sx={{
                  "& .MuiPagination-ul": {
                    flexWrap: "nowrap",
                  },
                }}
              />
              <Typography variant="body2" color="text.secondary">
                Página {currentPage} de {totalPages} • {posts.length}{" "}
                {posts.length === 1 ? "post" : "posts"} no total
              </Typography>
            </Stack>
          </Box>
        )}
      </>
    );
  };

  return (
    <AppLayout
      isAuthenticated={isAuthenticated}
      onLoginClick={() => setLoginOpen(true)}
      onLogout={handleLogout}
      onAddPostClick={() => navigate(paths.posts.create)}
      isProfessor={user?.isProfessor || false}
    >
      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: isProfessorView ? "#e0e0e0" : "transparent",
          transition: "background-color 0.3s ease",
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4 } }}>
          <Box mb={4}>
            <Typography variant="h3" component="h1" gutterBottom>
              {isProfessorView ? "Tela Administrativa" : "Blog EducaTech"}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {isProfessorView
                ? "Bem vindo professor, aqui você pode gerenciar seus posts."
                : "Compartilhando conhecimento educacional"}
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} mb={4} alignItems="center">
            <TextField
              fullWidth
              label="Buscar por posts"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {user?.isProfessor && (
              <Button
                variant="outlined"
                onClick={() => setViewAsGuest(!viewAsGuest)}
                sx={{ whiteSpace: "nowrap" }}
              >
                {viewAsGuest ? "Visão do Professor" : "Ver como Visitante"}
              </Button>
            )}
          </Stack>

          {renderContent()}
        </Container>
      </Box>

      <LoginDialog
        open={loginOpen}
        onClose={() => {
          setLoginOpen(false);
          setLoginError(null);
          setLoginData({ email: "", senha: "" });
        }}
        onSubmit={handleLogin}
        loginData={loginData}
        setLoginData={setLoginData}
        loading={loginLoading}
        error={loginError}
        onSignUp={handleSignUp}
      />
    </AppLayout>
  );
}
