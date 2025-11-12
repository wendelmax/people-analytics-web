import React from 'react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  checked,
  disabled,
  ...props
}) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${checkboxId}-error` : undefined;
  const helperId = helperText ? `${checkboxId}-helper` : undefined;

  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          id={checkboxId}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          className={`h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 transition-colors ${
            error ? 'border-error-500' : ''
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          aria-invalid={!!error}
          aria-describedby={errorId || helperId}
          {...props}
        />
      </div>
      {label && (
        <div className="ml-3 text-sm">
          <label
            htmlFor={checkboxId}
            className={`font-medium ${
              error ? 'text-error-600' : 'text-gray-700'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {label}
          </label>
          {error && (
            <p id={errorId} className="mt-1 text-sm text-error-600" role="alert">
              {error}
            </p>
          )}
          {!error && helperText && (
            <p id={helperId} className="mt-1 text-sm text-gray-500">
              {helperText}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

