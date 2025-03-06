import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export const Button: React.FC<ButtonProps> = ({ children, variant = "primary", ...props }) => {
  const baseClasses = "px-4 py-2 text-white rounded";
  const variantClasses =
    variant === "primary"
      ? "bg-[#444e57] hover:bg-[#333a45]"
      : "bg-[#784d1e] hover:bg-[#5a3516]";

  return (
    <button {...props} className={`${baseClasses} ${variantClasses}`}>
      {children}
    </button>
  );
};
