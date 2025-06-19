import React from 'react';

interface AlertProps {
  type?: 'success' | 'error' | 'info' | 'warning' | 'confirm';
  message: string;
  onClose?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

const typeStyles = {
  success: 'border-green-500',
  error: 'border-red-500',
  info: 'border-blue-500',
  warning: 'border-yellow-500',
  confirm: 'border-red-500',
};

const iconMap = {
  success: (
    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
  ),
  error: (
    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
  ),
  info: (
    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01" /></svg>
  ),
  warning: (
    <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" /></svg>
  ),
  confirm: (
    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
  ),
};

const Alert: React.FC<AlertProps> = ({ type = 'info', message, onClose, onConfirm, onCancel, confirmText = 'Delete', cancelText = 'Cancel' }) => {
  if (type === 'confirm') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Blurred Backdrop */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-lg transition-all duration-300" />
        {/* Modal Tile */}
        <div className={`relative z-10 bg-white rounded-xl shadow-xl border-t-4 px-8 py-6 max-w-sm w-full flex flex-col items-center text-center ${typeStyles[type]}`}>
          <div className="mb-3">{iconMap[type]}</div>
          <div className="mb-6 text-lg font-medium text-gray-800">{message}</div>
          <div className="flex gap-4 w-full justify-center">
            <button
              className="px-6 py-2 rounded bg-gray-200 text-gray-700 font-semibold shadow hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              onClick={onCancel || onClose}
            >
              {cancelText}
            </button>
            <button
              className="px-6 py-2 rounded bg-red-600 text-white font-semibold shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-lg transition-all duration-300" />
      {/* Modal Tile */}
      <div className={`relative z-10 bg-white rounded-xl shadow-xl border-t-4 px-8 py-6 max-w-sm w-full flex flex-col items-center text-center ${typeStyles[type]}`}>
        <div className="mb-3">{iconMap[type]}</div>
        <div className="mb-6 text-lg font-medium text-gray-800">{message}</div>
        <button
          className="px-6 py-2 rounded bg-primary-600 text-white font-semibold shadow hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400"
          onClick={onClose}
        >
          Okay
        </button>
      </div>
    </div>
  );
};

export default Alert; 