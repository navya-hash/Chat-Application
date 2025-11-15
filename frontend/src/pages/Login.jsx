import React, { useState, useEffect } from 'react';
import { FaUser, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from 'react-router-dom';
import { loginRoute, verifyUserRoute } from '../utils/APIRoutes';
import { ToastContainer, toast } from 'react-toastify';
import api from '../utils/AxiosSet'; 
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  
  // Check if user is already logged in
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const { data } = await api.get(verifyUserRoute);
        if (data.authenticated && data.user) {
          // Fixed: Check avatar status before redirecting
          if (data.user.isAvatarSet) {
            navigate('/');
          } else {
            navigate('/setAvatar');
          }
        }
      } catch (err) {
        // Not authenticated, stay on login
      }
    };
    verifyUser();
  }, [navigate]);

  const handleInputChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!handleValidation()) return;

    try {
      const { username, password } = loginData;
      const { data } = await api.post(loginRoute, { username, password });
      
      if (!data.status) {
        toast.error(data.message);
      } else {
        toast.success("Login successful!");
        // Fixed: Navigate based on avatar status
        setTimeout(() => {
          if (data.user.isAvatarSet) {
            navigate('/');
          } else {
            navigate('/setAvatar');
          }
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Something went wrong. Try again.";
      toast.error(errorMessage);
    }
  };

  const handleValidation = () => {
    const { username, password } = loginData;
    if (!username) {
      toast.error("Username is required!");
      return false;
    }
    if (!password) {
      toast.error("Password is required!");
      return false;
    }
    return true;
  };

  return (
    <>
      <div className="flex min-h-screen">
        {/* Left side - Form */}
        <div className="w-1/2 flex flex-col justify-center items-center px-10">
          <h1 className="text-3xl font-bold mb-2">LOGIN</h1>
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            {/* Username */}
            <div className="flex items-center bg-gray-100 rounded-md px-3 mb-4 w-full max-w-md">
              <FaUser className="text-gray-400 mr-2" />
              <input
                type="text"
                name="username"
                value={loginData.username}
                placeholder="Username"
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
                value={loginData.password}
                placeholder="Password"
                className="bg-transparent w-full py-3 focus:outline-none"
                onChange={handleInputChange}
              />
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-md w-full max-w-md mb-6 transition"
            >
              Login Now
            </button>
          </form>
          
          {/* Divider */}
          <div className="flex items-center w-full max-w-md mb-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-2 text-gray-500 font-medium">Login with Others</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Social buttons */}
          <button className="flex items-center justify-center border border-gray-300 rounded-md py-3 w-full max-w-md mb-4 hover:bg-gray-50">
            <FcGoogle className="text-xl mr-2" />
            <span className="font-medium">Login with Google</span>
          </button>

          {/* Signup link */}
          <p className="mt-6 text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-purple-600 font-medium hover:underline">
              Create account
            </Link>
          </p>
        </div>

        {/* Right side - Image with overlay */}
        {/* Right side - Image with overlay */}
<div className="w-1/2 bg-gradient-to-br from-purple-500 to-indigo-600 flex justify-center items-center relative">
  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white max-w-sm flex flex-col items-center">
    <h2 className="text-3xl font-extrabold mb-6 text-center drop-shadow-md">
      VibeChat
    </h2>
    <img
      src="https://img.freepik.com/free-photo/young-smiling-woman-using-digital-tablet_1262-21065.jpg"
      alt="Login Illustration"
      className="rounded-lg object-cover max-h-80 shadow-lg"
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

export default Login;