import { useState, useMemo } from 'react';
import { mockIncidents } from '../mocks/data';
import { IncidentCard } from '../components/IncidentCard';
import { SeverityLevel, IncidentStatus } from '../types';
import { List, Filter, SortDesc } from 'lucide-react';

/** Incident 清單頁面 */
export function IncidentList() {
    // 篩選狀態
    const [sortBy, setSortBy] = useState<'priority' | 'first_seen' | 'severity_level'>('priority');
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
    const [filterSeverity, setFilterSeverity] = useState<SeverityLevel | 'all'>('all');
    const [filterStatus, setFilterStatus] = useState<IncidentStatus | 'all'>('all');
    const [topK, setTopK] = useState<number>(0); // 0 = 顯示全部

    // 處理排序和篩選
    const filteredIncidents = useMemo(() => {
        let result = [...mockIncidents];

        // 篩選 severity
        if (filterSeverity !== 'all') {
            result = result.filter(inc => inc.severity_level === filterSeverity);
        }

        // 篩選 status
        if (filterStatus !== 'all') {
            result = result.filter(inc => inc.status === filterStatus);
        }

        // 排序
        result.sort((a, b) => {
            let comparison = 0;

            switch (sortBy) {
                case 'priority':
                    comparison = a.priority - b.priority;
                    break;
                case 'first_seen':
                    comparison = new Date(a.first_seen).getTime() - new Date(b.first_seen).getTime();
                    break;
                case 'severity_level':
                    const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
                    comparison = severityOrder[a.severity_level] - severityOrder[b.severity_level];
                    break;
            }

            return sortOrder === 'desc' ? -comparison : comparison;
        });

        // Top-K
        if (topK > 0) {
            result = result.slice(0, topK);
        }

        return result;
    }, [sortBy, sortOrder, filterSeverity, filterStatus, topK]);

    return (
        <div>
            {/* 頁面標題 */}
            <div className="page-header">
                <h1 className="page-title">
                    <List size={28} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
                    Incidents
                </h1>
                <span style={{
                    background: 'var(--accent-gradient)',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '0.9rem'
                }}>
                    共 {filteredIncidents.length} 筆
                </span>
            </div>

            {/* 篩選條 */}
            <div className="filter-bar">
                <div className="filter-group">
                    <Filter size={16} color="var(--text-muted)" />
                    <label className="filter-label">Severity:</label>
                    <select
                        value={filterSeverity}
                        onChange={e => setFilterSeverity(e.target.value as SeverityLevel | 'all')}
                    >
                        <option value="all">All</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label className="filter-label">Status:</label>
                    <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value as IncidentStatus | 'all')}
                    >
                        <option value="all">All</option>
                        <option value="new">New</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="suppressed">Suppressed</option>
                    </select>
                </div>

                <div className="filter-group">
                    <SortDesc size={16} color="var(--text-muted)" />
                    <label className="filter-label">Sort by:</label>
                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value as typeof sortBy)}
                    >
                        <option value="priority">Priority</option>
                        <option value="first_seen">Time</option>
                        <option value="severity_level">Severity</option>
                    </select>
                    <select
                        value={sortOrder}
                        onChange={e => setSortOrder(e.target.value as 'asc' | 'desc')}
                    >
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label className="filter-label">Top-K:</label>
                    <select
                        value={topK}
                        onChange={e => setTopK(Number(e.target.value))}
                    >
                        <option value={0}>All</option>
                        <option value={5}>Top 5</option>
                        <option value={10}>Top 10</option>
                        <option value={20}>Top 20</option>
                    </select>
                </div>
            </div>

            {/* Incident 清單 */}
            <div>
                {filteredIncidents.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 20px',
                        color: 'var(--text-muted)'
                    }}>
                        <List size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                        <p>No incidents found matching the current filters.</p>
                    </div>
                ) : (
                    filteredIncidents.map(incident => (
                        <IncidentCard key={incident.id} incident={incident} />
                    ))
                )}
            </div>
        </div>
    );
}
