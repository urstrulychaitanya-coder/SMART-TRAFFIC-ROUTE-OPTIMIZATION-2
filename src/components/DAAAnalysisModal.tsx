import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Compass, 
  Zap, 
  CheckCircle2, 
  Scale, 
  Code2, 
  Calculator,
  Layers,
  ChevronRight
} from 'lucide-react';

interface DAAAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  vCount: number;
  eCount: number;
}

export const DAAAnalysisModal: React.FC<DAAAnalysisModalProps> = ({
  isOpen,
  onClose,
  vCount,
  eCount,
}) => {
  const [activeTab, setActiveTab] = useState<'dijkstra' | 'astar' | 'comparison' | 'calculator'>('dijkstra');
  const [calcV, setCalcV] = useState(vCount);
  const [calcE, setCalcE] = useState(eCount);

  if (!isOpen) return null;

  // Theoretical operations estimate
  const dijkstraOps = Math.round((calcV + calcE) * Math.log2(Math.max(2, calcV)));
  const naiveOps = calcV * calcV;
  const astarEstimatedOps = Math.round(dijkstraOps * 0.45); // typical 55% reduction with directed heuristic

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-white">
                DAA Algorithm Analysis & Theoretical Framework
              </h2>
              <p className="text-xs text-slate-400">
                Design and Analysis of Algorithms · Graph Theory · Asymptotic Complexity
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('dijkstra')}
            className={`py-1.5 px-3 rounded-lg flex items-center gap-2 transition-colors ${
              activeTab === 'dijkstra'
                ? 'bg-cyan-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Dijkstra’s Algorithm</span>
          </button>
          <button
            onClick={() => setActiveTab('astar')}
            className={`py-1.5 px-3 rounded-lg flex items-center gap-2 transition-colors ${
              activeTab === 'astar'
                ? 'bg-cyan-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>A* Heuristic Search</span>
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`py-1.5 px-3 rounded-lg flex items-center gap-2 transition-colors ${
              activeTab === 'comparison'
                ? 'bg-cyan-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-purple-400" />
            <span>Complexity Matrix</span>
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`py-1.5 px-3 rounded-lg flex items-center gap-2 transition-colors ${
              activeTab === 'calculator'
                ? 'bg-cyan-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-emerald-400" />
            <span>Complexity Calculator</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-xs md:text-sm leading-relaxed">
          {activeTab === 'dijkstra' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  1. Dijkstra’s Shortest Path Algorithm
                </h3>
                <p className="text-slate-300">
                  Dijkstra’s algorithm is a fundamental <strong>Greedy Algorithm</strong> that computes single-source shortest paths on weighted directed or undirected graphs with non-negative edge weights <code className="text-cyan-300 font-mono">w(u, v) ≥ 0</code>.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2 text-cyan-400">
                    Mathematical Formulation & Edge Weights
                  </h4>
                  <p className="text-xs text-slate-400 mb-2">
                    In our smart traffic routing prototype, the edge weight is dynamically modeled as:
                  </p>
                  <div className="bg-slate-900 p-2.5 rounded-lg font-mono text-xs text-amber-300 border border-slate-800 mb-2">
                    w(e) = (d(e) / s(e)) × c(traffic) × μ_emergency
                  </div>
                  <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                    <li><strong className="text-slate-200">d(e)</strong>: Physical road length in kilometers</li>
                    <li><strong className="text-slate-200">s(e)</strong>: Posted speed limit in km/h</li>
                    <li><strong className="text-slate-200">c(traffic)</strong>: Live congestion factor (1.0x, 1.85x, 3.6x)</li>
                    <li><strong className="text-slate-200">μ_emergency</strong>: Priority lane discount (1.35x vs 4.5x)</li>
                  </ul>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2 text-purple-400">
                    Asymptotic Complexity Analysis
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400">Time Complexity (Binary Min-Heap):</span>
                      <div className="font-mono text-cyan-300 font-bold text-sm">O((V + E) log V)</div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Extract-Min takes <code className="text-slate-300 font-mono">O(log V)</code> invoked <code className="text-slate-300 font-mono">V</code> times. Edge relaxation takes <code className="text-slate-300 font-mono">O(log V)</code> invoked at most <code className="text-slate-300 font-mono">E</code> times.
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400">Space Complexity:</span>
                      <div className="font-mono text-cyan-300 font-bold text-sm">O(V + E)</div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Stores adjacency list, distance map <code className="text-slate-300 font-mono">dist[V]</code>, predecessor map <code className="text-slate-300 font-mono">prev[V]</code>, and Min-Heap.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2 text-emerald-400">
                  Greedy Choice Property & Optimal Substructure
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Optimal Substructure:</strong> Any subpath of a shortest path is itself a shortest path between its endpoints. If path <em>P = (s, ..., u, v)</em> is optimal, then subpath <em>P' = (s, ..., u)</em> is guaranteed to be optimal for reaching <em>u</em>.<br />
                  <strong>Greedy Choice:</strong> At each iteration, selecting the unvisited vertex with the minimum tentative distance guarantees that no shorter path to that vertex can exist (because all edge weights are strictly positive: <code className="text-emerald-300 font-mono">w(u,v) ≥ 0</code>).
                </p>
              </div>
            </div>
          )}

          {activeTab === 'astar' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  2. A* (A-Star) Heuristic Search Algorithm
                </h3>
                <p className="text-slate-300">
                  A* extends Dijkstra’s uniform radial search by introducing a <strong>goal-directed heuristic function</strong> <code className="text-amber-300 font-mono">h(n)</code>. While Dijkstra searches radially in all directions, A* focuses its search frontier toward the destination.
                </p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider text-amber-400">
                  Evaluation Function: f(n) = g(n) + h(n)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="font-mono font-bold text-cyan-400 block mb-1">g(n)</span>
                    <span className="text-slate-400">
                      Actual accumulated cost (travel time or distance) from starting node <em>source</em> to current vertex <em>n</em>.
                    </span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="font-mono font-bold text-amber-400 block mb-1">h(n)</span>
                    <span className="text-slate-400">
                      Heuristic estimate of remaining travel time from vertex <em>n</em> to the goal destination.
                    </span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="font-mono font-bold text-purple-400 block mb-1">f(n) = g(n) + h(n)</span>
                    <span className="text-slate-400">
                      Total estimated path cost passing through vertex <em>n</em>. Min-Heap extracts vertex with smallest <em>f(n)</em>.
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider text-cyan-400">
                  Admissibility & Monotonicity (Consistency) Proof
                </h4>
                <p className="text-xs text-slate-300">
                  To guarantee that A* returns an <strong>optimal shortest path</strong> without revisiting nodes, the heuristic must be <strong>admissible</strong> and <strong>consistent</strong>:
                </p>
                <div className="bg-slate-900 p-2.5 rounded-lg font-mono text-xs text-emerald-300 border border-slate-800">
                  Admissibility: h(n) ≤ h*(n)  (never overestimates the true remaining cost)
                  Consistency:   h(u) ≤ c(u, v) + h(v) (triangle inequality holds)
                </div>
                <p className="text-xs text-slate-400">
                  In our road network:
                  <br />
                  <code className="text-slate-200 font-mono">h(n) = EuclideanDistance(n, goal) / MaxSpeedNetwork</code>
                  <br />
                  Since no vehicle can travel faster than the network maximum speed (70 km/h) or take a path shorter than a straight line, <code className="text-cyan-300 font-mono">h(n) ≤ h*(n)</code> is mathematically guaranteed to be strictly admissible!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'comparison' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  3. DAA Graph Shortest Path Algorithms Comparison
                </h3>
                <p className="text-slate-300">
                  Comparative analysis of classical shortest path paradigms covered in DAA curricula.
                </p>
              </div>

              <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/80">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 bg-slate-900/60">
                      <th className="py-2.5 px-3">Algorithm</th>
                      <th className="py-2.5 px-3">Paradigm</th>
                      <th className="py-2.5 px-3">Time Complexity</th>
                      <th className="py-2.5 px-3">Space</th>
                      <th className="py-2.5 px-3">Negative Edges?</th>
                      <th className="py-2.5 px-3">Best Use Case</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                    <tr className="bg-cyan-950/20 text-cyan-300 font-semibold">
                      <td className="py-2.5 px-3 font-sans">Dijkstra (Heap)</td>
                      <td className="py-2.5 px-3 font-sans">Greedy</td>
                      <td className="py-2.5 px-3">O((V + E) log V)</td>
                      <td className="py-2.5 px-3">O(V)</td>
                      <td className="py-2.5 px-3 text-rose-400">No</td>
                      <td className="py-2.5 px-3 font-sans text-slate-300">Single-source road routing</td>
                    </tr>
                    <tr className="bg-amber-950/20 text-amber-300 font-semibold">
                      <td className="py-2.5 px-3 font-sans">A* Search</td>
                      <td className="py-2.5 px-3 font-sans">Heuristic / Best-First</td>
                      <td className="py-2.5 px-3">O((V + E) log V)</td>
                      <td className="py-2.5 px-3">O(V)</td>
                      <td className="py-2.5 px-3 text-rose-400">No</td>
                      <td className="py-2.5 px-3 font-sans text-slate-300">Goal-directed spatial routing</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-sans">Bellman-Ford</td>
                      <td className="py-2.5 px-3 font-sans">Dynamic Programming</td>
                      <td className="py-2.5 px-3">O(V × E)</td>
                      <td className="py-2.5 px-3">O(V)</td>
                      <td className="py-2.5 px-3 text-emerald-400">Yes</td>
                      <td className="py-2.5 px-3 font-sans text-slate-400">Negative weight cycles detection</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-sans">Floyd-Warshall</td>
                      <td className="py-2.5 px-3 font-sans">Dynamic Programming</td>
                      <td className="py-2.5 px-3">O(V³)</td>
                      <td className="py-2.5 px-3">O(V²)</td>
                      <td className="py-2.5 px-3 text-emerald-400">Yes</td>
                      <td className="py-2.5 px-3 font-sans text-slate-400">All-Pairs Shortest Paths (dense)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'calculator' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  4. Interactive DAA Complexity Calculator
                </h3>
                <p className="text-slate-300">
                  Simulate theoretical operations scaling as graph size <code className="text-emerald-300 font-mono">|V|</code> (intersections) and <code className="text-emerald-300 font-mono">|E|</code> (roads) scale.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Number of Vertices |V| (Intersections): {calcV}
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="500"
                    value={calcV}
                    onChange={(e) => setCalcV(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Number of Edges |E| (Road Segments): {calcE}
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="1500"
                    value={calcE}
                    onChange={(e) => setCalcE(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                    Naive Unindexed: O(V²)
                  </span>
                  <div className="text-xl font-bold font-mono text-rose-400">
                    {naiveOps.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-500">operations</span>
                </div>

                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-cyan-800/80">
                  <span className="text-[11px] text-cyan-400 uppercase tracking-wider block mb-1">
                    Dijkstra Min-Heap: O((V+E) log V)
                  </span>
                  <div className="text-xl font-bold font-mono text-cyan-300">
                    {dijkstraOps.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-cyan-500">
                    {((1 - dijkstraOps / naiveOps) * 100).toFixed(0)}% speedup vs naive
                  </span>
                </div>

                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-amber-800/80">
                  <span className="text-[11px] text-amber-400 uppercase tracking-wider block mb-1">
                    A* Directed Search (Est. Visited)
                  </span>
                  <div className="text-xl font-bold font-mono text-amber-300">
                    ~{astarEstimatedOps.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-amber-500">
                    Target-pruned search ellipse
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>Graph parameters: <span className="font-mono text-slate-200">|V| = {vCount}, |E| = {eCount}</span></div>
          <button
            onClick={onClose}
            className="py-1.5 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors"
          >
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
};
