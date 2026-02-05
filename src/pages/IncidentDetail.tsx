import { useParams, Link } from 'react-router-dom';
import { getIncidentById, getEventsByIncidentId, mockEntityGraph } from '../mocks/data';
import { SeverityBadge, StatusBadge, EntityTag } from '../components/Badges';
import { Timeline } from '../components/Timeline';
import { LLMReportView } from '../components/LLMReportView';
import {
    ArrowLeft,
    Shield,
    Clock,
    AlertTriangle,
    Network,
    FileText,
    Activity
} from 'lucide-react';

/** Incident 詳情頁面 */
export function IncidentDetail() {
    const { id } = useParams<{ id: string }>();
    const incident = getIncidentById(id || '');
    const events = getEventsByIncidentId(id || '');

    if (!incident) {
        return (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <AlertTriangle size={64} color="var(--severity-medium)" style={{ marginBottom: '16px' }} />
                <h2>Incident not found</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                    ID: {id} does not exist.
                </p>
                <Link to="/incidents" className="btn btn-primary">
                    <ArrowLeft size={16} /> Back to List
                </Link>
            </div>
        );
    }

    const formatTime = (isoString: string) => {
        return new Date(isoString).toLocaleString('zh-TW');
    };

    return (
        <div>
            {/* 返回按鈕 */}
            <Link
                to="/incidents"
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '20px',
                    color: 'var(--text-secondary)'
                }}
            >
                <ArrowLeft size={18} /> Back to Incidents
            </Link>

            {/* Header */}
            <div className="card" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <span style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '1.1rem',
                                color: 'var(--text-muted)'
                            }}>
                                {incident.id}
                            </span>
                            <SeverityBadge severity={incident.severity_level} />
                            <StatusBadge status={incident.status} />
                        </div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>
                            {incident.title}
                        </h1>
                        {incident.description && (
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                {incident.description}
                            </p>
                        )}
                    </div>

                    {/* Priority 區塊 */}
                    <div style={{
                        background: 'var(--bg-tertiary)',
                        padding: '20px 30px',
                        borderRadius: 'var(--border-radius)',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                            PRIORITY
                        </div>
                        <div style={{
                            fontSize: '2.5rem',
                            fontWeight: 700,
                            background: incident.priority >= 70
                                ? 'linear-gradient(135deg, #ef4444, #f97316)'
                                : 'var(--accent-gradient)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            {incident.priority}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Actionability: {(incident.actionability * 100).toFixed(0)}%
                        </div>
                    </div>
                </div>

                {/* 時間與統計 */}
                <div style={{
                    display: 'flex',
                    gap: '32px',
                    marginTop: '20px',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--border-color)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                        <Clock size={16} />
                        <span>First Seen: {formatTime(incident.first_seen)}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                        <Clock size={16} />
                        <span>Last Seen: {formatTime(incident.last_seen)}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                        <Activity size={16} />
                        <span>{incident.event_count} Events</span>
                    </div>
                    {incident.cluster_label && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-secondary)' }}>
                            <Network size={16} />
                            <span>Cluster: {incident.cluster_label}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* 兩欄佈局 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

                {/* 左側：實體與圖 */}
                <div>
                    {/* 關聯實體 */}
                    <div className="card" style={{ marginBottom: '24px' }}>
                        <h3 style={{
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <Shield size={18} color="var(--accent-primary)" />
                            關聯實體
                        </h3>

                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                來源 IP
                            </div>
                            {incident.entities.src_ips.map(ip => (
                                <EntityTag key={ip} type="ip" value={ip} />
                            ))}
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                目標 IP
                            </div>
                            {incident.entities.dst_ips.map(ip => (
                                <EntityTag key={ip} type="ip" value={ip} />
                            ))}
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                威脅類型
                            </div>
                            {incident.entities.threats.map(t => (
                                <EntityTag key={t} type="threat" value={t} />
                            ))}
                        </div>

                        <div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                觸發規則
                            </div>
                            {incident.entities.rules.map(r => (
                                <EntityTag key={r} type="rule" value={r} />
                            ))}
                        </div>
                    </div>

                    {/* Entity Graph 預留區 */}
                    <div className="card">
                        <h3 style={{
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <Network size={18} color="var(--accent-secondary)" />
                            溯源圖 (Entity Graph)
                        </h3>

                        <div style={{
                            background: 'var(--bg-tertiary)',
                            borderRadius: 'var(--border-radius-sm)',
                            padding: '40px 20px',
                            textAlign: 'center',
                            color: 'var(--text-muted)'
                        }}>
                            <Network size={48} style={{ marginBottom: '12px', opacity: 0.5 }} />
                            <p style={{ fontSize: '0.9rem' }}>
                                互動式溯源圖將在此顯示
                            </p>
                            <p style={{ fontSize: '0.75rem', marginTop: '8px' }}>
                                使用 vis-network 呈現 {mockEntityGraph.nodes.length} 個節點、
                                {mockEntityGraph.edges.length} 條關聯
                            </p>
                        </div>
                    </div>
                </div>

                {/* 右側：時間線與報告 */}
                <div>
                    {/* 事件時間線 */}
                    <div className="card" style={{ marginBottom: '24px' }}>
                        <h3 style={{
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <Activity size={18} color="var(--accent-primary)" />
                            事件時間線
                        </h3>

                        {events.length > 0 ? (
                            <Timeline events={events} />
                        ) : (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                No event details available. (Mock 資料僅包含部分 events)
                            </p>
                        )}
                    </div>

                    {/* LLM 回報 */}
                    <div className="card">
                        <h3 style={{
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <FileText size={18} color="var(--accent-secondary)" />
                            AI 分析回報
                        </h3>

                        {incident.llm_report ? (
                            <LLMReportView report={incident.llm_report} />
                        ) : (
                            <div style={{
                                background: 'var(--bg-tertiary)',
                                padding: '24px',
                                borderRadius: 'var(--border-radius-sm)',
                                textAlign: 'center',
                                color: 'var(--text-muted)'
                            }}>
                                <FileText size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
                                <p>尚未生成 LLM 回報</p>
                                <button className="btn btn-primary" style={{ marginTop: '16px' }}>
                                    Generate Report
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
