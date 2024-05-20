// src/components/Home.tsx
import React from "react";
import { Link } from "react-router-dom";
import "./home.css";

const home: React.FC = () => {
  return (
    <div className="home-container">
      <h1>Welcome to the Virtual Time Capsule</h1>
      <nav>
        <Link to="/create">Create a Capsule</Link>
        <Link to="/view">View Capsules</Link>
      </nav>
    </div>
  );
};

export default home;
