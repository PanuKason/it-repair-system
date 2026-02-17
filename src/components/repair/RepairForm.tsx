import React, { useState } from 'react';
import { api } from '../../services/api';
import { SuccessModal } from './SuccessModal';
import type { RepairRequest } from '../../entities/RepairRequest';

export const RepairForm: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        position: '',
        department: '',
        email: '',
        phone: '',
        problem_type: 'hardware' as RepairRequest['problem_type'],
        problem_detail: '',
        location: '',
        priority: 'low' as RepairRequest['priority'],
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [requestId, setRequestId] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);

        let attachmentUrl = '';
        if (selectedFile) {
            const url = await api.uploadFile(selectedFile);
            if (url) {
                attachmentUrl = url;
            }
        }

        const newRequest = await api.create({
            ...formData,
            attachments: attachmentUrl ? [attachmentUrl] : []
        });

        setIsUploading(false);

        if (newRequest) {
            setRequestId(newRequest.id);
            setIsModalOpen(true);
        } else {
            alert('Failed to submit request. Please try again.');
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        // Reset form
        setFormData({
            name: '', position: '', department: '', email: '', phone: '',
            problem_type: 'hardware', problem_detail: '', location: '', priority: 'low'
        });
        setSelectedFile(null);
    };

    return (
        <div className="card glass-panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>🔧 แบบฟอร์มแจ้งซ่อม</h2>

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label>ชื่อผู้แจ้ง</label>
                        <input required name="name" value={formData.name} onChange={handleChange} placeholder="สมชาย ใจดี" />
                    </div>
                    <div className="form-group">
                        <label>ตำแหน่ง</label>
                        <input required name="position" value={formData.position} onChange={handleChange} placeholder="Software Engineer" />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label>แผนก / ฝ่าย</label>
                        <input required name="department" value={formData.department} onChange={handleChange} placeholder="ฝ่ายไอที" />
                    </div>
                    <div className="form-group">
                        <label>อีเมล</label>
                        <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="somchai@company.com" />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label>เบอร์โทรศัพท์</label>
                        <input required name="phone" value={formData.phone} onChange={handleChange} placeholder="081-234-5678" />
                    </div>
                    <div className="form-group">
                        <label>สถานที่ / ห้อง</label>
                        <input required name="location" value={formData.location} onChange={handleChange} placeholder="อาคาร A, ห้อง 304" />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label>ประเภทปัญหา</label>
                        <select name="problem_type" value={formData.problem_type} onChange={handleChange}>
                            <option value="hardware">Hardware (อุปกรณ์)</option>
                            <option value="software">Software (โปรแกรม)</option>
                            <option value="network">Network (อินเทอร์เน็ต)</option>
                            <option value="other">Other (อื่นๆ)</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>ความเร่งด่วน</label>
                        <select name="priority" value={formData.priority} onChange={handleChange} style={{ color: formData.priority === 'urgent' ? 'var(--error)' : 'inherit' }}>
                            <option value="low">ปกติ (Low)</option>
                            <option value="medium">ปานกลาง (Medium)</option>
                            <option value="high">สูง (High)</option>
                            <option value="urgent">เร่งด่วน (Urgent)</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label>รายละเอียดปัญหา</label>
                    <textarea required name="problem_detail" rows={4} value={formData.problem_detail} onChange={handleChange} placeholder="อธิบายอาการเสียที่พบ..." />
                </div>

                <div className="form-group">
                    <label>ไฟล์แนบ (ถ้ามี)</label>
                    <input type="file" onChange={handleFileChange} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>
                        {selectedFile ? `เลือกไฟล์: ${selectedFile.name}` : ''}
                    </span>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={isUploading}>
                    {isUploading ? 'กำลังส่งข้อมูล...' : 'ส่งแจ้งซ่อม'}
                </button>
            </form>

            <SuccessModal isOpen={isModalOpen} onClose={handleCloseModal} requestId={requestId} />
        </div>
    );
};
