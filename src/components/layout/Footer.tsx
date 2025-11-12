import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} People Analytics. Todos os direitos reservados.
          </p>
          <p className="text-sm text-gray-600">Versão 0.1.0</p>
        </div>
      </div>
    </footer>
  );
};

