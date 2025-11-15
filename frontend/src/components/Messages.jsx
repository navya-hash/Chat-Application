import React from "react";
import { v4 as uuidv4 } from "uuid"; 

const Messages = ({ messages, currentUser }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
      {messages.map((msg) => {
        const isSelf = msg.fromSelf;

        //Ensure each message has a unique id (use msg.id if backend provides one)
        const messageId = msg.id || uuidv4();

        return (
          <div
            key={messageId} // 
            className={`flex ${isSelf ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs sm:max-w-md px-4 py-2 rounded-lg break-words
                ${isSelf
                  ? "bg-purple-400 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none"}
                shadow-md
              `}
            >
              <p className="text-sm">{msg.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
