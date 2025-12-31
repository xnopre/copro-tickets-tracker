import { InputHTMLAttributes, forwardRef, useId } from 'react';
import clsx from 'clsx';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const checkboxId = id || useId();

    return (
      <div className="flex items-start">
        <div className="flex h-5 items-center">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={clsx(
              'h-4 w-4 rounded border-gray-300 text-blue-600',
              'focus:ring-2 focus:ring-blue-500 focus:ring-offset-0',
              'disabled:cursor-not-allowed disabled:bg-gray-100',
              error && 'border-red-300',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${checkboxId}-error` : helperText ? `${checkboxId}-helper` : undefined
            }
            {...props}
          />
        </div>
        {label && (
          <div className="ml-3 flex-1">
            <label htmlFor={checkboxId} className="text-sm font-medium text-gray-700">
              {label}
            </label>
            {error && (
              <p id={`${checkboxId}-error`} className="mt-1 text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
            {helperText && !error && (
              <p id={`${checkboxId}-helper`} className="mt-1 text-sm text-gray-500">
                {helperText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
