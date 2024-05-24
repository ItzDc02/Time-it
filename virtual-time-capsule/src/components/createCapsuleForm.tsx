import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";
import { addCapsule } from "../Features/Capsule/capsuleSlice";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

interface FormValues {
  title: string;
  date: string;
  message: string;
}

const createCapsuleForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    date: Yup.date()
      .required("Date is required")
      .min(new Date(), "Date cannot be in the past"),
    message: Yup.string().required("Message is required"),
  });

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    const newCapsule = { id: uuidv4(), ...values };
    dispatch(addCapsule(newCapsule));
    try {
      await addDoc(collection(db, "capsules"), newCapsule);
      setSubmitted(true); // Set submitted state to true
      setTimeout(() => {
        navigate("/"); // Delay navigation to home page
      }, 3000); // Wait for 3 seconds
    } catch (error) {
      console.error("Failed to create capsule:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center text-2xl font-bold">
        Capsule Created Successfully! Redirecting to home...
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0]; // Set today's date as the minimum for the date picker

  return (
    <Formik
      initialValues={{
        title: "",
        date: today,
        message: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
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
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            <ErrorMessage
              name="title"
              component="div"
              className="text-red-500 text-sm mt-1"
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
              min={today}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            <ErrorMessage
              name="date"
              component="div"
              className="text-red-500 text-sm mt-1"
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
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            <ErrorMessage
              name="message"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 mt-4"
          >
            Create Capsule
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default createCapsuleForm;
