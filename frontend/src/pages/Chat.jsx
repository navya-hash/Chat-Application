import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/AxiosSet";
import { getUsersRoute, verifyUserRoute } from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import SettingsPane from "../components/SettingsPane";
import { io } from "socket.io-client";

const Chat = () => {
  const socket = useRef();
  const host = "http://localhost:7800";
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // verify user via backend
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const { data } = await api.get(verifyUserRoute);
        if (!data.status) navigate("/login");
        else {
          setCurrentUser(data.user);
          setIsLoading(true);
        }
      } catch (err) {
        navigate("/login");
      }
    };
    verifyUser();
  }, [navigate]);

  // fetch users after login
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;
      if (!currentUser.isAvatarSet) {
        navigate("/setAvatar");
      } else {
        const { data } = await api.get(getUsersRoute);
        const fetchedContacts = data.users || [];
        setContacts(fetchedContacts);

        // Restore active chat if stored in sessionStorage
        const savedChatId = sessionStorage.getItem("vibeChat_activeChatId");
        if (savedChatId) {
          const matched = fetchedContacts.find((c) => c._id === savedChatId);
          if (matched) {
            setCurrentChat(matched);
          }
        }
      }
    };
    fetchData();
  }, [currentUser, navigate]);

  // Socket connection lifecycle & real-time events
  useEffect(() => {
    if (currentUser) {
      const newSocket = io(host, { withCredentials: true });
      socket.current = newSocket;

      newSocket.on("connect", () => {
        newSocket.emit("add-user", currentUser._id);
      });

      newSocket.emit("add-user", currentUser._id);

      newSocket.on("get-online-users", (userList) => {
        setOnlineUsers(userList || []);
      });

      newSocket.on("user-typing", ({ from }) => {
        if (from) {
          setTypingUsers((prev) => ({ ...prev, [from]: true }));
        }
      });

      newSocket.on("user-stop-typing", ({ from }) => {
        if (from) {
          setTypingUsers((prev) => ({ ...prev, [from]: false }));
        }
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
    if (chat && chat._id) {
      sessionStorage.setItem("vibeChat_activeChatId", chat._id);
    }
  };

  const handleUserUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  // Render settings overlay if showSettings is true
  if (showSettings) {
    return (
      <div className="bg-surface-dim text-on-surface font-body-md min-h-screen relative overflow-hidden flex items-center justify-center p-gutter">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full animate-blob"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-container/10 blur-[100px] rounded-full animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-surface-container-low/40 blur-[80px] rounded-full animate-blob animation-delay-4000"></div>
        </div>

        <SettingsPane
          currentUser={currentUser}
          onBack={() => setShowSettings(false)}
          onUpdateUser={handleUserUpdate}
        />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex bg-surface-dim text-on-surface font-body-md relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-container/10 blur-[100px] rounded-full animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-surface-container-low/40 blur-[80px] rounded-full animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex h-full w-full">
        {/* Contacts Section (Left) */}
        <div className="w-1/3 min-w-[280px] max-w-[400px] flex flex-col h-full">
          <div className="text-xl font-bold py-4 px-6 border-b border-outline-variant/10 text-primary flex items-center gap-2 bg-surface-container-low/20 backdrop-blur-lg shrink-0">
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              hub
            </span>
            <span className="tracking-tight">VibeChat</span>
          </div>
          <div className="flex-1 min-h-0">
            <Contacts
              contacts={contacts}
              currentUser={currentUser}
              changeChat={handleChatChange}
              onlineUsers={onlineUsers}
              onSettingsClick={() => setShowSettings(true)}
            />
          </div>
        </div>

        {/* Chat Section (Right) */}
        <div className="flex-1 bg-surface-container-lowest/10 backdrop-blur-sm flex flex-col min-h-0">
          {isLoading && currentChat === undefined ? (
            <Welcome currentUser={currentUser} />
          ) : (
            <ChatContainer
              currentChat={currentChat}
              currentUser={currentUser}
              socket={socket}
              onlineUsers={onlineUsers}
              isTyping={currentChat ? !!typingUsers[currentChat._id] : false}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
