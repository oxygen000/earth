// src/components/ui/toast.tsx

import * as React from "react";

export type ToastActionElement = React.ReactNode;

export interface ToastProps {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// src/components/ui/toast.tsx
export const Toast = ({ id, title, description, action, open }: ToastProps) => {
  return (
    <div className={`toast ${open ? 'open' : ''}`} id={id}>
      <div className="toast-header">
        <strong>{title}</strong>
        {action && <div className="toast-action">{action}</div>}
      </div>
      <div className="toast-body">{description}</div>
    </div>
  );
};


export interface ToastProps {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: "default" | "destructive" | "success" | "info"; // إضافة خاصية variant
}


