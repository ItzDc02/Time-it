import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";
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
  const [submitted, setSubmitted] = useState(false);

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    date: Yup.date()
      .required("Date is required")
      .min(addDays(new Date(), 1), "Date cannot be today or in the past"), // Modify this line
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
      return;
    }

    const newCapsule = { ...values };
    try {
      await addDoc(collection(db, "users", user.uid, "capsules"), newCapsule);
      dispatch(addCapsule({ id: user.uid, ...newCapsule })); // Adjust based on how you manage state
      navigate("/"); // Ensure this happens after the async operation
    } catch (error) {
      console.error("Failed to create capsule:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center text-2xl font-bold">
          Capsule Created Successfully! Redirecting to home...
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="p-10 bg-white shadow-xl rounded-xl w-full max-w-4xl">
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 text-gray-700 hover:text-gray-900"
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
          Create a New Capsule
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
