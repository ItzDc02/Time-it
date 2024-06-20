import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { addCapsule } from "../Features/Capsule/capsuleSlice";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { addDays } from "date-fns";
import { getAuth } from "firebase/auth";

interface FormValues {
  title: string;
  date: string;
  message: string;
}

const CreateCapsuleForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    date: Yup.date()
      .required("Date is required")
      .min(addDays(new Date(), 1), "Date cannot be today or in the past"),
    message: Yup.string().required("Message is required"),
  });

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      console.error("No user logged in");
      setSubmitting(false);
      return;
    }

    const newCapsule = { ...values };
    try {
      await addDoc(collection(db, "users", user.uid, "capsules"), newCapsule);
      dispatch(addCapsule({ id: user.uid, ...newCapsule }));
      setShowModal(true);
      setTimeout(() => navigate("/"), 3000); // Redirect after 3 seconds
    } catch (error) {
      console.error("Failed to create capsule:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center relative font-mono bg-desktop-background sm:bg-mobile-background">
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
      <div className="p-10 bg-white shadow-xl rounded-xl w-full max-w-4xl z-10">
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 text-gray-700 hover:text-gray-900 z-50"
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
        <h2 className="text-3xl font-bold text-center mb-6">
          Create a New Memory ♥
        </h2>
        <Formik
          initialValues={{ title: "", date: "", message: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <Field
                  type="text"
                  name="title"
                  placeholder="Enter the title"
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date
                </label>
                <Field
                  type="date"
                  name="date"
                  placeholder="Select a date"
                  min={addDays(new Date(), 1).toISOString().split("T")[0]}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <ErrorMessage
                  name="date"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <Field
                  as="textarea"
                  name="message"
                  placeholder="Write your message"
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <ErrorMessage
                  name="message"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline"
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
