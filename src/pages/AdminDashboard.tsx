import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { RepairRequest } from '../entities/RepairRequest';
import { RequestCard } from '../components/repair/RequestCard';

export const AdminDashboard: React.FC = () => {
    const [requests, setRequests] = useState<RepairRequest[]>([]);
    const [filter, setFilter] = useState('all');

    const fetchRequests = async () => {
        const data = await api.getAll();
        setRequests(data);
    };

    useEffect(() => {
        // Seed data if empty for demo purposes - we can do this async too
        const init = async () => {
            const all = await api.getAll();
            if (all.length === 0) {
                await api.seed();
            }
            fetchRequests();
        };
        init();
        const interval = setInterval(fetchRequests, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        await api.updateStatus(id, newStatus as RepairRequest['status']);
        fetchRequests(); // Optimistic update or refresh
    };

    const filtered = requests.filter(r => filter === 'all' || r.status === filter);

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>แผงควบคุมผู้ดูแลระบบ</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('all')}>ทั้งหมด</button>
                    <button className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('pending')}>รอดำเนินการ</button>
                    <button className={`btn ${filter === 'in_progress' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('in_progress')}>กำลังซ่อม</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1rem' }}>
                {filtered.map(req => (
                    <div key={req.id} style={{ position: 'relative' }}>
                        <RequestCard request={req} />
                        <div className="glass-panel" style={{ marginTop: '-1rem', borderRadius: '0 0 16px 16px', borderTop: 'none', padding: '1rem' }}>
                            <label style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>อัปเดตสถานะ:</label>
                            <select
                                value={req.status}
                                onChange={(e) => handleStatusUpdate(req.id, e.target.value)}
                                style={{ marginBottom: 0 }}
                            >
                                <option value="pending">รอดำเนินการ (Pending)</option>
                                <option value="in_progress">กำลังดำเนินการ (In Progress)</option>
                                <option value="completed">เสร็จสิ้น (Completed)</option>
                                <option value="cancelled">ยกเลิก (Cancelled)</option>
                            </select>
                            <div style={{ marginTop: '0.5rem' }}>
                                <label style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>หมายเหตุช่าง:</label>
                                <textarea
                                    rows={2}
                                    placeholder="เพิ่มหมายเหตุ..."
                                    defaultValue={req.technician_note}
                                    onBlur={(e) => api.updateNote(req.id, e.target.value)}
                                    style={{ fontSize: '0.9rem' }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
