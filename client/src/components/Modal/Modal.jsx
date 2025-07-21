import { createPortal } from 'react-dom';
import React, { useEffect, useRef } from 'react'
import { X } from "lucide-react"

const Modal = ({ isModalOpen, onClose, children, title, size="md" }) => {
  const modalRef = useRef(null)
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isModalOpen, onClose])

  // Focus management
  useEffect(() => {
    if (isModalOpen && modalRef.current) {
      modalRef.current.focus()
    }
  }, [isModalOpen])

  // Handle backdrop click
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  if (!isModalOpen) return null

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  }
  return createPortal((
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 dark:text-black" onClick={handleBackdropClick}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`relative w-full ${sizeClasses[size]} max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          {title && (
            <h2 id="modal-title" className="text-lg font-semibold">
              {title}
            </h2>
          )}
          <button variant="ghost" size="sm" onClick={onClose} className="ml-auto h-8 w-8 p-0 hover:cursor-pointer" aria-label="Close modal">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">{children}</div>
      </div>
    </div>
  ), document.getElementById("modal-portal"))

}

export default Modal