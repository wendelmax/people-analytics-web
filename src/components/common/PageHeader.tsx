import React from 'react';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  documentNumber?: string;
  showNavigation?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'outline' | 'danger';
    icon?: string;
    dropdown?: Array<{ label: string; onClick: () => void }>;
  }>;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  documentNumber,
  showNavigation = false,
  onPrevious,
  onNext,
  actions = [],
  className = '',
}) => {
  const navigate = useNavigate();

  return (
    <div className={`flex items-start justify-between mb-6 ${className}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {title}
              {documentNumber && (
                <span className="text-lg font-normal text-gray-500">({documentNumber})</span>
              )}
            </h1>
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
          </div>
          {showNavigation && (
            <div className="flex items-center gap-1 ml-4">
              <button
                onClick={onPrevious}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
                aria-label="Previous"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={onNext}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
                aria-label="Next"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {actions.length > 0 && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {actions.map((action, index) => (
            <div key={index} className="relative">
              {action.dropdown ? (
                <div className="relative group">
                  <Button
                    variant={action.variant || 'outline'}
                    onClick={action.onClick}
                    className="flex items-center gap-1"
                  >
                    {action.icon && <span>{action.icon}</span>}
                    {action.label}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Button>
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    {action.dropdown.map((item, itemIndex) => (
                      <button
                        key={itemIndex}
                        onClick={(e) => {
                          e.stopPropagation();
                          item.onClick();
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <Button
                  variant={action.variant || 'outline'}
                  onClick={action.onClick}
                  className="flex items-center gap-1"
                >
                  {action.icon && <span>{action.icon}</span>}
                  {action.label}
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

