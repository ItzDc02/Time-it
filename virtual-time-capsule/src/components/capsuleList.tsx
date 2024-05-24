import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Store/store";
import { fetchCapsules, removeCapsule } from "../Features/Capsule/capsuleSlice";
import { useNavigate } from "react-router-dom";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const CapsuleList: React.FC = () => {
  const capsules = useSelector((state: RootState) => state.capsule.capsules);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [unlockedCapsules, setUnlockedCapsules] = useState<string[]>([]);

  // Fetch capsules on component mount
  useEffect(() => {
    dispatch(fetchCapsules());
  }, [dispatch]);

  // Redirect when capsule list is empty
  useEffect(() => {
    if (capsules.length === 0) {
      const timeout = setTimeout(() => navigate("/"), 3000);
      return () => clearTimeout(timeout);
    }
  }, [capsules, navigate]);

  const handleRemove = async (id: string) => {
    try {
      await deleteDoc(doc(db, "capsules", id));
      dispatch(removeCapsule(id));
      dispatch(fetchCapsules());
    } catch (error) {
      console.error("Failed to delete capsule:", error);
    }
  };

  const handleUnlock = (id: string) => {
    setUnlockedCapsules((prev) => [...prev, id]);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Capsule List</h2>
      {capsules.length === 0 && (
        <p className="text-center text-gray-700">
          No capsules available. Redirecting to home...
        </p>
      )}
      <ul className="space-y-4">
        {capsules.map((capsule) => (
          <li key={capsule.id} className="border p-4 rounded-md">
            <h3 className="text-xl font-semibold">{capsule.title}</h3>
            <p className="text-gray-600">{capsule.date}</p>
            {unlockedCapsules.includes(capsule.id) ? (
              <p className="mt-2">{capsule.message}</p>
            ) : (
              <button
                onClick={() => handleUnlock(capsule.id)}
                className="mt-2 bg-green-500 text-white py-1 px-3 rounded hover:bg-green-700"
              >
                Unlock Now
              </button>
            )}
            <button
              onClick={() => handleRemove(capsule.id)}
              className="mt-2 ml-4 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CapsuleList;
