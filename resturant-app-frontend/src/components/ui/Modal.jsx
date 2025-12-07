import React from "react";
import { FaTimes } from "react-icons/fa";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-4xl",
  maxHeight = "max-h-[90vh]",
  showCloseButton = true,
  closable = true,
  className = "",
  headerContent = null,
  footerContent = null,
}) => {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && closable) {
      onClose();
    }
  };

  const handleKeyDown = React.useCallback(
    (e) => {
      if (e.key === "Escape" && closable) {
        onClose();
      }
    },
    [closable, onClose]
  );

  React.useEffect(() => {
    if (isOpen && closable) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, closable, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white rounded-lg w-full ${maxWidth} ${maxHeight} overflow-hidden ${className} my-8 flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton || headerContent) && (
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <div className="flex-1">
              {title && (
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
              )}
              {headerContent}
            </div>
            {showCloseButton && closable && (
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded hover:bg-gray-100"
                aria-label="Close modal"
              >
                <FaTimes className="text-lg" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">{children}</div>

        {/* Footer */}
        {footerContent && (
          <div className="border-t border-gray-200 p-6">{footerContent}</div>
        )}
      </div>
    </div>
  );
};

export default Modal;
