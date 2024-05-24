import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import CreateCapsuleForm from "./components/createCapsuleForm";
import CapsuleList from "./components/capsuleList";
import Login from "./components/login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateCapsuleForm />} />
          <Route path="/view" element={<CapsuleList />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
