"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import PhoneInput from "react-phone-number-input";
import 'react-phone-number-input/style.css';
import Sidebar from "../../../../components/Sidebar"; // Import Sidebar component

const validationSchema = Yup.object({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  phoneNumber: Yup.string().required("Phone Number is required"),
});

const EditContactPage = ({ params }) => {
  const [contact, setContact] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}/contacts/${params.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        setContact(response.data);
      } catch (error) {
        console.error("Error fetching contact:", error.response?.data || error.message);
        setError("An error occurred while fetching contact details.");
      } finally {
        setLoading(false);
      }
    };
    fetchContact();
  }, [params.id, apiUrl]);

  const handleUpdateContact = async (values) => {
    console.log("Form values before filtering:", values);
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Token is missing.");
  
      // Remove _id, user, and createdAt from values before sending to the API
      const { _id, user, createdAt, updatedAt, __v, ...filteredValues } = values;
      console.log("Form values being sent after filtering:", filteredValues);
  
      const response = await axios.put(`${apiUrl}/contacts/${params.id}`, filteredValues, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Update successful:", response.data);
  
      router.push("/dashboard/contacts");
    } catch (error) {
      console.error("Error response:", error.response); // Detailed error logging
      console.error("Error message:", error.message);
  
      if (error.response) {
        setError(error.response.data?.message || "An error occurred while updating the contact.");
      } else if (error.request) {
        setError("No response received from the server.");
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  
  
  
  
  

  

  return (
    <div className="flex min-h-screen bg-blue-100">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-4xl font-bold mb-6 text-blue-900">Edit Contact</h1>
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin h-24 w-24 border-8 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        ) : contact ? (
          <Formik
            initialValues={contact}
            validationSchema={validationSchema}
            onSubmit={handleUpdateContact}
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form className="bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto">
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">First Name</label>
                  <Field
                    type="text"
                    name="firstName"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <ErrorMessage name="firstName" component="div" className="text-red-600 text-sm mt-1" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Last Name</label>
                  <Field
                    type="text"
                    name="lastName"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <ErrorMessage name="lastName" component="div" className="text-red-600 text-sm mt-1" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Phone Number</label>
                  <PhoneInput
                    defaultCountry="NG"
                    international
                    value={values.phoneNumber}
                    onChange={(value) => setFieldValue('phoneNumber', value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <ErrorMessage name="phoneNumber" component="div" className="text-red-600 text-sm mt-1" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Email</label>
                  <Field
                    type="email"
                    name="email"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Address</label>
                  <Field
                    type="text"
                    name="address"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Notes</label>
                  <Field
                    as="textarea"
                    name="notes"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                {error && (
                  <div className="mb-4 text-red-600">
                    <p>{error}</p>
                  </div>
                )}
                <div className="flex justify-end items-center mt-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-all"
                    disabled={isSubmitting}
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="ml-4 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-400 transition-all"
                    onClick={() => router.push("/dashboard/contacts")}
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default EditContactPage;
