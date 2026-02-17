export interface RepairRequest {
    id: string;
    name: string;
    position: string;
    department: string;
    email: string;
    phone: string;
    problem_type: 'hardware' | 'software' | 'network' | 'other';
    problem_detail: string;
    attachments?: string[];
    location: string;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    technician_note?: string;
    createdAt: string;
}
