import React, { useState, useEffect } from 'react';
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { registerRoute, verifyUserRoute } from '../utils/APIRoutes';
import api from '../utils/AxiosSet'; 

const Signup = () => {
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState({ username: "", email: "", password: "" });

  // Check if user is already logged in
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const { data } = await api.get(verifyUserRoute);
        if (data.authenticated && data.user) {
          
          if (data.user.isAvatarSet) {
            navigate('/');
          } else {
            navigate('/setAvatar');
          }
        }
      } catch (err) {
        // Not logged in, stay on signup
      }
    };
    verifyUser();
  }, [navigate]);

  const handleInputChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleValidation = () => {
    const { username, email, password } = registerData;
    if (!username || username.length < 2) {
      toast.error("Username should be at least 2 characters!");
      return false;
    }
    if (!email) {
      toast.error("Email is required!");
      return false;
    }
    if (!password || password.length < 8) {
      toast.error("Password should be at least 8 characters!");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!handleValidation()) return;

    try {
      const { username, email, password } = registerData;
      const { data } = await api.post(registerRoute, { username, email, password });

      if (!data.status) {
        toast.error(data.message);
      } else {
        toast.success("Signup successful!");
        
        setTimeout(() => {
          navigate('/setAvatar');
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Something went wrong. Try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <div className="flex min-h-screen">
        {/* Left side - Form */}
        <div className="w-1/2 flex flex-col justify-center items-center px-10">
          <h1 className="text-3xl font-bold mb-2">SIGNUP</h1>
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            {/* Username */}
            <div className="flex items-center bg-gray-100 rounded-md px-3 mb-4 w-full max-w-md">
              <FaUser className="text-gray-400 mr-2" />
              <input
                type="text"
                name="username"
                value={registerData.username}
                placeholder="Username"
                className="bg-transparent w-full py-3 focus:outline-none"
                onChange={handleInputChange}
              />
            </div>

            {/* Email */}
            <div className="flex items-center bg-gray-100 rounded-md px-3 mb-4 w-full max-w-md">
              <MdEmail className="text-gray-400 mr-2" />
              <input
                type="email"
                name="email"
                value={registerData.email}
                placeholder="Email"
                className="bg-transparent w-full py-3 focus:outline-none"
                onChange={handleInputChange}
              />
            </div>

            {/* Password */}
            <div className="flex items-center bg-gray-100 rounded-md px-3 mb-6 w-full max-w-md">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type="password"
                name="password"
                value={registerData.password}
                placeholder="Password"
                className="bg-transparent w-full py-3 focus:outline-none"
                onChange={handleInputChange}
              />
            </div>

            {/* Signup button */}
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-md w-full max-w-md mb-6 transition"
            >
              Signup
            </button>
          </form>

          {/* Login link */}
          <p className="mt-6 text-gray-600 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-600 font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>

        {/* Right side - Image with overlay */}
        <div className="w-1/2 bg-gradient-to-br from-purple-500 to-indigo-600 flex justify-center items-center relative">
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 text-white max-w-sm">
            <h2 className="text-2xl font-bold mb-4">
              Very good works are waiting for you! Signup Now!!!
            </h2>
            <img
              src="https://img.freepik.com/free-photo/young-smiling-woman-using-digital-tablet_1262-21065.jpg"
              alt="Signup Illustration"
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default Signup;