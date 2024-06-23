import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import React, { useState } from "react";

interface ExtendedFile extends File {
  preview: string;
}

interface FileUploaderProps {
  onFilesSelected: (files: ExtendedFile[]) => void; // Type for callback function
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFilesSelected }) => {
  const [files, setFiles] = useState<ExtendedFile[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [fileLimitReached, setFileLimitReached] = useState(false);

  const { getRootProps, getInputProps, isDragReject, fileRejections } =
    useDropzone({
      onDrop: (acceptedFiles: File[]) => {
        const newFiles = acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ) as ExtendedFile[];
        const updatedFiles = [...files, ...newFiles].slice(0, 3);
        setFiles(updatedFiles);
        onFilesSelected(updatedFiles);
        setFileLimitReached(files.length + acceptedFiles.length > 3);
      },
      accept: { "image/jpeg": [], "image/png": [], "application/pdf": [] },
      maxSize: 1024 * 1024,
    });

  const removeFile = (fileToRemove: ExtendedFile) => {
    const updatedFiles = files.filter((file) => file !== fileToRemove);
    setFiles(updatedFiles);
    onFilesSelected(updatedFiles);
    URL.revokeObjectURL(fileToRemove.preview);
  };

  return (
    <div>
      <div
        {...getRootProps()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`flex flex-col items-center justify-center border-2 ${
          isDragReject ? "border-red-500" : "border-dashed border-gray-300"
        } p-6 rounded-lg cursor-pointer hover:border-gray-400 transition `}
      >
        <input {...getInputProps()} />
        <p className="text-gray-600">
          Drag 'n' drop your files here, or click to select files (max 3 files)
        </p>
        <p className="text-gray-600">Allowed file types: .pdf, .png, .jpg</p>
        <motion.svg
          animate={isHovered ? { y: [-5, 5, -5] } : { y: 0 }}
          transition={
            isHovered
              ? {
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 0.8,
                  ease: "easeInOut",
                }
              : {}
          }
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 mt-2"
        >
          <path
            fillRule="evenodd"
            d="M10.5 3.75a6 6 0 0 0-5.98 6.496A5.25 5.25 0 0 0 6.75 20.25H18a4.5 4.5 0 0 0 2.206-8.423 3.75 3.75 0 0 0-4.133-4.303A6.001 6.001 0 0 0 10.5 3.75Zm2.03 5.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v4.94a.75.75 0 0 0 1.5 0v-4.94l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z"
            clipRule="evenodd"
          />
        </motion.svg>
      </div>
      <aside className="flex flex-wrap mt-4">
        {files.map((file) => (
          <div
            key={file.name}
            className="relative inline-block mr-2 mb-2 border border-gray-300 rounded p-2"
          >
            <img
              src={file.preview}
              className="block w-16 h-16 object-cover rounded"
              alt={file.name}
            />
            <button
              onClick={() => removeFile(file)}
              className="absolute top-0 right-0 mt-1 mr-1 text-red-600 bg-white rounded-full p-1 hover:bg-red-600 hover:text-white"
            >
              &times;
            </button>
          </div>
        ))}
      </aside>
      {fileLimitReached && (
        <p className="text-red-500 text-center mt-2">
          Maximum file limit reached. Please remove a file to add a new one.
        </p>
      )}
      <ul>
        {fileRejections.map(({ file, errors }) => (
          <li key={file.name}>
            {file.name} - {file.size / 1024 / 1024} MB
            {errors.map((e) => (
              <p key={e.code} className="text-red-500 text-xs">
                {e.message}
              </p>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileUploader;
