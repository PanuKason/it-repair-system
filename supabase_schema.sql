-- Create the repair_requests table
CREATE TABLE IF NOT EXISTS repair_requests (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    "position" TEXT NOT NULL,
    department TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    problem_type TEXT NOT NULL,
    problem_detail TEXT NOT NULL,
    attachments TEXT[] DEFAULT '{}',
    location TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    priority TEXT NOT NULL DEFAULT 'low',
    technician_note TEXT,
    "createdAt" TEXT NOT NULL
);

-- Optional: Enable Row Level Security (RLS)
-- ALTER TABLE repair_requests ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to read (since this is a demo/internal tool)
-- CREATE POLICY "Allow public read access" ON repair_requests FOR SELECT USING (true);

-- Policy to allow anyone to insert
-- CREATE POLICY "Allow public insert access" ON repair_requests FOR INSERT WITH CHECK (true);

-- Policy to allow anyone to update (for admin dashboard)
-- CREATE POLICY "Allow public update access" ON repair_requests FOR UPDATE USING (true);
