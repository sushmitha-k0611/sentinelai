import api from "./api";

export interface GraphNode {
  id: string;
  label: string;
  type: "victim" | "phone" | "email" | "upi" | "bank_account" | "device" | "ip_address" | "city";
  color: string;
  reports: number[];
}

export interface GraphEdge {
  from: string;
  to: string;
  label?: string;
}

export interface SuspectedRing {
  id: string;
  victim_count: number;
  victims: string[];
  nodes: { id: string; label: string; type: string }[];
}

export interface GraphStats {
  total_nodes: number;
  total_edges: number;
  suspected_rings: number;
  average_connections: number;
}

export interface NetworkGraphResponse {
  nodes: GraphNode[];
  edges: GraphEdge[];
  rings: SuspectedRing[];
  stats: GraphStats;
}

export const getNetworkGraph = async (): Promise<NetworkGraphResponse> => {
  const response = await api.get("/graph/network");
  return response.data;
};

export const getReportSubgraph = async (reportId: number): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> => {
  const response = await api.get(`/graph/user/${reportId}`);
  return response.data;
};
