/**
 * Smart Traffic Route Optimization
 * DAA (Design and Analysis of Algorithms) Hackathon Prototype
 * "From Shortest Path to Smartest Path"
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  INITIAL_NODES, 
  INITIAL_ROADS 
} from './algorithms/graphData';
import { 
  CityNode, 
  RoadEdge, 
  AlgorithmType, 
  AlgorithmResult, 
  AlgorithmStep, 
  TrafficLevel 
} from './algorithms/types';
import { runDijkstra } from './algorithms/dijkstra';
import { runAStar } from './algorithms/astar';
import { Header } from './components/Header';
import { CityMap } from './components/CityMap';
import { ControlPanel } from './components/ControlPanel';
import { AlgorithmVisualizer } from './components/AlgorithmVisualizer';
import { RouteComparison } from './components/RouteComparison';
import { CityDashboard } from './components/CityDashboard';
import { DAAAnalysisModal } from './components/DAAAnalysisModal';
import { 
  Zap, 
  AlertCircle, 
  CheckCircle2, 
  Flame, 
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';

export default function App() {
  // Graph Network State
  const [nodes] = useState<CityNode[]>(INITIAL_NODES);
  const [roads, setRoads] = useState<RoadEdge[]>(INITIAL_ROADS);

  // Routing Endpoints & Mode
  const [sourceId, setSourceId] = useState<string>('hospital');
  const [targetId, setTargetId] = useState<string>('airport');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>('dijkstra');
  const [isEmergencyMode, setIsEmergencyMode] = useState<boolean>(false);
  const [showNaiveOverlay, setShowNaiveOverlay] = useState<boolean>(true);

  // Visualizer Animation State
  const [isVisualizerRunning, setIsVisualizerRunning] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [visualizerSpeedMs, setVisualizerSpeedMs] = useState<number>(350);
  const animationTimerRef = useRef<number | null>(null);

  // DAA Analysis Modal
  const [isDAAModalOpen, setIsDAAModalOpen] = useState<boolean>(false);

  // Notification Toast for dynamic traffic events
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  const triggerToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  }, []);

  // Compute Algorithms Dynamically
  const routingMode = isEmergencyMode ? 'emergency' : 'smart_time';

  // 1. Smart Dijkstra (Real-time congestion aware)
  const smartDijkstraResult = useMemo<AlgorithmResult>(() => {
    return runDijkstra(nodes, roads, sourceId, targetId, routingMode);
  }, [nodes, roads, sourceId, targetId, routingMode]);

  // 2. Smart A* (Real-time congestion aware + Euclidean heuristic)
  const smartAStarResult = useMemo<AlgorithmResult>(() => {
    return runAStar(nodes, roads, sourceId, targetId, routingMode);
  }, [nodes, roads, sourceId, targetId, routingMode]);

  // 3. Static Distance Baseline (Traditional GPS ignoring traffic)
  const staticResult = useMemo<AlgorithmResult>(() => {
    return runDijkstra(nodes, roads, sourceId, targetId, 'static_distance');
  }, [nodes, roads, sourceId, targetId]);

  // Currently active result for map & visualizer
  const activeResult = selectedAlgorithm === 'dijkstra' ? smartDijkstraResult : smartAStarResult;

  // Active step for map highlights during step-by-step playback
  const currentVisualizerStep: AlgorithmStep | null = useMemo(() => {
    if (!activeResult || activeResult.steps.length === 0) return null;
    return activeResult.steps[Math.min(currentStepIndex, activeResult.steps.length - 1)];
  }, [activeResult, currentStepIndex]);

  // Network stats
  const totalRoads = roads.length;
  const activeRoads = roads.filter((r) => r.traffic !== 'blocked').length;
  const heavyRoadsCount = roads.filter((r) => r.traffic === 'heavy').length;
  const mediumRoadsCount = roads.filter((r) => r.traffic === 'medium').length;
  const networkCongestionIndex = Math.round(
    ((heavyRoadsCount * 3 + mediumRoadsCount * 1.5) / (totalRoads * 3)) * 100
  );

  // Handle Playback Stepping
  const handleNextStep = useCallback(() => {
    if (!activeResult) return;
    setCurrentStepIndex((prev) => {
      if (prev >= activeResult.steps.length - 1) {
        setIsVisualizerRunning(false);
        return prev;
      }
      return prev + 1;
    });
  }, [activeResult]);

  useEffect(() => {
    if (isVisualizerRunning) {
      animationTimerRef.current = window.setInterval(() => {
        handleNextStep();
      }, visualizerSpeedMs);
    } else {
      if (animationTimerRef.current) {
        clearInterval(animationTimerRef.current);
        animationTimerRef.current = null;
      }
    }
    return () => {
      if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    };
  }, [isVisualizerRunning, visualizerSpeedMs, handleNextStep]);

  // Reset step index when algorithm or endpoints change
  useEffect(() => {
    setIsVisualizerRunning(false);
    setCurrentStepIndex(activeResult.steps.length > 0 ? activeResult.steps.length - 1 : 0);
  }, [sourceId, targetId, selectedAlgorithm, isEmergencyMode]);

  // Handlers for Control Panel
  const handleSwapEndpoints = () => {
    setSourceId(targetId);
    setTargetId(sourceId);
  };

  const handleToggleRoadTraffic = (edgeId: string) => {
    setRoads((prev) =>
      prev.map((edge) => {
        if (edge.id !== edgeId) return edge;
        const nextTraffic: TrafficLevel =
          edge.traffic === 'low'
            ? 'medium'
            : edge.traffic === 'medium'
            ? 'heavy'
            : edge.traffic === 'heavy'
            ? 'blocked'
            : 'low';
        return { ...edge, traffic: nextTraffic };
      })
    );
    const road = roads.find((r) => r.id === edgeId);
    if (road) {
      triggerToast(`Road "${road.name}" traffic updated. Recalculating shortest path.`);
    }
  };

  const handleSimulateTraffic = () => {
    const levels: TrafficLevel[] = ['low', 'low', 'medium', 'medium', 'heavy'];
    setRoads((prev) =>
      prev.map((edge) => {
        const rand = Math.random();
        // 60% chance to perturb traffic
        if (rand < 0.6) {
          const newLevel = levels[Math.floor(Math.random() * levels.length)];
          return { ...edge, traffic: newLevel };
        }
        return edge;
      })
    );
    triggerToast('⚡ Real-time traffic updated across metropolitan arteries! Routes dynamically recalculated.');
  };

  // Demo Feature: Congest a road on the current route to immediately show rerouting!
  const handleCongestCurrentRouteRoad = () => {
    if (!activeResult || activeResult.pathEdgeIds.length === 0) return;
    
    // Pick an edge currently on the active route
    const targetEdgeId = activeResult.pathEdgeIds[Math.floor(activeResult.pathEdgeIds.length / 2)];
    const roadObj = roads.find((r) => r.id === targetEdgeId);
    if (!roadObj) return;

    setRoads((prev) =>
      prev.map((r) => (r.id === targetEdgeId ? { ...r, traffic: 'heavy' } : r))
    );

    triggerToast(
      `🚨 Gridlock detected on ${roadObj.name}! Travel time surged. System dynamically rerouted!`
    );
  };

  const handleClearCongestion = () => {
    setRoads((prev) => prev.map((edge) => ({ ...edge, traffic: 'low' })));
    triggerToast('All road congestion cleared. Network operating at free-flow speeds.');
  };

  const handleResetGraph = () => {
    setRoads(INITIAL_ROADS);
    setIsEmergencyMode(false);
    triggerToast('City graph reset to default baseline.');
  };

  const handleLoadPreset = (src: string, dst: string, emergency = false) => {
    setSourceId(src);
    setTargetId(dst);
    setIsEmergencyMode(emergency);
    triggerToast(`Loaded demo scenario: ${src} ➔ ${dst}${emergency ? ' (Emergency Mode)' : ''}`);
  };

  const handleStartVisualizer = () => {
    setCurrentStepIndex(0);
    setIsVisualizerRunning(true);
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Header */}
      <Header
        isEmergencyMode={isEmergencyMode}
        onToggleEmergency={() => setIsEmergencyMode(!isEmergencyMode)}
        onOpenDAAModal={() => setIsDAAModalOpen(true)}
        onResetGraph={handleResetGraph}
        networkCongestionIndex={networkCongestionIndex}
        activeRoadsCount={activeRoads}
        totalRoadsCount={totalRoads}
      />

      {/* Dynamic Toast Banner */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="bg-slate-900/95 border border-cyan-500/80 text-cyan-200 px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-md text-xs font-semibold flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Control Center Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6 flex flex-col gap-5">
        {/* Top KPIs / Smart City Dashboard */}
        <CityDashboard
          edges={roads}
          activeResult={activeResult}
          staticResult={staticResult}
          onToggleRoadTraffic={handleToggleRoadTraffic}
          isEmergencyMode={isEmergencyMode}
        />

        {/* Center Section: City Map + Control Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left: Interactive City Map (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <CityMap
              nodes={nodes}
              edges={roads}
              sourceId={sourceId}
              targetId={targetId}
              onSelectSource={setSourceId}
              onSelectTarget={setTargetId}
              onToggleRoadTraffic={handleToggleRoadTraffic}
              activeResult={activeResult}
              staticResult={staticResult}
              currentVisualizerStep={currentVisualizerStep}
              isEmergencyMode={isEmergencyMode}
              showNaiveRouteOverlay={showNaiveOverlay}
            />

            {/* Quick Map Guidance Note */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-2">
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                <span>Green: Low traffic · Yellow: Moderate · Red: Gridlock · Cyan/Red Glow: Active Optimal Route</span>
              </span>
              <button
                onClick={() => setIsDAAModalOpen(true)}
                className="text-cyan-400 hover:text-cyan-300 font-semibold underline decoration-cyan-500/40"
              >
                View O((V+E)logV) proof
              </button>
            </div>
          </div>

          {/* Right: Control Panel (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <ControlPanel
              nodes={nodes}
              edges={roads}
              sourceId={sourceId}
              targetId={targetId}
              onSourceChange={setSourceId}
              onTargetChange={setTargetId}
              onSwapEndpoints={handleSwapEndpoints}
              selectedAlgorithm={selectedAlgorithm}
              onSelectAlgorithm={setSelectedAlgorithm}
              onSimulateTraffic={handleSimulateTraffic}
              onCongestCurrentRouteRoad={handleCongestCurrentRouteRoad}
              onClearCongestion={handleClearCongestion}
              onRunAlgorithm={handleStartVisualizer}
              isEmergencyMode={isEmergencyMode}
              onToggleEmergency={() => setIsEmergencyMode(!isEmergencyMode)}
              showNaiveOverlay={showNaiveOverlay}
              onToggleNaiveOverlay={() => setShowNaiveOverlay(!showNaiveOverlay)}
              onLoadPreset={handleLoadPreset}
              isVisualizerRunning={isVisualizerRunning}
            />
          </div>
        </div>

        {/* Step-by-Step Priority Queue & Visualizer Panel */}
        <AlgorithmVisualizer
          algorithmType={selectedAlgorithm}
          result={activeResult}
          currentStepIndex={currentStepIndex}
          isPlaying={isVisualizerRunning}
          onPlay={() => setIsVisualizerRunning(true)}
          onPause={() => setIsVisualizerRunning(false)}
          onStepForward={handleNextStep}
          onStepBackward={() => setCurrentStepIndex((p) => Math.max(0, p - 1))}
          onReset={() => {
            setIsVisualizerRunning(false);
            setCurrentStepIndex(0);
          }}
          onJumpToEnd={() => {
            setIsVisualizerRunning(false);
            setCurrentStepIndex(activeResult.steps.length - 1);
          }}
          speedMs={visualizerSpeedMs}
          onSpeedChange={setVisualizerSpeedMs}
        />

        {/* Route Comparison Matrix & Efficiency Metrics */}
        <RouteComparison
          staticResult={staticResult}
          smartDijkstraResult={smartDijkstraResult}
          smartAStarResult={smartAStarResult}
          isEmergencyMode={isEmergencyMode}
        />
      </main>

      {/* DAA Algorithm Analysis Modal */}
      <DAAAnalysisModal
        isOpen={isDAAModalOpen}
        onClose={() => setIsDAAModalOpen(false)}
        vCount={nodes.length}
        eCount={roads.length}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>Smart Traffic Route Optimization</strong> · DAA Hackathon Project · Dijkstra & A* Graph Routing
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            Graph: |V| = {nodes.length} vertices, |E| = {roads.length} edges
          </div>
        </div>
      </footer>
    </div>
  );
}
