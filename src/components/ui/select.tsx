"use client";

import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ children, ...props }) => {
  return (
    <select
      {...props}
      className="border border-[#444e57] p-2 rounded w-full bg-white text-slate-700"
    >
      {children}
    </select>
  );
};
