import { CityNode, RoadEdge, RoutingMode, AlgorithmResult, AlgorithmStep } from './types';
import { PriorityQueue } from './priorityQueue';
import { calculateEdgeTravelTime, calculateAStarHeuristic } from './graphData';

interface AdjacencyNeighbor {
  nodeId: string;
  edge: RoadEdge;
  weight: number;
}

export function runAStar(
  nodes: CityNode[],
  edges: RoadEdge[],
  sourceId: string,
  targetId: string,
  mode: RoutingMode
): AlgorithmResult {
  const startTime = performance.now();
  const nodesMap = new Map(nodes.map((n) => [n.id, n]));

  // Build Adjacency List
  const adj = new Map<string, AdjacencyNeighbor[]>();
  nodes.forEach((n) => adj.set(n.id, []));

  edges.forEach((edge) => {
    const weight = calculateEdgeTravelTime(edge, mode);
    if (edge.traffic !== 'blocked') {
      adj.get(edge.u)?.push({ nodeId: edge.v, edge, weight });
      adj.get(edge.v)?.push({ nodeId: edge.u, edge, weight });
    }
  });

  const gScore: Record<string, number> = {};
  const fScore: Record<string, number> = {};
  const hScore: Record<string, number> = {};
  const parent: Record<string, string | null> = {};
  const parentEdge: Record<string, string | null> = {};
  const visited = new Set<string>();
  const visitedOrder: string[] = [];
  const steps: AlgorithmStep[] = [];

  nodes.forEach((n) => {
    gScore[n.id] = Infinity;
    fScore[n.id] = Infinity;
    hScore[n.id] = calculateAStarHeuristic(n.id, targetId, nodesMap, mode);
    parent[n.id] = null;
    parentEdge[n.id] = null;
  });

  gScore[sourceId] = 0;
  fScore[sourceId] = hScore[sourceId];

  // Min-Heap ordered by fScore = g(n) + h(n)
  const pq = new PriorityQueue<string>((id) => id);
  pq.insert(sourceId, fScore[sourceId], { g: 0, h: hScore[sourceId] });

  steps.push({
    stepIndex: steps.length,
    currentNode: sourceId,
    eventType: 'pop_min',
    description: `Initialize A*: g[${sourceId}] = 0, h[${sourceId}] = ${hScore[sourceId].toFixed(1)}, f[${sourceId}] = ${fScore[sourceId].toFixed(1)}. Added to Priority Queue.`,
    distances: { ...gScore },
    gScores: { ...gScore },
    hScores: { ...hScore },
    fScores: { ...fScore },
    pqSnapshot: pq.toArray().map((item) => ({
      id: item.item,
      priority: item.priority,
      g: gScore[item.item],
      h: hScore[item.item],
      f: fScore[item.item],
    })),
    visitedNodes: [],
    pseudoCodeLine: 1,
  });

  let edgesRelaxed = 0;

  while (!pq.isEmpty()) {
    const minNode = pq.pop()!;
    const u = minNode.item;
    const currentF = minNode.priority;

    if (visited.has(u)) {
      continue;
    }

    visited.add(u);
    visitedOrder.push(u);

    steps.push({
      stepIndex: steps.length,
      currentNode: u,
      eventType: 'pop_min',
      description: `A* Extract-Min: Exploring node '${u}' with lowest f(n) = ${currentF.toFixed(1)} [g: ${gScore[u].toFixed(1)}, h: ${hScore[u].toFixed(1)}].`,
      distances: { ...gScore },
      gScores: { ...gScore },
      hScores: { ...hScore },
      fScores: { ...fScore },
      pqSnapshot: pq.toArray().map((item) => ({
        id: item.item,
        priority: item.priority,
        g: gScore[item.item],
        h: hScore[item.item],
        f: fScore[item.item],
      })),
      visitedNodes: Array.from(visited),
      pseudoCodeLine: 4,
    });

    if (u === targetId) {
      steps.push({
        stepIndex: steps.length,
        currentNode: u,
        eventType: 'goal_reached',
        description: `Target destination '${targetId}' reached! A* early-exit triggered with provably optimal path.`,
        distances: { ...gScore },
        gScores: { ...gScore },
        hScores: { ...hScore },
        fScores: { ...fScore },
        pqSnapshot: pq.toArray().map((item) => ({
          id: item.item,
          priority: item.priority,
          g: gScore[item.item],
          h: hScore[item.item],
          f: fScore[item.item],
        })),
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

      const tentativeG = gScore[u] + weight;
      if (tentativeG < gScore[v]) {
        gScore[v] = tentativeG;
        fScore[v] = tentativeG + hScore[v];
        parent[v] = u;
        parentEdge[v] = edge.id;
        edgesRelaxed++;

        pq.decreasePriority(v, fScore[v], { g: tentativeG, h: hScore[v] });

        steps.push({
          stepIndex: steps.length,
          currentNode: u,
          examinedNeighbor: v,
          edgeWeight: weight,
          newTentativeDist: tentativeG,
          eventType: 'relax_edge',
          description: `A* Evaluation (${u} ➔ ${v}): g = ${tentativeG.toFixed(1)}, h = ${hScore[v].toFixed(1)}, f = g+h = ${fScore[v].toFixed(1)}. Updated Priority Queue.`,
          distances: { ...gScore },
          gScores: { ...gScore },
          hScores: { ...hScore },
          fScores: { ...fScore },
          pqSnapshot: pq.toArray().map((item) => ({
            id: item.item,
            priority: item.priority,
            g: gScore[item.item],
            h: hScore[item.item],
            f: fScore[item.item],
          })),
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

  if (gScore[targetId] !== Infinity) {
    while (curr) {
      path.unshift(curr);
      const edgeId = parentEdge[curr];
      if (edgeId) {
        pathEdgeIds.unshift(edgeId);
      }
      curr = parent[curr];
    }
  }

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
    algorithm: 'astar',
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
    distances: gScore,
    fScores: fScore,
    parentMap: parent,
    trafficBreakdown,
  };
}
