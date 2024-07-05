import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { addCapsule } from "../Features/Capsule/capsuleSlice";
import { useNavigate } from "react-router-dom";
import {
  db,
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "../firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import FileUploader from "./fileUploader";
import TooltipError from "./ErrorTooltip";
import { addDays, startOfDay } from "date-fns";

interface ExtendedFile {
  name: string;
}

interface FormValues {
  title: string;
  date: string;
  message: string;
  fileUrls?: string[]; // This will store the URLs post-upload
}

const CreateCapsuleForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [files, setFiles] = useState<ExtendedFile[]>([]); // Use the ExtendedFile type

  const tomorrow = startOfDay(addDays(new Date(), 1));
  const minDate = tomorrow.toISOString().split("T")[0];

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    date: Yup.date()
      .required("Date is required")
      .min(tomorrow, "Date cannot be today or in the past"),
    message: Yup.string().required("Message is required"),
  });

  const handleFilesSelected = (selectedFiles: ExtendedFile[]) => {
    setFiles(selectedFiles);
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      setSubmitting(false);
      return;
    }

    try {
      const storage = getStorage();
      const capsuleId = new Date().getTime().toString();
      const fileUrls = await Promise.all(
        files.map((file) => {
          const fileRef = ref(
            storage,
            `capsules/${user.uid}/${capsuleId}/${file.name}`
          );
          return uploadBytes(fileRef, file as unknown as Blob).then(() =>
            getDownloadURL(fileRef)
          );
        })
      );

      const newCapsule = { ...values, fileUrls, createdAt: Timestamp.now() };
      await addDoc(collection(db, "users", user.uid, "capsules"), newCapsule);
      dispatch(addCapsule({ id: capsuleId, ...newCapsule }));
      setShowModal(true);
      setTimeout(() => navigate("/"), 3000);
    } catch (error) {
      console.error("Failed to upload files:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center relative font-mono bg-desktop-background sm:bg-mobile-background bg-cover bg-no-repeat">
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-20">
          <div className="bg-black p-6 rounded-lg shadow-lg flex flex-col items-center">
            <svg
              className="w-16 h-16 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h3 className="text-white text-xl font-bold mt-4">
              Capsule Created Successfully!
            </h3>
            <p className="animate-spin mt-3">
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
            </p>
            <p className="text-white">Redirecting to home...</p>
          </div>
        </div>
      )}
      <div className="p-4 bg-white rounded-xl w-full max-w-3xl z-10">
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 text-yellow-400 hover:text-white z-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
        <h2 className="text-3xl font-bold text-center mb-4">
          Create a New Memory ♥
        </h2>
        <Formik
          initialValues={{ title: "", date: "", message: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-3">
              <div className="relative">
                <label
                  htmlFor="title"
                  className="block text-base font-medium text-gray-700"
                >
                  Title
                </label>
                <div className="flex items-center relative">
                  <Field
                    type="text"
                    name="title"
                    placeholder="Enter the title"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <TooltipError
                    name="title"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  />
                </div>
              </div>
              <div className="relative">
                <label
                  htmlFor="date"
                  className="block text-base font-medium text-gray-700"
                >
                  Date
                </label>
                <div className="flex items-center relative">
                  <Field
                    type="date"
                    name="date"
                    placeholder="Select a date"
                    min={minDate}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <TooltipError
                    name="date"
                    className="absolute right-8 top-1/2 transform -translate-y-1/2"
                  />
                </div>
              </div>
              <div className="relative">
                <label
                  htmlFor="message"
                  className="block text-base font-medium text-gray-700"
                >
                  Message
                </label>
                <div className="flex items-center relative">
                  <Field
                    as="textarea"
                    name="message"
                    placeholder="Write your message"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                    style={{ height: "100px", paddingRight: "2.5rem" }} // Increased right padding to accommodate the icon
                  />
                  <TooltipError
                    name="message"
                    className="absolute right-2 bottom-2"
                  />
                </div>
              </div>
              <div>
                <FileUploader onFilesSelected={handleFilesSelected} />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Create Capsule
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateCapsuleForm;
