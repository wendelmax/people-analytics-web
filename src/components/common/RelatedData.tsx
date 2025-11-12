import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './Card';
import { Button } from './Button';

interface RelatedItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  route: string;
  badge?: string | number;
}

interface RelatedDataProps {
  title: string;
  items: RelatedItem[];
  emptyMessage?: string;
  onViewAll?: () => void;
  viewAllRoute?: string;
  maxItems?: number;
}

export const RelatedData: React.FC<RelatedDataProps> = ({
  title,
  items,
  emptyMessage = 'Nenhum item relacionado',
  onViewAll,
  viewAllRoute,
  maxItems = 5,
}) => {
  const navigate = useNavigate();

  const displayItems = items.slice(0, maxItems);

  if (items.length === 0) {
    return (
      <Card>
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>
          <p className="text-sm text-gray-500">{emptyMessage}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          {(onViewAll || viewAllRoute) && items.length > maxItems && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (viewAllRoute) {
                  navigate(viewAllRoute);
                } else if (onViewAll) {
                  onViewAll();
                }
              }}
            >
              Ver Todos ({items.length})
            </Button>
          )}
        </div>
        <div className="space-y-2">
          {displayItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.route)}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left group"
            >
              <span className="text-xl">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 truncate">
                  {item.title}
                </p>
                {item.subtitle && (
                  <p className="text-xs text-gray-500 truncate">{item.subtitle}</p>
                )}
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {item.badge}
                </span>
              )}
              <svg
                className="h-4 w-4 text-gray-400 group-hover:text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
};

