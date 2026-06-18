import { Incident, Event, DashboardStats, EntityGraph, MethodResult } from '../types';

// ============================================
// Formal report result snapshot (2026-06-18)
// ============================================
export const formalMethodResults: MethodResult[] = [
    {
        method: "baseline",
        label: "Baseline",
        role: "DeepCASE reproduction",
        clusters: 35,
        workload_reduction: 0.9373,
        cluster_purity: 0.9874,
        auto_decided_rate: 0.9468,
        reject_rate: 0.0532,
        binary_f1: 0.7617,
        weighted_f1: 0.0055,
        interpretation: "Strong workload reduction, but incident prioritization has room to improve."
    },
    {
        method: "cross_host",
        label: "Cross-Host",
        role: "Context ablation",
        clusters: 40,
        workload_reduction: 0.9410,
        cluster_purity: 0.9799,
        auto_decided_rate: 0.9019,
        reject_rate: 0.0981,
        binary_f1: 0.7638,
        weighted_f1: 0.0006,
        interpretation: "Best workload reduction, but higher rejection and only marginal F1 gain."
    },
    {
        method: "hierarchical_context",
        label: "Hierarchical Context",
        role: "Temporal ablation",
        clusters: 87,
        workload_reduction: 0.9383,
        cluster_purity: 0.9792,
        auto_decided_rate: 0.9423,
        reject_rate: 0.0577,
        binary_f1: 0.7796,
        weighted_f1: 0.0066,
        interpretation: "Better binary F1 with near-baseline rejection, but much more cluster fragmentation."
    },
    {
        method: "rebalanced",
        label: "Rebalanced",
        role: "Main proposed method",
        clusters: 36,
        workload_reduction: 0.9365,
        cluster_purity: 0.9875,
        auto_decided_rate: 0.9307,
        reject_rate: 0.0693,
        binary_f1: 0.8088,
        weighted_f1: null,
        interpretation: "Strongest split-controlled incident-detection improvement."
    }
];

// ============================================
// Mock Incidents 資料
// ============================================
export const mockIncidents: Incident[] = [
    {
        id: "INC-001",
        priority: 95,
        actionability: 0.92,
        severity_level: "critical",
        status: "new",
        title: "Rebalanced Triage: High-Confidence Incident Cluster",
        description: "rebalanced variant 將稀有 incident 訊號提高權重後，判定此 cluster 需要優先處置",
        event_count: 156,
        first_seen: "2026-06-17T22:15:00Z",
        last_seen: "2026-06-17T23:45:00Z",
        entities: {
            src_ips: ["203.45.67.89", "203.45.67.90"],
            dst_ips: ["192.168.1.10", "192.168.1.11"],
            threats: ["brute-force", "ssh-attack"],
            rules: ["SSH-Brute-Force-Detection"],
            apps: ["ssh"]
        },
        event_ids: ["evt-001", "evt-002", "evt-003"],
        cluster_id: 1,
        cluster_label: "Incident-favoring rebalanced cluster",
        method_variant: "rebalanced",
        triage_decision: "incident",
        model_confidence: 0.94,
        analyst_focus: "驗證高 recall incident queue 是否包含真實攻擊階段事件",
        llm_report: {
            summary: "rebalanced 模型將此群組判為 incident，原因是 cluster prior、模型信心與事件距離均支持自動判斷。此範例保留 SSH 暴力破解情境，對應 SOC analyst 需優先確認的高風險 queue。",
            risk_assessment: "高風險 - rebalanced run 在正式結果中達到 binary F1 0.8088，適合作為主要 incident triage 展示案例",
            recommended_actions: [
                "立即封鎖來源 IP：203.45.67.89, 203.45.67.90",
                "確認目標主機的 SSH 帳戶是否有異常登入成功紀錄",
                "比對 cluster score 與 -4 benign/default code，確認此筆不是良性預設群",
                "考慮啟用 SSH Key-based 認證，停用密碼認證",
                "設定 Fail2Ban 或類似工具進行自動封鎖"
            ],
            manual_review_items: [
                "確認是否為授權的滲透測試活動",
                "檢查相關主機的登入成功日誌"
            ],
            cti_references: ["MITRE ATT&CK: T1110.001 - Brute Force: Password Guessing"],
            generated_at: "2026-06-17T23:50:00Z"
        }
    },
    {
        id: "INC-002",
        priority: 88,
        actionability: 0.85,
        severity_level: "high",
        status: "new",
        title: "Hierarchical Context: Earlier Precursor Evidence",
        description: "hierarchical_context variant 使用短期脈絡與 compact long-term memory，補足較早期的前兆事件",
        event_count: 23,
        first_seen: "2026-06-17T18:30:00Z",
        last_seen: "2026-06-17T21:15:00Z",
        entities: {
            src_ips: ["192.168.5.100"],
            dst_ips: ["185.220.101.45"],
            threats: ["data-exfiltration"],
            rules: ["Large-Outbound-Transfer"],
            apps: ["https", "ftp"]
        },
        event_ids: ["evt-010", "evt-011"],
        cluster_id: 2,
        cluster_label: "Long-memory precursor cluster",
        method_variant: "hierarchical_context",
        triage_decision: "incident",
        model_confidence: 0.87,
        analyst_focus: "檢查長期記憶是否引入有用前兆，而不是造成 cluster fragmentation",
        llm_report: {
            summary: "hierarchical_context 將早期外傳前兆與近期資料傳輸連成同一審查脈絡。正式結果中此方法 binary F1 達 0.7796，但 cluster 數增加到 87，需注意分群碎片化。",
            risk_assessment: "高風險 - 時間脈絡有助於 incident triage，但分析師仍需確認長期記憶是否引入雜訊",
            recommended_actions: [
                "立即隔離主機 192.168.5.100 進行調查",
                "分析外傳的資料類型與內容",
                "檢查長期記憶中的 precursor event 是否發生於目前事件之前",
                "查詢目標 IP 185.220.101.45 的威脅情資"
            ],
            manual_review_items: [
                "確認是否為授權的資料傳輸（如備份、同步）",
                "訪談主機使用者了解近期操作"
            ],
            generated_at: "2026-06-17T21:20:00Z"
        }
    },
    {
        id: "INC-003",
        priority: 72,
        actionability: 0.68,
        severity_level: "high",
        status: "in_progress",
        title: "Cross-Host Companion Context Review",
        description: "cross_host variant 將同 scenario 其他主機的既有事件作為 companion context",
        event_count: 45,
        first_seen: "2026-06-17T10:00:00Z",
        last_seen: "2026-06-17T22:00:00Z",
        entities: {
            src_ips: ["192.168.3.55"],
            dst_ips: ["45.33.32.156"],
            threats: ["c2-communication", "malware-beacon"],
            rules: ["C2-Beacon-Detection", "DNS-Tunnel-Detect"],
            apps: ["dns", "https"]
        },
        event_ids: ["evt-020", "evt-021", "evt-022"],
        cluster_id: 3,
        cluster_label: "Cross-host companion evidence",
        method_variant: "cross_host",
        triage_decision: "rejected",
        model_confidence: 0.58,
        reject_reason: "Distance threshold exceeded after companion-context fusion",
        analyst_focus: "確認跨主機 evidence 是否提升 workload reduction，或只是提高 reject rate"
    },
    {
        id: "INC-004",
        priority: 55,
        actionability: 0.52,
        severity_level: "medium",
        status: "new",
        title: "Baseline DeepCASE Cluster Assignment",
        description: "baseline 使用 same-host fixed-length context、attention representation 與 DBSCAN interpreter",
        event_count: 89,
        first_seen: "2026-06-17T14:20:00Z",
        last_seen: "2026-06-17T14:35:00Z",
        entities: {
            src_ips: ["192.168.2.30"],
            dst_ips: ["192.168.2.1", "192.168.2.2", "192.168.2.3"],
            threats: ["port-scan"],
            rules: ["Internal-Port-Scan"],
            apps: ["tcp"]
        },
        event_ids: ["evt-030"],
        cluster_id: 4,
        cluster_label: "Baseline same-host context cluster",
        method_variant: "baseline",
        triage_decision: "incident",
        model_confidence: 0.79,
        analyst_focus: "作為 DeepCASE-style baseline 與 rebalanced strict comparison 的參照"
    },
    {
        id: "INC-005",
        priority: 35,
        actionability: 0.33,
        severity_level: "low",
        status: "resolved",
        title: "Benign Default Cluster (-4) Validation",
        description: "此範例展示良性/default cluster score 與 rejection code 的語意分離",
        event_count: 12,
        first_seen: "2026-06-16T09:00:00Z",
        last_seen: "2026-06-16T17:30:00Z",
        entities: {
            src_ips: ["192.168.4.88"],
            dst_ips: ["104.16.85.20"],
            threats: ["policy-violation"],
            rules: ["Unauthorized-App"],
            apps: ["bittorrent"]
        },
        event_ids: ["evt-040"],
        cluster_id: -4,
        cluster_label: "Benign/default cluster score",
        method_variant: "baseline",
        triage_decision: "benign",
        model_confidence: 0.81,
        analyst_focus: "確認 -4 代表 benign/default cluster，而不是 low-confidence rejection"
    },
    {
        id: "INC-006",
        priority: 20,
        actionability: 0.15,
        severity_level: "low",
        status: "suppressed",
        title: "Rejected Low-Confidence DNS Pattern",
        description: "此範例展示 DeepCASE-style prediction code 中的低信心拒判",
        event_count: 1250,
        first_seen: "2026-06-13T00:00:00Z",
        last_seen: "2026-06-17T23:59:00Z",
        entities: {
            src_ips: ["192.168.1.0/24"],
            dst_ips: ["ads.google.com"],
            threats: [],
            rules: ["DNS-Ad-Query"],
            apps: ["dns"]
        },
        event_ids: ["evt-050"],
        cluster_id: -1,
        cluster_label: "Low-confidence rejection",
        method_variant: "rebalanced",
        triage_decision: "rejected",
        model_confidence: 0.31,
        reject_reason: "Model confidence below auto-decision threshold",
        analyst_focus: "用 reject rate 搭配 binary F1 解讀，避免把困難樣本硬判成 incident 或 benign"
    }
];

// ============================================
// Mock Events 資料
// ============================================
export const mockEvents: Event[] = [
    {
        id: "evt-001",
        timestamp: "2026-06-17T22:15:23Z",
        src_ip: "203.45.67.89",
        dst_ip: "192.168.1.10",
        src_port: 54321,
        dst_port: 22,
        rule: "SSH-Brute-Force-Detection",
        action: "deny",
        severity: "high",
        threat_name: "brute-force",
        app: "ssh",
        protocol: "TCP"
    },
    {
        id: "evt-002",
        timestamp: "2026-06-17T22:15:25Z",
        src_ip: "203.45.67.89",
        dst_ip: "192.168.1.10",
        src_port: 54322,
        dst_port: 22,
        rule: "SSH-Brute-Force-Detection",
        action: "deny",
        severity: "high",
        threat_name: "brute-force",
        app: "ssh",
        protocol: "TCP"
    },
    {
        id: "evt-003",
        timestamp: "2026-06-17T22:15:28Z",
        src_ip: "203.45.67.90",
        dst_ip: "192.168.1.11",
        src_port: 54400,
        dst_port: 22,
        rule: "SSH-Brute-Force-Detection",
        action: "deny",
        severity: "high",
        threat_name: "brute-force",
        app: "ssh",
        protocol: "TCP"
    },
    {
        id: "evt-010",
        timestamp: "2026-06-17T18:30:00Z",
        src_ip: "192.168.5.100",
        dst_ip: "185.220.101.45",
        src_port: 49152,
        dst_port: 443,
        rule: "Large-Outbound-Transfer",
        action: "allow",
        severity: "medium",
        threat_name: "data-exfiltration",
        app: "https",
        protocol: "TCP",
        bytes_sent: 1073741824
    },
    {
        id: "evt-011",
        timestamp: "2026-06-17T21:12:44Z",
        src_ip: "192.168.5.100",
        dst_ip: "185.220.101.45",
        src_port: 49160,
        dst_port: 21,
        rule: "Long-Window-Exfil-Precursor",
        action: "alert",
        severity: "high",
        threat_name: "data-exfiltration",
        app: "ftp",
        protocol: "TCP",
        bytes_sent: 1610612736
    },
    {
        id: "evt-020",
        timestamp: "2026-06-17T10:00:00Z",
        src_ip: "192.168.3.55",
        dst_ip: "45.33.32.156",
        src_port: 53001,
        dst_port: 443,
        rule: "C2-Beacon-Detection",
        action: "alert",
        severity: "high",
        threat_name: "c2-communication",
        app: "https",
        protocol: "TCP"
    },
    {
        id: "evt-021",
        timestamp: "2026-06-17T10:08:00Z",
        src_ip: "192.168.3.56",
        dst_ip: "45.33.32.156",
        src_port: 53009,
        dst_port: 443,
        rule: "Cross-Host-Companion-C2",
        action: "alert",
        severity: "medium",
        threat_name: "companion-context",
        app: "https",
        protocol: "TCP"
    },
    {
        id: "evt-022",
        timestamp: "2026-06-17T22:00:00Z",
        src_ip: "192.168.3.55",
        dst_ip: "45.33.32.156",
        src_port: 53101,
        dst_port: 53,
        rule: "DNS-Tunnel-Detect",
        action: "alert",
        severity: "high",
        threat_name: "dns-tunnel",
        app: "dns",
        protocol: "UDP"
    },
    {
        id: "evt-030",
        timestamp: "2026-06-17T14:20:00Z",
        src_ip: "192.168.2.30",
        dst_ip: "192.168.2.1",
        src_port: 41000,
        dst_port: 445,
        rule: "Baseline-Same-Host-Sequence",
        action: "alert",
        severity: "medium",
        threat_name: "port-scan",
        app: "tcp",
        protocol: "TCP"
    },
    {
        id: "evt-040",
        timestamp: "2026-06-16T09:00:00Z",
        src_ip: "192.168.4.88",
        dst_ip: "104.16.85.20",
        src_port: 50010,
        dst_port: 443,
        rule: "Benign-Default-Cluster",
        action: "allow",
        severity: "low",
        app: "https",
        protocol: "TCP"
    },
    {
        id: "evt-050",
        timestamp: "2026-06-17T23:59:00Z",
        src_ip: "192.168.1.0/24",
        dst_ip: "ads.google.com",
        rule: "Low-Confidence-DNS-Reject",
        action: "alert",
        severity: "low",
        app: "dns",
        protocol: "UDP"
    }
];

// ============================================
// Mock Dashboard 統計
// ============================================
export const mockDashboardStats: DashboardStats = {
    total_incidents: 2080211,
    new_incidents: 23,
    critical_count: 3,
    high_count: 12,
    medium_count: 45,
    low_count: 67,
    resolved_today: 8,
    avg_priority: 42.5,
    train_events: 520052,
    test_events: 2080211,
    best_method: "rebalanced",
    best_binary_f1: 0.8088,
    workload_reduction: 0.9365,
    reject_rate: 0.0693
};

// ============================================
// Mock Entity Graph (for INC-001)
// ============================================
export const mockEntityGraph: EntityGraph = {
    nodes: [
        { id: "src-1", label: "203.45.67.89", type: "src_ip", count: 120 },
        { id: "src-2", label: "203.45.67.90", type: "src_ip", count: 36 },
        { id: "dst-1", label: "192.168.1.10", type: "dst_ip", count: 100 },
        { id: "dst-2", label: "192.168.1.11", type: "dst_ip", count: 56 },
        { id: "threat-1", label: "brute-force", type: "threat", count: 156 },
        { id: "rule-1", label: "SSH-Brute-Force-Detection", type: "rule", count: 156 },
        { id: "app-1", label: "ssh", type: "app", count: 156 }
    ],
    edges: [
        { from: "src-1", to: "dst-1", count: 85, first_seen: "2026-06-17T22:15:00Z", last_seen: "2026-06-17T23:30:00Z" },
        { from: "src-1", to: "dst-2", count: 35, first_seen: "2026-06-17T22:20:00Z", last_seen: "2026-06-17T23:45:00Z" },
        { from: "src-2", to: "dst-1", count: 15, first_seen: "2026-06-17T22:25:00Z", last_seen: "2026-06-17T23:00:00Z" },
        { from: "src-2", to: "dst-2", count: 21, first_seen: "2026-06-17T22:30:00Z", last_seen: "2026-06-17T23:40:00Z" },
        { from: "dst-1", to: "threat-1", count: 100, first_seen: "2026-06-17T22:15:00Z", last_seen: "2026-06-17T23:30:00Z" },
        { from: "dst-2", to: "threat-1", count: 56, first_seen: "2026-06-17T22:20:00Z", last_seen: "2026-06-17T23:45:00Z" },
        { from: "threat-1", to: "rule-1", count: 156, first_seen: "2026-06-17T22:15:00Z", last_seen: "2026-06-17T23:45:00Z" }
    ]
};

// ============================================
// Helper: 取得單一 Incident
// ============================================
export function getIncidentById(id: string): Incident | undefined {
    return mockIncidents.find(inc => inc.id === id);
}

// ============================================
// Helper: 取得 Incident 的 Events
// ============================================
export function getEventsByIncidentId(incidentId: string): Event[] {
    const incident = getIncidentById(incidentId);
    if (!incident) return [];
    return mockEvents.filter(evt => incident.event_ids.includes(evt.id));
}
