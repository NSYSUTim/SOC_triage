import { Event } from '../types';
import { Clock } from 'lucide-react';

interface TimelineProps {
    events: Event[];
}

/** 事件時間線元件 */
export function Timeline({ events }: TimelineProps) {
    // 依時間排序
    const sortedEvents = [...events].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleString('zh-TW', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'var(--severity-critical)';
            case 'high': return 'var(--severity-high)';
            case 'medium': return 'var(--severity-medium)';
            default: return 'var(--severity-low)';
        }
    };

    return (
        <div className="timeline">
            {sortedEvents.map((event, index) => (
                <div
                    key={event.id}
                    className="timeline-item"
                    style={{
                        '--dot-color': getSeverityColor(event.severity)
                    } as React.CSSProperties}
                >
                    <style>{`
            .timeline-item:nth-child(${index + 1})::before {
              background: ${getSeverityColor(event.severity)} !important;
            }
          `}</style>

                    <div className="timeline-time">
                        <Clock size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        {formatTime(event.timestamp)}
                    </div>

                    <div className="timeline-content">
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '8px'
                        }}>
                            <span style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.75rem',
                                color: 'var(--text-muted)'
                            }}>
                                {event.id}
                            </span>
                            <span
                                className={`badge badge-${event.severity}`}
                                style={{ fontSize: '0.7rem', padding: '2px 6px' }}
                            >
                                {event.severity.toUpperCase()}
                            </span>
                        </div>

                        <div style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.8rem',
                            marginBottom: '8px'
                        }}>
                            <span style={{ color: 'var(--text-muted)' }}>
                                {event.src_ip}:{event.src_port || '?'}
                            </span>
                            <span style={{ color: 'var(--accent-primary)', margin: '0 8px' }}>→</span>
                            <span style={{ color: 'var(--text-primary)' }}>
                                {event.dst_ip}:{event.dst_port || '?'}
                            </span>
                        </div>

                        <div style={{
                            display: 'flex',
                            gap: '12px',
                            fontSize: '0.8rem',
                            color: 'var(--text-secondary)'
                        }}>
                            <span><strong>Rule:</strong> {event.rule}</span>
                            <span><strong>Action:</strong> {event.action}</span>
                            {event.threat_name && (
                                <span style={{ color: 'var(--severity-high)' }}>
                                    <strong>Threat:</strong> {event.threat_name}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
