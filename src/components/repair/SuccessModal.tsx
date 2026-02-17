import React from 'react';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    requestId: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, requestId }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content glass-panel" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                <h2 style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>บันทึกแจ้งซ่อมสำเร็จ!</h2>
                <p>ระบบได้รับข้อมูลแจ้งซ่อมของคุณแล้ว</p>

                <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    margin: '1.5rem 0',
                    border: '1px dashed var(--border-color)'
                }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--secondary)' }}>หมายเลขติดตามงาน (Tracking ID)</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0 0 0', color: 'var(--primary)', letterSpacing: '1px' }}>
                        {requestId}
                    </p>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--secondary)', marginBottom: '1.5rem' }}>
                    คุณสามารถใช้หมายเลขนี้เพื่อตรวจสอบสถานะการซ่อมได้ที่หน้า "ติดตามสถานะ"
                </p>

                <button className="btn btn-primary" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>
                    ตกลง
                </button>
            </div>
        </div>
    );
};
