import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  color?: "green" | "yellow" | "red" | "gray";
}

export const Badge: React.FC<BadgeProps> = ({ children, color = "gray" }) => {
  const baseClasses = "text-xs px-2 py-1 rounded font-semibold text-white inline-block";

  const colorClasses = {
    green: "bg-green-600",
    yellow: "bg-yellow-500 text-black",
    red: "bg-red-600",
    gray: "bg-gray-500",
  };

  return <span className={`${baseClasses} ${colorClasses[color]}`}>{children}</span>;
};
