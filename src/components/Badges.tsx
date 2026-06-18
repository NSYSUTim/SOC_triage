import { SeverityLevel, IncidentStatus, ModelVariant, TriageDecision } from '../types';

interface PriorityBadgeProps {
    priority: number;
    showValue?: boolean;
}

/** 優先級徽章 */
export function PriorityBadge({ priority, showValue = true }: PriorityBadgeProps) {
    const getColor = () => {
        if (priority >= 80) return 'critical';
        if (priority >= 60) return 'high';
        if (priority >= 40) return 'medium';
        return 'low';
    };

    return (
        <div className="priority-badge" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {showValue && (
                <span style={{
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.875rem'
                }}>
                    {priority}
                </span>
            )}
            <div className="priority-bar" style={{ width: '60px' }}>
                <div
                    className={`priority-bar-fill ${getColor()}`}
                    style={{ width: `${priority}%` }}
                />
            </div>
        </div>
    );
}

interface SeverityBadgeProps {
    severity: SeverityLevel;
}

/** 嚴重等級徽章 */
export function SeverityBadge({ severity }: SeverityBadgeProps) {
    const labels: Record<SeverityLevel, string> = {
        critical: 'Critical',
        high: 'High',
        medium: 'Medium',
        low: 'Low'
    };

    return (
        <span className={`badge badge-${severity}`}>
            {labels[severity]}
        </span>
    );
}

interface StatusBadgeProps {
    status: IncidentStatus;
}

/** 狀態徽章 */
export function StatusBadge({ status }: StatusBadgeProps) {
    const labels: Record<IncidentStatus, string> = {
        new: 'New',
        in_progress: 'In Progress',
        resolved: 'Resolved',
        suppressed: 'Suppressed'
    };

    const className = status === 'in_progress' ? 'in-progress' : status;

    return (
        <span className={`badge badge-${className}`}>
            {labels[status]}
        </span>
    );
}

interface MethodBadgeProps {
    method: ModelVariant;
}

/** 論文方法變體徽章 */
export function MethodBadge({ method }: MethodBadgeProps) {
    const labels: Record<ModelVariant, string> = {
        baseline: "Baseline",
        cross_host: "Cross-Host",
        hierarchical_context: "Hierarchical",
        rebalanced: "Rebalanced"
    };

    const colorMap: Record<ModelVariant, string> = {
        baseline: "var(--accent-primary)",
        cross_host: "var(--severity-medium)",
        hierarchical_context: "var(--accent-secondary)",
        rebalanced: "var(--severity-low)"
    };

    return (
        <span
            className="badge"
            style={{
                color: colorMap[method],
                border: `1px solid ${colorMap[method]}`,
                background: 'rgba(255, 255, 255, 0.04)'
            }}
        >
            {labels[method]}
        </span>
    );
}

interface DecisionBadgeProps {
    decision: TriageDecision;
}

/** Triage 決策徽章 */
export function DecisionBadge({ decision }: DecisionBadgeProps) {
    const labels: Record<TriageDecision, string> = {
        incident: "Incident",
        benign: "Benign",
        rejected: "Rejected"
    };

    const classMap: Record<TriageDecision, string> = {
        incident: "high",
        benign: "low",
        rejected: "medium"
    };

    return (
        <span className={`badge badge-${classMap[decision]}`}>
            {labels[decision]}
        </span>
    );
}

interface EntityTagProps {
    type: 'ip' | 'threat' | 'rule' | 'app';
    value: string;
}

/** 實體標籤 */
export function EntityTag({ type, value }: EntityTagProps) {
    return (
        <span className={`entity-tag ${type}`}>
            {value}
        </span>
    );
}
