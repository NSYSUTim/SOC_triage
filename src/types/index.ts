// ============================================
// SOC Triage Demo - 核心資料型別定義
// ============================================

/** 嚴重等級 */
export type SeverityLevel = "low" | "medium" | "high" | "critical";

/** Incident 狀態 */
export type IncidentStatus = "new" | "in_progress" | "resolved" | "suppressed";

/** 日誌事件動作 */
export type EventAction = "allow" | "deny" | "alert" | "drop";

/** 報告中比較的 DeepCASE-style 方法 */
export type ModelVariant = "baseline" | "cross_host" | "hierarchical_context" | "rebalanced";

/** 前端呈現的 triage 決策 */
export type TriageDecision = "incident" | "benign" | "rejected";

// ============================================
// 單筆日誌事件 (Raw Event)
// ============================================
export interface Event {
    id: string;
    timestamp: string;
    src_ip: string;
    dst_ip: string;
    src_port?: number;
    dst_port?: number;
    rule: string;
    action: EventAction;
    severity: SeverityLevel;
    threat_id?: string;
    threat_name?: string;
    app?: string;
    protocol?: string;
    bytes_sent?: number;
    bytes_received?: number;
}

// ============================================
// 聚合後的 Incident
// ============================================
export interface Incident {
    id: string;

    // 排序/優先級相關 (由 TEQ 模型產出)
    priority: number;           // 0-100，越高越需優先處理
    actionability: number;      // 可行動性分數 0-1
    severity_level: SeverityLevel;
    status: IncidentStatus;

    // 摘要資訊
    title: string;
    description?: string;
    event_count: number;
    first_seen: string;
    last_seen: string;

    // 關聯實體統計
    entities: IncidentEntities;

    // 所屬事件 IDs (對應 events 資料)
    event_ids: string[];

    // DeepCASE 分群資訊
    cluster_id?: number;
    cluster_label?: string;
    method_variant: ModelVariant;
    triage_decision: TriageDecision;
    model_confidence?: number;
    reject_reason?: string;
    analyst_focus?: string;

    // LLM 產出的回報
    llm_report?: LLMReport;
}

/** Incident 內的實體統計 */
export interface IncidentEntities {
    src_ips: string[];
    dst_ips: string[];
    threats: string[];
    rules: string[];
    apps: string[];
}

/** LLM 自動生成的回報 */
export interface LLMReport {
    summary: string;
    risk_assessment: string;
    recommended_actions: string[];
    manual_review_items: string[];
    cti_references?: string[];   // 外部威脅情資參考
    generated_at: string;
}

// ============================================
// 溯源圖 (Entity Graph)
// ============================================
export interface GraphNode {
    id: string;
    label: string;
    type: "src_ip" | "dst_ip" | "threat" | "rule" | "app";
    count?: number;
}

export interface GraphEdge {
    from: string;
    to: string;
    count: number;
    first_seen: string;
    last_seen: string;
}

export interface EntityGraph {
    nodes: GraphNode[];
    edges: GraphEdge[];
}

// ============================================
// API 回應格式 (預留給後端)
// ============================================
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
}

export interface IncidentListParams {
    page?: number;
    page_size?: number;
    sort_by?: "priority" | "first_seen" | "last_seen" | "severity_level";
    sort_order?: "asc" | "desc";
    status?: IncidentStatus[];
    severity?: SeverityLevel[];
    top_k?: number;  // 只取前 K 個
}

// ============================================
// Dashboard 統計
// ============================================
export interface DashboardStats {
    total_incidents: number;
    new_incidents: number;
    critical_count: number;
    high_count: number;
    medium_count: number;
    low_count: number;
    resolved_today: number;
    avg_priority: number;
    train_events: number;
    test_events: number;
    best_method: ModelVariant;
    best_binary_f1: number;
    workload_reduction: number;
    reject_rate: number;
}

// ============================================
// 論文正式結果摘要
// ============================================
export interface MethodResult {
    method: ModelVariant;
    label: string;
    role: string;
    clusters: number;
    workload_reduction: number;
    cluster_purity: number;
    auto_decided_rate: number;
    reject_rate: number;
    binary_f1: number;
    weighted_f1: number | null;
    interpretation: string;
}
