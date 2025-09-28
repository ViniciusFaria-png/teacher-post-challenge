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
import { getPost } from "../actions/posts";
import AppLayout from "../components/layout/AppLayout"; // Reutilizamos nosso layout
import { useProfessorName } from "../hooks/useProfessorName";
import { paths } from "../routes/paths";
import type { IPost } from "../types/post";

export default function PostDetailPage() {
  // Hook para pegar parâmetros da URL. O nome "id" deve corresponder ao definido na rota (`/posts/:id`)
  const { id } = useParams<{ id: string }>();

  const [post, setPost] = useState<IPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reutilizando o hook para buscar o nome do professor.
  // A busca só é ativada quando 'post?.professor_id' tiver um valor.
  const { professorName, isLoading: professorLoading } = useProfessorName(
    post?.professor_id ?? "",
  );

  // Busca os dados do post quando o componente é montado ou quando o `id` da URL muda
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
      } catch (err) {
        setError(
          "Erro ao carregar o post. Ele pode não existir ou a conexão falhou.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

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
      // Usando Skeletons para uma experiência de carregamento mais profissional
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

        {/* Usamos whiteSpace: 'pre-wrap' para respeitar quebras de linha e parágrafos do conteúdo */}
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
    // Envolvemos a página no AppLayout para manter a Navbar e o Footer
    // OBS: Em uma app real, o estado de autenticação viria de um Contexto global, não por props aqui.
    <AppLayout
      isAuthenticated={false}
      onLoginClick={() => {}}
      onLogout={() => {}}
      onAddPostClick={() => {}}
    >
      <Container maxWidth="md" sx={{ py: { xs: 3, sm: 5 } }}>
        <Button
          component={Link} // Usamos o componente Link do react-router-dom
          to={paths.posts.root} // Usamos o objeto `paths` para o link de "voltar"
          startIcon={<ArrowBack />}
          sx={{ mb: 3 }}
        >
          Voltar para todos os posts
        </Button>
        {renderContent()}
      </Container>
    </AppLayout>
  );
}
