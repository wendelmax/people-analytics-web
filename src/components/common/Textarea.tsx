import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCount?: boolean;
  maxLength?: number;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  showCount = false,
  maxLength,
  className = '',
  id,
  value,
  ...props
}) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${textareaId}-error` : undefined;
  const helperId = helperText ? `${textareaId}-helper` : undefined;

  const currentLength = typeof value === 'string' ? value.length : 0;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors resize-y ${
          error ? 'border-error-500 focus:ring-error-500' : 'border-gray-300'
        } ${className}`}
        aria-invalid={!!error}
        aria-describedby={errorId || helperId}
        maxLength={maxLength}
        value={value}
        {...props}
      />
      <div className="flex items-center justify-between mt-1">
        <div>
          {error && (
            <p id={errorId} className="text-sm text-error-600" role="alert">
              {error}
            </p>
          )}
          {!error && helperText && (
            <p id={helperId} className="text-sm text-gray-500">
              {helperText}
            </p>
          )}
        </div>
        {showCount && maxLength && (
          <span
            className={`text-xs ${
              currentLength >= maxLength ? 'text-error-600' : 'text-gray-500'
            }`}
          >
            {currentLength}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

