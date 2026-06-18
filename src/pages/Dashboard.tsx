import { Link } from 'react-router-dom';
import { formalMethodResults, mockDashboardStats, mockIncidents } from '../mocks/data';
import { MethodBadge, PriorityBadge, SeverityBadge } from '../components/Badges';
import {
    TrendingUp,
    ArrowRight,
    Activity,
    Database,
    Gauge,
    ListChecks
} from 'lucide-react';

/** 儀表板頁面 */
export function Dashboard() {
    const stats = mockDashboardStats;
    const bestResult = formalMethodResults.find(result => result.method === stats.best_method);
    const topIncidents = mockIncidents
        .filter(inc => inc.status === 'new' || inc.status === 'in_progress')
        .sort((a, b) => b.priority - a.priority)
        .slice(0, 5);

    const formatPct = (value: number) => `${(value * 100).toFixed(2)}%`;
    const formatCount = (value: number) => value.toLocaleString('en-US');

    return (
        <div>
            {/* 頁面標題 */}
            <div className="page-header">
                <h1 className="page-title">
                    <Activity size={28} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
                    SOC Triage Research Dashboard
                </h1>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Formal snapshot: 2026-06-18
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
                    <div className="stat-value">{formatCount(stats.test_events)}</div>
                    <div className="stat-label">
                        <Database size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        Test Events
                    </div>
                </div>

                <div className="stat-card" style={{ borderLeft: '4px solid var(--status-new)' }}>
                    <div className="stat-value" style={{ color: 'var(--status-new)' }}>
                        {formatCount(stats.train_events)}
                    </div>
                    <div className="stat-label">Training Events</div>
                </div>

                <div className="stat-card" style={{ borderLeft: '4px solid var(--severity-critical)' }}>
                    <div className="stat-value" style={{ color: 'var(--severity-critical)' }}>
                        {formatPct(stats.best_binary_f1)}
                    </div>
                    <div className="stat-label">
                        <Gauge size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        Best Binary F1
                    </div>
                </div>

                <div className="stat-card" style={{ borderLeft: '4px solid var(--severity-high)' }}>
                    <div className="stat-value" style={{ color: 'var(--severity-high)' }}>
                        {formatPct(stats.workload_reduction)}
                    </div>
                    <div className="stat-label">Workload Reduction</div>
                </div>

                <div className="stat-card" style={{ borderLeft: '4px solid var(--status-resolved)' }}>
                    <div className="stat-value" style={{ color: 'var(--status-resolved)' }}>
                        {bestResult?.clusters ?? '-'}
                    </div>
                    <div className="stat-label">
                        <ListChecks size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        Rebalanced Clusters
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-value">{formatPct(stats.reject_rate)}</div>
                    <div className="stat-label">
                        <TrendingUp size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        Rebalanced Reject Rate
                    </div>
                </div>
            </div>

            <div className="card" style={{ marginBottom: '24px' }}>
                <div className="card-header">
                    <div>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>
                            Formal Method Results
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                            AIT-ADS formal CPU runs with hidden size 128, 10 epochs, and 100 query iterations.
                        </p>
                    </div>
                </div>

                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Method</th>
                            <th>Role</th>
                            <th>Clusters</th>
                            <th>Workload</th>
                            <th>Purity</th>
                            <th>Reject</th>
                            <th>Binary F1</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formalMethodResults.map(result => (
                            <tr key={result.method}>
                                <td><MethodBadge method={result.method} /></td>
                                <td>{result.role}</td>
                                <td style={{ fontFamily: 'var(--font-mono)' }}>{result.clusters}</td>
                                <td style={{ fontFamily: 'var(--font-mono)' }}>{formatPct(result.workload_reduction)}</td>
                                <td style={{ fontFamily: 'var(--font-mono)' }}>{formatPct(result.cluster_purity)}</td>
                                <td style={{ fontFamily: 'var(--font-mono)' }}>{formatPct(result.reject_rate)}</td>
                                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                                    {formatPct(result.binary_f1)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Top 5 待處理 */}
            <div className="card">
                <div className="card-header">
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>
                        Top 5 Review Queue
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
                            <th>Method</th>
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
                                <td><MethodBadge method={incident.method_variant} /></td>
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
                        +4.71pt
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rebalanced F1 Gain</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--severity-low)' }}>
                        0.9875
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cluster Purity</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                        35 to 36
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cluster Count</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                        +1.61pt
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Reject Increase</div>
                </div>
            </div>
        </div>
    );
}
