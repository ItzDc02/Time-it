import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Store/store";
import { fetchCapsules, removeCapsule } from "../Features/Capsule/capsuleSlice";
import { useNavigate } from "react-router-dom";
import { deleteDoc, doc } from "firebase/firestore";
import { db, getStorage, ref, deleteObject } from "../firebaseConfig";
import FileModal from "./FileModal";
import { ToastContainer, toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomIcon from "../assets/CustomIcon";
import TransferOwnershipModal from "./TransferOwnerShipModal";

const CapsuleList: React.FC = () => {
  const capsules = useSelector((state: RootState) => state.capsule.capsules);
  const userUid = useSelector((state: RootState) => state.user.uid);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [unlockedCapsules, setUnlockedCapsules] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTransferModal, setShowTransferModal] = useState(false);

  useEffect(() => {
    if (userUid) {
      dispatch(fetchCapsules(userUid)).finally(() => setIsLoading(false));
    }
  }, [dispatch, userUid]);

  useEffect(() => {
    if (!isLoading && capsules.length === 0) {
      setShowRedirectModal(true);
      const timeout = setTimeout(() => {
        setShowRedirectModal(false);
        navigate("/");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [capsules, navigate, isLoading]);

  const handleRemove = useCallback(
    async (id: string, fileUrls: string[] = []) => {
      if (!userUid) {
        return;
      }
      const docRef = doc(db, "users", userUid, "capsules", id);
      const storage = getStorage();
      try {
        if (fileUrls.length > 0) {
          await Promise.all(
            fileUrls.map(async (fileUrl) => {
              if (fileUrl) {
                const correctedPath = fileUrl.replace("gs://", "");
                const fileRef = ref(storage, correctedPath);
                await deleteObject(fileRef);
              }
            })
          );
        }
        await deleteDoc(docRef);
        dispatch(removeCapsule(id));
        toast.success("Capsule removed successfully");
      } catch (error) {
        console.error("Error removing capsule or file:", error);
        toast.error("Failed to remove capsule");
      }
    },
    [userUid, dispatch]
  );

  const handleUnlock = useCallback((id: string, message: string) => {
    setUnlockedCapsules((prev) => [...prev, id]);
    setCurrentMessage(message);
  }, []);

  const handleViewFiles = useCallback((fileUrls: string[]) => {
    if (fileUrls.length === 0) {
      toast.info("No Memories here! Time to create some 🎉", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Flip,
        icon: <CustomIcon />,
      });
      return;
    }
    setSelectedFiles(fileUrls);
    setShowModal(true);
  }, []);

  const handleCloseMessage = useCallback(() => {
    setCurrentMessage(null);
    setUnlockedCapsules([]);
  }, []);

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
          <button
            onClick={() => setShowTransferModal(true)}
            className="bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-3 rounded"
          >
            Transfer Ownership
          </button>
        </div>
        <ul className="space-y-4">
          {capsules.map((capsule) => (
            <li
              key={capsule.id}
              className="relative border p-4 rounded-md shadow-sm bg-white hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900">
                {capsule.title}
              </h3>
              <p className="text-gray-600">{capsule.date}</p>
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => handleViewFiles(capsule.fileUrls || [])}
                  className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded"
                >
                  View Memories
                </button>
                {!unlockedCapsules.includes(capsule.id) && (
                  <button
                    onClick={() => handleUnlock(capsule.id, capsule.message)}
                    className="bg-green-500 hover:bg-green-700 text-white py-1 px-3 rounded"
                  >
                    Unlock Now
                  </button>
                )}
              </div>
              <svg
                onClick={() => handleRemove(capsule.id, capsule.fileUrls || [])}
                className="h-6 w-6 text-red-500 hover:text-red-700 absolute top-2 right-2 cursor-pointer"
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
                />
              </svg>
            </li>
          ))}
        </ul>
      </div>
      {showModal && selectedFiles.length > 0 && (
        <FileModal
          fileUrls={selectedFiles}
          onClose={() => setShowModal(false)}
        />
      )}
      {currentMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative bg-black p-6 rounded-lg shadow-lg">
            <div className="flex flex-row-reverse justify-between items-center mb-4">
              <svg
                onClick={handleCloseMessage}
                className="h-6 w-6 text-red-500 hover:text-red-700 cursor-pointer"
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
                />
              </svg>
            </div>
            <h3 className="text-white text-xl font-semibold mb-4">
              Your Secrets Are Here 🧙‍♂️
            </h3>
            <p className="text-white mb-4">{currentMessage}</p>
          </div>
        </div>
      )}
      {showRedirectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
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
                strokeWidth={2}
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
      {showTransferModal && userUid && (
        <TransferOwnershipModal
          userUid={userUid}
          onClose={() => setShowTransferModal(false)}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default CapsuleList;
