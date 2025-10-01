import { ArrowBack } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { signUp } from "../actions/auth";
import { createPost, getPost, updatePost } from "../actions/posts";
import AppLayout from "../components/layout/AppLayout";
import LoginDialog from "../components/LoginDialog";
import { useAuth } from "../hooks/useAuth";
import { paths } from "../routes/paths";

interface FormState {
  titulo: string;
  resumo: string;
  conteudo: string;
}

export default function PostCreateEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const { user, isAuthenticated, logout, login } = useAuth();

  const [formState, setFormState] = useState<FormState>({
    titulo: "",
    resumo: "",
    conteudo: "",
  });
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(paths.posts.root);
      return;
    }

    if (!user?.isProfessor) {
      setError("Apenas professores podem criar/editar posts.");
      return;
    }

    if (!user?.professorId) {
      setError("ID do professor não encontrado. Faça login novamente.");
      return;
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (isEditMode && id && user?.professorId) {
      const fetchPostData = async () => {
        try {
          setLoading(true);
          setError(null);
          setIsReadOnly(false);
          const postData = await getPost(id);

          setFormState({
            titulo: postData.titulo || "",
            resumo: postData.resumo || "",
            conteudo: postData.conteudo || "",
          });

          if (String(postData.professor_id) !== String(user.professorId)) {
            setError("Você não tem permissão para editar este post.");
            setIsReadOnly(true);
          }
        } catch (err) {
          console.error("Erro ao carregar post:", err);
          setError("Não foi possível carregar os dados do post para edição.");
        } finally {
          setLoading(false);
        }
      };
      fetchPostData();
    }
  }, [id, isEditMode, user?.professorId]);

  // Estados para login dialog
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", senha: "" });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Sessão expirada. Faça login novamente.");
      setTimeout(() => {
        logout();
        navigate(paths.posts.root);
      }, 2000);
      return;
    }

    if (!user?.professorId) {
      setError("ID do professor não encontrado. Faça login novamente.");
      return;
    }

    if (!user?.isProfessor) {
      setError("Apenas professores podem criar/editar posts.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (isEditMode && id) {
        await updatePost(id, formState);
        setSuccessMessage("Post atualizado com sucesso!");
      } else {
        const postData = {
          ...formState,
          professor_id: user.professorId,
        };

        console.log("Criando post com dados:", postData);
        await createPost(postData);
        setSuccessMessage("Post criado com sucesso!");
      }

      setTimeout(() => {
        navigate(paths.posts.root);
      }, 1500);
    } catch (err) {
      console.error("Erro ao salvar post:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
      setError(
        `Falha ao ${isEditMode ? "atualizar" : "criar"} o post: ${errorMessage}`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (user) {
      console.log("Dados do usuário logado:", {
        id: user.id,
        email: user.email,
        isProfessor: user.isProfessor,
        professorId: user.professorId,
        professorName: user.professorName,
      });
    }
  }, [user]);

  const renderForm = () => {
    if (!isAuthenticated) {
      return (
        <Alert severity="warning">
          Você precisa estar logado para acessar esta página.
        </Alert>
      );
    }

    if (!user?.isProfessor) {
      return (
        <Alert severity="error">
          Apenas professores podem criar/editar posts.
        </Alert>
      );
    }

    if (!user?.professorId) {
      return (
        <Alert severity="error">
          ID do professor não encontrado. Faça login novamente.
        </Alert>
      );
    }

    if (loading) {
      return (
        <Box textAlign="center" py={10}>
          <CircularProgress />
          <Typography mt={2}>Carregando dados do post...</Typography>
        </Box>
      );
    }

    return (
      <form onSubmit={handleSubmit}>
        <TextField
          label="Título do Post"
          name="titulo"
          value={formState.titulo}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          variant="outlined"
          disabled={submitting || isReadOnly}
        />
        <TextField
          label="Resumo (Opcional)"
          name="resumo"
          value={formState.resumo}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
          disabled={submitting || isReadOnly}
          helperText="Um breve resumo do seu post"
        />
        <TextField
          label="Conteúdo Completo"
          name="conteudo"
          value={formState.conteudo}
          onChange={handleChange}
          fullWidth
          required
          multiline
          rows={12}
          margin="normal"
          variant="outlined"
          disabled={submitting || isReadOnly}
          helperText="Escreva o conteúdo completo do seu post"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={submitting || isReadOnly}
          fullWidth
          sx={{ mt: 3, py: 1.5, fontSize: "1rem" }}
        >
          {submitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : isEditMode ? (
            "Salvar Alterações"
          ) : (
            "Publicar Post"
          )}
        </Button>
      </form>
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
          sx={{ mb: 3, color: "text.secondary" }}
        >
          Voltar para todos os posts
        </Button>

        <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2 }}>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            gutterBottom
          >
            {isEditMode ? "Editar Publicação" : "Criar Nova Publicação"}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {isEditMode
              ? "Ajuste as informações necessárias e salve as alterações."
              : "Preencha os campos abaixo para compartilhar um novo conteúdo."}
          </Typography>

          {/* {user && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Logado como: {user.email} | Professor ID: {user.professorId} | É
              Professor: {user.isProfessor ? "Sim" : "Não"}
            </Alert>
          )} */}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          {renderForm()}
        </Paper>
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
