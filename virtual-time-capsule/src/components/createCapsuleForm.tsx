// src/components/CreateCapsuleForm.tsx
import React from "react";
import { useDispatch } from "react-redux";
import { Formik, Form, Field } from "formik";
import { v4 as uuidv4 } from "uuid";
import { addCapsule } from "../Features/Capsule/capsuleSlice";
import "./createCapsuleForm.css";

interface FormValues {
  title: string;
  date: string;
  message: string;
}

const CreateCapsuleForm: React.FC = () => {
  const dispatch = useDispatch();

  const handleSubmit = (values: FormValues) => {
    dispatch(addCapsule({ id: uuidv4(), ...values }));
  };

  return (
    <Formik
      initialValues={{
        title: "",
        date: "",
        message: "",
      }}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <div>
            <label htmlFor="title">Title</label>
            <Field type="text" name="title" />
          </div>
          <div>
            <label htmlFor="date">Date</label>
            <Field type="date" name="date" />
          </div>
          <div>
            <label htmlFor="message">Message</label>
            <Field as="textarea" name="message" />
          </div>
          <button type="submit" disabled={isSubmitting}>
            Create Capsule
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default CreateCapsuleForm;
