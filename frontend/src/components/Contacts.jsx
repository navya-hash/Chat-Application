import React, { useState, useEffect } from "react";
import { svgToBase64 } from "../utils/avatarHelper";
import Logout from "./Logout";

const Contacts = ({ contacts, currentUser, changeChat, onlineUsers = [], onSettingsClick }) => {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (currentUser) {
      setCurrentUserName(currentUser.username);
      setCurrentUserImage(currentUser.AvatarImage); // match backend naming
    }
  }, [currentUser]);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  // Filter contacts based on search query
  const filteredContacts = contacts.filter((contact) =>
    contact.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper: random pastel background colors for initials
  const getRandomColor = (name) => {
    const colors = [
      "bg-primary/20 text-primary",
      "bg-secondary-container/40 text-secondary",
      "bg-tertiary-container/40 text-tertiary",
      "bg-error-container/40 text-error",
    ];
    const index = name
      ? name.toUpperCase().charCodeAt(0) % colors.length
      : 0;
    return colors[index];
  };

  return (
    <>
      {currentUserName && (
        <div className="flex flex-col h-full bg-surface-container-low/20 backdrop-blur-lg border-r border-outline-variant/10 text-on-surface">
          
          {/* Search Contacts */}
          <div className="p-4 border-b border-outline-variant/10">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors text-[20px]">
                search
              </span>
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-container-lowest/50 border border-outline-variant/20 rounded-xl py-2 pl-10 pr-4 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact, index) => {
                const isOnline = onlineUsers.includes(contact._id);
                return (
                  <div
                    key={contact._id || index}
                    className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${
                      currentSelected === index
                        ? "bg-primary/10 border-l-4 border-primary text-primary"
                        : "hover:bg-white/5 text-on-surface-variant hover:text-on-surface"
                    }`}
                    onClick={() => changeCurrentChat(index, contact)}
                  >
                    {/* Avatar or Initial */}
                    <div className="relative shrink-0">
                      <div
                        className={`w-11 h-11 rounded-full overflow-hidden flex items-center justify-center font-bold text-base shadow-inner ${getRandomColor(
                          contact.username
                        )}`}
                      >
                        {contact.AvatarImage ? (
                          <img
                            src={svgToBase64(contact.AvatarImage)}
                            alt={contact.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          contact.username[0].toUpperCase()
                        )}
                      </div>
                      {/* Online status indicator */}
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-surface-dim ${
                          isOnline
                            ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                            : "bg-slate-500"
                        }`}
                        title={isOnline ? "Online" : "Offline"}
                      ></span>
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm truncate">
                          {contact.username}
                        </h3>
                        <span className="text-[10px] text-outline">
                          {isOnline ? "Online" : "Offline"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center text-outline text-sm">
                No contacts found
              </div>
            )}
          </div>

          {/* Current User Footer */}
          <div className="p-4 border-t border-outline-variant/10 bg-surface-container-low/50 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-11 h-11 rounded-full overflow-hidden flex items-center justify-center font-bold text-base shadow-inner shrink-0 ${getRandomColor(
                  currentUserName
                )}`}
              >
                {currentUserImage ? (
                  <img
                    src={svgToBase64(currentUserImage)}
                    alt={currentUserName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  currentUserName[0].toUpperCase()
                )}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm truncate">{currentUserName}</h3>
                <p className="text-xs text-on-surface-variant">You</p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {/* Settings Trigger */}
              <button
                onClick={onSettingsClick}
                className="p-2 hover:bg-white/5 rounded-xl text-on-surface-variant hover:text-on-surface transition-all flex items-center justify-center cursor-pointer"
                title="Settings"
              >
                <span className="material-symbols-outlined text-[22px]">settings</span>
              </button>
              
              {/* Logout Button */}
              <Logout iconOnly={true} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Contacts;
