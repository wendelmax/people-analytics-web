import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}) => {
  const baseStyles = 'bg-gray-200 rounded';

  const variantStyles = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
  };

  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse',
    none: '',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${animationStyles[animation]} ${className}`}
      style={style}
      aria-busy="true"
      aria-live="polite"
    />
  );
};

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className = '',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          width={index === lines - 1 ? '75%' : '100%'}
          height="1rem"
        />
      ))}
    </div>
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <Skeleton variant="circular" width={40} height={40} className="mb-4" />
      <SkeletonText lines={3} />
    </div>
  );
};

export const SkeletonTable: React.FC<{ rows?: number; cols?: number; className?: string }> = ({
  rows = 5,
  cols = 4,
  className = '',
}) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <div className="min-w-full divide-y divide-gray-200">
        <div className="bg-gray-50 flex space-x-4 p-4">
          {Array.from({ length: cols }).map((_, index) => (
            <Skeleton key={index} variant="text" width="100%" height="1rem" />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex space-x-4 p-4">
            {Array.from({ length: cols }).map((_, colIndex) => (
              <Skeleton key={colIndex} variant="text" width="100%" height="1rem" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

