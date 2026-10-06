import React, { useState } from 'react';
import { 
  CityNode, 
  RoadEdge, 
  TrafficLevel, 
  AlgorithmResult,
  AlgorithmStep
} from '../algorithms/types';
import { calculateEdgeTravelTime } from '../algorithms/graphData';
import { 
  Cross, 
  Plane, 
  Train, 
  ShoppingBag, 
  GraduationCap, 
  Home, 
  Building2, 
  Cpu, 
  ShieldAlert,
  Flame,
  Ship,
  Sparkles,
  MousePointerClick
} from 'lucide-react';

interface CityMapProps {
  nodes: CityNode[];
  edges: RoadEdge[];
  sourceId: string;
  targetId: string;
  onSelectSource: (id: string) => void;
  onSelectTarget: (id: string) => void;
  onToggleRoadTraffic: (edgeId: string) => void;
  activeResult: AlgorithmResult | null;
  staticResult: AlgorithmResult | null;
  currentVisualizerStep: AlgorithmStep | null;
  isEmergencyMode: boolean;
  showNaiveRouteOverlay: boolean;
}

export const CityMap: React.FC<CityMapProps> = ({
  nodes,
  edges,
  sourceId,
  targetId,
  onSelectSource,
  onSelectTarget,
  onToggleRoadTraffic,
  activeResult,
  staticResult,
  currentVisualizerStep,
  isEmergencyMode,
  showNaiveRouteOverlay,
}) => {
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const nodeMap = new Map<string, CityNode>(nodes.map((n) => [n.id, n]));

  // Active optimal path edges & nodes sets for instant lookup
  const optimalPathNodes = new Set(activeResult?.path || []);
  const optimalPathEdges = new Set(activeResult?.pathEdgeIds || []);
  const staticPathEdges = new Set(staticResult?.pathEdgeIds || []);

  // Visualizer step highlight sets
  const visualizerVisited = new Set(currentVisualizerStep?.visitedNodes || []);
  const visualizerCurrentNode = currentVisualizerStep?.currentNode;
  const visualizerNeighbor = currentVisualizerStep?.examinedNeighbor;

  const getNodeIcon = (category: CityNode['category']) => {
    switch (category) {
      case 'healthcare':
        return <Cross className="w-3.5 h-3.5 text-rose-400" />;
      case 'transit':
        return <Plane className="w-3.5 h-3.5 text-sky-400" />;
      case 'education':
        return <GraduationCap className="w-3.5 h-3.5 text-amber-400" />;
      case 'commercial':
        return <ShoppingBag className="w-3.5 h-3.5 text-purple-400" />;
      case 'residential':
        return <Home className="w-3.5 h-3.5 text-emerald-400" />;
      case 'tech':
        return <Cpu className="w-3.5 h-3.5 text-cyan-400" />;
      case 'industrial':
        return <Ship className="w-3.5 h-3.5 text-orange-400" />;
      default:
        return <Building2 className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  const getTrafficColor = (traffic: TrafficLevel) => {
    switch (traffic) {
      case 'low':
        return '#10b981'; // emerald-500
      case 'medium':
        return '#f59e0b'; // amber-500
      case 'heavy':
        return '#ef4444'; // rose-500
      case 'blocked':
        return '#475569'; // slate-600
    }
  };

  const hoveredEdge = edges.find((e) => e.id === hoveredEdgeId);

  return (
    <div className="relative w-full rounded-2xl bg-slate-950/90 border border-slate-800/90 overflow-hidden shadow-2xl flex flex-col">
      {/* Top Map Toolbar */}
      <div className="px-4 py-2.5 bg-slate-900/80 border-b border-slate-800/70 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Metropolitan Traffic Grid Map
          </span>
          <span className="text-slate-500 hidden sm:inline">· Click road to cycle traffic · Click node to set route</span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px] text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Low (Free)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Gridlock</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
            <span>Blocked</span>
          </div>
          <div className="flex items-center gap-1.5 hidden md:flex">
            <span className="w-3.5 h-1 bg-cyan-400 rounded-sm" />
            <span>Emergency Lane</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative w-full aspect-[16/9] md:aspect-[16/9.2] select-none bg-[#090d16]">
        <svg
          viewBox="0 0 1020 620"
          className="w-full h-full"
          style={{ touchAction: 'pan-x pan-y' }}
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="cityGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(30, 41, 59, 0.4)" strokeWidth="0.8" />
            </pattern>

            {/* Blocked Road Hatch Pattern */}
            <pattern id="blockedHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#ef4444" strokeWidth="2.5" />
            </pattern>

            {/* Neon Route Glow Filters */}
            <filter id="optimalGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="emergencyGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Gradient for district zones */}
            <radialGradient id="medicalZone" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(244, 63, 94, 0.08)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <radialGradient id="techZone" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(6, 182, 212, 0.08)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <radialGradient id="transitZone" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.08)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* Background Grid */}
          <rect width="1020" height="620" fill="url(#cityGrid)" />

          {/* City District Background Auras */}
          <ellipse cx="200" cy="150" rx="160" ry="110" fill="url(#medicalZone)" />
          <ellipse cx="900" cy="200" rx="140" ry="120" fill="url(#transitZone)" />
          <ellipse cx="880" cy="400" rx="150" ry="130" fill="url(#techZone)" />

          {/* District Boundary Text Markers */}
          <text x="180" y="45" fill="rgba(148, 163, 184, 0.3)" fontSize="11" fontWeight="700" letterSpacing="2">
            HEALTHCARE CORRIDOR
          </text>
          <text x="500" y="45" fill="rgba(148, 163, 184, 0.3)" fontSize="11" fontWeight="700" letterSpacing="2">
            ACADEMIC CAMPUS
          </text>
          <text x="820" y="45" fill="rgba(148, 163, 184, 0.3)" fontSize="11" fontWeight="700" letterSpacing="2">
            AEROTROPOLIS TERMINAL
          </text>
          <text x="460" y="595" fill="rgba(148, 163, 184, 0.3)" fontSize="11" fontWeight="700" letterSpacing="2">
            RIVERSIDE PROMENADE & SOUTH GATEWAY
          </text>
          <text x="80" y="595" fill="rgba(148, 163, 184, 0.3)" fontSize="11" fontWeight="700" letterSpacing="2">
            SEAPORT LOGISTICS
          </text>

          {/* 1. Base Road Beds (Dark wide casing) */}
          {edges.map((edge) => {
            const u = nodeMap.get(edge.u);
            const v = nodeMap.get(edge.v);
            if (!u || !v) return null;
            return (
              <line
                key={`base_${edge.id}`}
                x1={u.x}
                y1={u.y}
                x2={v.x}
                y2={v.y}
                stroke="#1e293b"
                strokeWidth={edge.lanes >= 6 ? 12 : edge.lanes >= 4 ? 9 : 6}
                strokeLinecap="round"
              />
            );
          })}

          {/* 2. Traffic Flow Lines (Colored by status) */}
          {edges.map((edge) => {
            const u = nodeMap.get(edge.u);
            const v = nodeMap.get(edge.v);
            if (!u || !v) return null;

            const isHovered = hoveredEdgeId === edge.id;
            const strokeColor = getTrafficColor(edge.traffic);
            const lineWidth = edge.lanes >= 6 ? 7 : edge.lanes >= 4 ? 5 : 3.5;

            return (
              <g key={`traffic_${edge.id}`}>
                {/* Hit target for road click */}
                <line
                  x1={u.x}
                  y1={u.y}
                  x2={v.x}
                  y2={v.y}
                  stroke="transparent"
                  strokeWidth={20}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredEdgeId(edge.id)}
                  onMouseLeave={() => setHoveredEdgeId(null)}
                  onClick={() => onToggleRoadTraffic(edge.id)}
                />

                {/* Road Line with traffic color */}
                <line
                  x1={u.x}
                  y1={u.y}
                  x2={v.x}
                  y2={v.y}
                  stroke={edge.traffic === 'blocked' ? '#334155' : strokeColor}
                  strokeWidth={lineWidth}
                  strokeLinecap="round"
                  strokeDasharray={edge.traffic === 'blocked' ? '6 6' : undefined}
                  opacity={isHovered ? 1 : 0.85}
                  className="cursor-pointer transition-all duration-300"
                  onMouseEnter={() => setHoveredEdgeId(edge.id)}
                  onMouseLeave={() => setHoveredEdgeId(null)}
                  onClick={() => onToggleRoadTraffic(edge.id)}
                />

                {/* Emergency lane indicator */}
                {edge.isEmergencyLane && (
                  <line
                    x1={u.x}
                    y1={u.y}
                    x2={v.x}
                    y2={v.y}
                    stroke="#06b6d4"
                    strokeWidth={1.5}
                    strokeDasharray="4 6"
                    opacity={0.6}
                    pointerEvents="none"
                  />
                )}

                {/* Midpoint Distance Tag */}
                {edge.lanes >= 4 && (
                  <text
                    x={(u.x + v.x) / 2}
                    y={(u.y + v.y) / 2 - 4}
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="select-none pointer-events-none"
                    opacity={0.7}
                  >
                    {edge.distanceKm}km
                  </text>
                )}
              </g>
            );
          })}

          {/* 3. Naive Distance Route Overlay (if toggled on) */}
          {showNaiveRouteOverlay && staticResult && (
            <g className="opacity-70 pointer-events-none">
              {staticResult.pathEdgeIds.map((edgeId) => {
                const edge = edges.find((e) => e.id === edgeId);
                if (!edge) return null;
                const u = nodeMap.get(edge.u);
                const v = nodeMap.get(edge.v);
                if (!u || !v) return null;
                return (
                  <line
                    key={`naive_${edge.id}`}
                    x1={u.x}
                    y1={u.y}
                    x2={v.x}
                    y2={v.y}
                    stroke="#f97316"
                    strokeWidth={5}
                    strokeDasharray="8 6"
                    strokeLinecap="round"
                  />
                );
              })}
            </g>
          )}

          {/* 4. Active Optimal Path Highlight (Glowing & Flowing) */}
          {activeResult && activeResult.pathEdgeIds.length > 0 && (
            <g className="pointer-events-none">
              {activeResult.pathEdgeIds.map((edgeId, index) => {
                const edge = edges.find((e) => e.id === edgeId);
                if (!edge) return null;
                const u = nodeMap.get(edge.u);
                const v = nodeMap.get(edge.v);
                if (!u || !v) return null;

                const strokeColor = isEmergencyMode ? '#ef4444' : '#06b6d4';

                return (
                  <React.Fragment key={`opt_${edge.id}_${index}`}>
                    {/* Outer Glow Line */}
                    <line
                      x1={u.x}
                      y1={u.y}
                      x2={v.x}
                      y2={v.y}
                      stroke={strokeColor}
                      strokeWidth={10}
                      strokeLinecap="round"
                      opacity={0.4}
                      filter={isEmergencyMode ? 'url(#emergencyGlow)' : 'url(#optimalGlow)'}
                    />

                    {/* Inner Sharp Flow Line */}
                    <line
                      x1={u.x}
                      y1={u.y}
                      x2={v.x}
                      y2={v.y}
                      stroke={isEmergencyMode ? '#ffffff' : '#e0f2fe'}
                      strokeWidth={4.5}
                      strokeLinecap="round"
                      strokeDasharray="10 8"
                      className="animate-pulse"
                    />
                  </React.Fragment>
                );
              })}
            </g>
          )}

          {/* 5. Visualizer Step Highlight (Edge relaxation in progress) */}
          {currentVisualizerStep?.eventType === 'relax_edge' && currentVisualizerStep.examinedNeighbor && (
            (() => {
              const u = nodeMap.get(currentVisualizerStep.currentNode);
              const v = nodeMap.get(currentVisualizerStep.examinedNeighbor);
              if (!u || !v) return null;
              return (
                <line
                  x1={u.x}
                  y1={u.y}
                  x2={v.x}
                  y2={v.y}
                  stroke="#fbbf24"
                  strokeWidth={6}
                  strokeLinecap="round"
                  strokeDasharray="6 4"
                  className="animate-pulse"
                />
              );
            })()
          )}

          {/* 6. Nodes (Intersections) */}
          {nodes.map((node) => {
            const isSource = node.id === sourceId;
            const isTarget = node.id === targetId;
            const isOnOptimalPath = optimalPathNodes.has(node.id);
            const isCurrentInStep = visualizerCurrentNode === node.id;
            const isVisitedInStep = visualizerVisited.has(node.id);
            const isNeighborInStep = visualizerNeighbor === node.id;

            return (
              <g
                key={`node_${node.id}`}
                className="cursor-pointer group"
                onClick={() => setSelectedNodeId(node.id)}
              >
                {/* Visualizer Exploration Aura */}
                {isCurrentInStep && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={26}
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth={3}
                    className="animate-ping"
                  />
                )}

                {/* Source / Target Glowing Aura */}
                {isSource && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={22}
                    fill="rgba(16, 185, 129, 0.25)"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    className="animate-pulse"
                  />
                )}
                {isTarget && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={22}
                    fill="rgba(168, 85, 247, 0.25)"
                    stroke="#a855f7"
                    strokeWidth={2.5}
                    className="animate-pulse"
                  />
                )}

                {/* Outer Node Circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={16}
                  fill={
                    isSource
                      ? '#064e3b'
                      : isTarget
                      ? '#4c1d95'
                      : isOnOptimalPath
                      ? '#0f172a'
                      : isCurrentInStep
                      ? '#78350f'
                      : '#0f172a'
                  }
                  stroke={
                    isSource
                      ? '#10b981'
                      : isTarget
                      ? '#c084fc'
                      : isCurrentInStep
                      ? '#f59e0b'
                      : isNeighborInStep
                      ? '#38bdf8'
                      : isVisitedInStep
                      ? '#0ea5e9'
                      : isOnOptimalPath
                      ? '#38bdf8'
                      : '#334155'
                  }
                  strokeWidth={isSource || isTarget || isOnOptimalPath || isCurrentInStep ? 2.5 : 1.5}
                  className="transition-all duration-300 group-hover:stroke-cyan-400 group-hover:scale-110"
                />

                {/* Center Node Dot / Icon Placeholder */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={7}
                  fill={
                    isSource
                      ? '#34d399'
                      : isTarget
                      ? '#e879f9'
                      : isCurrentInStep
                      ? '#fbbf24'
                      : isOnOptimalPath
                      ? '#38bdf8'
                      : '#475569'
                  }
                />

                {/* Node Name Label */}
                <text
                  x={node.x}
                  y={node.y + 26}
                  fill={
                    isSource
                      ? '#34d399'
                      : isTarget
                      ? '#e879f9'
                      : isOnOptimalPath
                      ? '#f1f5f9'
                      : '#94a3b8'
                  }
                  fontSize="10"
                  fontWeight={isSource || isTarget || isOnOptimalPath ? '700' : '500'}
                  textAnchor="middle"
                  className="pointer-events-none drop-shadow-md select-none"
                >
                  {node.shortName}
                </text>

                {/* Start / Target Badge */}
                {isSource && (
                  <g transform={`translate(${node.x - 22}, ${node.y - 32})`}>
                    <rect
                      width="44"
                      height="15"
                      rx="3"
                      fill="#10b981"
                      className="shadow-sm"
                    />
                    <text
                      x="22"
                      y="11"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="800"
                      textAnchor="middle"
                      className="pointer-events-none"
                    >
                      SOURCE
                    </text>
                  </g>
                )}

                {isTarget && (
                  <g transform={`translate(${node.x - 20}, ${node.y - 32})`}>
                    <rect
                      width="40"
                      height="15"
                      rx="3"
                      fill="#a855f7"
                      className="shadow-sm"
                    />
                    <text
                      x="20"
                      y="11"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="800"
                      textAnchor="middle"
                      className="pointer-events-none"
                    >
                      GOAL
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hovered Road Details Card (floating overlay) */}
        {hoveredEdge && (
          <div className="absolute top-3 right-3 bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 shadow-2xl backdrop-blur-md text-xs z-20 min-w-[210px] pointer-events-none animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-slate-800">
              <span className="font-bold text-slate-100">{hoveredEdge.name}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                hoveredEdge.traffic === 'low' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                hoveredEdge.traffic === 'medium' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                hoveredEdge.traffic === 'heavy' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                {hoveredEdge.traffic}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-y-1 text-[11px] text-slate-300">
              <div>Distance: <span className="font-mono text-cyan-300 font-semibold">{hoveredEdge.distanceKm} km</span></div>
              <div>Speed Limit: <span className="font-mono text-slate-200">{hoveredEdge.speedLimitKmh} km/h</span></div>
              <div>Est Travel Time: <span className="font-mono text-amber-300 font-semibold">{calculateEdgeTravelTime(hoveredEdge, isEmergencyMode ? 'emergency' : 'smart_time')} min</span></div>
              <div>Lanes: <span className="font-mono text-slate-200">{hoveredEdge.lanes} lanes</span></div>
            </div>
            {hoveredEdge.isEmergencyLane && (
              <div className="mt-1.5 pt-1 border-t border-slate-800/80 text-[10px] text-cyan-400 flex items-center gap-1 font-semibold">
                <Sparkles className="w-3 h-3" /> Designated Emergency Corridor
              </div>
            )}
            <div className="mt-1 text-[10px] text-slate-500 italic">Click road to toggle traffic congestion</div>
          </div>
        )}

        {/* Selected Node Action Popover */}
        {selectedNodeId && (
          <div className="absolute bottom-3 left-3 bg-slate-900/95 border border-cyan-800/60 rounded-xl p-3 shadow-2xl backdrop-blur-md text-xs z-30 min-w-[240px]">
            {(() => {
              const node = nodeMap.get(selectedNodeId);
              if (!node) return null;
              return (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {getNodeIcon(node.category)}
                    <span className="font-bold text-slate-100">{node.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-2.5">{node.description}</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onSelectSource(node.id);
                        setSelectedNodeId(null);
                      }}
                      className="flex-1 py-1 px-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] transition-colors"
                    >
                      Set as Source
                    </button>
                    <button
                      onClick={() => {
                        onSelectTarget(node.id);
                        setSelectedNodeId(null);
                      }}
                      className="flex-1 py-1 px-2.5 rounded bg-purple-600 hover:bg-purple-500 text-white font-semibold text-[11px] transition-colors"
                    >
                      Set as Target
                    </button>
                    <button
                      onClick={() => setSelectedNodeId(null)}
                      className="py-1 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 text-[11px]"
                    >
                      Close
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};
