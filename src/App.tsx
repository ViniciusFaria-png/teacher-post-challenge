import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import PostCreateEditPage from "./pages/PostCreateEditPage";
import PostDetailPage from "./pages/PostDetailPage";
import PostPage from "./pages/PostPage";
import { paths } from "./routes/paths";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Navigate to={paths.posts.root} replace />}
          />
          <Route path={paths.posts.root} element={<PostPage />} />
          <Route
            path={paths.posts.details(":id")}
            element={<PostDetailPage />}
          />
          <Route path={paths.posts.create} element={<PostCreateEditPage />} />
          <Route
            path={paths.posts.edit(":id")}
            element={<PostCreateEditPage />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
