interface MessageNodeProps {
  sender: string;
  avatar?: string;
  text: string;
  time: string;
  isMe: boolean;
}

export default function MessageNode({
  sender,
  text,
  time,
  isMe,
}: MessageNodeProps) {
  return (
    <div
      className={`flex gap-3 max-w-[80%] ${isMe ? "ml-auto flex-row-reverse" : "mr-auto"}`}
    >
      {/* Mini Profile Avatar Ring */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 text-white shadow-sm ${
          isMe ? "bg-indigo-600" : "bg-slate-500"
        }`}
      >
        {sender[0]}
      </div>

      <div className="space-y-1">
        <div
          className={`p-3.5 rounded-2xl text-xs leading-relaxed font-medium shadow-[0_2px_8px_rgba(0,0,0,0.02)] ${
            isMe
              ? "bg-indigo-600 text-white rounded-tr-none"
              : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
          }`}
        >
          {text}
        </div>
        <p
          className={`text-[9px] font-bold text-gray-400 ${isMe ? "text-right" : "text-left"}`}
        >
          {time}
        </p>
      </div>
    </div>
  );
}
