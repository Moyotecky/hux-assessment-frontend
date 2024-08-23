"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Sidebar from '../components/Sidebar';
import Widget from '../components/Widget';
import Chart from '../components/Chart';
import { faAddressBook, faList, faUser } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

const DashboardPage = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    values: []
  });
  const [userDetails, setUserDetails] = useState({
    username: '',
    contactsCount: 0,
    listsCount: 0,
    profileViews: 0,
  });
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${apiUrl}/users/details`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Make sure the token is stored in localStorage
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserDetails({
            username: data.username,
            contactsCount: data.contactsCount,
            listsCount: data.listsCount,
            profileViews: data.profileViews,
          });
          setChartData({
            labels: data.chartData.labels,
            values: data.chartData.values,
          });
        } else {
          console.error('Failed to fetch user details');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 p-6 bg-blue-100 min-h-screen md:ml-64 transition-all">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4 md:mb-6">
          Welcome back, {userDetails.username}!
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
          <Widget title="Contacts" value={userDetails.contactsCount} icon={<FontAwesomeIcon icon={faAddressBook} />} />
          <Widget title="Lists" value={userDetails.listsCount} icon={<FontAwesomeIcon icon={faList} />} />
          <Widget title="Profile Views" value={userDetails.profileViews} icon={<FontAwesomeIcon icon={faUser} />} />
        </div>
        <Chart data={chartData} />
      </div>
    </div>
  );
};

export default DashboardPage;
