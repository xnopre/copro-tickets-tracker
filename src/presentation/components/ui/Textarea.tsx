import { TextareaHTMLAttributes, forwardRef, useId } from 'react';
import clsx from 'clsx';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', id, required, ...props }, ref) => {
    const textareaId = id || useId();

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="mb-2 block text-sm font-medium text-gray-700">
            {label}
            {required && <span aria-label="requis"> *</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={clsx(
            'w-full rounded-md border px-3 py-2',
            'focus:ring-2 focus:outline-none',
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-transparent focus:ring-blue-500',
            'disabled:cursor-not-allowed disabled:bg-gray-100',
            className
          )}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
          }
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${textareaId}-helper`} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
