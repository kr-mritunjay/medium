import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { Blog } from "./pages/Blog";
import "./App.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/signup" />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="signin" element={<Signin />}></Route>
          <Route path="/blog/:id" element={<Blog />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
