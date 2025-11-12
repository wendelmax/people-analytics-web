import React from 'react';

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  options: RadioOption[];
  label?: string;
  error?: string;
  helperText?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const Radio: React.FC<RadioProps> = ({
  options,
  label,
  error,
  helperText,
  orientation = 'vertical',
  className = '',
  id,
  name,
  value,
  disabled,
  onChange,
  ...props
}) => {
  const radioGroupId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${radioGroupId}-error` : undefined;
  const helperId = helperText ? `${radioGroupId}-helper` : undefined;
  const radioName = name || radioGroupId;

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      )}
      <div
        className={`flex gap-4 ${orientation === 'horizontal' ? 'flex-row' : 'flex-col'}`}
        role="radiogroup"
        aria-labelledby={label ? `${radioGroupId}-label` : undefined}
        aria-describedby={errorId || helperId}
        aria-invalid={!!error}
      >
        {options.map((option) => {
          const optionId = `${radioGroupId}-${option.value}`;
          const isChecked = value === option.value;

          return (
            <div key={option.value} className="flex items-center">
              <input
                id={optionId}
                type="radio"
                name={radioName}
                value={option.value}
                checked={isChecked}
                disabled={disabled || option.disabled}
                onChange={onChange}
                className={`h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500 transition-colors ${
                  error ? 'border-error-500' : ''
                } ${disabled || option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                aria-describedby={errorId || helperId}
                {...props}
              />
              <label
                htmlFor={optionId}
                className={`ml-2 text-sm ${
                  error ? 'text-error-600' : 'text-gray-700'
                } ${disabled || option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {option.label}
              </label>
            </div>
          );
        })}
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

