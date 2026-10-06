import React from 'react';
import { RoadEdge, AlgorithmResult } from '../algorithms/types';
import { 
  Activity, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  TrendingDown, 
  CheckCircle2, 
  Car, 
  Flame, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface CityDashboardProps {
  edges: RoadEdge[];
  activeResult: AlgorithmResult | null;
  staticResult: AlgorithmResult | null;
  onToggleRoadTraffic: (edgeId: string) => void;
  isEmergencyMode: boolean;
}

export const CityDashboard: React.FC<CityDashboardProps> = ({
  edges,
  activeResult,
  staticResult,
  onToggleRoadTraffic,
  isEmergencyMode,
}) => {
  const totalRoads = edges.length;
  const activeRoads = edges.filter((e) => e.traffic !== 'blocked').length;
  const heavyRoads = edges.filter((e) => e.traffic === 'heavy');
  const mediumRoads = edges.filter((e) => e.traffic === 'medium');

  // Network congestion index (0 to 100)
  const congestionScore = Math.round(
    ((heavyRoads.length * 3 + mediumRoads.length * 1.5) / (totalRoads * 3)) * 100
  );

  const naiveTime = staticResult?.totalTravelTimeMin || 0;
  const smartTime = activeResult?.totalTravelTimeMin || 0;
  const timeSaved = Math.max(0, Number((naiveTime - smartTime).toFixed(1)));

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* 1. Network Congestion Level */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-lg">
        <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
          <span>Congestion Index</span>
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className={`text-xl font-black font-mono ${
            congestionScore > 50 ? 'text-rose-400' :
            congestionScore > 25 ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {congestionScore}%
          </span>
          <span className="text-[10px] text-slate-400">
            {congestionScore > 50 ? 'Heavy' : congestionScore > 25 ? 'Moderate' : 'Smooth'}
          </span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              congestionScore > 50 ? 'bg-rose-500' :
              congestionScore > 25 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${congestionScore}%` }}
          />
        </div>
      </div>

      {/* 2. Active Road Segments */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-lg">
        <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
          <span>Active Arterials</span>
          <Car className="w-3.5 h-3.5 text-blue-400" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-black font-mono text-white">{activeRoads}</span>
          <span className="text-[10px] text-slate-400">/ {totalRoads} open</span>
        </div>
        <p className="text-[10px] text-slate-500 mt-2 truncate">
          {totalRoads - activeRoads === 0 ? 'Full network operational' : `${totalRoads - activeRoads} road closures active`}
        </p>
      </div>

      {/* 3. Congested Hotspots Count */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-lg">
        <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
          <span>Gridlock Hotspots</span>
          <Flame className="w-3.5 h-3.5 text-rose-400" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-black font-mono text-rose-400">{heavyRoads.length}</span>
          <span className="text-[10px] text-slate-400">chokepoints</span>
        </div>
        <p className="text-[10px] text-slate-500 mt-2 truncate">
          {mediumRoads.length} moderate segments
        </p>
      </div>

      {/* 4. Estimated Travel Time on Optimal Route */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-lg">
        <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
          <span>Optimal Route Time</span>
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-black font-mono text-emerald-400">
            {activeResult?.totalTravelTimeMin || '--'}
          </span>
          <span className="text-[10px] text-slate-400">minutes</span>
        </div>
        <p className="text-[10px] text-slate-500 mt-2 truncate">
          Total distance: {activeResult?.totalDistanceKm || '--'} km
        </p>
      </div>

      {/* 5. Estimated Time Saved */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-lg">
        <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
          <span>Estimated Time Saved</span>
          <TrendingDown className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-black font-mono text-cyan-400">
            {timeSaved > 0 ? `+${timeSaved}` : '0.0'}
          </span>
          <span className="text-[10px] text-slate-400">min saved</span>
        </div>
        <p className="text-[10px] text-slate-500 mt-2 truncate">
          vs naive shortest distance
        </p>
      </div>

      {/* 6. Emergency Dispatch Mode Status */}
      <div className={`border rounded-xl p-3 shadow-lg transition-colors ${
        isEmergencyMode
          ? 'bg-rose-950/70 border-rose-800 text-white'
          : 'bg-slate-900/90 border border-slate-800'
      }`}>
        <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
          <span className={isEmergencyMode ? 'text-rose-300 font-bold' : ''}>Mode</span>
          <ShieldCheck className={`w-3.5 h-3.5 ${isEmergencyMode ? 'text-white' : 'text-slate-400'}`} />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className={`text-sm font-bold tracking-tight truncate ${
            isEmergencyMode ? 'text-white uppercase' : 'text-slate-200'
          }`}>
            {isEmergencyMode ? '🚨 EMERGENCY' : 'Standard Civil'}
          </span>
        </div>
        <p className={`text-[10px] mt-2 truncate ${isEmergencyMode ? 'text-rose-200' : 'text-slate-500'}`}>
          {isEmergencyMode ? 'Emergency corridors prioritized' : 'Live traffic optimization'}
        </p>
      </div>
    </div>
  );
};
