import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import CreateCapsuleForm from "./components/createCapsuleForm";
import CapsuleList from "./components/capsuleList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateCapsuleForm />} />
        <Route path="/view" element={<CapsuleList />} />
      </Routes>
    </Router>
  );
}

export default App;
