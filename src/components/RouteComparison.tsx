import React from 'react';
import { AlgorithmResult } from '../algorithms/types';
import { 
  TrendingDown, 
  Clock, 
  MapPin, 
  Activity, 
  Cpu, 
  ShieldCheck, 
  AlertTriangle,
  ArrowRight,
  Zap,
  CheckCircle2
} from 'lucide-react';

interface RouteComparisonProps {
  staticResult: AlgorithmResult | null;
  smartDijkstraResult: AlgorithmResult | null;
  smartAStarResult: AlgorithmResult | null;
  isEmergencyMode: boolean;
}

export const RouteComparison: React.FC<RouteComparisonProps> = ({
  staticResult,
  smartDijkstraResult,
  smartAStarResult,
  isEmergencyMode,
}) => {
  if (!smartDijkstraResult || !staticResult) return null;

  const naiveTime = staticResult.totalTravelTimeMin;
  const smartTime = smartDijkstraResult.totalTravelTimeMin;
  const timeSaved = Math.max(0, Number((naiveTime - smartTime).toFixed(1)));
  const percentSaved = naiveTime > 0 ? Math.round((timeSaved / naiveTime) * 100) : 0;

  const naiveDist = staticResult.totalDistanceKm;
  const smartDist = smartDijkstraResult.totalDistanceKm;
  const distDiff = Number((smartDist - naiveDist).toFixed(1));

  const astarNodes = smartAStarResult?.nodesExplored || 0;
  const dijkstraNodes = smartDijkstraResult.nodesExplored;
  const nodesSpared = Math.max(0, dijkstraNodes - astarNodes);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-5 shadow-xl flex flex-col gap-4">
      {/* Time Saved Hero Callout */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
        timeSaved > 0
          ? 'bg-gradient-to-r from-emerald-950/60 to-cyan-950/40 border-emerald-800/80'
          : 'bg-slate-950/60 border-slate-800'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
                {isEmergencyMode ? '🚨 Emergency Dispatch Optimization' : 'Algorithmic Optimization Gain'}
              </span>
            </div>
            <p className="text-xl md:text-2xl font-black text-white">
              {timeSaved > 0 ? (
                <>
                  <span className="text-emerald-400 font-mono">+{timeSaved} min</span> saved ({percentSaved}% faster)
                </>
              ) : (
                <span className="text-slate-300">Current baseline is already optimal</span>
              )}
            </p>
          </div>
        </div>

        {/* Node Pruning Callout (A* vs Dijkstra) */}
        {smartAStarResult && nodesSpared > 0 && (
          <div className="text-right self-end sm:self-auto bg-slate-900/80 px-3 py-1.5 rounded-lg border border-cyan-800/60">
            <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1 justify-end">
              <Zap className="w-3 h-3 text-amber-300" />
              <span>A* Search Efficiency</span>
            </div>
            <div className="text-xs text-slate-200">
              Examined <strong className="text-amber-300 font-mono">{nodesSpared} fewer</strong> nodes than Dijkstra
            </div>
          </div>
        )}
      </div>

      {/* Side-by-Side Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
              <th className="py-2.5 px-3">Routing Metric</th>
              <th className="py-2.5 px-3 text-amber-400">
                Current Naive Route
                <span className="block text-[10px] text-slate-500 font-normal lowercase">shortest distance only</span>
              </th>
              <th className="py-2.5 px-3 text-cyan-400">
                Optimized Route (Dijkstra)
                <span className="block text-[10px] text-slate-500 font-normal lowercase">traffic congestion aware</span>
              </th>
              {smartAStarResult && (
                <th className="py-2.5 px-3 text-purple-400">
                  A* Heuristic Route
                  <span className="block text-[10px] text-slate-500 font-normal lowercase">directed f(n)=g+h</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {/* Travel Time */}
            <tr className="hover:bg-slate-800/30">
              <td className="py-3 px-3 font-semibold text-slate-300 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Estimated Travel Time</span>
              </td>
              <td className="py-3 px-3 font-mono text-rose-300 font-bold text-sm">
                {staticResult.totalTravelTimeMin} min
              </td>
              <td className="py-3 px-3 font-mono text-emerald-400 font-bold text-sm">
                {smartDijkstraResult.totalTravelTimeMin} min
              </td>
              {smartAStarResult && (
                <td className="py-3 px-3 font-mono text-purple-300 font-bold text-sm">
                  {smartAStarResult.totalTravelTimeMin} min
                </td>
              )}
            </tr>

            {/* Total Distance */}
            <tr className="hover:bg-slate-800/30">
              <td className="py-3 px-3 font-semibold text-slate-300 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>Physical Road Distance</span>
              </td>
              <td className="py-3 px-3 font-mono text-slate-300">
                {staticResult.totalDistanceKm} km
              </td>
              <td className="py-3 px-3 font-mono text-slate-200">
                {smartDijkstraResult.totalDistanceKm} km
                {distDiff > 0 && (
                  <span className="text-[10px] text-amber-400 ml-1.5 font-sans">(+{distDiff} km detour)</span>
                )}
              </td>
              {smartAStarResult && (
                <td className="py-3 px-3 font-mono text-slate-200">
                  {smartAStarResult.totalDistanceKm} km
                </td>
              )}
            </tr>

            {/* Congestion Conditions */}
            <tr className="hover:bg-slate-800/30">
              <td className="py-3 px-3 font-semibold text-slate-300 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-amber-400" />
                <span>Traffic Encountered</span>
              </td>
              <td className="py-3 px-3">
                <div className="flex items-center gap-1.5 text-[11px]">
                  {staticResult.trafficBreakdown.heavyCount > 0 ? (
                    <span className="text-rose-400 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-rose-400" />
                      {staticResult.trafficBreakdown.heavyCount} Heavy Gridlock
                    </span>
                  ) : staticResult.trafficBreakdown.mediumCount > 0 ? (
                    <span className="text-amber-400 font-semibold">
                      {staticResult.trafficBreakdown.mediumCount} Moderate
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-semibold">Free Flow</span>
                  )}
                </div>
              </td>
              <td className="py-3 px-3">
                <div className="flex items-center gap-1.5 text-[11px]">
                  {smartDijkstraResult.trafficBreakdown.heavyCount > 0 ? (
                    <span className="text-rose-400 font-semibold">
                      {smartDijkstraResult.trafficBreakdown.heavyCount} Gridlock
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      Bypassed heavy traffic
                    </span>
                  )}
                </div>
              </td>
              {smartAStarResult && (
                <td className="py-3 px-3 text-[11px] text-emerald-400">
                  {smartAStarResult.trafficBreakdown.heavyCount === 0 ? 'Bypassed gridlock' : `${smartAStarResult.trafficBreakdown.heavyCount} Heavy`}
                </td>
              )}
            </tr>

            {/* Nodes Explored (DAA Benchmark) */}
            <tr className="hover:bg-slate-800/30">
              <td className="py-3 px-3 font-semibold text-slate-300 flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>Nodes Explored (V_visited)</span>
              </td>
              <td className="py-3 px-3 font-mono text-slate-400">
                {staticResult.nodesExplored} nodes
              </td>
              <td className="py-3 px-3 font-mono text-cyan-300 font-semibold">
                {smartDijkstraResult.nodesExplored} nodes
              </td>
              {smartAStarResult && (
                <td className="py-3 px-3 font-mono text-purple-300 font-bold">
                  {smartAStarResult.nodesExplored} nodes
                  {nodesSpared > 0 && (
                    <span className="text-[10px] text-emerald-400 ml-1.5 font-sans">(-{nodesSpared} visited)</span>
                  )}
                </td>
              )}
            </tr>

            {/* Execution Runtime */}
            <tr className="hover:bg-slate-800/30">
              <td className="py-3 px-3 font-semibold text-slate-300">
                Algorithm Exec Time (ms)
              </td>
              <td className="py-3 px-3 font-mono text-slate-400">
                {staticResult.executionTimeMs} ms
              </td>
              <td className="py-3 px-3 font-mono text-cyan-300">
                {smartDijkstraResult.executionTimeMs} ms
              </td>
              {smartAStarResult && (
                <td className="py-3 px-3 font-mono text-purple-300">
                  {smartAStarResult.executionTimeMs} ms
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Path sequence breadcrumbs */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-1.5 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="font-semibold text-cyan-400">Optimized Path Sequence:</span>
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-slate-200">
            {smartDijkstraResult.path.map((nodeId, idx) => (
              <React.Fragment key={`path_item_${nodeId}`}>
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-300">
                  {nodeId}
                </span>
                {idx < smartDijkstraResult.path.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-slate-600" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
