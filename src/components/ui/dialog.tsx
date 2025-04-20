// src/components/ui/dialog.tsx
import React from "react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange?: (open: boolean) => void; // Added onOpenChange prop
  children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, onOpenChange, children }) => {
  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
    if (onOpenChange) {
      onOpenChange(false); // Notify parent about the state change
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg w-11/12 sm:w-[500px] max-h-[90vh] overflow-y-auto p-6">
        {children}
        <div className="text-right mt-6">
          <button
            className="text-sm text-[#784d1e] hover:underline"
            onClick={handleClose} // Updated to use handleClose
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

const DialogHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mb-4">{children}</div>
);

const DialogTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-xl font-bold text-[#784d1e]">{children}</h2>
);

const DialogDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-gray-700 text-sm">{children}</p>
);

const DialogContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div>{children}</div>
);

const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className || ""}`} {...props} />
);

export { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent, DialogFooter };
