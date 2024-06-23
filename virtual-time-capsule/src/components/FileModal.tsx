import React from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { getStorage, ref, getDownloadURL } from "../firebaseConfig";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FileModalProps {
  fileUrls: string[];
  onClose: () => void;
}

const FileModal: React.FC<FileModalProps> = ({ fileUrls, onClose }) => {
  const downloadZip = async () => {
    const storage = getStorage();
    const zip = new JSZip();

    try {
      await Promise.all(
        fileUrls.map(async (fileUrl, index) => {
          try {
            const fileRef = ref(storage, fileUrl);
            const downloadUrl = await getDownloadURL(fileRef);
            const response = await fetch(downloadUrl);
            if (!response.ok) {
              throw new Error(
                `Failed to fetch file ${index + 1} - Status: ${response.status}`
              );
            }
            const blob = await response.blob();

            // Extract the correct file name
            const url = new URL(fileUrl);
            const fullPath = decodeURIComponent(url.pathname);
            const fileNameWithParams = fullPath.split("/").pop();
            if (!fileNameWithParams) {
              throw new Error(
                `Unable to extract file name from URL: ${fileUrl}`
              );
            }

            // Extract the original file name
            const fileName = fileNameWithParams.split("?")[0];

            zip.file(fileName, blob);
          } catch (error) {
            console.error(`Error fetching file ${index + 1}:`, error);
            throw error;
          }
        })
      );

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "files.zip");
    } catch (error) {
      console.error("Error creating zip file:", error);
      toast.error("Failed to download files. Please try again.", {
        position: "top-right",
        autoClose: 3000, // 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-black p-6 rounded-lg flex flex-col items-center shadow-xl">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-12 w-12 text-blue-500 mb-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
          />
        </svg>

        <h3 className="text-white text-xl font-bold text-center mb-4">Files</h3>
        <ul className="list-disc list-inside mb-4 text-left text-white w-full">
          {fileUrls.map((url, index) => (
            <li key={url}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                {`File ${index + 1}`}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex space-x-2">
          <button
            onClick={downloadZip}
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Download All as ZIP
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default FileModal;
