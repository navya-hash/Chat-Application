import React from "react";


const Welcome = ({ currentUser }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full space-y-6">
      {/* Animated Hello Image */}
      <img
        src="hello.jpg"
        alt="Hello Animation"
        className="w-48 h-48 rounded-full shadow-lg border-2 border-white"
      />

      {/* Welcome Text */}
      <h1 className="text-3xl font-bold text-white">
        Welcome, <span className="text-yellow-300">{currentUser?.username}!</span>
      </h1>

      <p className="text-lg text-white/80">
        Select a chat to start messaging 💬
      </p>
    </div>
  );
};

export default Welcome;
