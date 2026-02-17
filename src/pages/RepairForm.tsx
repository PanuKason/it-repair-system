import React from 'react';
import { RepairForm as FormComponent } from '../components/repair/RepairForm';

export const RepairFormPage: React.FC = () => {
    return (
        <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1>แจ้งซ่อมอุปกรณ์ไอที</h1>
                <p>บริการรวดเร็ว ทันใจ แจ้งปุ๊บ ซ่อมปั๊บ</p>
            </div>
            <FormComponent />
        </div>
    );
};
