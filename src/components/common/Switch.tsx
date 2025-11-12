import React from 'react';

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Switch: React.FC<SwitchProps> = ({
  label,
  error,
  helperText,
  size = 'md',
  className = '',
  id,
  checked,
  disabled,
  ...props
}) => {
  const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${switchId}-error` : undefined;
  const helperId = helperText ? `${switchId}-helper` : undefined;

  const sizeStyles = {
    sm: {
      track: 'h-4 w-7',
      thumb: 'h-3 w-3',
      translate: 'translate-x-3',
    },
    md: {
      track: 'h-5 w-9',
      thumb: 'h-4 w-4',
      translate: 'translate-x-4',
    },
    lg: {
      track: 'h-6 w-11',
      thumb: 'h-5 w-5',
      translate: 'translate-x-5',
    },
  };

  return (
    <div className={className}>
      <div className="flex items-center">
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-labelledby={label ? `${switchId}-label` : undefined}
          aria-describedby={errorId || helperId}
          disabled={disabled}
          onClick={() => {
            if (!disabled && props.onChange) {
              const event = {
                target: { checked: !checked },
              } as React.ChangeEvent<HTMLInputElement>;
              props.onChange(event);
            }
          }}
          className={`
            relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            ${sizeStyles[size].track}
            ${
              checked
                ? 'bg-primary-600'
                : 'bg-gray-200'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input
            id={switchId}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={props.onChange}
            className="sr-only"
            aria-hidden="true"
            {...props}
          />
          <span
            className={`
              pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out
              ${sizeStyles[size].thumb}
              ${checked ? sizeStyles[size].translate : 'translate-x-0'}
            `}
          />
        </button>
        {label && (
          <label
            id={`${switchId}-label`}
            htmlFor={switchId}
            className={`ml-3 text-sm font-medium ${
              error ? 'text-error-600' : 'text-gray-700'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {label}
          </label>
        )}
      </div>
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
  );
};

