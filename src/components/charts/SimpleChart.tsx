import React from 'react';
import { Card } from '../common/Card';

interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface SimpleChartProps {
  title?: string;
  data: ChartDataPoint[];
  type: 'bar' | 'line' | 'pie';
  height?: number;
  showLegend?: boolean;
  showValues?: boolean;
}

export const SimpleChart: React.FC<SimpleChartProps> = ({
  title,
  data,
  type,
  height = 300,
  showLegend = true,
  showValues = true,
}) => {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  const renderBarChart = () => {
    return (
      <div className="flex items-end justify-between gap-2 h-full">
        {data.map((point, index) => {
          const percentage = (point.value / maxValue) * 100;
          const color = point.color || `hsl(${(index * 360) / data.length}, 70%, 50%)`;

          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              {showValues && (
                <span className="text-xs font-semibold text-gray-700">{point.value}</span>
              )}
              <div
                className="w-full rounded-t transition-all hover:opacity-80"
                style={{
                  height: `${percentage}%`,
                  backgroundColor: color,
                  minHeight: point.value > 0 ? '4px' : '0',
                }}
                title={`${point.label}: ${point.value}`}
              />
              <span className="text-xs text-gray-600 text-center">{point.label}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderLineChart = () => {
    const points = data.map((point, index) => {
      const x = (index / (data.length - 1 || 1)) * 100;
      const y = 100 - (point.value / maxValue) * 100;
      return { x, y, ...point };
    });

    const pathData = points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ');

    return (
      <div className="relative w-full h-full">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
            </linearGradient>
          </defs>
          <path
            d={`${pathData} L 100 100 L 0 100 Z`}
            fill="url(#lineGradient)"
            opacity="0.3"
          />
          <path
            d={pathData}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="2"
              fill="#3b82f6"
              className="hover:r-3 transition-all"
            >
              <title>{`${point.label}: ${point.value}`}</title>
            </circle>
          ))}
        </svg>
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-600">
          {data.map((point, index) => (
            <span key={index}>{point.label}</span>
          ))}
        </div>
      </div>
    );
  };

  const renderPieChart = () => {
    let currentAngle = -90;
    const total = data.reduce((sum, d) => sum + d.value, 0);

    // Se não há dados ou todos são zero, mostrar gráfico vazio
    if (total === 0 || data.length === 0) {
      return (
        <div className="flex items-center justify-center gap-8">
          <svg width={height} height={height} viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="#f3f4f6"
              stroke="#d1d5db"
              strokeWidth="2"
            />
            <text
              x="100"
              y="105"
              textAnchor="middle"
              fill="#6b7280"
              fontSize="12"
            >
              Sem dados
            </text>
          </svg>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center gap-8">
        <svg width={height} height={height} viewBox="0 0 200 200">
          {data.map((point, index) => {
            const percentage = (point.value / total) * 100;
            const angle = (percentage / 100) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;

            // Verificar se os valores são válidos (não NaN)
            const x1 = isNaN(startAngle) ? 100 : 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
            const y1 = isNaN(startAngle) ? 100 : 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
            const x2 = isNaN(endAngle) ? 100 : 100 + 80 * Math.cos((endAngle * Math.PI) / 180);
            const y2 = isNaN(endAngle) ? 100 : 100 + 80 * Math.sin((endAngle * Math.PI) / 180);

            const largeArc = angle > 180 ? 1 : 0;

            const pathData = [
              `M 100 100`,
              `L ${x1} ${y1}`,
              `A 80 80 0 ${largeArc} 1 ${x2} ${y2}`,
              `Z`,
            ].join(' ');

            const color = point.color || `hsl(${(index * 360) / data.length}, 70%, 50%)`;
            currentAngle = endAngle;

            return (
              <path
                key={index}
                d={pathData}
                fill={color}
                stroke="white"
                strokeWidth="2"
                className="hover:opacity-80 transition-opacity cursor-pointer"
              >
                <title>{`${point.label}: ${point.value} (${percentage.toFixed(1)}%)`}</title>
              </path>
            );
          })}
          {showValues && (
            <text x="100" y="100" textAnchor="middle" dominantBaseline="middle" className="text-lg font-bold fill-gray-700">
              {total}
            </text>
          )}
        </svg>

        {showLegend && (
          <div className="space-y-2">
            {data.map((point, index) => {
              const percentage = ((point.value / total) * 100).toFixed(1);
              const color = point.color || `hsl(${(index * 360) / data.length}, 70%, 50%)`;

              return (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm text-gray-700">
                    {point.label}: {point.value} ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <div className="p-6">
        {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
        <div style={{ height: `${height}px` }}>
          {type === 'bar' && renderBarChart()}
          {type === 'line' && renderLineChart()}
          {type === 'pie' && renderPieChart()}
        </div>
      </div>
    </Card>
  );
};

