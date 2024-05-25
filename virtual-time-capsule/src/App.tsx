import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import CreateCapsuleForm from "./components/createCapsuleForm";
import CapsuleList from "./components/capsuleList";
import Login from "./components/login";
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
        // Only pass the serializable parts of the user object
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        };
        dispatch(setUser(userData));
      } else {
        dispatch(clearUser());
      }
    });
  }, [dispatch]);

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
};

export default App;
