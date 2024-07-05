import React, { useState, useRef, useEffect } from "react";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { toast } from "react-toastify";

interface TransferOwnershipModalProps {
  userUid: string;
  onClose: () => void;
}

const TransferOwnershipModal: React.FC<TransferOwnershipModalProps> = ({
  userUid,
  onClose,
}) => {
  const [newOwnerEmail, setNewOwnerEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleTransferRequest = async () => {
    if (!newOwnerEmail) {
      toast.error("Please provide the new owner's email.");
      return;
    }

    setIsSubmitting(true);
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", newOwnerEmail));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error(
          "User not found. They must create an account and log in at least once before a transfer can be initiated."
        );
        return;
      }

      const transferRequestRef = doc(
        db,
        "transferRequests",
        `${userUid}_${Date.now()}`
      );
      await setDoc(transferRequestRef, {
        oldOwnerUid: userUid,
        newOwnerEmail: newOwnerEmail,
        status: "pending",
        createdAt: new Date().toISOString(),
      });

      toast.success(
        "Transfer request sent. An admin will review your request."
      );
      onClose();
    } catch (error) {
      toast.error("Failed to send transfer request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Transfer Ownership</h3>
        <p className="mb-4">Enter the new owner's email address:</p>
        <input
          type="email"
          placeholder="New Owner Email"
          value={newOwnerEmail}
          onChange={(e) => setNewOwnerEmail(e.target.value)}
          className="mb-4 p-2 border rounded w-full"
        />
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleTransferRequest}
            className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferOwnershipModal;
