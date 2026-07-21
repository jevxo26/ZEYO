"use client";
import React, { useState } from "react";
import { Send, Smile, Paperclip, MoreVertical, Phone } from "lucide-react";
import MessageNode from "./MessageNode";

export default function LiveChatWidget() {
  const [messages, setMessages] = useState([
    {
      sender: "Client (Sarah)",
      text: "Hey! Just wanted to check if the floral team is confirmed for the Corporate Gala?",
      time: "10:24 AM",
      isMe: false,
    },
    {
      sender: "You",
      text: "Hi Sarah! Yes, the premium orchid layout has been locked in and paid.",
      time: "10:26 AM",
      isMe: true,
    },
    {
      sender: "Client (Sarah)",
      text: "Perfect! Can you update the timeline on the dashboard?",
      time: "10:27 AM",
      isMe: false,
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([
      ...messages,
      {
        sender: "You",
        text: input,
        time: "Just Now",
        isMe: true,
      },
    ]);
    setInput("");
  };

  return (
    <div className="bg-white border border-gray-200/60 rounded-3xl h-[550px] flex flex-col overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:border-gray-300 transition-all duration-300">
      {/* Active Stream Header Matrix */}
      <div className="bg-white border-b border-gray-100 p-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-400 rounded-full flex items-center justify-center text-slate-950 font-black text-xs shadow-sm shadow-amber-400/10">
            S
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900">Sarah Jenkins</h4>
            <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse" />{" "}
              Active Box • Annual Gala
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <button className="p-2 hover:bg-slate-50 text-gray-500 rounded-xl transition-all cursor-pointer">
            <Phone size={15} />
          </button>
          <button className="p-2 hover:bg-slate-50 text-gray-400 rounded-xl transition-all cursor-pointer">
            <MoreVertical size={15} />
          </button>
        </div>
      </div>

      {/* Dynamic Scroll Frame Buffer */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/30">
        {messages.map((msg, idx) => (
          <MessageNode
            key={idx}
            sender={msg.sender}
            text={msg.text}
            time={msg.time}
            isMe={msg.isMe}
          />
        ))}
      </div>

      {/* Interface Input Panel */}
      <form
        onSubmit={handleSend}
        className="bg-white border-t border-gray-100 p-4 flex items-center gap-2.5 shrink-0"
      >
        <button
          type="button"
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
        >
          <Paperclip size={16} />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
          className="flex-1 bg-slate-50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-slate-400 text-gray-700 placeholder:text-gray-400 transition-colors font-medium"
        />
        <button
          type="button"
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
        >
          <Smile size={16} />
        </button>
        <button
          type="submit"
          className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/10 cursor-pointer flex items-center justify-center"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
