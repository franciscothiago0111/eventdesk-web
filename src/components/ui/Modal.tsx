'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;

  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'center' | 'sheet';

  showCloseButton?: boolean;

  containerClassName?: string;
  contentClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  variant = 'center',
  showCloseButton = true,
  containerClassName,
  contentClassName,
  headerClassName,
  bodyClassName,
  footerClassName,
}: IModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') {
    return null;
  }

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  const sheetSizeClasses = {
    sm: 'md:max-w-md',
    md: 'md:max-w-lg',
    lg: 'md:max-w-2xl',
    xl: 'md:max-w-4xl',
  };

  return createPortal(
    <div
      className={cn(
        variant === 'sheet'
          ? 'fixed inset-0 z-50 flex items-end justify-center md:items-center p-0 md:p-4'
          : 'fixed inset-0 z-50 flex items-center justify-center p-4',
        containerClassName
      )}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#041332B2] backdrop-blur-[2px]" />

      {/* Content */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'relative bg-white shadow-2xl flex flex-col overflow-hidden',
          'max-h-[90vh]',
          variant === 'sheet'
            ? [
              'w-full',
              'rounded-t-[32px]',
              'rounded-b-none',
              'md:rounded-3xl',
              'min-h-[320px]',
            ]
            : ['w-full', 'rounded-3xl'],
          variant === 'sheet'
            ? sheetSizeClasses[size]
            : sizeClasses[size],
          contentClassName
        )}
      >
        {/* Mobile Handle */}
        {variant === 'sheet' && (
          <div className="md:hidden shrink-0 pt-3 pb-2">
            <div className="mx-auto h-1.5 w-12 rounded-full bg-slate-300" />
          </div>
        )}

        {/* Header */}
        {(title || showCloseButton) && (
          <div
            className={cn(
              'shrink-0 flex items-center justify-between',
              'px-5 pt-2 pb-4 md:px-6 md:pt-6',
              headerClassName
            )}
          >
            <h2 className="text-lg font-semibold text-slate-900">
              {title}
            </h2>

            {showCloseButton && (
              <button
                onClick={onClose}
                aria-label="Fechar"
                className="
                  rounded-xl
                  p-2
                  text-slate-400
                  transition-colors
                  hover:bg-slate-100
                  hover:text-slate-600
                "
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div
          className={cn(
            'flex-1 overflow-y-auto',
            'px-5 md:px-6',
            bodyClassName
          )}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className={cn(
              'shrink-0 border-t border-slate-100',
              'flex flex-row items-center gap-3',
              'px-5 py-6 pb-6 md:px-6',
              footerClassName
            )}
          >
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}