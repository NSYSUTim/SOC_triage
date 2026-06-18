import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { IncidentList } from './pages/IncidentList';
import { IncidentDetail } from './pages/IncidentDetail';
import {
    LayoutDashboard,
    List,
    Shield,
    Settings,
    Upload
} from 'lucide-react';

function App() {
    return (
        <BrowserRouter>
            <div className="app-container">
                {/* 側邊欄 */}
                <aside className="sidebar">
                    <div className="sidebar-logo">
                        <Shield size={28} />
                        <span>SOC Triage</span>
                    </div>

                    <nav className="sidebar-nav">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        >
                            <LayoutDashboard size={20} />
                            <span>Dashboard</span>
                        </NavLink>

                        <NavLink
                            to="/incidents"
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        >
                            <List size={20} />
                            <span>Incidents</span>
                        </NavLink>

                        <div
                            className="nav-item"
                            style={{ opacity: 0.5, cursor: 'not-allowed' }}
                            title="Coming soon - 後端整合後開放"
                        >
                            <Upload size={20} />
                            <span>Upload Events</span>
                        </div>

                        <div
                            className="nav-item"
                            style={{ opacity: 0.5, cursor: 'not-allowed' }}
                            title="Coming soon"
                        >
                            <Settings size={20} />
                            <span>Settings</span>
                        </div>
                    </nav>

                    {/* 底部版本資訊 */}
                    <div style={{
                        marginTop: 'auto',
                        paddingTop: '20px',
                        borderTop: '1px solid var(--border-color)',
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)'
                    }}>
                        <div>SOC Triage Demo v0.2.0</div>
                        <div style={{ marginTop: '4px' }}>AIT-ADS report-aligned mock data</div>
                    </div>
                </aside>

                {/* 主內容區 */}
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/incidents" element={<IncidentList />} />
                        <Route path="/incidents/:id" element={<IncidentDetail />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;
