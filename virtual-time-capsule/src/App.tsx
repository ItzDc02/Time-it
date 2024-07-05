import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import CreateCapsuleForm from "./components/createCapsuleForm";
import CapsuleList from "./components/capsuleList";
import About from "./components/About";
import Login from "./components/login";
import AdminPanel from "./components/AdminPanel";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { clearUser, setUser } from "./Features/Users/userSlice";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          })
        );
      } else {
        dispatch(clearUser());
      }
    });
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateCapsuleForm />} />
          <Route path="/view" element={<CapsuleList />} />
          <Route path="/about" element={<About />} />
        </Route>
        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route path="/admin" element={<AdminPanel />} />
        </Route>
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default App;
