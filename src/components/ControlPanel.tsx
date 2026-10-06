import React from 'react';
import { 
  CityNode, 
  RoadEdge, 
  AlgorithmType, 
  RoutingMode 
} from '../algorithms/types';
import { 
  Shuffle, 
  ArrowRightLeft, 
  Flame, 
  Play, 
  Gauge, 
  Layers, 
  Compass, 
  Sparkles,
  Zap,
  TrendingDown,
  ShieldAlert
} from 'lucide-react';

interface ControlPanelProps {
  nodes: CityNode[];
  edges: RoadEdge[];
  sourceId: string;
  targetId: string;
  onSourceChange: (id: string) => void;
  onTargetChange: (id: string) => void;
  onSwapEndpoints: () => void;
  selectedAlgorithm: AlgorithmType;
  onSelectAlgorithm: (algo: AlgorithmType) => void;
  onSimulateTraffic: () => void;
  onCongestCurrentRouteRoad: () => void;
  onClearCongestion: () => void;
  onRunAlgorithm: () => void;
  isEmergencyMode: boolean;
  onToggleEmergency: () => void;
  showNaiveOverlay: boolean;
  onToggleNaiveOverlay: () => void;
  onLoadPreset: (source: string, target: string, emergency?: boolean) => void;
  isVisualizerRunning: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  nodes,
  sourceId,
  targetId,
  onSourceChange,
  onTargetChange,
  onSwapEndpoints,
  selectedAlgorithm,
  onSelectAlgorithm,
  onSimulateTraffic,
  onCongestCurrentRouteRoad,
  onClearCongestion,
  onRunAlgorithm,
  isEmergencyMode,
  onToggleEmergency,
  showNaiveOverlay,
  onToggleNaiveOverlay,
  onLoadPreset,
  isVisualizerRunning,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-5 shadow-xl flex flex-col gap-4">
      {/* 1. Endpoint Selectors */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Route Endpoints
          </span>
          <button
            onClick={onSwapEndpoints}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            title="Swap Source and Destination"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Swap</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Source Dropdown */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 focus-within:border-emerald-500/70 transition-colors">
            <label className="block text-[11px] text-emerald-400 font-semibold mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Source Intersection (Start)
            </label>
            <select
              value={sourceId}
              onChange={(e) => onSourceChange(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-100 font-medium focus:outline-none cursor-pointer"
            >
              {nodes.map((node) => (
                <option key={`src_${node.id}`} value={node.id} className="bg-slate-900 text-slate-100">
                  {node.shortName} ({node.name.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Destination Dropdown */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 focus-within:border-purple-500/70 transition-colors">
            <label className="block text-[11px] text-purple-400 font-semibold mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              Target Destination (Goal)
            </label>
            <select
              value={targetId}
              onChange={(e) => onTargetChange(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-100 font-medium focus:outline-none cursor-pointer"
            >
              {nodes.map((node) => (
                <option key={`dst_${node.id}`} value={node.id} className="bg-slate-900 text-slate-100">
                  {node.shortName} ({node.name.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Hackathon Quick Demo Presets */}
      <div>
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Hackathon Demo Scenarios</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
          <button
            onClick={() => onLoadPreset('hospital', 'airport', false)}
            className="py-1.5 px-2 bg-slate-950/70 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 rounded-lg text-slate-300 hover:text-white transition-all text-left truncate"
            title="Hospital to Airport arterial test"
          >
            🏥 Hospital ➔ ✈️ Airport
          </button>
          <button
            onClick={() => onLoadPreset('residential_north', 'downtown', false)}
            className="py-1.5 px-2 bg-slate-950/70 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 rounded-lg text-slate-300 hover:text-white transition-all text-left truncate"
            title="Residential North to Downtown commuter rush"
          >
            🏡 North ➔ 🏙️ Downtown
          </button>
          <button
            onClick={() => onLoadPreset('station', 'tech_park', false)}
            className="py-1.5 px-2 bg-slate-950/70 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 rounded-lg text-slate-300 hover:text-white transition-all text-left truncate"
            title="Railway Station to Cyber Tech Park"
          >
            🚆 Station ➔ 💻 Tech Park
          </button>
          <button
            onClick={() => onLoadPreset('residential_south', 'hospital', true)}
            className="py-1.5 px-2 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/60 rounded-lg text-rose-300 hover:text-white transition-all text-left truncate"
            title="Emergency Trauma Ambulance Route"
          >
            🚨 Trauma ➔ 🏥 Hospital
          </button>
        </div>
      </div>

      {/* 3. Algorithm Selection Segmented Control */}
      <div>
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
          Primary Routing Algorithm
        </span>
        <div className="grid grid-cols-2 gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => onSelectAlgorithm('dijkstra')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              selectedAlgorithm === 'dijkstra'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Dijkstra’s Algorithm</span>
          </button>
          <button
            onClick={() => onSelectAlgorithm('astar')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              selectedAlgorithm === 'astar'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>A* Algorithm (Heuristic)</span>
          </button>
        </div>
      </div>

      {/* 4. Traffic Manipulation & Execution Triggers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
        <button
          onClick={onSimulateTraffic}
          className="flex items-center justify-center gap-2 py-2.5 px-3 bg-amber-950/50 hover:bg-amber-900/60 border border-amber-800/70 text-amber-300 hover:text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
          title="Randomly perturb city road congestion to simulate real-time traffic flux"
        >
          <Shuffle className="w-3.5 h-3.5 text-amber-400" />
          <span>Simulate Live Traffic</span>
        </button>

        <button
          onClick={onCongestCurrentRouteRoad}
          className="flex items-center justify-center gap-2 py-2.5 px-3 bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800/70 text-rose-300 hover:text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
          title="Inject heavy traffic spike directly into one road of the current route to force algorithm to reroute"
        >
          <Flame className="w-3.5 h-3.5 text-rose-400" />
          <span>Congest Current Route (Demo)</span>
        </button>
      </div>

      {/* 5. Execution & Visualizer Trigger */}
      <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
        <button
          onClick={onRunAlgorithm}
          disabled={isVisualizerRunning}
          className={`flex-1 w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
            isVisualizerRunning
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isVisualizerRunning ? 'Algorithm Visualizer Running...' : 'Run Step-by-Step Algorithm'}</span>
        </button>

        <button
          onClick={onClearCongestion}
          className="py-2.5 px-3 rounded-xl text-xs font-medium bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors w-full sm:w-auto"
          title="Clear all congestion and reset all roads to low traffic"
        >
          Clear Congestion
        </button>
      </div>

      {/* Sub-toggles */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showNaiveOverlay}
            onChange={onToggleNaiveOverlay}
            className="rounded border-slate-700 text-cyan-600 focus:ring-0 bg-slate-950"
          />
          <span>Show Naive Distance Baseline (Orange dashed)</span>
        </label>
        <span className="text-slate-500 font-mono text-[10px]">Auto-recalculation ON</span>
      </div>
    </div>
  );
};
