-- Create a new storage bucket for repair attachments
INSERT INTO storage.buckets (id, name, public) 
VALUES ('repair-attachments', 'repair-attachments', true);

-- Allow public access to read files in the bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'repair-attachments' );

-- Allow anyone to upload files to the bucket
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'repair-attachments' );
