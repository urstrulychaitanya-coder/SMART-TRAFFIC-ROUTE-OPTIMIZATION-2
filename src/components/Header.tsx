import React from 'react';
import { 
  Activity, 
  Siren, 
  BookOpen, 
  RotateCcw, 
  Layers, 
  Cpu, 
  MapPin, 
  Clock 
} from 'lucide-react';

interface HeaderProps {
  isEmergencyMode: boolean;
  onToggleEmergency: () => void;
  onOpenDAAModal: () => void;
  onResetGraph: () => void;
  networkCongestionIndex: number;
  activeRoadsCount: number;
  totalRoadsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  isEmergencyMode,
  onToggleEmergency,
  onOpenDAAModal,
  onResetGraph,
  networkCongestionIndex,
  activeRoadsCount,
  totalRoadsCount,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-4 py-3 lg:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Branding & Subtitle */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-white">
                Smart Traffic Route Optimization
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-cyan-400 font-semibold">“From Shortest Path to Smartest Path”</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>DAA Hackathon Edition</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Graph Theory & Heuristics</span>
            </div>
          </div>
        </div>

        {/* Center: Live Control Room Metrics */}
        <div className="hidden lg:flex items-center gap-6 text-xs text-slate-300 bg-slate-900/90 border border-slate-800/80 rounded-lg px-4 py-1.5">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Network Congestion:</span>
            <span className={`font-mono font-bold ${
              networkCongestionIndex > 50 ? 'text-rose-400' :
              networkCongestionIndex > 25 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {networkCongestionIndex}%
            </span>
            <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  networkCongestionIndex > 50 ? 'bg-rose-500' :
                  networkCongestionIndex > 25 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, networkCongestionIndex)}%` }}
              />
            </div>
          </div>

          <div className="h-3 w-px bg-slate-800" />

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Arterials Open:</span>
            <span className="font-mono font-medium text-slate-200">
              {activeRoadsCount}/{totalRoadsCount}
            </span>
          </div>
        </div>

        {/* Right: Actions & Emergency Switch */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Emergency Vehicle Toggle */}
          <button
            onClick={onToggleEmergency}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border ${
              isEmergencyMode
                ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-900/40 animate-pulse'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700/70 hover:text-white'
            }`}
            title="Enable Priority Dispatch for Ambulances and Emergency Units"
          >
            <Siren className={`w-3.5 h-3.5 ${isEmergencyMode ? 'text-white' : 'text-rose-400'}`} />
            <span>Emergency Mode</span>
            {isEmergencyMode && (
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            )}
          </button>

          {/* DAA Analysis Modal Trigger */}
          <button
            onClick={onOpenDAAModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-950/70 hover:bg-cyan-900/90 text-cyan-300 border border-cyan-800/80 transition-all hover:border-cyan-600 shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Algorithm Analysis</span>
            <span className="sm:hidden">DAA</span>
          </button>

          {/* Reset Graph */}
          <button
            onClick={onResetGraph}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
            title="Reset City Road Conditions to Default"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
