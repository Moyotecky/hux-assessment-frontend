"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faAddressBook, faList, faUser, faCog, faBars, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const [active, setActive] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const handleNavigation = (path) => {
    setActive(path);
    router.push(`/dashboard/${path === 'dashboard' ? '' : path }`);
  };

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`fixed top-0 left-0 h-full bg-blue-800 text-white transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} md:w-64`}>
      <div className="p-6 flex items-center justify-between">
        {!collapsed && <h2 className="text-2xl font-bold">Dashboard</h2>}
        <button
          onClick={handleToggleSidebar}
          className="text-white text-2xl md:block"
        >
          <FontAwesomeIcon icon={collapsed ? faChevronRight : faBars} />
        </button>
      </div>
      <ul className="mt-6">
        {['dashboard', 'contacts', 'lists', 'profile', 'settings'].map((item) => (
          <motion.li
            key={item}
            className={`nav-item flex items-center rounded-lg cursor-pointer p-4 ${active === item ? 'bg-blue-700' : ''} hover:bg-blue-600`}
            onClick={() => handleNavigation(item)}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <FontAwesomeIcon icon={
              item === 'dashboard' ? faHome : 
              item === 'contacts' ? faAddressBook : 
              item === 'lists' ? faList : 
              item === 'profile' ? faUser : 
              faCog
            } />
            {!collapsed && <span className="ml-2">{item.charAt(0).toUpperCase() + item.slice(1)}</span>}
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
