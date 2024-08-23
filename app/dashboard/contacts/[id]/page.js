"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Sidebar from "../../../components/Sidebar"; // Import Sidebar component
import Image from "next/image";
import defaultAvatar from "../../../../public/avatar.jpg"; // Add a default avatar image

const ViewContactPage = ({ params }) => {
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
        console.error("Error fetching contact:", error);
        setError("An error occurred while fetching contact details.");
      } finally {
        setLoading(false);
      }
    };
    fetchContact();
  }, [params.id, apiUrl]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 flex flex-col items-center justify-center">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin h-24 w-24 border-8 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        ) : contact ? (
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Image
                  src={contact.avatar || defaultAvatar}
                  alt={`${contact.firstName} ${contact.lastName}`}
                  width={100}
                  height={100}
                  className="rounded-full border-4 border-blue-600"
                />
                <div className="ml-6">
                  <h2 className="text-3xl font-bold text-blue-900">
                    {contact.firstName} {contact.lastName}
                  </h2>
                  <p className="text-gray-600">{contact.email || "No email provided"}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Phone Number</h3>
                <p className="text-gray-700">{contact.phoneNumber}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Address</h3>
                <p className="text-gray-700">{contact.address || "No address provided"}</p>
              </div>
              <div className="col-span-full">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Notes</h3>
                <p className="text-gray-700">{contact.notes || "No notes provided"}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => router.push(`/dashboard/contacts/edit/${params.id}`)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition-all"
              >
                Edit Contact
              </button>
            </div>
          </div>
        ) : (
          <p>{error || "Loading..."}</p>
        )}
      </div>
    </div>
  );
};

export default ViewContactPage;
