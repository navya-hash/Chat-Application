import React, { useState, useEffect } from "react";
import api from "../utils/AxiosSet";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute, verifyUserRoute } from "../utils/APIRoutes";
import multiavatar from "@multiavatar/multiavatar/esm";
import { toast } from "react-toastify";

const SetAvatar = () => {
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const { data } = await api.get(verifyUserRoute);
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
        }, 1500);
      } else {
        toast.error("Error setting avatar. Try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <div className="bg-surface-dim text-on-surface font-body-md min-h-screen relative overflow-hidden flex items-center justify-center p-gutter">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-container/10 blur-[100px] rounded-full animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-surface-container-low/40 blur-[80px] rounded-full animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Container */}
      <main className="relative z-10 w-full max-w-[560px]">
        <div className="glass-card rim-light rounded-[32px] p-container-padding md:p-stack-lg flex flex-col items-center">
          {/* Header */}
          <div className="mb-stack-lg text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-container mb-stack-md shadow-[0_8px_30px_rgb(192,193,255,0.3)]">
              <span className="material-symbols-outlined text-on-primary-container text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                face
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Pick an Avatar</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-unit">Customize your presence in the VibeChat workspace.</p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-stack-lg space-y-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="font-label-md text-outline">Generating custom options...</p>
            </div>
          ) : (
            <>
              {/* Avatar Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-stack-md mb-stack-lg w-full">
                {avatars.map((a, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer p-2 border-2 rounded-full transition-all duration-300 flex items-center justify-center aspect-square ${
                      selectedAvatar === index
                        ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(192,193,255,0.2)] scale-105"
                        : "border-outline-variant/30 hover:border-primary/50 hover:bg-white/5"
                    }`}
                    onClick={() => setSelectedAvatar(index)}
                  >
                    <div
                      className="w-20 h-20"
                      dangerouslySetInnerHTML={{ __html: a }}
                    />
                  </div>
                ))}
              </div>

              {/* Set Action */}
              <button
                className="w-full bg-gradient-to-r from-primary-container to-primary text-on-primary-container font-title-md text-title-md py-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all duration-200"
                onClick={setProfilePicture}
              >
                Set Profile Picture
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default SetAvatar;
