import React from 'react';
import { logoutRoute } from '../utils/APIRoutes';
import api from '../utils/AxiosSet';
import { FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Logout = () => {
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const { data } = await api.get(logoutRoute, { withCredentials: true });
      if (data.status === true) {
         navigate('/login')
      } else {
        toast.error("Logout failed. Please try again.");
      }
    } catch (err) {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center space-x-2 bg-white text-purple-600 px-3 py-2 rounded-full shadow-md hover:bg-purple-600 hover:text-white transition-all duration-300"
        title="Log out"
      >
        <FaSignOutAlt className="text-lg" />
        <span className="font-medium hidden sm:inline">Logout</span>
      </button>
      
    </>
  );
};

export default Logout;
