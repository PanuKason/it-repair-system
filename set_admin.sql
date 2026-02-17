-- 1. อัปเดตสิทธิ์ให้เป็น admin สำหรับอีเมลใหม่ที่คุณเพิ่งสมัคร
INSERT INTO public.profiles (id, email, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email = 'admin123@gmail.com'
ON CONFLICT (id) DO UPDATE
SET role = 'admin';

-- 2. ตรวจสอบผลลัพธ์
SELECT * FROM public.profiles WHERE email = 'admin123@gmail.com';
