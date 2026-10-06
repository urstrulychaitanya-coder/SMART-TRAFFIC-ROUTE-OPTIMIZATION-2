import { CityNode, RoadEdge, RoutingMode, AlgorithmResult, AlgorithmStep, TrafficLevel } from './types';
import { PriorityQueue } from './priorityQueue';
import { calculateEdgeTravelTime } from './graphData';

interface AdjacencyNeighbor {
  nodeId: string;
  edge: RoadEdge;
  weight: number;
}

export function runDijkstra(
  nodes: CityNode[],
  edges: RoadEdge[],
  sourceId: string,
  targetId: string,
  mode: RoutingMode
): AlgorithmResult {
  const startTime = performance.now();

  // 1. Build Adjacency List (roads are bidirectional in the city grid)
  const adj = new Map<string, AdjacencyNeighbor[]>();
  nodes.forEach((n) => adj.set(n.id, []));

  edges.forEach((edge) => {
    const weight = calculateEdgeTravelTime(edge, mode);
    // Ignore completely blocked roads if impassable
    if (edge.traffic !== 'blocked') {
      adj.get(edge.u)?.push({ nodeId: edge.v, edge, weight });
      adj.get(edge.v)?.push({ nodeId: edge.u, edge, weight });
    }
  });

  const dist: Record<string, number> = {};
  const parent: Record<string, string | null> = {};
  const parentEdge: Record<string, string | null> = {};
  const visited = new Set<string>();
  const visitedOrder: string[] = [];
  const steps: AlgorithmStep[] = [];

  nodes.forEach((n) => {
    dist[n.id] = Infinity;
    parent[n.id] = null;
    parentEdge[n.id] = null;
  });

  dist[sourceId] = 0;
  const pq = new PriorityQueue<string>((id) => id);
  pq.insert(sourceId, 0);

  // Initial step snapshot
  steps.push({
    stepIndex: steps.length,
    currentNode: sourceId,
    eventType: 'pop_min',
    description: `Initialize Dijkstra: dist[${sourceId}] = 0, dist[others] = ∞. Insert source into Min-Heap Priority Queue.`,
    distances: { ...dist },
    pqSnapshot: pq.toArray().map((item) => ({ id: item.item, priority: item.priority })),
    visitedNodes: [],
    pseudoCodeLine: 1,
  });

  let edgesRelaxed = 0;

  while (!pq.isEmpty()) {
    const minNode = pq.pop()!;
    const u = minNode.item;
    const currentDist = minNode.priority;

    // Skip stale entries in heap
    if (visited.has(u)) {
      continue;
    }

    visited.add(u);
    visitedOrder.push(u);

    steps.push({
      stepIndex: steps.length,
      currentNode: u,
      eventType: 'pop_min',
      description: `Extract-Min: Dequeue node '${u}' with shortest tentative distance ${currentDist.toFixed(1)} ${mode === 'static_distance' ? 'km' : 'min'}.`,
      distances: { ...dist },
      pqSnapshot: pq.toArray().map((item) => ({ id: item.item, priority: item.priority })),
      visitedNodes: Array.from(visited),
      pseudoCodeLine: 4,
    });

    if (u === targetId) {
      steps.push({
        stepIndex: steps.length,
        currentNode: u,
        eventType: 'goal_reached',
        description: `Target destination '${targetId}' reached! Optimal shortest path verified.`,
        distances: { ...dist },
        pqSnapshot: pq.toArray().map((item) => ({ id: item.item, priority: item.priority })),
        visitedNodes: Array.from(visited),
        pseudoCodeLine: 5,
      });
      break;
    }

    const neighbors = adj.get(u) || [];
    for (const { nodeId: v, edge, weight } of neighbors) {
      if (visited.has(v)) {
        continue;
      }

      const tentativeDist = currentDist + weight;
      if (tentativeDist < dist[v]) {
        dist[v] = tentativeDist;
        parent[v] = u;
        parentEdge[v] = edge.id;
        edgesRelaxed++;

        pq.decreasePriority(v, tentativeDist);

        steps.push({
          stepIndex: steps.length,
          currentNode: u,
          examinedNeighbor: v,
          edgeWeight: weight,
          newTentativeDist: tentativeDist,
          eventType: 'relax_edge',
          description: `Relax edge (${u} ➔ ${v}, wt: ${weight.toFixed(1)}): Improved dist[${v}] to ${tentativeDist.toFixed(1)}. Updated Priority Queue.`,
          distances: { ...dist },
          pqSnapshot: pq.toArray().map((item) => ({ id: item.item, priority: item.priority })),
          visitedNodes: Array.from(visited),
          pseudoCodeLine: 7,
        });
      }
    }
  }

  // Reconstruct path
  const path: string[] = [];
  const pathEdgeIds: string[] = [];
  let curr: string | null = targetId;

  if (dist[targetId] !== Infinity) {
    while (curr) {
      path.unshift(curr);
      const edgeId = parentEdge[curr];
      if (edgeId) {
        pathEdgeIds.unshift(edgeId);
      }
      curr = parent[curr];
    }
  }

  // Calculate actual total distance and real travel time on the path
  let totalDistanceKm = 0;
  let totalTravelTimeMin = 0;
  const trafficBreakdown = {
    lowCount: 0,
    mediumCount: 0,
    heavyCount: 0,
    blockedCount: 0,
  };

  const edgeMap = new Map(edges.map((e) => [e.id, e]));
  for (const edgeId of pathEdgeIds) {
    const edge = edgeMap.get(edgeId);
    if (edge) {
      totalDistanceKm += edge.distanceKm;
      const t = calculateEdgeTravelTime(edge, mode === 'emergency' ? 'emergency' : 'smart_time');
      totalTravelTimeMin += t;
      if (edge.traffic === 'low') trafficBreakdown.lowCount++;
      else if (edge.traffic === 'medium') trafficBreakdown.mediumCount++;
      else if (edge.traffic === 'heavy') trafficBreakdown.heavyCount++;
      else if (edge.traffic === 'blocked') trafficBreakdown.blockedCount++;
    }
  }

  const executionTimeMs = Number((performance.now() - startTime).toFixed(3));

  return {
    algorithm: 'dijkstra',
    source: sourceId,
    target: targetId,
    path,
    pathEdgeIds,
    totalDistanceKm: Number(totalDistanceKm.toFixed(1)),
    totalTravelTimeMin: Number(totalTravelTimeMin.toFixed(1)),
    nodesExplored: visited.size,
    edgesRelaxed,
    executionTimeMs,
    steps,
    visitedOrder,
    distances: dist,
    parentMap: parent,
    trafficBreakdown,
  };
}
