import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { RepairRequest } from '../entities/RepairRequest';

export const DatabaseView: React.FC = () => {
    const [data, setData] = useState<RepairRequest[]>([]);

    const fetchData = async () => {
        const data = await api.getAll();
        setData(data);
    };

    useEffect(() => {
        fetchData();
        // Auto-refresh every 5 seconds to keep data live
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString();
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1>ข้อมูลซ่อมทั้งหมด (Data)</h1>
                    <p>ตารางแสดงข้อมูลการแจ้งซ่อมทั้งหมดในระบบ</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary" onClick={async () => { await api.seed(); fetchData(); }}>
                        เพิ่มข้อมูลตัวอย่าง
                    </button>
                    <button className="btn btn-outline" onClick={fetchData}>
                        รีเฟรชข้อมูล
                    </button>
                </div>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>สถานะ</th>
                            <th>วันที่แจ้ง</th>
                            <th>ชื่อผู้แจ้ง</th>
                            <th>แผนก</th>
                            <th>ตำแหน่ง</th>
                            <th>อีเมล</th>
                            <th>เบอร์โทร</th>
                            <th>สถานที่</th>
                            <th>ความเร่งด่วน</th>
                            <th>ประเภท</th>
                            <th>รายละเอียด</th>
                            <th>ไฟล์แนบ</th>
                            <th>หมายเหตุช่าง</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={14} style={{ textAlign: 'center', color: 'var(--secondary)', padding: '2rem' }}>
                                    ไม่พบข้อมูลในระบบ
                                </td>
                            </tr>
                        ) : (
                            data.map((row) => (
                                <tr key={row.id}>
                                    <td style={{ fontFamily: 'monospace', color: 'var(--primary)' }}>{row.id}</td>
                                    <td>
                                        <span className={`status-badge status-${row.status}`}>
                                            {row.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td>{formatDate(row.createdAt)}</td>
                                    <td>{row.name}</td>
                                    <td>{row.department}</td>
                                    <td>{row.position}</td>
                                    <td>{row.email}</td>
                                    <td>{row.phone}</td>
                                    <td>{row.location}</td>
                                    <td>
                                        <span style={{
                                            textTransform: 'capitalize',
                                            color: row.priority === 'urgent' ? 'var(--error)' :
                                                row.priority === 'high' ? 'var(--warning)' : 'inherit'
                                        }}>
                                            {row.priority}
                                        </span>
                                    </td>
                                    <td style={{ textTransform: 'capitalize' }}>{row.problem_type}</td>
                                    <td style={{ maxWidth: '300px', whiteSpace: 'normal', minWidth: '200px' }}>
                                        {row.problem_detail}
                                    </td>
                                    <td>
                                        {row.attachments && row.attachments.length > 0 ? (
                                            <span style={{ color: 'var(--info)' }}>{row.attachments.length} file(s)</span>
                                        ) : (
                                            <span style={{ color: 'var(--secondary)', opacity: 0.5 }}>-</span>
                                        )}
                                    </td>
                                    <td style={{ maxWidth: '200px', whiteSpace: 'normal', color: 'var(--secondary)' }}>
                                        {row.technician_note || '-'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '1rem', textAlign: 'right', color: 'var(--secondary)', fontSize: '0.8rem' }}>
                จำนวนทั้งหมด: {data.length} รายการ
            </div>
        </div>
    );
};
