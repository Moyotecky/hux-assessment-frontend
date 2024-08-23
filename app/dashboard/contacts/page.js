"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faEye, faAddressBook } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-number-input";
import 'react-phone-number-input/style.css'; // Importing the styles
import { z } from "zod";
import { Formik, Field, Form, ErrorMessage } from 'formik';

// Define Zod schema
const validationSchema = z.object({
  firstName: z.string().nonempty("First name is required"),
  lastName: z.string().nonempty("Last name is required"),
  phoneNumber: z.string().nonempty("Phone number is required"),
  email: z.string().email("Invalid email address").optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

// Convert Zod schema to Formik validation
const validateZod = (values) => {
  try {
    validationSchema.parse(values);
    return {}; // No errors
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errors = err.errors.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {});
      return errors;
    }
    return { general: "Validation error" };
  }
};

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // For displaying error messages

  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      setToken(savedToken);
      fetchContacts(savedToken);
    } else {
      router.push("/auth");
    }
  }, [router]);

  const fetchContacts = async (authToken) => {
    try {
      const response = await axios.get(`${apiUrl}/contacts`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setError(error.response?.data?.message || "An error occurred while fetching contacts.");
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        router.push("/auth");
      }
    }
  };

  const handleAddContact = async (values, { setSubmitting }) => {
    setLoading(true);
    setError(""); // Reset error state before making the request

    try {
      const response = await axios.post(`${apiUrl}/contacts`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts([...contacts, response.data]);
      closeModal();
    } catch (error) {
      console.error("Error adding contact:", error);
      setError(error.response?.data?.message || "An error occurred while adding the contact.");
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        router.push("/auth");
      }
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleViewContact = (id) => {
    router.push(`/dashboard/contacts/${id}`);
  };

  const handleEditContact = (id) => {
    router.push(`/dashboard/contacts/edit/${id}`);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 p-6 bg-blue-100 min-h-screen md:ml-64 transition-all">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-blue-900">Contacts</h1>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-all flex items-center"
            onClick={openModal}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Contact
          </button>
        </div>

        {contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <FontAwesomeIcon icon={faAddressBook} className="text-6xl text-blue-500 mb-4" />
            <p className="text-xl text-gray-600">No contacts created yet. Start by adding a new contact.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contacts.map((contact) => (
              <div key={contact._id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-all">
                <h2 className="text-xl font-bold mb-2">
                  {contact.firstName} {contact.lastName}
                </h2>
                <p className="text-gray-700 mb-4">Phone: {contact.phoneNumber}</p>
                <div className="flex space-x-4">
                  <button
                    className="text-blue-600 hover:text-blue-700 transition-all"
                    onClick={() => handleEditContact(contact._id)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    className="text-blue-600 hover:text-blue-700 transition-all"
                    onClick={() => handleViewContact(contact._id)}
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for adding a new contact */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
              <h2 className="text-2xl font-bold mb-4">Add New Contact</h2>
              <Formik
                initialValues={{
                  firstName: "",
                  lastName: "",
                  phoneNumber: "+234",
                  email: "",
                  address: "",
                  notes: "",
                }}
                validate={validateZod} // Use the custom validate function
                onSubmit={handleAddContact}
              >
                {({ values, setFieldValue, isSubmitting }) => (
                  <Form>
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
                      <ErrorMessage name="email" component="div" className="text-red-600 text-sm mt-1" />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Address</label>
                      <Field
                        as="textarea"
                        name="address"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <ErrorMessage name="address" component="div" className="text-red-600 text-sm mt-1" />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Notes</label>
                      <Field
                        as="textarea"
                        name="notes"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <ErrorMessage name="notes" component="div" className="text-red-600 text-sm mt-1" />
                    </div>
                    {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || loading}
                        className={`bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-all ${isSubmitting || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {loading ? 'Adding...' : 'Add Contact'}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactsPage;
