import React, { useState, useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import Messages from "./Messages";
import Logout from "./Logout";
import api from "../utils/AxiosSet";
import { sendMsgRoute, getMsgRoute } from "../utils/APIRoutes";

const ChatContainer = ({ currentChat, currentUser, socket }) => {
  const scrollRef = useRef();
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);

  // Fetch all previous messages when currentChat changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (currentUser && currentChat) {
        try {
          const response = await api.post(getMsgRoute, {
            from: currentUser._id,
            to: currentChat._id,
          });
          setMessages(response.data);
        } catch (err) {
          console.error("Failed to fetch messages:", err);
        }
      }
    };
    fetchMessages();
  }, [currentChat, currentUser]);

  // Handle sending a new message
  const handleSendMsg = async (msg) => {
    if (!msg) return;

    try {
      // Save message in backend
      await api.post(sendMsgRoute, {
        from: currentUser._id,
        to: currentChat._id,
        message: msg,
      });

      // Emit message to receiver via socket
      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: currentUser._id,
        message: msg,
      });

      // Update messages locally
      setMessages((prev) => [...prev, { fromSelf: true, message: msg }]);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  // Listen for incoming messages
  useEffect(() => {
    if (socket.current) {
      const handleMsgReceive = (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      };

      socket.current.on("msg-receive", handleMsgReceive);

      // Cleanup listener on unmount
      return () => {
        socket.current.off("msg-receive", handleMsgReceive);
      };
    }
  }, [socket]);

  // Append new incoming message to messages array
  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  // Scroll to latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-br from-white to-purple-100">
      {/* Header */}
      <div className="flex items-center justify-between bg-purple-600 text-white px-6 py-3 rounded-t-2xl shadow-md">
        <div className="flex items-center space-x-3">
          <img
            src={
              currentChat?.AvatarImage
                ? `data:image/svg+xml;base64,${btoa(currentChat.AvatarImage)}`
                : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="avatar"
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <h3 className="text-lg font-semibold">{currentChat?.username}</h3>
        </div>
        <Logout />
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-white">
        <Messages messages={messages} scrollRef={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="bg-purple-100 border-t border-purple-200 px-4 py-2">
        <ChatInput handleSendMsg={handleSendMsg} />
      </div>
    </div>
  );
};

export default ChatContainer;
