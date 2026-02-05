import { Incident, Event, DashboardStats, EntityGraph } from '../types';

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
        title: "Multiple Failed SSH Login Attempts from External IP",
        description: "偵測到來自外部 IP 的大量 SSH 登入失敗嘗試，疑似暴力破解攻擊",
        event_count: 156,
        first_seen: "2026-02-05T22:15:00Z",
        last_seen: "2026-02-05T23:45:00Z",
        entities: {
            src_ips: ["203.45.67.89", "203.45.67.90"],
            dst_ips: ["192.168.1.10", "192.168.1.11"],
            threats: ["brute-force", "ssh-attack"],
            rules: ["SSH-Brute-Force-Detection"],
            apps: ["ssh"]
        },
        event_ids: ["evt-001", "evt-002", "evt-003"],
        cluster_id: 1,
        cluster_label: "SSH Brute Force Pattern",
        llm_report: {
            summary: "偵測到來自外部 IP 203.45.67.89 及 203.45.67.90 的暴力破解攻擊，針對內部 SSH 服務主機。攻擊持續約 1.5 小時，共產生 156 次失敗登入嘗試。",
            risk_assessment: "高風險 - 若攻擊者成功取得帳密，可能導致內網橫向移動",
            recommended_actions: [
                "立即封鎖來源 IP：203.45.67.89, 203.45.67.90",
                "確認目標主機的 SSH 帳戶是否有異常登入成功紀錄",
                "考慮啟用 SSH Key-based 認證，停用密碼認證",
                "設定 Fail2Ban 或類似工具進行自動封鎖"
            ],
            manual_review_items: [
                "確認是否為授權的滲透測試活動",
                "檢查相關主機的登入成功日誌"
            ],
            cti_references: ["MITRE ATT&CK: T1110.001 - Brute Force: Password Guessing"],
            generated_at: "2026-02-05T23:50:00Z"
        }
    },
    {
        id: "INC-002",
        priority: 88,
        actionability: 0.85,
        severity_level: "high",
        status: "new",
        title: "Potential Data Exfiltration to Unknown External Host",
        description: "內部主機對外傳輸大量資料至未知外部位址",
        event_count: 23,
        first_seen: "2026-02-05T18:30:00Z",
        last_seen: "2026-02-05T21:15:00Z",
        entities: {
            src_ips: ["192.168.5.100"],
            dst_ips: ["185.220.101.45"],
            threats: ["data-exfiltration"],
            rules: ["Large-Outbound-Transfer"],
            apps: ["https", "ftp"]
        },
        event_ids: ["evt-010", "evt-011"],
        cluster_id: 2,
        cluster_label: "Data Exfiltration Pattern",
        llm_report: {
            summary: "內部主機 192.168.5.100 於過去 3 小時內傳輸約 2.5GB 資料至外部 IP 185.220.101.45。此外部 IP 未在已知合作廠商清單中。",
            risk_assessment: "高風險 - 可能為資料外洩或遭植入惡意程式的受害主機",
            recommended_actions: [
                "立即隔離主機 192.168.5.100 進行調查",
                "分析外傳的資料類型與內容",
                "查詢目標 IP 185.220.101.45 的威脅情資"
            ],
            manual_review_items: [
                "確認是否為授權的資料傳輸（如備份、同步）",
                "訪談主機使用者了解近期操作"
            ],
            generated_at: "2026-02-05T21:20:00Z"
        }
    },
    {
        id: "INC-003",
        priority: 72,
        actionability: 0.68,
        severity_level: "high",
        status: "in_progress",
        title: "Malware Communication Pattern Detected",
        description: "偵測到疑似惡意程式的 C2 通訊模式",
        event_count: 45,
        first_seen: "2026-02-05T10:00:00Z",
        last_seen: "2026-02-05T22:00:00Z",
        entities: {
            src_ips: ["192.168.3.55"],
            dst_ips: ["45.33.32.156"],
            threats: ["c2-communication", "malware-beacon"],
            rules: ["C2-Beacon-Detection", "DNS-Tunnel-Detect"],
            apps: ["dns", "https"]
        },
        event_ids: ["evt-020", "evt-021", "evt-022"],
        cluster_id: 3,
        cluster_label: "C2 Beacon Pattern"
    },
    {
        id: "INC-004",
        priority: 55,
        actionability: 0.52,
        severity_level: "medium",
        status: "new",
        title: "Unusual Port Scanning Activity",
        description: "內網主機進行異常的埠掃描行為",
        event_count: 89,
        first_seen: "2026-02-05T14:20:00Z",
        last_seen: "2026-02-05T14:35:00Z",
        entities: {
            src_ips: ["192.168.2.30"],
            dst_ips: ["192.168.2.1", "192.168.2.2", "192.168.2.3"],
            threats: ["port-scan"],
            rules: ["Internal-Port-Scan"],
            apps: ["tcp"]
        },
        event_ids: ["evt-030"],
        cluster_id: 4,
        cluster_label: "Port Scan Pattern"
    },
    {
        id: "INC-005",
        priority: 35,
        actionability: 0.33,
        severity_level: "low",
        status: "resolved",
        title: "Policy Violation - Unauthorized Application Usage",
        description: "使用者安裝並執行未授權的應用程式",
        event_count: 12,
        first_seen: "2026-02-04T09:00:00Z",
        last_seen: "2026-02-04T17:30:00Z",
        entities: {
            src_ips: ["192.168.4.88"],
            dst_ips: ["104.16.85.20"],
            threats: ["policy-violation"],
            rules: ["Unauthorized-App"],
            apps: ["bittorrent"]
        },
        event_ids: ["evt-040"],
        cluster_id: 5,
        cluster_label: "Policy Violation"
    },
    {
        id: "INC-006",
        priority: 20,
        actionability: 0.15,
        severity_level: "low",
        status: "suppressed",
        title: "Repeated DNS Query to Known Ad Server",
        description: "重複的廣告伺服器 DNS 查詢（已抑制）",
        event_count: 1250,
        first_seen: "2026-02-01T00:00:00Z",
        last_seen: "2026-02-05T23:59:00Z",
        entities: {
            src_ips: ["192.168.1.0/24"],
            dst_ips: ["ads.google.com"],
            threats: [],
            rules: ["DNS-Ad-Query"],
            apps: ["dns"]
        },
        event_ids: ["evt-050"],
        cluster_id: 6,
        cluster_label: "Benign DNS Pattern"
    }
];

// ============================================
// Mock Events 資料
// ============================================
export const mockEvents: Event[] = [
    {
        id: "evt-001",
        timestamp: "2026-02-05T22:15:23Z",
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
        timestamp: "2026-02-05T22:15:25Z",
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
        timestamp: "2026-02-05T22:15:28Z",
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
        timestamp: "2026-02-05T18:30:00Z",
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
    }
];

// ============================================
// Mock Dashboard 統計
// ============================================
export const mockDashboardStats: DashboardStats = {
    total_incidents: 127,
    new_incidents: 23,
    critical_count: 3,
    high_count: 12,
    medium_count: 45,
    low_count: 67,
    resolved_today: 8,
    avg_priority: 42.5
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
        { from: "src-1", to: "dst-1", count: 85, first_seen: "2026-02-05T22:15:00Z", last_seen: "2026-02-05T23:30:00Z" },
        { from: "src-1", to: "dst-2", count: 35, first_seen: "2026-02-05T22:20:00Z", last_seen: "2026-02-05T23:45:00Z" },
        { from: "src-2", to: "dst-1", count: 15, first_seen: "2026-02-05T22:25:00Z", last_seen: "2026-02-05T23:00:00Z" },
        { from: "src-2", to: "dst-2", count: 21, first_seen: "2026-02-05T22:30:00Z", last_seen: "2026-02-05T23:40:00Z" },
        { from: "dst-1", to: "threat-1", count: 100, first_seen: "2026-02-05T22:15:00Z", last_seen: "2026-02-05T23:30:00Z" },
        { from: "dst-2", to: "threat-1", count: 56, first_seen: "2026-02-05T22:20:00Z", last_seen: "2026-02-05T23:45:00Z" },
        { from: "threat-1", to: "rule-1", count: 156, first_seen: "2026-02-05T22:15:00Z", last_seen: "2026-02-05T23:45:00Z" }
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
