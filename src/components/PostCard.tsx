import { Delete, Edit, MoreVert, Visibility } from "@mui/icons-material";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { useProfessorName } from "../hooks/useProfessorName";
import type { IPost } from "../types/post";

interface PostCardProps {
  post: IPost;
  isProfessor: boolean;
  onView: (post: IPost) => void;
  onEdit?: (post: IPost) => void;
  onDelete?: (post: IPost) => void;
}

export default function PostCard({
  post,
  isProfessor,
  onView,
  onEdit,
  onDelete,
}: PostCardProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { professorName, isLoading } = useProfessorName(post.professor_id);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleAction = (action?: (post: IPost) => void) => {
    action?.(post);
    handleClose();
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
        <Box mb={2}>
          <Typography
            variant="h5"
            component="h2"
            fontWeight="bold"
            gutterBottom
            sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
          >
            {post.titulo}
          </Typography>
          {post.resumo && (
            <Typography
              variant="body2"
              color="text.secondary"
              fontStyle="italic"
            >
              {post.resumo}
            </Typography>
          )}
        </Box>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
            overflow: "hidden",
            mb: 3,
          }}
        >
          {post.conteudo}
        </Typography>

        <Stack
          direction="column"
          spacing={0.5}
          alignItems="flex-start"
          sx={{ mt: "auto" }}
        >
          <Typography variant="caption" color="text.secondary">
            Criado por{" "}
            {isLoading ? (
              <Skeleton variant="text" width={100} component="span" />
            ) : (
              <strong>{professorName}</strong>
            )}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            em {formatDate(post.created_at)}
          </Typography>
        </Stack>
      </CardContent>

      <CardActions sx={{ justifyContent: "flex-end", pt: 0, px: 1 }}>
        <IconButton
          aria-label="opções do post"
          aria-controls={anchorEl ? "post-menu" : undefined}
          aria-haspopup="true"
          onClick={handleMenuClick}
        >
          <MoreVert />
        </IconButton>
        <Menu
          id="post-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          MenuListProps={{ "aria-labelledby": "opções do post" }}
        >
          <MenuItem onClick={() => handleAction(onView)}>
            <Visibility fontSize="small" sx={{ mr: 1.5 }} /> Ver post
          </MenuItem>
          {isProfessor && [
            <Divider key="divider" />,
            <MenuItem key="edit" onClick={() => handleAction(onEdit)}>
              <Edit fontSize="small" sx={{ mr: 1.5 }} /> Editar
            </MenuItem>,
            <MenuItem
              key="delete"
              onClick={() => handleAction(onDelete)}
              sx={{ color: "error.main" }}
            >
              <Delete fontSize="small" sx={{ mr: 1.5 }} /> Apagar
            </MenuItem>,
          ]}
        </Menu>
      </CardActions>
    </Card>
  );
}
