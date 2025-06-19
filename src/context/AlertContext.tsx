"use client";
import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import Alert from "@/components/Alert";

export type AlertType = "success" | "error" | "info" | "warning" | "confirm";

interface AlertState {
  open: boolean;
  message: string;
  type: AlertType;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

interface AlertContextType {
  showAlert: (message: string, type?: AlertType, autoClose?: number, onConfirm?: () => void) => void;
  showConfirm: (message: string, onConfirm: () => void, onCancel?: () => void, confirmText?: string, cancelText?: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<AlertState>({ open: false, message: "", type: "info" });

  const showAlert = useCallback((message: string, type: AlertType = "info", autoClose = 3000, onConfirm?: () => void) => {
    setAlert({ open: true, message, type, onConfirm });
    if (autoClose && type !== 'confirm') {
      setTimeout(() => setAlert((a) => ({ ...a, open: false })), autoClose);
    }
  }, []);

  const showConfirm = useCallback((message: string, onConfirm: () => void, onCancel?: () => void, confirmText = "Delete", cancelText = "Cancel") => {
    setAlert({
      open: true,
      message,
      type: "confirm",
      onConfirm,
      onCancel,
      confirmText,
      cancelText,
    });
  }, []);

  const handleClose = () => {
    setAlert((a) => ({ ...a, open: false }));
  };

  const handleConfirm = () => {
    if (alert.onConfirm) alert.onConfirm();
    setAlert((a) => ({ ...a, open: false }));
  };

  const handleCancel = () => {
    if (alert.onCancel) alert.onCancel();
    setAlert((a) => ({ ...a, open: false }));
  };

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm }}>
      {/* Alert at the top of the app */}
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center pointer-events-none">
        {alert.open && (
          <div className="pointer-events-auto w-full max-w-md">
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={handleClose}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
              confirmText={alert.confirmText}
              cancelText={alert.cancelText}
            />
          </div>
        )}
      </div>
      {children}
    </AlertContext.Provider>
  );
};

export function useAlert() {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlert must be used within an AlertProvider");
  return ctx;
} 