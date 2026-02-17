import React from 'react';
import type { RepairRequest } from '../../entities/RepairRequest';

const statusMap: Record<string, string> = {
    pending: 'รอดำเนินการ',
    in_progress: 'กำลังดำเนินการ',
    completed: 'เสร็จสิ้น',
    cancelled: 'ยกเลิก'
};

interface RequestCardProps {
    request: RepairRequest;
    onClick?: () => void;
    showAdminControls?: boolean;
}

export const RequestCard: React.FC<RequestCardProps> = ({ request, onClick, showAdminControls }) => {
    return (
        <div
            className="card"
            onClick={onClick}
            style={{
                cursor: onClick ? 'pointer' : 'default',
                textAlign: 'left',
                background: 'var(--bg-dark)',
                border: '1px solid var(--border-color)',
                marginBottom: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className={`status-badge status-${request.status}`} style={{ display: 'inline-block' }}>
                    {statusMap[request.status] || request.status}
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>
                    {new Date(request.createdAt).toLocaleDateString('th-TH')}
                </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'white' }}>
                    {request.problem_type.toUpperCase()}
                </h3>
                {request.priority === 'urgent' && (
                    <span style={{
                        color: 'var(--error)',
                        fontWeight: 'bold',
                        fontSize: '0.75rem',
                        border: '1px solid var(--error)',
                        padding: '2px 6px',
                        borderRadius: '4px'
                    }}>
                        ด่วนมาก
                    </span>
                )}
            </div>

            <p style={{ margin: '0.5rem 0', color: 'var(--secondary)', lineHeight: '1.4' }}>
                {request.problem_detail}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--info)' }}>
                <div>📍 {request.location}</div>
                <div>📂 {request.department}</div>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--secondary)', marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.5rem' }}>
                ID: {request.id}
            </div>

            {showAdminControls && (
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>รายละเอียด</button>
                </div>
            )}
        </div>
    );
};
