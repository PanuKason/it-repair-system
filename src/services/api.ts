
import { supabase } from './supabaseClient';
import type { RepairRequest } from '../entities/RepairRequest';

const TABLE_NAME = 'repair_requests'; // Assume table name in Supabase
const BUCKET_NAME = 'repair-attachments';

export const api = {
    getAll: async (): Promise<RepairRequest[]> => {
        if (!supabase) {
            console.warn("Supabase client not initialized. Check your .env file.");
            return [];
        }
        try {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .select('*')
                .order('createdAt', { ascending: false });

            if (error) {
                console.error('Error fetching data:', error);
                throw error;
            }
            return (data as RepairRequest[]) || [];
        } catch (error) {
            console.error('API Error (getAll):', error);
            return []; // Fallback to empty array on error
        }
    },

    getById: async (id: string): Promise<RepairRequest | undefined> => {
        if (!supabase) return undefined;
        try {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching by ID:', error);
                return undefined;
            }
            return data as RepairRequest;
        } catch (error) {
            console.error('API Error (getById):', error);
            return undefined;
        }
    },

    create: async (data: Omit<RepairRequest, 'id' | 'createdAt' | 'status'> & { createdAt?: string }): Promise<RepairRequest | null> => {
        if (!supabase) return null;
        try {
            const newRequest = {
                ...data, // ... rest of code
                // Supabase generates ID automatically if using UUID, but here we might need to conform to existing logic or let DB handle it.
                // Assuming we want to keep generating custom ID for now or let Supabase handle UUID.
                // Let's stick to the previous logic of generating ID client-side for consistency with previous behavior, 
                // OR better, let's use the DB's ID if possible. 
                // However, the previous code generated a short ID. Let's keep that for display purposes if the DB supports it, 
                // or just use the UUID from Supabase.
                // For now, let's generate it client-side to match the interface, but ideally we should use DB triggers.
                id: Math.random().toString(36).substr(2, 9).toUpperCase(),
                createdAt: data.createdAt || new Date().toISOString(),
                status: 'pending',
            };

            const { data: createdData, error } = await supabase
                .from(TABLE_NAME)
                .insert([newRequest])
                .select()
                .single();

            if (error) {
                console.error('Error creating request:', error);
                throw error;
            }
            return createdData as RepairRequest;
        } catch (error) {
            console.error('API Error (create):', error);
            return null;
        }
    },

    updateStatus: async (id: string, status: RepairRequest['status']): Promise<void> => {
        if (!supabase) return;
        try {
            const { error } = await supabase
                .from(TABLE_NAME)
                .update({ status })
                .eq('id', id);

            if (error) {
                console.error('Error updating status:', error);
                throw error;
            }
        } catch (error) {
            console.error('API Error (updateStatus):', error);
        }
    },

    updateNote: async (id: string, note: string): Promise<void> => {
        if (!supabase) return;
        try {
            const { error } = await supabase
                .from(TABLE_NAME)
                .update({ technician_note: note })
                .eq('id', id);

            if (error) {
                console.error('Error updating note:', error);
                throw error;
            }
        } catch (error) {
            console.error('API Error (updateNote):', error);
        }
    },

    seed: async () => {
        if (!supabase) return;
        // Check if data exists
        const { count, error } = await supabase
            .from(TABLE_NAME)
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error('Error checking for existing data:', error);
            return;
        }

        if (count === 0) {
            const initial: RepairRequest[] = [
                {
                    id: 'REQ82X91',
                    name: 'John Doe',
                    position: 'Software Engineer',
                    department: 'Development',
                    email: 'john.doe@company.com',
                    phone: '081-234-5678',
                    problem_type: 'hardware',
                    problem_detail: 'Laptop screen flickers intermittently when moved.',
                    location: 'Office 304',
                    status: 'pending',
                    priority: 'high',
                    createdAt: new Date().toISOString(),
                },
                {
                    id: 'REQ19Z22',
                    name: 'Jane Smith',
                    position: 'HR Manager',
                    department: 'Human Resources',
                    email: 'jane.smith@company.com',
                    phone: '089-876-5432',
                    problem_type: 'software',
                    problem_detail: 'Unable to access the payroll system on the new workstation.',
                    location: 'Building A, 2nd Floor',
                    status: 'in_progress',
                    priority: 'medium',
                    createdAt: new Date(Date.now() - 86400000).toISOString(),
                }
            ];

            const { error: seedError } = await supabase
                .from(TABLE_NAME)
                .insert(initial);

            if (seedError) {
                console.error('Error seeding data:', seedError);
            } else {
                console.log('Seeded initial data.');
            }
        }
    },

    uploadFile: async (file: File): Promise<string | null> => {
        if (!supabase) return null;
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(filePath, file);

            if (uploadError) {
                console.error('Error uploading file:', uploadError);
                throw uploadError;
            }

            const { data } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(filePath);

            return data.publicUrl;
        } catch (error) {
            console.error('API Error (uploadFile):', error);
            return null;
        }
    }
};
