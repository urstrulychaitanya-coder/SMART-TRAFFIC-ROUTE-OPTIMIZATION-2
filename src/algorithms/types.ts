/**
 * Type definitions for Smart Traffic Route Optimization (DAA Hackathon)
 */

export type TrafficLevel = 'low' | 'medium' | 'heavy' | 'blocked';

export type NodeCategory = 
  | 'healthcare'
  | 'transit'
  | 'education'
  | 'commercial'
  | 'residential'
  | 'tech'
  | 'civic'
  | 'industrial';

export interface CityNode {
  id: string;
  name: string;
  shortName: string;
  category: NodeCategory;
  x: number;
  y: number;
  description: string;
  isPopularPreset?: boolean;
}

export interface RoadEdge {
  id: string;
  u: string;
  v: string;
  name: string;
  distanceKm: number;
  speedLimitKmh: number;
  traffic: TrafficLevel;
  lanes: number;
  isEmergencyLane?: boolean;
}

export type RoutingMode = 'smart_time' | 'static_distance' | 'emergency';
export type AlgorithmType = 'dijkstra' | 'astar';

export interface AlgorithmStep {
  stepIndex: number;
  currentNode: string;
  eventType: 'pop_min' | 'relax_edge' | 'skip_visited' | 'goal_reached' | 'no_path';
  description: string;
  examinedNeighbor?: string;
  edgeWeight?: number;
  newTentativeDist?: number;
  distances: Record<string, number>;
  gScores?: Record<string, number>;
  hScores?: Record<string, number>;
  fScores?: Record<string, number>;
  pqSnapshot: Array<{
    id: string;
    priority: number;
    g?: number;
    h?: number;
    f?: number;
  }>;
  visitedNodes: string[];
  pseudoCodeLine: number;
}

export interface AlgorithmResult {
  algorithm: AlgorithmType;
  source: string;
  target: string;
  path: string[];
  pathEdgeIds: string[];
  totalDistanceKm: number;
  totalTravelTimeMin: number;
  nodesExplored: number;
  edgesRelaxed: number;
  executionTimeMs: number;
  steps: AlgorithmStep[];
  visitedOrder: string[];
  distances: Record<string, number>;
  fScores?: Record<string, number>;
  parentMap: Record<string, string | null>;
  trafficBreakdown: {
    lowCount: number;
    mediumCount: number;
    heavyCount: number;
    blockedCount: number;
  };
}

export interface RouteComparisonStats {
  source: string;
  target: string;
  staticRoute: AlgorithmResult;
  smartDijkstraRoute: AlgorithmResult;
  smartAStarRoute: AlgorithmResult;
  timeSavedMin: number;
  timeSavedPercent: number;
  distanceDiffKm: number;
}
