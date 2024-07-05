import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useDispatch } from "react-redux";
import { setUser } from "../Features/Users/userSlice";

const Login: React.FC = () => {
  const auth = getAuth();
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const { uid, email, displayName } = result.user;

      const userDocRef = doc(db, "users", uid);
      await setDoc(userDocRef, { email, displayName }, { merge: true });

      dispatch(setUser({ uid, email, displayName }));

      const adminDocRef = doc(db, "admins", uid);
      const adminDoc = await getDoc(adminDocRef);

      if (adminDoc.exists() && adminDoc.data()?.isAdmin === true) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  const handleAdminSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        adminEmail,
        adminPassword
      );

      const adminDocRef = doc(db, "admins", userCredential.user.uid);
      const adminDoc = await getDoc(adminDocRef);
      if (adminDoc.exists() && adminDoc.data()?.isAdmin === true) {
        dispatch(
          setUser({
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            displayName: userCredential.user.displayName,
          })
        );
        navigate("/admin");
      } else {
        alert("You do not have admin privileges.");
      }
    } catch (error) {
      console.error("Error signing in admin user: ", error);
      alert("Invalid email or password. Please try again.");
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
          onClick={handleGoogleLogin}
          className="bg-red-600 text-white py-3 px-6 rounded-full flex items-center justify-center w-full text-lg font-semibold hover:bg-red-700 transition duration-300 mb-4"
        >
          <i className="fab fa-google text-2xl mr-3"></i>
          Sign in with Google
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white py-3 px-6 rounded-full flex items-center justify-center w-full text-lg font-semibold hover:bg-blue-700 transition duration-300"
        >
          <i className="fas fa-user-shield text-2xl mr-3"></i>
          Admin Sign In
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-10 rounded-lg shadow-lg text-center w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Admin Sign In
            </h2>
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="Admin Email"
              className="w-full p-3 mb-4 border rounded"
            />
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Admin Password"
              className="w-full p-3 mb-4 border rounded"
            />
            <button
              onClick={handleAdminSignIn}
              className="bg-blue-600 text-white py-3 px-6 rounded-full flex items-center justify-center w-full text-lg font-semibold hover:bg-blue-700 transition duration-300 mb-4"
            >
              Sign In
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-600 text-white py-3 px-6 rounded-full flex items-center justify-center w-full text-lg font-semibold hover:bg-gray-700 transition duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
