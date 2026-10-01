import React from "react";
import Logout from "./Logout";

const Welcome = ({ currentUser }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-on-surface select-none">
      <div className="glass-card rim-light rounded-[32px] p-8 md:p-12 max-w-md w-full flex flex-col items-center space-y-6 shadow-2xl transition-all duration-300">
        {/* Animated Brand/Hello Image */}
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-95 group-hover:scale-105 transition-all"></div>
          <img
            src="hello.jpg"
            alt="Hello Animation"
            className="relative w-44 h-44 rounded-full border-2 border-primary/20 shadow-xl object-cover"
          />
        </div>

        {/* Welcome Text */}
        <div className="space-y-2">
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
            Welcome back, <span className="text-primary">{currentUser?.username}</span>!
          </h1>
          <p className="font-body-md text-on-surface-variant">
            Select a contact from the workspace panel to start vibing. 💬
          </p>
        </div>

        <div className="pt-2">
          <Logout />
        </div>
      </div>
    </div>
  );
};

export default Welcome;
