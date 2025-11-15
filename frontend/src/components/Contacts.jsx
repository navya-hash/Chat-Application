import React, { useState, useEffect } from "react";

const Contacts = ({ contacts, currentUser, changeChat }) => {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

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

  // Helper: safely convert SVG to Base64 (handles Unicode correctly)
  const svgToBase64 = (svg) =>
    `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;

  // Helper: random pastel background colors for initials
  const getRandomColor = (name) => {
    const colors = [
      "bg-purple-400",
      "bg-pink-400",
      "bg-blue-400",
      "bg-green-400",
      "bg-yellow-400",
      "bg-red-400",
      "bg-indigo-400",
    ];
    const index = name
      ? name.toUpperCase().charCodeAt(0) % colors.length
      : 0;
    return colors[index];
  };

  return (
    <>
      {currentUserName && (
        <div className="flex flex-col h-full bg-white border-r border-gray-200">
          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto">
            {contacts.map((contact, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 cursor-pointer transition-all ${
                  currentSelected === index
                    ? "bg-purple-100 border-l-4 border-purple-600"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => changeCurrentChat(index, contact)}
              >
                {/* Avatar or Initial */}
                <div
                  className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-lg shadow-inner ${getRandomColor(
                    contact.username
                  )}`}
                >
                  {contact.AvatarImage ? (
                    <img
                      src={svgToBase64(contact.AvatarImage)}
                      alt={contact.username}
                      className="w-full h-full"
                    />
                  ) : (
                    contact.username[0].toUpperCase()
                  )}
                </div>

                {/* Name */}
                <div className="flex-1">
                  <h3 className="text-gray-800 font-medium">
                    {contact.username}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* Current User Footer */}
          <div className="p-3 border-t border-gray-200 bg-gray-50 flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-lg shadow-inner ${getRandomColor(
                currentUserName
              )}`}
            >
              {currentUserImage ? (
                <img
                  src={svgToBase64(currentUserImage)}
                  alt={currentUserName}
                  className="w-full h-full"
                />
              ) : (
                currentUserName[0].toUpperCase()
              )}
            </div>
            <div>
              <h3 className="text-gray-800 font-semibold">{currentUserName}</h3>
              <p className="text-xs text-gray-500">You</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Contacts;
