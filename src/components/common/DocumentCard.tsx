import React from 'react';
import { Card } from './Card';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface DocumentCardProps {
  title: string;
  documentNumber?: string;
  amount?: number;
  currency?: string;
  status?: string;
  date?: string;
  icon?: string;
  onClick?: () => void;
  onDetailsClick?: () => void;
  className?: string;
  metadata?: Array<{ label: string; value: string }>;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  title,
  documentNumber,
  amount,
  currency = 'BRL',
  status,
  date,
  icon = '📄',
  onClick,
  onDetailsClick,
  className = '',
  metadata = [],
}) => {
  const getStatusColor = (status?: string) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    const statusLower = status.toLowerCase();
    if (statusLower.includes('open') || statusLower.includes('pending')) {
      return 'bg-blue-100 text-blue-800';
    }
    if (statusLower.includes('approved') || statusLower.includes('completed')) {
      return 'bg-green-100 text-green-800';
    }
    if (statusLower.includes('rejected') || statusLower.includes('cancelled')) {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <Card
      className={`cursor-pointer hover:shadow-lg transition-all ${className}`}
      onClick={onClick}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="text-3xl flex-shrink-0">{icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-gray-900 truncate">{title}</h3>
                {documentNumber && (
                  <span className="text-xs text-gray-500 flex-shrink-0">{documentNumber}</span>
                )}
              </div>
              {date && (
                <p className="text-xs text-gray-500 mt-1">{formatDate(date)}</p>
              )}
            </div>
          </div>
          {status && (
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${getStatusColor(
                status
              )}`}
            >
              {status}
            </span>
          )}
        </div>

        {amount !== undefined && (
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(amount)} {currency}
            </span>
          </div>
        )}

        {metadata.length > 0 && (
          <div className="space-y-1 pt-2 border-t border-gray-100">
            {metadata.map((item, index) => (
              <div key={index} className="flex justify-between text-xs">
                <span className="text-gray-500">{item.label}:</span>
                <span className="text-gray-900 font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {onDetailsClick && (
          <div className="pt-2 border-t border-gray-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDetailsClick();
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Details →
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};

