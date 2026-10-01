import React from "react";

const Messages = ({ messages, scrollRef }) => {
  // Helper to format ISO timestamps to HH:MM AM/PM
  const formatTime = (isoString) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    } catch (e) {
      return "";
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {messages.map((msg, index) => {
        const isSelf = msg.fromSelf;
        const messageKey = `${index}-${msg.message.substring(0, 8)}-${msg.createdAt || ""}`;

        return (
          <div
            key={messageKey}
            className={`flex w-full ${isSelf ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex flex-col max-w-[75%] sm:max-w-[65%] ${isSelf ? "items-end" : "items-start"}`}>
              {/* Message Bubble */}
              <div
                className={`px-4 py-2.5 rounded-2xl shadow-md break-words text-sm relative ${
                  isSelf
                    ? "message-gradient text-on-primary-fixed rounded-tr-none rim-light"
                    : "bg-surface-container-high/50 border border-outline-variant/10 text-on-surface rounded-tl-none"
                }`}
              >
                <p className="leading-relaxed font-body-md">{msg.message}</p>
              </div>

              {/* Timestamp */}
              {msg.createdAt && (
                <span className="text-[10px] text-on-surface-variant/60 mt-1 px-1">
                  {formatTime(msg.createdAt)}
                </span>
              )}
            </div>
          </div>
        );
      })}

      {/* Invisible anchor for scrolling to bottom */}
      <div ref={scrollRef} />
    </div>
  );
};

export default Messages;
