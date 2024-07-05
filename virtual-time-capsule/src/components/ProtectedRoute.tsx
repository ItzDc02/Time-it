import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ adminOnly = false }) => {
  const [user, loading] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          const adminRef = doc(db, "admins", user.uid);
          const adminSnap = await getDoc(adminRef);
          setIsAdmin(adminSnap.exists() && adminSnap.data()?.isAdmin === true);
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        }
      }
      setCheckingAdmin(false);
    };

    if (user) {
      checkAdminStatus();
    } else {
      setCheckingAdmin(false);
    }
  }, [user]);

  if (loading || checkingAdmin)
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );

  if (!user) return <Navigate to="/login" />;

  if (adminOnly && !isAdmin) return <Navigate to="/" />;

  if (!adminOnly && isAdmin) return <Navigate to="/admin" />;

  return <Outlet />;
};

export default ProtectedRoute;
