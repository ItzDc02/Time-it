import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Store/store";
import { fetchCapsules, removeCapsule } from "../Features/Capsule/capsuleSlice";
import { useNavigate } from "react-router-dom";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const CapsuleList: React.FC = () => {
  const capsules = useSelector((state: RootState) => state.capsule.capsules);
  const userUid = useSelector((state: RootState) => state.user.uid);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [unlockedCapsules, setUnlockedCapsules] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (userUid) {
      dispatch(fetchCapsules(userUid));
    } else {
      console.log("No user logged in");
    }
  }, [dispatch, userUid]);

  useEffect(() => {
    if (capsules.length === 0) {
      setShowModal(true);
      const timeout = setTimeout(() => {
        setShowModal(false);
        navigate("/");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [capsules, navigate]);

  const handleRemove = async (id: string) => {
    if (!userUid) {
      console.error("User not authenticated");
      return;
    }
    try {
      await deleteDoc(doc(db, "users", userUid, "capsules", id));
      dispatch(removeCapsule(id));
    } catch (error) {
      console.error("Failed to delete capsule:", error);
    }
  };

  const handleUnlock = (id: string) => {
    setUnlockedCapsules((prev) => [...prev, id]);
  };

  return (
    <div className="relative p-6 bg-gradient-to-r from-blue-100 to-purple-100 min-h-screen flex flex-col items-center font-mono">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center justify-center p-2 bg-blue-500 hover:bg-blue-700 text-white rounded-full"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
            <span className="mr-2">Back</span>
          </button>
          <h2 className="text-3xl font-bold text-gray-800 text-center w-full">
            Your Memories rest here ♥
          </h2>
          <div></div>
        </div>
        <ul className="space-y-4">
          {capsules.map((capsule) => (
            <li
              key={capsule.id}
              className="border p-4 rounded-md shadow-sm bg-white hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900">
                {capsule.title}
              </h3>
              <p className="text-gray-600">{capsule.date}</p>
              {unlockedCapsules.includes(capsule.id) ? (
                <p className="mt-2 text-gray-800">{capsule.message}</p>
              ) : (
                <button
                  onClick={() => handleUnlock(capsule.id)}
                  className="mt-2 bg-green-500 hover:bg-green-700 text-white py-1 px-3 rounded"
                >
                  Unlock Now
                </button>
              )}
              <button
                onClick={() => handleRemove(capsule.id)}
                className="mt-2 ml-4 bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
      {showModal && (
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-black p-6 rounded-lg flex flex-col items-center shadow-xl">
            <svg
              className="h-12 w-12 text-red-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
            <h3 className="text-white text-xl font-bold">
              No capsules available!
            </h3>
            <div className="animate-spin mt-3">
              <svg
                className="w-6 h-6 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 0v4m0-4h4m-4 0H8"
                />
              </svg>
            </div>
            <p className="text-white mt-3">Redirecting to home...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CapsuleList;
