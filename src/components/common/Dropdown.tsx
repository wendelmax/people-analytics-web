import React, { useState, useRef, useEffect, ReactNode } from 'react';

interface DropdownItem {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  divider?: boolean;
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  position?: 'left' | 'right' | 'top' | 'bottom';
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  position = 'bottom',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsOpen(false);
        }
      };
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen]);

  const positionStyles = {
    bottom: 'top-full left-0 mt-1',
    top: 'bottom-full left-0 mb-1',
    right: 'top-0 left-full ml-1',
    left: 'top-0 right-full mr-1',
  };

  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled) {
      item.onClick();
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          className={`absolute z-50 min-w-[200px] bg-white rounded-lg shadow-lg border border-gray-200 py-1 ${positionStyles[position]}`}
          role="menu"
          aria-orientation="vertical"
        >
          {items.map((item, index) => {
            if (item.divider) {
              return <div key={`divider-${index}`} className="border-t border-gray-200 my-1" />;
            }

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
                className={`
                  w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100
                  transition-colors flex items-center gap-2
                  ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                role="menuitem"
              >
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

