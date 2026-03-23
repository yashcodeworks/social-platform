import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import CreatePost from "./pages/CreatePost";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;