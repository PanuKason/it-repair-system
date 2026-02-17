
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { RepairFormPage } from './pages/RepairForm';
import { RepairStatusPage } from './pages/RepairStatus';
import { AdminDashboard } from './pages/AdminDashboard';
import { DatabaseView } from './pages/DatabaseView';
import { Login } from './pages/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactElement, allowedRoles?: string[] }) => {
    const { user, role, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user) return <Login />; // Or redirect to login
    if (allowedRoles && role && !allowedRoles.includes(role)) return <div>Access Denied (Role: {role})</div>;
    return children;
};

const Navbar = () => {
    const location = useLocation();
    const { user, signOut } = useAuth();
    return (
        <nav className="navbar">
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                <Link to="/" className="logo">🔧 QuickFix</Link>
                <div className="nav-links">
                    <Link to="/" className={location.pathname === '/' ? 'active' : ''}>แจ้งซ่อม</Link>
                    <Link to="/status" className={location.pathname === '/status' ? 'active' : ''}>ติดตามสถานะ</Link>
                    {user && (
                        <>
                            <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>ผู้ดูแล</Link>
                            <Link to="/database" className={location.pathname === '/database' ? 'active' : ''}>Data</Link>
                        </>
                    )}
                    {user ? (
                        <button onClick={signOut} className="btn btn-secondary" style={{ marginLeft: '1rem', padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                            Logout
                        </button>
                    ) : (
                        <Link to="/login" className="btn btn-primary" style={{ marginLeft: '1rem', padding: '0.4rem 0.8rem', fontSize: '0.9rem', textDecoration: 'none' }}>
                            Login (Admin)
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Navbar />
                    <div style={{ flex: 1, paddingBottom: '2rem' }}>
                        <Routes>
                            <Route path="/" element={<RepairFormPage />} />
                            <Route path="/status" element={<RepairStatusPage />} />
                            <Route path="/login" element={<Login />} />
                            <Route
                                path="/admin"
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/database"
                                element={
                                    <ProtectedRoute allowedRoles={['admin', 'staff']}>
                                        <DatabaseView />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </div>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
