import React, { useState } from 'react';

interface RegionData {
  name: string;
  sales: number;
}

interface ThailandMapProps {
  data: RegionData[];
  className?: string;
}

// Simplified SVG paths for Thailand regions
const REGIONS = [
  {
    id: 'North',
    name: 'North',
    path: 'M130,20 L160,25 L180,50 L175,80 L140,90 L110,70 L100,40 Z',
    labelX: 140,
    labelY: 55
  },
  {
    id: 'North-East',
    name: 'North-East',
    path: 'M180,50 L240,50 L260,90 L250,130 L200,135 L175,80 Z',
    labelX: 220,
    labelY: 90
  },
  {
    id: 'Central',
    name: 'Central',
    path: 'M140,90 L175,80 L200,135 L190,170 L150,160 L130,120 Z',
    labelX: 165,
    labelY: 130
  },
  {
    id: 'West',
    name: 'West',
    path: 'M100,40 L110,70 L130,120 L130,170 L110,200 L90,150 L90,80 Z',
    labelX: 105,
    labelY: 120
  },
  {
    id: 'East',
    name: 'East',
    path: 'M190,170 L230,170 L240,200 L210,210 L190,190 Z',
    labelX: 215,
    labelY: 190
  },
  {
    id: 'South',
    name: 'South',
    path: 'M110,200 L130,170 L150,160 L150,190 L130,220 L130,280 L150,330 L120,350 L100,300 L100,240 Z',
    labelX: 125,
    labelY: 280
  }
];

export default function ThailandMap({ data, className }: ThailandMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // Find max sales for scaling colors
  const maxSales = Math.max(...data.map(d => d.sales));

  const getRegionColor = (regionName: string) => {
    const regionData = data.find(d => d.name === regionName);
    if (!regionData) return '#F3F4F6'; // Gray for no data

    // Calculate opacity based on sales value (0.3 to 1.0)
    const opacity = 0.3 + (regionData.sales / maxSales) * 0.7;
    return `rgba(255, 87, 34, ${opacity})`; // Orange base
  };

  const getRegionData = (regionName: string) => {
    return data.find(d => d.name === regionName);
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg 
        viewBox="0 0 300 380" 
        className="w-full h-full max-h-[400px] drop-shadow-xl filter"
        style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
      >
        {REGIONS.map((region) => {
          const regionData = getRegionData(region.name);
          const isHovered = hoveredRegion === region.name;
          
          return (
            <g 
              key={region.id}
              onMouseEnter={() => setHoveredRegion(region.name)}
              onMouseLeave={() => setHoveredRegion(null)}
              className="transition-all duration-300 cursor-pointer"
            >
              <path
                d={region.path}
                fill={getRegionColor(region.name)}
                stroke="white"
                strokeWidth="2"
                className={`transition-all duration-300 ${isHovered ? 'brightness-110 transform scale-[1.01]' : ''}`}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              />
              {/* Region Label */}
              <text
                x={region.labelX}
                y={region.labelY}
                textAnchor="middle"
                fill="white"
                fontSize="10"
                fontWeight="bold"
                className="pointer-events-none drop-shadow-md"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                {region.name}
              </text>
              
              {/* Tooltip-like overlay on hover */}
              {isHovered && regionData && (
                <foreignObject x={region.labelX - 60} y={region.labelY - 40} width="120" height="50">
                  <div className="bg-gray-900/90 text-white text-xs p-2 rounded-lg text-center shadow-lg  border border-white/10">
                    <div className="font-bold">{region.name}</div>
                    <div className="text-orange-300 font-mono">฿{(regionData.sales / 1000).toFixed(1)}k</div>
                  </div>
                </foreignObject>
              )}
            </g>
          );
        })}
      </svg>
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white/90  p-3 rounded-xl border border-gray-100 shadow-sm text-xs">
        <div className="font-bold text-gray-600 mb-2 uppercase tracking-wider">Sales Volume</div>
        <div className="flex items-center gap-2">
          <div className="w-20 h-2 rounded-full bg-gradient-to-r from-orange-100 to-orange-600"></div>
        </div>
        <div className="flex justify-between mt-1 text-[10px] text-gray-400 font-mono">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>
    </div>
  );
}
