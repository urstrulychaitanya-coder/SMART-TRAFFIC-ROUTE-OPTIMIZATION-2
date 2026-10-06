import { CityNode, RoadEdge, TrafficLevel, RoutingMode } from './types';

export const INITIAL_NODES: CityNode[] = [
  {
    id: 'hospital',
    name: 'Apollo Apex Medical Center',
    shortName: 'Hospital',
    category: 'healthcare',
    x: 180,
    y: 130,
    description: 'Level 1 Trauma Center with 24/7 Emergency Care',
    isPopularPreset: true,
  },
  {
    id: 'residential_north',
    name: 'Greenwood Heights',
    shortName: 'Residential North',
    category: 'residential',
    x: 370,
    y: 80,
    description: 'High-density residential township & housing sector',
    isPopularPreset: true,
  },
  {
    id: 'school',
    name: 'City Science & Tech Campus',
    shortName: 'School / Univ',
    category: 'education',
    x: 600,
    y: 95,
    description: 'Metropolitan university with 20,000 students',
    isPopularPreset: true,
  },
  {
    id: 'airport',
    name: 'Metro International Airport',
    shortName: 'Airport',
    category: 'transit',
    x: 880,
    y: 140,
    description: 'Terminal 1 & 2 International Aviation Hub',
    isPopularPreset: true,
  },
  {
    id: 'fire_station',
    name: 'Central Fire Rescue HQ',
    shortName: 'Fire Station',
    category: 'civic',
    x: 120,
    y: 290,
    description: 'Emergency response command & quick-dispatch bay',
  },
  {
    id: 'heritage_quarter',
    name: 'Old Town Heritage Quarter',
    shortName: 'Heritage Qtr',
    category: 'civic',
    x: 290,
    y: 220,
    description: 'Historic district with narrow avenues and markets',
  },
  {
    id: 'city_center',
    name: 'Municipal Plaza (City Center)',
    shortName: 'City Center',
    category: 'civic',
    x: 480,
    y: 220,
    description: 'City administration center and central public square',
  },
  {
    id: 'mall',
    name: 'Plaza Royale Grand Mall',
    shortName: 'Shopping Mall',
    category: 'commercial',
    x: 710,
    y: 230,
    description: 'Premier retail, cinema, and dining complex',
    isPopularPreset: true,
  },
  {
    id: 'tech_park',
    name: 'Cyber Gateway Tech Park',
    shortName: 'Tech Park',
    category: 'tech',
    x: 910,
    y: 310,
    description: 'IT hub, software parks, and innovation towers',
  },
  {
    id: 'station',
    name: 'Grand Central Terminal',
    shortName: 'Railway Station',
    category: 'transit',
    x: 310,
    y: 370,
    description: 'Main intercity railway and express subway junction',
    isPopularPreset: true,
  },
  {
    id: 'downtown',
    name: 'Downtown Financial District',
    shortName: 'Downtown Core',
    category: 'commercial',
    x: 520,
    y: 360,
    description: 'Skyscrapers, banking headquarters, and exchange',
  },
  {
    id: 'convention_center',
    name: 'Global Expo Arena',
    shortName: 'Expo Arena',
    category: 'civic',
    x: 730,
    y: 370,
    description: 'Sports stadium, concert hall, and conference arena',
  },
  {
    id: 'industrial_port',
    name: 'Seaport Logistics Zone',
    shortName: 'Harbor Port',
    category: 'industrial',
    x: 140,
    y: 490,
    description: 'Maritime freight terminal, warehouses, and customs',
  },
  {
    id: 'residential_south',
    name: 'Sunset Valley Suburbs',
    shortName: 'Residential South',
    category: 'residential',
    x: 380,
    y: 510,
    description: 'Quiet suburban community with schools and parks',
    isPopularPreset: true,
  },
  {
    id: 'riverside_junction',
    name: 'Riverside Marina Promenade',
    shortName: 'Riverside',
    category: 'commercial',
    x: 610,
    y: 500,
    description: 'Riverfront waterfront restaurants and boardwalk',
  },
  {
    id: 'south_gateway',
    name: 'South Expressway Gateway',
    shortName: 'South Gateway',
    category: 'transit',
    x: 850,
    y: 490,
    description: 'Southern arterial highway interchange',
  },
];

export const INITIAL_ROADS: RoadEdge[] = [
  // Row 1 & Cross connections
  {
    id: 'r_hosp_res_n',
    u: 'hospital',
    v: 'residential_north',
    name: 'Medical Boulevard',
    distanceKm: 4.8,
    speedLimitKmh: 50,
    traffic: 'low',
    lanes: 4,
    isEmergencyLane: true,
  },
  {
    id: 'r_res_n_school',
    u: 'residential_north',
    v: 'school',
    name: 'Academic Corridor',
    distanceKm: 5.5,
    speedLimitKmh: 45,
    traffic: 'low',
    lanes: 4,
  },
  {
    id: 'r_school_airport',
    u: 'school',
    v: 'airport',
    name: 'Skyway North Bypass',
    distanceKm: 6.8,
    speedLimitKmh: 65,
    traffic: 'low',
    lanes: 6,
    isEmergencyLane: true,
  },

  // Western vertical connections
  {
    id: 'r_hosp_fire',
    u: 'hospital',
    v: 'fire_station',
    name: 'Emergency Services Link',
    distanceKm: 3.5,
    speedLimitKmh: 45,
    traffic: 'low',
    lanes: 2,
    isEmergencyLane: true,
  },
  {
    id: 'r_hosp_heritage',
    u: 'hospital',
    v: 'heritage_quarter',
    name: 'Old Town Avenue',
    distanceKm: 3.8,
    speedLimitKmh: 40,
    traffic: 'medium',
    lanes: 2,
  },
  {
    id: 'r_res_n_heritage',
    u: 'residential_north',
    v: 'heritage_quarter',
    name: 'Greenwood Lane',
    distanceKm: 3.9,
    speedLimitKmh: 40,
    traffic: 'low',
    lanes: 2,
  },
  {
    id: 'r_res_n_center',
    u: 'residential_north',
    v: 'city_center',
    name: 'Capital Arterial Way',
    distanceKm: 4.2,
    speedLimitKmh: 55,
    traffic: 'low',
    lanes: 4,
  },
  {
    id: 'r_school_center',
    u: 'school',
    v: 'city_center',
    name: 'University Drive',
    distanceKm: 4.0,
    speedLimitKmh: 45,
    traffic: 'low',
    lanes: 4,
  },
  {
    id: 'r_school_mall',
    u: 'school',
    v: 'mall',
    name: 'Commerce Parkway',
    distanceKm: 4.5,
    speedLimitKmh: 50,
    traffic: 'low',
    lanes: 4,
  },
  {
    id: 'r_airport_mall',
    u: 'airport',
    v: 'mall',
    name: 'Terminal Radial Road',
    distanceKm: 5.2,
    speedLimitKmh: 60,
    traffic: 'medium',
    lanes: 4,
  },
  {
    id: 'r_airport_tech',
    u: 'airport',
    v: 'tech_park',
    name: 'Airport Express Highway',
    distanceKm: 5.6,
    speedLimitKmh: 70,
    traffic: 'low',
    lanes: 6,
    isEmergencyLane: true,
  },

  // Mid-tier horizontal & diagonals
  {
    id: 'r_fire_station_rail',
    u: 'fire_station',
    v: 'station',
    name: 'Railway Depot Spur',
    distanceKm: 4.4,
    speedLimitKmh: 45,
    traffic: 'low',
    lanes: 2,
    isEmergencyLane: true,
  },
  {
    id: 'r_heritage_station',
    u: 'heritage_quarter',
    v: 'station',
    name: 'Station Bazaar Road',
    distanceKm: 3.4,
    speedLimitKmh: 35,
    traffic: 'heavy', // Frequently jammed historic bottleneck!
    lanes: 2,
  },
  {
    id: 'r_heritage_center',
    u: 'heritage_quarter',
    v: 'city_center',
    name: 'Civic Promenade',
    distanceKm: 4.6,
    speedLimitKmh: 50,
    traffic: 'low',
    lanes: 4,
  },
  {
    id: 'r_center_mall',
    u: 'city_center',
    v: 'mall',
    name: 'Metro Grand Boulevard',
    distanceKm: 5.8,
    speedLimitKmh: 55,
    traffic: 'low',
    lanes: 6,
  },
  {
    id: 'r_center_downtown',
    u: 'city_center',
    v: 'downtown',
    name: 'Financial Core Flyover',
    distanceKm: 3.6,
    speedLimitKmh: 60,
    traffic: 'low',
    lanes: 4,
    isEmergencyLane: true,
  },
  {
    id: 'r_mall_tech',
    u: 'mall',
    v: 'tech_park',
    name: 'Silicon Link',
    distanceKm: 5.1,
    speedLimitKmh: 50,
    traffic: 'low',
    lanes: 4,
  },
  {
    id: 'r_mall_expo',
    u: 'mall',
    v: 'convention_center',
    name: 'Arena Way',
    distanceKm: 3.7,
    speedLimitKmh: 50,
    traffic: 'low',
    lanes: 4,
  },

  // Downtown Core Cross-links
  {
    id: 'r_station_downtown',
    u: 'station',
    v: 'downtown',
    name: 'Central Commuter Arterial',
    distanceKm: 5.1,
    speedLimitKmh: 45,
    traffic: 'heavy', // Classic central bottleneck during rush hour
    lanes: 4,
  },
  {
    id: 'r_downtown_expo',
    u: 'downtown',
    v: 'convention_center',
    name: 'Broadway East Extension',
    distanceKm: 5.3,
    speedLimitKmh: 55,
    traffic: 'low',
    lanes: 4,
  },
  {
    id: 'r_tech_expo',
    u: 'tech_park',
    v: 'convention_center',
    name: 'Enterprise Avenue',
    distanceKm: 4.9,
    speedLimitKmh: 50,
    traffic: 'low',
    lanes: 4,
  },
  {
    id: 'r_tech_southgate',
    u: 'tech_park',
    v: 'south_gateway',
    name: 'Outer Ring Bypass East',
    distanceKm: 4.7,
    speedLimitKmh: 65,
    traffic: 'low',
    lanes: 6,
  },

  // South Tier & Port Connections
  {
    id: 'r_fire_port',
    u: 'fire_station',
    v: 'industrial_port',
    name: 'Harbor Emergency Route',
    distanceKm: 4.9,
    speedLimitKmh: 50,
    traffic: 'low',
    lanes: 4,
    isEmergencyLane: true,
  },
  {
    id: 'r_port_rail',
    u: 'industrial_port',
    v: 'station',
    name: 'Freight Interchange Lane',
    distanceKm: 5.2,
    speedLimitKmh: 40,
    traffic: 'medium',
    lanes: 2,
  },
  {
    id: 'r_port_res_s',
    u: 'industrial_port',
    v: 'residential_south',
    name: 'Dockland Ringway',
    distanceKm: 5.8,
    speedLimitKmh: 50,
    traffic: 'low',
    lanes: 4,
  },
  {
    id: 'r_station_res_s',
    u: 'station',
    v: 'residential_south',
    name: 'Valley Boulevard',
    distanceKm: 3.8,
    speedLimitKmh: 50,
    traffic: 'low',
    lanes: 4,
  },
  {
    id: 'r_res_s_riverside',
    u: 'residential_south',
    v: 'riverside_junction',
    name: 'Sunset Waterfront Drive',
    distanceKm: 5.7,
    speedLimitKmh: 50,
    traffic: 'low',
    lanes: 4,
  },
  {
    id: 'r_downtown_riverside',
    u: 'downtown',
    v: 'riverside_junction',
    name: 'Riverbridge South Overpass',
    distanceKm: 4.1,
    speedLimitKmh: 55,
    traffic: 'low',
    lanes: 4,
    isEmergencyLane: true,
  },
  {
    id: 'r_expo_riverside',
    u: 'convention_center',
    v: 'riverside_junction',
    name: 'South Marina Trunk',
    distanceKm: 4.6,
    speedLimitKmh: 45,
    traffic: 'low',
    lanes: 4,
  },
  {
    id: 'r_riverside_southgate',
    u: 'riverside_junction',
    v: 'south_gateway',
    name: 'Coastal Beltway Highway',
    distanceKm: 6.2,
    speedLimitKmh: 65,
    traffic: 'low',
    lanes: 6,
    isEmergencyLane: true,
  },
  {
    id: 'r_expo_southgate',
    u: 'convention_center',
    v: 'south_gateway',
    name: 'Stadium South Expressway',
    distanceKm: 4.3,
    speedLimitKmh: 60,
    traffic: 'low',
    lanes: 4,
  },
];

/**
 * Calculates effective travel time (minutes) on a road segment based on distance,
 * speed limit, traffic congestion, and vehicle mode.
 */
export function calculateEdgeTravelTime(
  edge: RoadEdge,
  mode: RoutingMode
): number {
  if (edge.traffic === 'blocked') {
    return 9999.0; // effectively disconnected / impassable
  }

  // Base free-flow time in minutes: (dist / speed) * 60
  const freeFlowMin = (edge.distanceKm / edge.speedLimitKmh) * 60;

  if (mode === 'static_distance') {
    // Pure distance optimization
    return edge.distanceKm;
  }

  let multiplier = 1.0;
  switch (edge.traffic) {
    case 'low':
      multiplier = 1.0;
      break;
    case 'medium':
      multiplier = 1.85;
      break;
    case 'heavy':
      multiplier = 3.6;
      break;
  }

  if (mode === 'emergency') {
    // Emergency vehicle has priority signals and emergency lanes
    if (edge.isEmergencyLane) {
      // Emergency lane reduces congestion penalty drastically
      if (edge.traffic === 'heavy') multiplier = 1.35;
      else if (edge.traffic === 'medium') multiplier = 1.15;
      else multiplier = 0.85; // can speed up on clear emergency lane
    } else {
      // Normal streets with heavy traffic severely trap emergency vehicles
      if (edge.traffic === 'heavy') multiplier = 4.5;
    }
  }

  return Number((freeFlowMin * multiplier).toFixed(2));
}

/**
 * Helper to get Euclidean distance between two nodes (scaled to kilometers)
 * Used as the admissible heuristic h(n) in A* search.
 */
export function getEuclideanDistance(
  uNode: CityNode,
  vNode: CityNode
): number {
  const dx = (uNode.x - vNode.x) * 0.025; // scaling factor to realistic city km
  const dy = (uNode.y - vNode.y) * 0.025;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Admissible heuristic for A*: estimated minimum travel time to goal.
 * Using max network speed (70 km/h) ensures h(n) <= true remaining time h*(n).
 * Therefore A* is guaranteed to find the mathematically optimal route!
 */
export function calculateAStarHeuristic(
  nodeId: string,
  targetId: string,
  nodesMap: Map<string, CityNode>,
  mode: RoutingMode
): number {
  const u = nodesMap.get(nodeId);
  const v = nodesMap.get(targetId);
  if (!u || !v) return 0;

  const straightLineKm = getEuclideanDistance(u, v);

  if (mode === 'static_distance') {
    return straightLineKm;
  }

  // Max free flow speed in city is 70 km/h
  const maxLegalSpeedKmh = 70;
  const minPossibleTimeMin = (straightLineKm / maxLegalSpeedKmh) * 60;
  return minPossibleTimeMin;
}
