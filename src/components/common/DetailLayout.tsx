import React from 'react';
import { Tabs } from './Tabs';

interface DetailLayoutProps {
  children: React.ReactNode;
  tabs?: Array<{
    id: string;
    label: string;
    content: React.ReactNode;
    icon?: string;
  }>;
  defaultTab?: string;
  leftColumn?: React.ReactNode;
  rightColumn?: React.ReactNode;
  className?: string;
}

export const DetailLayout: React.FC<DetailLayoutProps> = ({
  children,
  tabs,
  defaultTab,
  leftColumn,
  rightColumn,
  className = '',
}) => {
  if (tabs) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Tabs tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, content: tab.content }))} defaultTab={defaultTab} />
      </div>
    );
  }

  if (leftColumn || rightColumn) {
    return (
      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${className}`}>
        {leftColumn && (
          <div className="lg:col-span-2 space-y-6">
            {leftColumn}
          </div>
        )}
        {rightColumn && (
          <div className="space-y-6">
            {rightColumn}
          </div>
        )}
        {!leftColumn && !rightColumn && children}
      </div>
    );
  }

  return <div className={className}>{children}</div>;
};

