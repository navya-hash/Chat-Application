import React, { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";
import { IoSend } from "react-icons/io5";

const ChatInput = ({ handleSendMsg, handleTyping, handleStopTyping }) => {
  const [showEmoji, setShowEmoji] = useState(false);
  const [msg, setMsg] = useState("");

  const handleEmojiShowOrHide = () => setShowEmoji(!showEmoji);

  const handleEmoji = (emojiObject) => {
    setMsg((prevMsg) => prevMsg + emojiObject.emoji);
    if (handleTyping) handleTyping();
  };

  const handleInput = (e) => {
    setMsg(e.target.value);
    if (handleTyping) handleTyping();
  };

  const sendChat = (e) => {
    e.preventDefault();
    if (msg.trim().length > 0) {
      handleSendMsg(msg);
      setMsg("");
      setShowEmoji(false);
      if (handleStopTyping) handleStopTyping();
    }
  };

  // Get current active theme for EmojiPicker
  const activeTheme = localStorage.getItem("vibeChat_theme") === "light" ? "light" : "dark";

  return (
    <div className="relative w-full py-1.5 flex items-center gap-3 bg-transparent">
      {/* Emoji Button */}
      <div className="relative flex items-center">
        <BsEmojiSmile
          onClick={handleEmojiShowOrHide}
          className="text-2xl text-on-surface-variant hover:text-primary cursor-pointer transition-colors duration-200"
          title="Add Emoji"
        />
        <div
          className={`absolute bottom-14 left-0 z-50 transition-all duration-200 origin-bottom-left ${
            showEmoji ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"
          }`}
        >
          <EmojiPicker
            onEmojiClick={handleEmoji}
            theme={activeTheme}
            emojiStyle="native"
            height={360}
            width={300}
          />
        </div>
      </div>

      {/* Input + Send Button */}
      <form
        onSubmit={sendChat}
        className="flex-1 flex items-center bg-surface-container-lowest/50 border border-outline-variant/20 rounded-2xl px-4 py-2.5 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all duration-200"
      >
        <input
          type="text"
          placeholder="Type a message..."
          value={msg}
          onChange={handleInput}
          className="flex-1 bg-transparent outline-none text-on-surface placeholder:text-outline text-sm sm:text-base border-none p-0 focus:ring-0 focus:outline-none"
        />
        <button
          type="submit"
          className="text-xl text-primary hover:text-primary-container hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center pl-2"
          title="Send message"
        >
          <IoSend />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
