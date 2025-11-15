import React, { useState, useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/AxiosSet";
import { getUsersRoute ,verifyUserRoute} from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import { io } from "socket.io-client";
 // or your backend socket server URL

const Chat = () => {
  const socket = useRef();
  const host = "http://localhost:7800";
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  // useRef() → keeps a persistent reference to the socket connection (so it doesn’t reset on re-renders)

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
        setContacts(data.users);
      }
    }
    fetchData();
  }, [currentUser, navigate]);

useEffect(() => {
  if (currentUser) {
    socket.current = io(host);
    socket.current.emit("add-user", currentUser._id);
  }
}, [currentUser]);

// A new user with this ID is online — store their socket connection


  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <div className="h-screen w-screen flex bg-gradient-to-r from-white via-white to-purple-100">
      {/* Contacts Section (Left) */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        <div className="text-2xl font-bold text-center py-4 text-purple-600 shadow-sm">
          Chats
        </div>
        <Contacts
          contacts={contacts}
          currentUser={currentUser}
          changeChat={handleChatChange}
        />
      </div>

      {/* Chat Section (Right) */}
      <div className="flex-1 bg-gradient-to-br from-purple-500 to-purple-700 text-white flex flex-col justify-center items-center">
        {isLoading && currentChat === undefined ? (
          <Welcome currentUser={currentUser} />
        ) : (
          <ChatContainer currentChat={currentChat} currentUser={currentUser}
          socket={socket}/>
        )}
      </div>
    </div>
  );
};

export default Chat;
