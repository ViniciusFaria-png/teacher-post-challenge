import { useEffect, useState } from "react";
import type { IPost } from "src/types/post";
import { createPost, deletePost, getPosts } from "../actions/posts";

export default function TestPosts() {
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    getPosts().then(setPosts).catch(console.error);
  }, []);

  const handleAdd = async () => {
    const newPost = await createPost({
      titulo: "Teste",
      conteudo: "Conteúdo de teste",
      resumo: "Resumo de teste",
    });
    setPosts((prev) => [...prev, newPost]);
  };

  const handleDelete = async (id: string) => {
    await deletePost(id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Testando Posts</h1>
      <button onClick={handleAdd}>Adicionar Post</button>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <strong>{post.titulo}</strong> - {post.conteudo}
            <button
              onClick={() => handleDelete(post.id.toString())}
              style={{ marginLeft: "10px" }}
            >
              Deletar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
