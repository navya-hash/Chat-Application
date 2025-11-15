import React, { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";
import { IoSend } from "react-icons/io5";

const ChatInput = ({ handleSendMsg }) => {
  const [showEmoji, setShowEmoji] = useState(false);
  const [msg, setMsg] = useState("");

  const handleEmojiShowOrHide = () => setShowEmoji(!showEmoji);

  const handleEmoji = (emojiObject) => {
    setMsg((prevMsg) => prevMsg + emojiObject.emoji);
  };

  const handleInput = (e) => {
    setMsg(e.target.value);
  };

  const sendChat = (e) => {
    e.preventDefault();
    if (msg.trim().length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <div className="relative w-full bg-white border-t border-purple-200 px-3 sm:px-5 py-2 flex items-center gap-2 sm:gap-4">
      {/* Emoji Button */}
      <div className="relative">
        <BsEmojiSmile
          onClick={handleEmojiShowOrHide}
          className="text-2xl sm:text-3xl text-purple-500 cursor-pointer hover:text-purple-700 transition"
        />
        {/* // {showEmoji && ( */}
        {/* //   <div className="absolute bottom-12 left-0 z-50">
        //     <EmojiPicker */}
        {/* //       onEmojiClick={handleEmoji}
        //       theme="light"
        //       emojiStyle="native"
        //       height={350}
        //       width={300}
        //     />
        //   </div>
        // )} */}
        <div
          className={`absolute bottom-12 left-0 z-50 transition-all ${
            showEmoji ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <EmojiPicker
            onEmojiClick={handleEmoji}
            theme="light"
            emojiStyle="native"
            height={350}
            width={300}
          />
        </div>
      </div>

      {/* Input + Send Button */}
      <form
        onSubmit={sendChat}
        className="flex-1 flex items-center bg-purple-50 rounded-full border border-purple-100 px-3 sm:px-5 py-1 sm:py-2"
      >
        <input
          type="text"
          placeholder="Type a message..."
          value={msg}
          onChange={handleInput}
          className="flex-1 bg-transparent outline-none text-gray-700 text-sm sm:text-base placeholder-gray-400"
        />
        <button
          type="submit"
          className="text-xl sm:text-2xl text-purple-600 hover:text-purple-800 transition"
        >
          <IoSend />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
