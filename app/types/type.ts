export type BuildStatus = "Passing" | "Failing" | "Running";

export type DashboardData = {
  summary: {
    activeBranch: string;
    lastDeploy: string;
    openIssues: {
      total: number;
      critical: number;
      major: number;
      minor: number;
    };
    build: {
      status: BuildStatus;
      lastRunLabel: string;
    };
  };
  tasks: {
    completed: number;
    total: number;
    items: Array<{
      id: string;
      done: boolean;
      title: string;
      meta: string;
      accent?: "point" | "danger";
    }>;
  };
  activity: Array<{
    hash: string;
    message: string;
    time: string;
  }>;
  environment: {
    runtime: string[];
    ui: string[];
    charts: string[];
  };
};

export type LogLevel = "INFO" | "WARN" | "ERROR";

export type LogEntry = {
  id: number;
  timestamp: string;
  level: LogLevel;
  message: string;
  createdAt: string;
};

export type MetricType = "requests" | "errors" | "db";

export type MetricDataPoint = {
  timestamp: number;
  value: number;
};

export type ChartDataset = {
  label: string;
  data: MetricDataPoint[];
  borderColor: string;
  backgroundColor: string;
  fill?: boolean;
};

export type ServiceStatus = "UP" | "DEGRADED" | "DOWN";

export type ServiceHealth = {
  name: string;
  status: ServiceStatus;
  latencyMs: number;
  errorRate: number;
  updatedAt: string;
};

export type Variant = "primary" | "secondary" | "ghost";

export type GalleryPayload = {
  meta: {
    title: string;
    version: string;
    updatedAt: string;
  };
  categories: Array<{
    id: string;
    label: string;
    activeByDefault: boolean;
  }>;
  button: {
    description: string;
    variants: Variant[];
    usageTemplate: (variant: Variant) => string;
  };
  badge: {
    description: string;
    examples: Array<{
      label: string;
      tone: "info" | "warning" | "error" | "draft";
      icon: "check" | "dot" | "square";
    }>;
    usageSnippet: string;
  };
  infoCard: {
    description: string;
    examples: Array<{
      title: string;
      value: string;
      hint?: string;
      tone: "info" | "success" | "warning";
    }>;
    usageSnippet: string;
  };
};

export type CategoryId =
  | "all"
  | "buttons"
  | "badges"
  | "cards"
  | "forms"
  | "checkbox";

export type ClusterStatus = "HEALTHY" | "DEGRADED" | "DOWN";

export type ClusterSummary = {
  clusterName: string;
  status: ClusterStatus;
  brokers: number;
  topics: number;
  partitions: number;
  underReplicated: number;
  messageInPerSec: number;
  messageOutPerSec: number;
  storageUsedGB: number;
  storageTotalGB: number;
  updatedAt: string;
};

export type DiffPayload = {
  original: string;
  modified: string;
  language?: string;
  updatedAt: string;
};

export type BrokerStatus = "ONLINE" | "OFFLINE" | "DEGRADED";

export type BrokerEntry = {
  id: number;
  host: string;
  rack?: string;
  status: BrokerStatus;
  cpu: number; // %
  memory: number; // %
  disk: number; // %
  networkIn: number; // MB/s
  networkOut: number; // MB/s
  updatedAt: string;
};

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export type SavedRequest = {
  id: number;
  name: string;
  method: HttpMethod;
  url: string;
};

export type AlertLevel = "INFO" | "WARN" | "ERROR" | "CRITICAL";

export type AlertEntry = {
  id: number;
  timestamp: string; // UI-friendly
  level: AlertLevel;
  title: string;
  message: string;
  source?: string; // broker/topic/service 등
  acknowledged: boolean;
  createdAt: string; // ISO
};

export type TopicEntry = {
  name: string;
  partitions: number;
  replicationFactor: number;
  messageInPerSec: number;
  messageOutPerSec: number;
  lag: number;
  sizeGB: number;
  updatedAt: string;
};
