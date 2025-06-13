import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import React from 'react';

export function Toaster() {
  const { toasts, removeToast } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, dismiss, ...props }) => {
        // `dismiss` ficou de fora de `props`
        return (
          <Toast
            key={id}
            {...props}
            onOpenChange={(open) => {
              // quando o radix fechar a toast, remove do estado
              if (!open) removeToast(id);
            }}
          >
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose aria-label="Fechar" />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
