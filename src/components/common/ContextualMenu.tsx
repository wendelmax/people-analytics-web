import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModuleId, getModuleConfig } from '../../types/modules';

interface ContextualMenuItem {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  module?: ModuleId;
  divider?: boolean;
  danger?: boolean;
}

interface ContextualMenuProps {
  items: ContextualMenuItem[];
  trigger: React.ReactNode;
  position?: 'bottom' | 'top' | 'left' | 'right';
  align?: 'start' | 'end' | 'center';
}

export const ContextualMenu: React.FC<ContextualMenuProps> = ({
  items,
  trigger,
  position = 'bottom',
  align = 'end',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const positionClasses = {
    bottom: 'top-full mt-1',
    top: 'bottom-full mb-1',
    left: 'right-full mr-1',
    right: 'left-full ml-1',
  };

  const alignClasses = {
    start: 'left-0',
    end: 'right-0',
    center: 'left-1/2 transform -translate-x-1/2',
  };

  return (
    <div className="relative">
      <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {isOpen && (
        <div
          ref={menuRef}
          className={`absolute z-50 ${positionClasses[position]} ${alignClasses[align]} w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-1`}
        >
          {items.map((item, index) => {
            if (item.divider) {
              return <hr key={`divider-${index}`} className="my-1 border-gray-200" />;
            }

            const module = item.module ? getModuleConfig(item.module) : null;

            return (
              <button
                key={item.id}
                onClick={() => {
                  item.action();
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left transition-colors ${
                  item.danger
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {module && (
                  <span className="text-xs text-gray-400">({module.name})</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

