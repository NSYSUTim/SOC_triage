import { Link } from 'react-router-dom';
import { mockDashboardStats, mockIncidents } from '../mocks/data';
import { PriorityBadge, SeverityBadge } from '../components/Badges';
import {
    AlertTriangle,
    Shield,
    CheckCircle,
    TrendingUp,
    ArrowRight,
    Activity
} from 'lucide-react';

/** 儀表板頁面 */
export function Dashboard() {
    const stats = mockDashboardStats;
    const topIncidents = mockIncidents
        .filter(inc => inc.status === 'new' || inc.status === 'in_progress')
        .sort((a, b) => b.priority - a.priority)
        .slice(0, 5);

    return (
        <div>
            {/* 頁面標題 */}
            <div className="page-header">
                <h1 className="page-title">
                    <Activity size={28} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
                    SOC Dashboard
                </h1>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    上次更新：{new Date().toLocaleString('zh-TW')}
                </span>
            </div>

            {/* 統計卡片 */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '32px'
            }}>
                <div className="stat-card">
                    <div className="stat-value">{stats.total_incidents}</div>
                    <div className="stat-label">
                        <Shield size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        Total Incidents
                    </div>
                </div>

                <div className="stat-card" style={{ borderLeft: '4px solid var(--status-new)' }}>
                    <div className="stat-value" style={{ color: 'var(--status-new)' }}>
                        {stats.new_incidents}
                    </div>
                    <div className="stat-label">New (待處理)</div>
                </div>

                <div className="stat-card" style={{ borderLeft: '4px solid var(--severity-critical)' }}>
                    <div className="stat-value" style={{ color: 'var(--severity-critical)' }}>
                        {stats.critical_count}
                    </div>
                    <div className="stat-label">
                        <AlertTriangle size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        Critical
                    </div>
                </div>

                <div className="stat-card" style={{ borderLeft: '4px solid var(--severity-high)' }}>
                    <div className="stat-value" style={{ color: 'var(--severity-high)' }}>
                        {stats.high_count}
                    </div>
                    <div className="stat-label">High</div>
                </div>

                <div className="stat-card" style={{ borderLeft: '4px solid var(--status-resolved)' }}>
                    <div className="stat-value" style={{ color: 'var(--status-resolved)' }}>
                        {stats.resolved_today}
                    </div>
                    <div className="stat-label">
                        <CheckCircle size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        今日已處理
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-value">{stats.avg_priority.toFixed(1)}</div>
                    <div className="stat-label">
                        <TrendingUp size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        平均 Priority
                    </div>
                </div>
            </div>

            {/* Top 5 待處理 */}
            <div className="card">
                <div className="card-header">
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>
                        🔥 Top 5 待處理 Incidents
                    </h2>
                    <Link to="/incidents" className="btn btn-secondary">
                        View All <ArrowRight size={16} />
                    </Link>
                </div>

                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Severity</th>
                            <th>Priority</th>
                            <th>Events</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topIncidents.map(incident => (
                            <tr key={incident.id}>
                                <td>
                                    <Link
                                        to={`/incidents/${incident.id}`}
                                        style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}
                                    >
                                        {incident.id}
                                    </Link>
                                </td>
                                <td style={{ maxWidth: '400px' }}>
                                    <Link to={`/incidents/${incident.id}`}>
                                        {incident.title.length > 50
                                            ? incident.title.substring(0, 50) + '...'
                                            : incident.title}
                                    </Link>
                                </td>
                                <td><SeverityBadge severity={incident.severity_level} /></td>
                                <td><PriorityBadge priority={incident.priority} /></td>
                                <td style={{ fontFamily: 'var(--font-mono)' }}>{incident.event_count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 快速統計 */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px',
                marginTop: '24px',
                padding: '16px',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--border-radius)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--severity-medium)' }}>
                        {stats.medium_count}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Medium</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--severity-low)' }}>
                        {stats.low_count}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Low</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                        {Math.round((stats.resolved_today / stats.new_incidents) * 100)}%
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>處理率</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                        {stats.critical_count + stats.high_count}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>高風險總計</div>
                </div>
            </div>
        </div>
    );
}
