'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface Toast {
  id: number;
  title: string;
  description?: string;
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = toastId++;
    setToasts((prev) => [...prev, { ...toast, id }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000); // авто-скрытие через 4 сек
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Контейнер для всех уведомлений */}
      <div className="fixed top-5 right-5 flex flex-col gap-2 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-gray-800 text-white p-3 rounded-lg shadow-lg border-l-4 border-orange-500 animate-fade-in"
          >
            <p className="font-semibold">{toast.title}</p>
            {toast.description && <p className="text-sm">{toast.description}</p>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
