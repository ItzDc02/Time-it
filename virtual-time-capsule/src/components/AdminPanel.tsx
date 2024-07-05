import React, { useEffect, useState } from "react";
import { db, auth } from "../firebaseConfig";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import Logout from "./logout";

interface TransferRequest {
  oldOwnerUid: string;
  newOwnerEmail: string;
  status: string;
}

const AdminPanel: React.FC = () => {
  const [requests, setRequests] = useState<
    (TransferRequest & { id: string })[]
  >([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const adminDocRef = doc(db, "admins", user.uid);
        const adminDoc = await getDoc(adminDocRef);
        if (adminDoc.exists() && adminDoc.data()?.isAdmin) {
          setIsAdmin(true);
          await fetchRequests();
        }
        setIsLoading(false);
      }
    };
    checkAdminStatus();
  }, [user]);

  const fetchRequests = async () => {
    const q = query(
      collection(db, "transferRequests"),
      where("status", "==", "pending")
    );
    const querySnapshot = await getDocs(q);
    const fetchedRequests = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as TransferRequest),
    }));
    setRequests(fetchedRequests);
  };

  const handleApproval = async (
    request: TransferRequest & { id: string },
    approve: boolean
  ) => {
    setIsProcessing(true);
    try {
      if (approve) {
        await processApproval(request);
      } else {
        await updateDoc(doc(db, "transferRequests", request.id), {
          status: "denied",
        });
        toast.info("Transfer request denied.");
      }
      await fetchRequests();
    } catch (error) {
      console.error("Error processing transfer request:", error);
      toast.error(
        `Failed to process transfer request: ${(error as Error).message}`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const processApproval = async (request: TransferRequest & { id: string }) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", request.newOwnerEmail));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      throw new Error(
        "New owner not found in the database. They need to log in at least once to create their account."
      );
    }
    const newOwnerUid = querySnapshot.docs[0].id;
    const oldCapsulesRef = collection(
      db,
      "users",
      request.oldOwnerUid,
      "capsules"
    );
    const oldCapsuleSnapshot = await getDocs(oldCapsulesRef);
    const batch = writeBatch(db);
    for (const capsuleDoc of oldCapsuleSnapshot.docs) {
      const capsuleData = capsuleDoc.data();
      const newCapsuleRef = doc(
        db,
        "users",
        newOwnerUid,
        "capsules",
        capsuleDoc.id
      );
      const existingCapsule = await getDoc(newCapsuleRef);
      if (!existingCapsule.exists()) {
        batch.set(newCapsuleRef, {
          ...capsuleData,
          ownerUid: newOwnerUid,
          ownerEmail: request.newOwnerEmail,
        });
      }
      batch.delete(
        doc(db, "users", request.oldOwnerUid, "capsules", capsuleDoc.id)
      );
    }
    await batch.commit();
    await updateDoc(doc(db, "transferRequests", request.id), {
      status: "approved",
    });
    toast.success("Transfer request approved and processed.");
  };

  if (!isAdmin) {
    return <div>You do not have permission to view this page.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Transfer Ownership Requests</h1>
      <Logout />
      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        requests.map((request) => (
          <div key={request.id} className="bg-white p-4 rounded-lg shadow mb-4">
            <p>From: {request.oldOwnerUid}</p>
            <p>To: {request.newOwnerEmail}</p>
            <div className="mt-2">
              <button
                onClick={() => handleApproval(request, true)}
                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Approve"}
              </button>
              <button
                onClick={() => handleApproval(request, false)}
                className="bg-red-500 text-white px-4 py-2 rounded"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Deny"}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminPanel;
