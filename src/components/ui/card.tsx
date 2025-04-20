import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`bg-[#928776] shadow p-4 rounded ${className || ""}`}>
      {children}
    </div>
  );
};

const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="font-bold text-lg mb-2 text-[#1f2023]">{children}</div>;
};

const CardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="text-[#1f2023]">{children}</div>;
};

const CardFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="border-t mt-2 pt-2 text-right border-[#444e57]">{children}</div>;
};

const CardTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <h3 className="text-lg font-semibold text-[#1f2023] mb-1">{children}</h3>
  );
};

// Named Exports
export { Card, CardHeader, CardContent, CardFooter, CardTitle };

// Default Export (Jika diperlukan)
export default Card;
