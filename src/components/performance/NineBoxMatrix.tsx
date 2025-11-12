import React from 'react';
import { Card } from '../Card';

export const NineBoxMatrix: React.FC = () => {
  const boxes = [
    { id: '1A', label: 'Enigma', color: 'bg-yellow-100', employees: 2 },
    { id: '1B', label: 'Alto Potencial', color: 'bg-green-100', employees: 5 },
    { id: '1C', label: 'Top Talent', color: 'bg-green-200', employees: 3 },
    { id: '2A', label: 'Questionável', color: 'bg-red-100', employees: 1 },
    { id: '2B', label: 'Mantenedor', color: 'bg-yellow-50', employees: 12 },
    { id: '2C', label: 'Forte Desempenho', color: 'bg-green-100', employees: 8 },
    { id: '3A', label: 'Risco', color: 'bg-red-200', employees: 1 },
    { id: '3B', label: 'Eficaz', color: 'bg-yellow-50', employees: 6 },
    { id: '3C', label: 'Especialista', color: 'bg-yellow-100', employees: 4 },
  ];

  return (
    <Card className="h-full">
      <div className="p-6 h-full flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Matriz 9-Box (OPR)</h3>
        
        <div className="flex-1 relative">
          {/* Eixo Y Label */}
          <div className="absolute -left-8 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-bold text-gray-500 tracking-widest">
            POTENCIAL (LCM)
          </div>

          <div className="grid grid-cols-3 grid-rows-3 gap-2 h-96 w-full pl-6 pb-6">
            {boxes.map((box) => (
              <div 
                key={box.id} 
                className={`${box.color} rounded-lg p-2 flex flex-col justify-center items-center cursor-pointer hover:opacity-80 transition-opacity border border-black/5`}
              >
                <span className="font-bold text-gray-800 text-sm text-center">{box.label}</span>
                <span className="text-xs text-gray-600 mt-1">{box.employees} Pessoas</span>
              </div>
            ))}
          </div>

          {/* Eixo X Label */}
          <div className="text-center text-xs font-bold text-gray-500 tracking-widest mt-2 pl-6">
            DESEMPENHO (RESULTADOS)
          </div>
        </div>
      </div>
    </Card>
  );
};

