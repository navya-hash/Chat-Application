import React, { useState, useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import Messages from "./Messages";
import Logout from "./Logout";
import api from "../utils/AxiosSet";
import { sendMsgRoute, getMsgRoute } from "../utils/APIRoutes";
import { svgToBase64 } from "../utils/avatarHelper";

const ChatContainer = ({ currentChat, currentUser, socket, onlineUsers = [], isTyping = false }) => {
  const scrollRef = useRef();
  const typingTimeoutRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);

  const isContactOnline = currentChat ? onlineUsers.includes(currentChat._id) : false;

  // Fetch all previous messages when currentChat changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (currentUser && currentChat) {
        try {
          const response = await api.post(getMsgRoute, {
            from: currentUser._id,
            to: currentChat._id,
          });
          setMessages(response.data || []);
        } catch (err) {
          console.error("Failed to fetch messages:", err);
        }
      }
    };
    fetchMessages();
  }, [currentChat, currentUser]);

  // Handle typing emissions
  const handleTyping = () => {
    if (socket?.current && currentChat && currentUser) {
      socket.current.emit("typing", {
        to: currentChat._id,
        from: currentUser._id,
      });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.current.emit("stop-typing", {
          to: currentChat._id,
          from: currentUser._id,
        });
      }, 3000);
    }
  };

  const handleStopTyping = () => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (socket?.current && currentChat && currentUser) {
      socket.current.emit("stop-typing", {
        to: currentChat._id,
        from: currentUser._id,
      });
    }
  };

  // Handle sending a new message
  const handleSendMsg = async (msg) => {
    if (!msg || !currentChat || !currentUser) return;

    const createdAt = new Date().toISOString();

    try {
      // Save message in backend
      await api.post(sendMsgRoute, {
        from: currentUser._id,
        to: currentChat._id,
        message: msg,
      });

      // Emit message to receiver via socket
      if (socket?.current) {
        socket.current.emit("send-msg", {
          to: currentChat._id,
          from: currentUser._id,
          message: msg,
          createdAt,
        });
      }

      // Update messages locally
      setMessages((prev) => [...prev, { fromSelf: true, message: msg, createdAt }]);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  // Listen for incoming messages
  useEffect(() => {
    const currentSocket = socket?.current;
    if (currentSocket) {
      const handleMsgReceive = (data) => {
        const senderId = typeof data === "object" ? data.from : null;
        const msgText = typeof data === "object" ? data.message : data;
        const msgTime = typeof data === "object" ? data.createdAt : new Date().toISOString();

        if (!senderId || (currentChat && currentChat._id === senderId)) {
          setArrivalMessage({ fromSelf: false, message: msgText, createdAt: msgTime });
        }
      };

      currentSocket.on("msg-receive", handleMsgReceive);

      return () => {
        currentSocket.off("msg-receive", handleMsgReceive);
      };
    }
  }, [socket, currentChat]);

  // Append new incoming message to messages array
  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  // Scroll to latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-full w-full bg-transparent overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between bg-surface-container-low/30 backdrop-blur-md px-6 py-4 border-b border-outline-variant/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full border border-primary/20 overflow-hidden flex items-center justify-center bg-surface-container shadow-inner">
              {currentChat?.AvatarImage ? (
                <img
                  src={svgToBase64(currentChat.AvatarImage)}
                  alt={currentChat.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-bold text-base text-outline uppercase">
                  {currentChat?.username?.[0] || "?"}
                </span>
              )}
            </div>
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-surface-dim ${
                isContactOnline
                  ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                  : "bg-slate-500"
              }`}
            ></span>
          </div>
          <div>
            <h3 className="text-on-surface font-semibold text-sm">
              {currentChat?.username}
            </h3>
            <p className="text-xs text-on-surface-variant flex items-center gap-1.5">
              {isTyping ? (
                <span className="text-primary font-medium animate-pulse">typing...</span>
              ) : isContactOnline ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                  Active Now
                </>
              ) : (
                <span className="text-outline">Offline</span>
              )}
            </p>
          </div>
        </div>
        <Logout />
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-surface-container-lowest/10">
        <Messages messages={messages} scrollRef={scrollRef} />
        {isTyping && (
          <div className="flex items-center gap-2 mt-2 text-xs text-primary italic">
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce"></span>
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce delay-100"></span>
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce delay-200"></span>
            <span>{currentChat?.username} is typing...</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-surface-container-low/30 backdrop-blur-md border-t border-outline-variant/10 px-4 py-3 shrink-0">
        <ChatInput
          handleSendMsg={handleSendMsg}
          handleTyping={handleTyping}
          handleStopTyping={handleStopTyping}
        />
      </div>
    </div>
  );
};

export default ChatContainer;
