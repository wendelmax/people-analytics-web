import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  title: string;
  type: 'employee' | 'project' | 'department' | 'training' | 'goal';
  path: string;
}

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  showShortcut?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Buscar...',
  className = '',
  showShortcut = true,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }

      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }

      if (isOpen && results.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
          e.preventDefault();
          handleResultClick(results[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    onSearch?.(searchQuery);

    if (searchQuery.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsOpen(true);

    const mockResults: SearchResult[] = [
      {
        id: '1',
        title: `Funcionário: ${searchQuery}`,
        type: 'employee',
        path: '/employees/1',
      },
      {
        id: '2',
        title: `Projeto: ${searchQuery}`,
        type: 'project',
        path: '/projects/1',
      },
    ];

    setResults(mockResults);
  };

  const handleResultClick = (result: SearchResult) => {
    navigate(result.path);
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(-1);
  };

  const getTypeIcon = (type: SearchResult['type']) => {
    const icons = {
      employee: '👤',
      project: '📁',
      department: '🏢',
      training: '📚',
      goal: '🎯',
    };
    return icons[type] || '📄';
  };

  const getTypeLabel = (type: SearchResult['type']) => {
    const labels = {
      employee: 'Funcionário',
      project: 'Projeto',
      department: 'Departamento',
      training: 'Treinamento',
      goal: 'Meta',
    };
    return labels[type] || 'Item';
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-20 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          🔍
        </div>
        {showShortcut && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1 text-xs text-gray-400">
            <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300">Ctrl</kbd>
            <span>+</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300">K</kbd>
          </div>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {results.map((result, index) => (
            <button
              key={result.id}
              onClick={() => handleResultClick(result)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors ${
                index === selectedIndex ? 'bg-blue-50' : ''
              }`}
            >
              <span className="text-xl">{getTypeIcon(result.type)}</span>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{result.title}</p>
                <p className="text-sm text-gray-500">{getTypeLabel(result.type)}</p>
              </div>
              <span className="text-xs text-gray-400">Enter</span>
            </button>
          ))}
        </div>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
          Nenhum resultado encontrado
        </div>
      )}
    </div>
  );
};

