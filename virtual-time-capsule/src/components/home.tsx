import { useState } from "react";
import { Link } from "react-router-dom";
import rockyBeach from "../assets/rockybeach.webp";
import { motion } from "framer-motion";
import { getAuth, signOut } from "firebase/auth";
import logo from "../assets/logo.svg";

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-mono">
      <header className="fixed top-0 left-0 w-full z-50 text-white px-4 sm:px-6 lg:px-8 py-3 ">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src={logo} alt="Time-it Logo" className="h-16 w-16 mr-2" />
            <h1 className="text-3xl font-bold">Time-it</h1>
          </div>
          <nav className="hidden sm:flex space-x-4">
            <Link className="text-lg hover:underline" to="/about">
              About
            </Link>
            <Link className="text-lg hover:underline" to="/create">
              Create Capsule
            </Link>
            <Link className="text-lg hover:underline" to="/view">
              Capsule List
            </Link>
            <Link
              className="text-lg hover:underline"
              to=""
              onClick={handleLogout}
            >
              Logout
            </Link>
          </nav>
          <button
            onClick={toggleMenu}
            className="sm:hidden text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </header>
      <div>
        <motion.div
          className="flex-grow bg-cover bg-center"
          style={{ backgroundImage: `url(${rockyBeach})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50">
            <div className="text-center p-6">
              <h2 className="text-4xl font-bold text-white mb-4">
                Preserve Your Memories for the Future
              </h2>
              <p className="text-xl text-white mb-8">
                Capture and preserve your memories to relive them in the future.
              </p>
              <Link
                to="/create"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
              >
                Create Your Capsule
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
      <footer className="fixed bottom-0 left-0 w-full text-white text-center p-4 z-50">
        © 2024 Time-it. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
