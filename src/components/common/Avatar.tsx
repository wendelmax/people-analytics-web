import React from 'react';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away' | 'busy';
  className?: string;
  onClick?: () => void;
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getStatusColor = (status?: AvatarProps['status']) => {
  switch (status) {
    case 'online':
      return 'bg-green-500';
    case 'away':
      return 'bg-yellow-500';
    case 'busy':
      return 'bg-red-500';
    case 'offline':
      return 'bg-gray-400';
    default:
      return '';
  }
};

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
};

const statusSizeClasses = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-4 h-4',
};

export const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  size = 'md',
  status,
  className = '',
  onClick,
}) => {
  const initials = getInitials(name);
  const baseClasses = `${sizeClasses[size]} rounded-full flex items-center justify-center font-semibold text-white bg-blue-500 ${
    onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
  } ${className}`;

  return (
    <div className="relative inline-block">
      {src ? (
        <img
          src={src}
          alt={name}
          className={baseClasses}
          onClick={onClick}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              const fallback = document.createElement('div');
              fallback.className = baseClasses;
              fallback.textContent = initials;
              parent.appendChild(fallback);
            }
          }}
        />
      ) : (
        <div className={baseClasses} onClick={onClick}>
          {initials}
        </div>
      )}
      {status && (
        <span
          className={`absolute bottom-0 right-0 ${statusSizeClasses[size]} ${getStatusColor(
            status
          )} border-2 border-white rounded-full`}
        />
      )}
    </div>
  );
};

