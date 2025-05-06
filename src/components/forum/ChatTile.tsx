"use client";

import { useUser } from "@/src/hooks/useUser";

type ChatTileProps = {
  isUserSide: boolean;
  content: string;
  senderId: string;
};

export function ChatTile({
  isUserSide = false,
  content,
  senderId,
}: ChatTileProps) {
  const { user: sender } = useUser(senderId);

  return (
    <div
      className={`my-3 space-y-2 flex flex-col ${
        isUserSide ? "items-end" : "items-start"
      }`}
    >
      <p
        className={`p-4 max-w-1/2 rounded-md ${
          isUserSide ? "bg-purple-600 text-white" : "bg-gray-200 text-black"
        }`}
      >
        {content ?? "Lorem ipsum dolor sit amet consectetur adipisicing elit."}
      </p>
      <span className="text-gray-400">{sender?.fullname}</span>
    </div>
  );
}
