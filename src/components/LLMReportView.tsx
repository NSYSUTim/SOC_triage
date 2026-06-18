import { LLMReport } from '../types';
import { Bot, AlertTriangle, Shield, CheckCircle, HelpCircle, ExternalLink } from 'lucide-react';

interface LLMReportViewProps {
    report: LLMReport;
}

/** LLM 回報區塊 */
export function LLMReportView({ report }: LLMReportViewProps) {
    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleString('zh-TW');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* 生成時間 */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--text-muted)',
                fontSize: '0.8rem'
            }}>
                <Bot size={16} />
                由 LLM 於 {formatTime(report.generated_at)} 生成
            </div>

            {/* 摘要 */}
            <div className="report-section">
                <h4 className="report-title">
                    <Shield size={18} color="var(--accent-primary)" />
                    事件摘要
                </h4>
                <p className="report-content">{report.summary}</p>
            </div>

            {/* 風險評估 */}
            <div className="report-section" style={{
                borderLeft: '4px solid var(--severity-high)',
                paddingLeft: '16px'
            }}>
                <h4 className="report-title">
                    <AlertTriangle size={18} color="var(--severity-high)" />
                    風險評估
                </h4>
                <p className="report-content">{report.risk_assessment}</p>
            </div>

            {/* 建議處置 */}
            <div className="report-section">
                <h4 className="report-title">
                    <CheckCircle size={18} color="var(--severity-low)" />
                    建議處置
                </h4>
                <ul className="report-list">
                    {report.recommended_actions.map((action, index) => (
                        <li key={index}>{action}</li>
                    ))}
                </ul>
            </div>

            {/* 需人工確認項目 */}
            {report.manual_review_items && report.manual_review_items.length > 0 && (
                <div className="report-section" style={{
                    background: 'rgba(234, 179, 8, 0.1)',
                    borderLeft: '4px solid var(--severity-medium)'
                }}>
                    <h4 className="report-title">
                        <HelpCircle size={18} color="var(--severity-medium)" />
                        需人工確認
                    </h4>
                    <ul className="report-list">
                        {report.manual_review_items.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* CTI 參考 */}
            {report.cti_references && report.cti_references.length > 0 && (
                <div className="report-section">
                    <h4 className="report-title">
                        <ExternalLink size={18} color="var(--accent-secondary)" />
                        威脅情資參考
                    </h4>
                    <ul className="report-list">
                        {report.cti_references.map((ref, index) => (
                            <li key={index} style={{ color: 'var(--accent-secondary)' }}>{ref}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div style={{
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
                borderTop: '1px solid var(--border-color)',
                paddingTop: '12px'
            }}>
                Report note: mock LLM text is for analyst-facing explanation only; formal metrics are reported separately.
            </div>
        </div>
    );
}
