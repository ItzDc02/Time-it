import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";
import { addCapsule } from "../Features/Capsule/capsuleSlice";
import { useNavigate } from "react-router-dom";

interface FormValues {
  title: string;
  date: string;
  message: string;
}

const createCapsuleForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [confirmation, setConfirmation] = useState(false);

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    date: Yup.date()
      .required("Date is required")
      .min(new Date(), "Date cannot be in the past"),
    message: Yup.string().required("Message is required"),
  });

  const handleSubmit = (values: FormValues) => {
    dispatch(addCapsule({ id: uuidv4(), ...values }));
    setConfirmation(true);
    sessionStorage.setItem("capsuleCreated", "true");
    setTimeout(() => {
      navigate("/");
    }, 3000); // Redirect after 3 seconds
  };

  const today = new Date().toISOString().split("T")[0];

  if (confirmation) {
    return (
      <div className="text-center p-6">
        <h2 className="text-2xl font-bold mb-4">
          Capsule Created Successfully!
        </h2>
        <p className="text-gray-700">
          You will be redirected to the home page shortly...
        </p>
      </div>
    );
  }

  return (
    <Formik
      initialValues={{
        title: "",
        date: "",
        message: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="flex flex-col space-y-4 p-4">
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
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Create Capsule
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default createCapsuleForm;
