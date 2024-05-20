// src/components/CapsuleList.tsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../App/store";
import { removeCapsule } from "../Features/Capsule/capsuleSlice";
import "./capsuleList.css";

const CapsuleList: React.FC = () => {
  const capsules = useSelector((state: RootState) => state.capsule.capsules);
  const dispatch = useDispatch();

  const handleRemove = (id: string) => {
    dispatch(removeCapsule(id));
  };

  return (
    <div>
      <h2>Capsule List</h2>
      <ul>
        {capsules.map((capsule) => (
          <li key={capsule.id}>
            <h3>{capsule.title}</h3>
            <p>{capsule.date}</p>
            <p>{capsule.message}</p>
            <button onClick={() => handleRemove(capsule.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CapsuleList;
