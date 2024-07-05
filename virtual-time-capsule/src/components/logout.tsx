import React from "react";
import { getAuth, signOut } from "firebase/auth";

const Logout: React.FC = () => {
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {}
  };

  return (
    <button onClick={handleLogout} className="text-lg hover:underline">
      Logout
    </button>
  );
};

export default Logout;
