import React from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useDispatch } from "react-redux";
import { setUser } from "../Features/Users/userSlice"; // Adjust path as necessary

const Login: React.FC = () => {
  const auth = getAuth();
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const { uid, email, displayName } = result.user;
      // Create or update a user document in Firestore
      const userDocRef = doc(db, "users", uid);
      await setDoc(userDocRef, { email: email }, { merge: true });
      // Dispatch setUser action with only the serializable parts of the user data
      dispatch(setUser({ uid, email, displayName }));
      console.log("User signed in and document created/updated successfully");
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  React.useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="text-center p-6">
      <h1 className="text-4xl font-bold mb-6">Login</h1>
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
