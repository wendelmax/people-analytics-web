import React, { useState, useRef, useEffect } from 'react';

interface PopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export const Popover: React.FC<PopoverProps> = ({
  trigger,
  content,
  position = 'bottom',
  align = 'center',
  onOpenChange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && triggerRef.current && popoverRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      let top = 0;
      let left = 0;

      switch (position) {
        case 'top':
          top = triggerRect.top + scrollY - popoverRect.height - 8;
          break;
        case 'bottom':
          top = triggerRect.bottom + scrollY + 8;
          break;
        case 'left':
          top = triggerRect.top + scrollY + triggerRect.height / 2 - popoverRect.height / 2;
          left = triggerRect.left + scrollX - popoverRect.width - 8;
          break;
        case 'right':
          top = triggerRect.top + scrollY + triggerRect.height / 2 - popoverRect.height / 2;
          left = triggerRect.right + scrollX + 8;
          break;
      }

      switch (align) {
        case 'start':
          left = triggerRect.left + scrollX;
          break;
        case 'center':
          if (position === 'top' || position === 'bottom') {
            left = triggerRect.left + scrollX + triggerRect.width / 2 - popoverRect.width / 2;
          }
          break;
        case 'end':
          left = triggerRect.right + scrollX - popoverRect.width;
          break;
      }

      popoverRef.current.style.top = `${top}px`;
      popoverRef.current.style.left = `${left}px`;
    }
  }, [isOpen, position, align]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        triggerRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        onOpenChange?.(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onOpenChange]);

  const togglePopover = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onOpenChange?.(newState);
  };

  return (
    <>
      <div ref={triggerRef} onClick={togglePopover} className="inline-block">
        {trigger}
      </div>
      {isOpen && (
        <div
          ref={popoverRef}
          className={`fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg ${className}`}
        >
          {content}
        </div>
      )}
    </>
  );
};

