import { ArrowBack } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { signUp } from "../actions/auth";
import { getPost } from "../actions/posts";
import AppLayout from "../components/layout/AppLayout";
import LoginDialog from "../components/LoginDialog";
import { useAuth } from "../hooks/useAuth";
import { useProfessorName } from "../hooks/useProfessorName";
import { paths } from "../routes/paths";
import type { IPost } from "../types/post";

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [post, setPost] = useState<IPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [loginOpen, setLoginOpen] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", senha: "" });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const { isAuthenticated, logout, login } = useAuth();

  const { professorName, isLoading: professorLoading } = useProfessorName(
    post?.professor_id ?? "",
  );

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError("ID do post não encontrado na URL.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const postData = await getPost(id);
        setPost(postData);
      } catch {
        setError(
          "Erro ao carregar o post. Ele pode não existir ou a conexão falhou.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

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

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box>
          <Skeleton variant="text" width="80%" height={70} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="40%" height={30} sx={{ mb: 3 }} />
          <Skeleton variant="rectangular" width="100%" height={350} />
        </Box>
      );
    }

    if (error || !post) {
      return <Alert severity="error">{error || "Post não encontrado."}</Alert>;
    }

    return (
      <Box component="article">
        <Typography
          variant="h3"
          component="h1"
          fontWeight="bold"
          gutterBottom
          sx={{ fontSize: { xs: "2.2rem", md: "3rem" } }}
        >
          {post.titulo}
        </Typography>

        {post.resumo && (
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ fontStyle: "italic", mb: 2 }}
          >
            {post.resumo}
          </Typography>
        )}

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Por{" "}
            {professorLoading ? (
              <Skeleton variant="text" width={120} component="span" />
            ) : (
              <strong>{professorName}</strong>
            )}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            •
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Publicado em {formatDate(post.created_at)}
          </Typography>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        <Typography
          variant="body1"
          sx={{ fontSize: "1.1rem", lineHeight: 1.7, whiteSpace: "pre-wrap" }}
        >
          {post.conteudo}
        </Typography>
      </Box>
    );
  };

  return (
    <AppLayout
      isAuthenticated={isAuthenticated}
      onLoginClick={() => setLoginOpen(true)}
      onLogout={logout}
      onAddPostClick={() => {}}
    >
      <Container maxWidth="md" sx={{ py: { xs: 3, sm: 5 } }}>
        <Button
          component={Link}
          to={paths.posts.root}
          startIcon={<ArrowBack />}
          sx={{ mb: 3 }}
        >
          Voltar para todos os posts
        </Button>
        {renderContent()}
      </Container>

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
