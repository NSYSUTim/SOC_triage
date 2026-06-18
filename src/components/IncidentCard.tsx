import { Link } from 'react-router-dom';
import { Incident } from '../types';
import { PriorityBadge, SeverityBadge, StatusBadge, EntityTag, MethodBadge, DecisionBadge } from './Badges';
import { Clock, AlertTriangle, ArrowRight, Network } from 'lucide-react';

interface IncidentCardProps {
    incident: Incident;
}

/** 單一 Incident 卡片 */
export function IncidentCard({ incident }: IncidentCardProps) {
    // 格式化時間
    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleString('zh-TW', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Link to={`/incidents/${incident.id}`} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ marginBottom: '16px' }}>
                {/* 標題列 */}
                <div className="card-header">
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <span style={{
                                fontFamily: 'var(--font-mono)',
                                color: 'var(--text-muted)',
                                fontSize: '0.875rem'
                            }}>
                                {incident.id}
                            </span>
                            <SeverityBadge severity={incident.severity_level} />
                            <StatusBadge status={incident.status} />
                            <MethodBadge method={incident.method_variant} />
                            <DecisionBadge decision={incident.triage_decision} />
                        </div>
                        <h3 className="card-title" style={{ fontSize: '1.1rem' }}>
                            {incident.title}
                        </h3>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <PriorityBadge priority={incident.priority} />
                    </div>
                </div>

                {/* 描述 */}
                {incident.description && (
                    <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.875rem',
                        marginBottom: '16px',
                        lineHeight: '1.6'
                    }}>
                        {incident.description}
                    </p>
                )}

                {/* 實體標籤 */}
                <div style={{ marginBottom: '16px' }}>
                    {incident.entities.src_ips.slice(0, 2).map(ip => (
                        <EntityTag key={`src-${ip}`} type="ip" value={`SRC: ${ip}`} />
                    ))}
                    {incident.entities.dst_ips.slice(0, 2).map(ip => (
                        <EntityTag key={`dst-${ip}`} type="ip" value={`DST: ${ip}`} />
                    ))}
                    {incident.entities.threats.slice(0, 2).map(t => (
                        <EntityTag key={t} type="threat" value={t} />
                    ))}
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '10px',
                    marginBottom: '16px',
                    color: 'var(--text-secondary)',
                    fontSize: '0.8rem'
                }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Network size={14} />
                        Cluster: {incident.cluster_label || 'Unassigned'}
                    </span>
                    {incident.model_confidence !== undefined && (
                        <span>Confidence: {(incident.model_confidence * 100).toFixed(0)}%</span>
                    )}
                    {incident.reject_reason && (
                        <span style={{ color: 'var(--severity-medium)' }}>
                            Reject: {incident.reject_reason}
                        </span>
                    )}
                </div>

                {/* 底部資訊 */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border-color)'
                }}>
                    <div style={{ display: 'flex', gap: '24px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <AlertTriangle size={14} />
                            {incident.event_count} events
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={14} />
                            {formatTime(incident.first_seen)} - {formatTime(incident.last_seen)}
                        </span>
                    </div>
                    <span style={{
                        color: 'var(--accent-primary)',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}>
                        View Details <ArrowRight size={14} />
                    </span>
                </div>
            </div>
        </Link>
    );
}
