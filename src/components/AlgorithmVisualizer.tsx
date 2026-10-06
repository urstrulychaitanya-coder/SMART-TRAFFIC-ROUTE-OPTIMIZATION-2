import React from 'react';
import { 
  AlgorithmResult, 
  AlgorithmStep, 
  AlgorithmType 
} from '../algorithms/types';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  FastForward, 
  ListOrdered, 
  Code
} from 'lucide-react';

interface AlgorithmVisualizerProps {
  algorithmType: AlgorithmType;
  result: AlgorithmResult | null;
  currentStepIndex: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onJumpToEnd: () => void;
  speedMs: number;
  onSpeedChange: (speed: number) => void;
}

const DIJKSTRA_CODE = [
  '1: initialize dist[v] = ∞, dist[source] = 0, prev[v] = null',
  '2: MinHeap.insert(source, priority=0)',
  '3: while !MinHeap.isEmpty():',
  '4:     u = MinHeap.extractMin()  // dequeue closest vertex',
  '5:     if u == destination: break  // target settled',
  '6:     for each neighbor v of u:',
  '7:         weight = travel_time(u, v, traffic_multiplier)',
  '8:         if dist[u] + weight < dist[v]:',
  '9:             dist[v] = dist[u] + weight; prev[v] = u',
  '10:            MinHeap.decreasePriority(v, dist[v])',
];

const ASTAR_CODE = [
  '1: initialize g[v] = ∞, f[v] = ∞, g[source] = 0, f[source] = h(source)',
  '2: MinHeap.insert(source, priority = f[source])',
  '3: while !MinHeap.isEmpty():',
  '4:     u = MinHeap.extractMin()  // dequeue lowest f(n) = g + h',
  '5:     if u == destination: return reconstructPath()',
  '6:     for each neighbor v of u:',
  '7:         tentative_g = g[u] + travel_time(u, v, traffic)',
  '8:         if tentative_g < g[v]:',
  '9:             g[v] = tentative_g; f[v] = g[v] + h(v, goal)',
  '10:            MinHeap.decreasePriority(v, priority = f[v])',
];

export const AlgorithmVisualizer: React.FC<AlgorithmVisualizerProps> = ({
  algorithmType,
  result,
  currentStepIndex,
  isPlaying,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onReset,
  onJumpToEnd,
  speedMs,
  onSpeedChange,
}) => {
  if (!result || result.steps.length === 0) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 text-center text-slate-400 text-xs">
        Run algorithm to view step-by-step priority queue execution and trace.
      </div>
    );
  }

  const steps = result.steps;
  const currentStep = steps[Math.min(currentStepIndex, steps.length - 1)];
  const isFinished = currentStepIndex >= steps.length - 1;
  const codeLines = algorithmType === 'dijkstra' ? DIJKSTRA_CODE : ASTAR_CODE;

  const getActiveCodeLine = () => {
    if (!currentStep) return 1;
    switch (currentStep.eventType) {
      case 'pop_min':
        return 4;
      case 'goal_reached':
        return 5;
      case 'relax_edge':
        return 9;
      default:
        return 1;
    }
  };

  const activeLine = getActiveCodeLine();

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-5 shadow-xl flex flex-col gap-4">
      {/* Header & Playback Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              {algorithmType === 'dijkstra' ? 'Dijkstra Priority Queue Trace' : 'A* Heuristic Search Trace'}
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Step {currentStepIndex + 1} of {steps.length} · {result.nodesExplored} nodes settled · {result.edgesRelaxed} relaxations
          </p>
        </div>

        {/* Playback Buttons */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={onReset}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Reset to Step 0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onStepBackward}
            disabled={currentStepIndex <= 0}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 transition-colors"
            title="Step Backward"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          {isPlaying ? (
            <button
              onClick={onPause}
              className="py-1 px-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1 transition-colors"
            >
              <Pause className="w-3 h-3 fill-current" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={onPlay}
              disabled={isFinished}
              className="py-1 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold text-xs flex items-center gap-1 transition-colors"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{isFinished ? 'Done' : 'Play'}</span>
            </button>
          )}

          <button
            onClick={onStepForward}
            disabled={isFinished}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 transition-colors"
            title="Step Forward"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onJumpToEnd}
            disabled={isFinished}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 transition-colors"
            title="Jump to Finish"
          >
            <FastForward className="w-3.5 h-3.5" />
          </button>

          {/* Speed Selector */}
          <div className="h-4 w-px bg-slate-800 mx-1" />
          <select
            value={speedMs}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="bg-transparent text-[11px] text-cyan-400 font-mono font-medium focus:outline-none cursor-pointer pr-1"
          >
            <option value={800} className="bg-slate-900 text-slate-200">0.5x</option>
            <option value={400} className="bg-slate-900 text-slate-200">1.0x</option>
            <option value={150} className="bg-slate-900 text-slate-200">2.5x</option>
            <option value={50} className="bg-slate-900 text-slate-200">5.0x</option>
          </select>
        </div>
      </div>

      {/* Current Step Action Banner */}
      <div className={`p-3 rounded-xl border text-xs font-mono transition-all ${
        currentStep.eventType === 'goal_reached'
          ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-200'
          : currentStep.eventType === 'relax_edge'
          ? 'bg-amber-950/40 border-amber-800/70 text-amber-200'
          : 'bg-slate-950/80 border-slate-800 text-cyan-200'
      }`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700">
            {currentStep.eventType.replace('_', ' ')}
          </span>
          <span className="text-slate-400 text-[11px]">Active Vertex: <strong className="text-white">{currentStep.currentNode}</strong></span>
        </div>
        <p className="leading-relaxed">{currentStep.description}</p>
      </div>

      {/* Grid: Priority Queue Snapshot + Pseudo-code line inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Priority Queue State */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ListOrdered className="w-3.5 h-3.5 text-cyan-400" />
              Min-Heap Priority Queue (Live)
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              {currentStep.pqSnapshot.length} entries
            </span>
          </div>

          <div className="overflow-x-auto max-h-44 overflow-y-auto">
            {currentStep.pqSnapshot.length === 0 ? (
              <div className="text-[11px] text-slate-500 py-4 text-center">
                Priority Queue is empty (all reachable nodes processed).
              </div>
            ) : (
              <table className="w-full text-[11px] font-mono text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 text-[10px]">
                    <th className="py-1">Rank</th>
                    <th className="py-1">Node</th>
                    <th className="py-1">{algorithmType === 'astar' ? 'f(n) = g + h' : 'Min Dist (min)'}</th>
                    {algorithmType === 'astar' && <th className="py-1 text-right">g / h</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {currentStep.pqSnapshot.map((item, idx) => (
                    <tr
                      key={`pq_${item.id}_${idx}`}
                      className={idx === 0 ? 'bg-cyan-950/40 text-cyan-300 font-bold' : 'text-slate-300'}
                    >
                      <td className="py-1 text-slate-500">#{idx + 1}</td>
                      <td className="py-1 font-semibold">{item.id}</td>
                      <td className="py-1 text-amber-300">
                        {item.priority === Infinity ? '∞' : item.priority.toFixed(1)}
                      </td>
                      {algorithmType === 'astar' && (
                        <td className="py-1 text-right text-slate-400">
                          {item.g !== undefined ? item.g.toFixed(1) : '-'} / {item.h !== undefined ? item.h.toFixed(1) : '-'}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Pseudo-code Highlighting */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 flex flex-col font-mono text-[11px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider font-sans flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-amber-400" />
              Algorithm Pseudo-Code
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              O((V + E) log V)
            </span>
          </div>

          <div className="overflow-y-auto max-h-44 space-y-0.5 text-slate-400">
            {codeLines.map((line, idx) => {
              const lineNum = idx + 1;
              const isHighlighted = lineNum === activeLine;
              return (
                <div
                  key={`line_${lineNum}`}
                  className={`px-2 py-0.5 rounded transition-colors whitespace-pre ${
                    isHighlighted
                      ? 'bg-amber-500/20 text-amber-300 font-bold border-l-2 border-amber-400'
                      : 'hover:bg-slate-900/60'
                  }`}
                >
                  {line}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Settled / Visited Nodes Progress Bar */}
      <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 text-[11px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Settled Nodes ({currentStep.visitedNodes.length}):</span>
          <div className="flex flex-wrap gap-1">
            {currentStep.visitedNodes.map((n) => (
              <span
                key={`visited_${n}`}
                className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono text-[10px]"
              >
                {n}
              </span>
            ))}
          </div>
        </div>
        <div className="text-slate-500 text-[10px] shrink-0 font-mono">
          Final Shortest Path: <span className="text-emerald-400 font-bold">{result.path.join(' ➔ ')}</span>
        </div>
      </div>
    </div>
  );
};
