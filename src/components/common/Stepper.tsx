import React from 'react';

interface Step {
  id: string;
  label: string;
  description?: string;
  completed?: boolean;
  active?: boolean;
  disabled?: boolean;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  orientation = 'horizontal',
  className = '',
}) => {
  const getStepStatus = (index: number) => {
    if (steps[index].disabled) return 'disabled';
    if (steps[index].completed) return 'completed';
    if (index === currentStep) return 'active';
    if (index < currentStep) return 'completed';
    return 'pending';
  };

  if (orientation === 'vertical') {
    return (
      <div className={`space-y-4 ${className}`}>
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isClickable = onStepClick && !step.disabled;

          return (
            <div key={step.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => isClickable && onStepClick(index)}
                  disabled={step.disabled || !isClickable}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    status === 'completed'
                      ? 'bg-green-500 text-white'
                      : status === 'active'
                      ? 'bg-blue-500 text-white ring-4 ring-blue-100'
                      : status === 'disabled'
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-600'
                  } ${isClickable ? 'cursor-pointer hover:opacity-80' : ''}`}
                >
                  {status === 'completed' ? '✓' : index + 1}
                </button>
                {index < steps.length - 1 && (
                  <div
                    className={`w-0.5 h-12 mt-2 ${
                      status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
              <div className="flex-1 pb-8">
                <button
                  onClick={() => isClickable && onStepClick(index)}
                  disabled={step.disabled || !isClickable}
                  className={`text-left ${
                    isClickable ? 'cursor-pointer' : 'cursor-default'
                  } ${step.disabled ? 'opacity-50' : ''}`}
                >
                  <h4
                    className={`font-semibold ${
                      status === 'active' ? 'text-blue-600' : 'text-gray-900'
                    }`}
                  >
                    {step.label}
                  </h4>
                  {step.description && (
                    <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {steps.map((step, index) => {
        const status = getStepStatus(index);
        const isClickable = onStepClick && !step.disabled;
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center flex-1">
              <button
                onClick={() => isClickable && onStepClick(index)}
                disabled={step.disabled || !isClickable}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  status === 'completed'
                    ? 'bg-green-500 text-white'
                    : status === 'active'
                    ? 'bg-blue-500 text-white ring-4 ring-blue-100'
                    : status === 'disabled'
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-600'
                } ${isClickable ? 'cursor-pointer hover:opacity-80' : ''}`}
              >
                {status === 'completed' ? '✓' : index + 1}
              </button>
              <div className="mt-2 text-center">
                <p
                  className={`text-sm font-medium ${
                    status === 'active' ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                )}
              </div>
            </div>
            {!isLast && (
              <div
                className={`flex-1 h-0.5 mx-2 ${
                  status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

