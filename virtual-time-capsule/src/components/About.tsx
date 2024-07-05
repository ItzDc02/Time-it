import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import rockyBeach from "../assets/rockybeach.webp";
import logo from "../assets/logo.svg";
import Logout from "./logout";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen font-mono">
      <header className="fixed top-0 left-0 w-full z-50 text-white px-4 sm:px-6 lg:px-8 py-3 ">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src={logo} alt="Time-it Logo" className="h-16 w-16 mr-2" />
            <h1 className="text-3xl font-bold">Time-it</h1>
          </div>
          <nav className="hidden sm:flex space-x-4">
            <Link className="text-lg hover:underline" to="/">
              Home
            </Link>
            <Link className="text-lg hover:underline" to="/create">
              Create Capsule
            </Link>
            <Link className="text-lg hover:underline" to="/view">
              Capsule List
            </Link>
            <Logout />
          </nav>
        </div>
      </header>
      <section>
        <motion.div
          className="flex-grow bg-cover bg-center"
          style={{ backgroundImage: `url(${rockyBeach})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50 p-8">
            <div className="text-center p-6 max-w-4xl mx-auto bg-opacity-90 rounded-lg text-white">
              <h2 className="text-4xl font-bold text-center mb-4 ">
                About Time-it
              </h2>
              <p className="text-xl text-center mb-8">
                Welcome to Time-it, your personal time capsule to the future! We
                know how quickly time flies, and sometimes, you just want to
                hold on to those precious memories a little bit longer.
              </p>
              <div className="text-lg leading-7">
                <p className="mb-4">
                  <span className="font-bold">What is Time-it?</span> Time-it is
                  a virtual time capsule built with React and TypeScript, using
                  Redux for state management and Tailwind for styling. My goal
                  is to give you a simple yet powerful way to create, view, and
                  preserve your memories for the future. Whether it’s a
                  heartfelt message, a cherished photo, or a memorable date,
                  Time-it has got you covered.
                </p>
                <p className="mb-4">
                  <span className="font-bold">Motivation</span>: The inspiration
                  behind Time-it came from the realization that our lives are
                  filled with fleeting moments that we wish we could relive.
                  With social media constantly bombarding us with the “now,” we
                  wanted to create something that focuses on the “then.” What if
                  you could capture a slice of today and revisit it in the
                  future? That’s the magic of Time-it.
                </p>
                <p className="mb-4">
                  <span className="font-bold">Features</span>:
                </p>
                <ul className="list-disc list-inside mb-4">
                  <li>
                    Create Time Capsules: Easily create a new time capsule with
                    a title, date, and message.
                  </li>
                  <li>
                    View Time Capsules: Access and enjoy a list of all your
                    created time capsules.
                  </li>
                  <li>
                    File Upload,Download and Viewing: Add files to your time
                    capsules and Keep those Precious Moments Secure and Safe
                    forever.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
      <footer className="fixed bottom-0 left-0 w-full text-white text-center p-4 z-50">
        © 2024 Time-it. All rights reserved.
      </footer>
    </div>
  );
};

export default About;
