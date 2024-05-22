import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const home: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const capsuleCreated = sessionStorage.getItem("capsuleCreated");
    if (capsuleCreated) {
      sessionStorage.removeItem("capsuleCreated");
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="text-center p-6">
      <h1 className="text-4xl font-bold mb-6">
        Welcome to the Virtual Time Capsule
      </h1>
      <nav>
        <Link to="/create" className="text-blue-500 mx-4 hover:underline">
          Create a Capsule
        </Link>
        <Link to="/view" className="text-blue-500 mx-4 hover:underline">
          View Capsules
        </Link>
      </nav>
    </div>
  );
};

export default home;
