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
import { createPost, getPost, updatePost } from "../actions/posts";
import AppLayout from "../components/layout/AppLayout";
import { useAuth } from "../contexts/AuthContext";
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

  const { user } = useAuth();

  const [formState, setFormState] = useState<FormState>({
    titulo: "",
    resumo: "",
    conteudo: "",
  });
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode && id) {
      const fetchPostData = async () => {
        try {
          setLoading(true);
          setError(null);
          const postData = await getPost(id);
          setFormState({
            titulo: postData.titulo || "",
            resumo: postData.resumo || "",
            conteudo: postData.conteudo || "",
          });
        } catch {
          setError("Não foi possível carregar os dados do post para edição.");
        } finally {
          setLoading(false);
        }
      };
      fetchPostData();
    }
  }, [id, isEditMode]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user?.professorId) {
      setError("ID do professor não encontrado. Faça login novamente.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    const postData = {
      ...formState,
      professor_id: user.professorId,
    };

    try {
      if (isEditMode && id) {
        await updatePost(id, formState);
        setSuccessMessage("Post atualizado com sucesso!");
      } else {
        await createPost(postData);
        setSuccessMessage("Post criado com sucesso!");
      }

      setTimeout(() => {
        navigate(paths.posts.root);
      }, 1500);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
      setError(
        `Falha ao ${isEditMode ? "atualizar" : "criar"} o post: ${errorMessage}`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderForm = () => {
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
          disabled={submitting}
        />
        <TextField
          label="Resumo (Opcional)"
          name="resumo"
          value={formState.resumo}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
          disabled={submitting}
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
          disabled={submitting}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={submitting}
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
      isAuthenticated={true} // Assumindo que o usuário deve estar autenticado para acessar esta página
      onLoginClick={() => {}}
      onLogout={() => {
        localStorage.removeItem("token");
        navigate(paths.posts.root);
      }}
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
    </AppLayout>
  );
}
