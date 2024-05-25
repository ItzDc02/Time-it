import React from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useDispatch } from "react-redux";
import { setUser } from "../Features/Users/userSlice"; // Adjust path as necessary
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome CSS

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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-600">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center w-full max-w-md">
        <h1 className="text-5xl font-bold mb-6 text-gray-800">Welcome Back!</h1>
        <p className="text-gray-600 mb-8">Please sign in to continue</p>
        <button
          onClick={handleLogin}
          className="bg-red-600 text-white py-3 px-6 rounded-full flex items-center justify-center w-full text-lg font-semibold hover:bg-red-700 transition duration-300"
        >
          <i className="fab fa-google text-2xl mr-3"></i>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
