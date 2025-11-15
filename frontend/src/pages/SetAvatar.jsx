import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import api from "../utils/AxiosSet";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { setAvatarRoute } from "../utils/APIRoutes";
import multiavatar from "@multiavatar/multiavatar/esm";
import { verifyUserRoute } from "../utils/APIRoutes";

const SetAvatar = () => {
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  useEffect(() => {
    // verify user via backend
    const verifyUser = async () => {
      try {
        const { data } = await api.get(verifyUserRoute); // your verify endpoint
        if (!data.status) navigate("/login");
      } catch (err) {
        navigate("/login");
      }
    };
    verifyUser();
  }, [navigate]);

  useEffect(() => {
    const data = [];
    for (let i = 0; i < 4; i++) {
      const randomName = Math.random().toString(36).substring(7);
      const svgCode = multiavatar(randomName);
      data.push(svgCode);
    }
    setAvatars(data);
    setIsLoading(false);
  }, []);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar");
      return;
    }

    try {
      const { data } = await api.post(setAvatarRoute, {
        AvatarImage: avatars[selectedAvatar],
      });

      if (data.isSet) {
        toast.success("Avatar set successfully!");
        setTimeout(() => {
          navigate("/");
        }, 1500); // redirect to main page
      } else {
        toast.error("Error setting avatar. Try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-10 w-full max-w-md sm:max-w-lg md:max-w-2xl text-center">
        {isLoading ? (
          <h1 className="text-lg font-semibold text-gray-600">Loading...</h1>
        ) : (
          <>
            <h1 className="font-bold text-xl sm:text-2xl text-gray-800 mb-6 sm:mb-8">
              Pick an Avatar
            </h1>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {avatars.map((a, index) => (
                <div
                  key={index}
                  className={`cursor-pointer p-2 border-4 rounded-full transition transform hover:scale-105 ${
                    selectedAvatar === index
                      ? "border-purple-600"
                      : "border-gray-300"
                  }`}
                  onClick={() => setSelectedAvatar(index)}
                >
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 mx-auto"
                    dangerouslySetInnerHTML={{ __html: a }}
                  />
                </div>
              ))}
            </div>

            <button
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-md w-full transition"
              onClick={setProfilePicture}
            >
              Set Profile Picture
            </button>
          </>
        )}
        
      </div>
    </div>
  );
};

export default SetAvatar;
