import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import PostDetailPage from "./pages/PostDetailPage";
import PostPage from "./pages/PostPage";
import { paths } from "./routes/paths";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={paths.posts.root} element={<PostPage />} />
        <Route path={paths.posts.details(":id")} element={<PostDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
