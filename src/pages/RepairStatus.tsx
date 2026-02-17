import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { RepairRequest } from '../entities/RepairRequest';
import { RequestCard } from '../components/repair/RequestCard';

export const RepairStatusPage: React.FC = () => {
    const [requests, setRequests] = useState<RepairRequest[]>([]);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        // Basic polling
        const fetchRequests = async () => {
            const data = await api.getAll();
            setRequests(data);
        };

        fetchRequests();
        const interval = setInterval(fetchRequests, 5000);
        return () => clearInterval(interval);
    }, []);

    const filtered = requests.length > 0 ? requests.filter(r => {
        const searchLower = filter.toLowerCase();
        return (
            r.id.toLowerCase().includes(searchLower) ||
            r.email.toLowerCase().includes(searchLower)
        );
    }) : [];

    return (
        <div className="container">
            <h1>รายการแจ้งซ่อมของฉัน</h1>

            <div className="card glass-panel" style={{ marginBottom: '2rem', padding: '1rem' }}>
                <input
                    type="text"
                    placeholder="ค้นหาด้วยรหัสหรืออีเมล..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={{ margin: 0 }}
                />
            </div>

            {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--secondary)', marginTop: '2rem' }}>
                    <p>ไม่พบรายการที่ค้นหา กรุณาตรวจสอบรหัส/อีเมล หรือคุณยังไม่ได้แจ้งซ่อม</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '1rem'
                }}>
                    {filtered.map(req => (
                        <RequestCard
                            key={req.id}
                            request={req}
                            onClick={() => alert(`ดูรายละเอียดของ ${req.id}`)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
