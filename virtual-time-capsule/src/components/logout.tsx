import React from "react";
import { getAuth, signOut } from "firebase/auth";

const Logout: React.FC = () => {
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // User is signed out
    } catch (error) {}
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
    >
      Logout
    </button>
  );
};

export default Logout;
