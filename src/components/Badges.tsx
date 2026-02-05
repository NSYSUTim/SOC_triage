import { SeverityLevel, IncidentStatus } from '../types';

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
