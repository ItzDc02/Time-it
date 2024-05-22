import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../Store/store";
import { removeCapsule } from "../Features/Capsule/capsuleSlice";
import { useNavigate } from "react-router-dom";

const capsuleList: React.FC = () => {
  const capsules = useSelector((state: RootState) => state.capsule.capsules);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [unlockedCapsules, setUnlockedCapsules] = useState<string[]>([]);

  useEffect(() => {
    const capsuleCreated = sessionStorage.getItem("capsuleCreated");
    if (capsuleCreated) {
      sessionStorage.removeItem("capsuleCreated");
      navigate("/");
    }
  }, [navigate]);

  const handleRemove = (id: string) => {
    dispatch(removeCapsule(id));
  };

  const handleUnlock = (id: string) => {
    setUnlockedCapsules((prev) => [...prev, id]);
  };

  const today = new Date();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Capsule List</h2>
      <ul className="space-y-4">
        {capsules.map((capsule) => {
          const capsuleDate = new Date(capsule.date);
          const isUnlocked =
            capsuleDate <= today || unlockedCapsules.includes(capsule.id);

          return (
            <li key={capsule.id} className="border p-4 rounded-md">
              <h3 className="text-xl font-semibold">{capsule.title}</h3>
              <p className="text-gray-600">{capsule.date}</p>
              {isUnlocked ? (
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
          );
        })}
      </ul>
    </div>
  );
};

export default capsuleList;
