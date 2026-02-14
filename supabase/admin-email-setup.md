# إعداد دخول المدير (بريد وكلمة مرور)

لتسجيل الدخول إلى لوحة الإدارة بـ **admin@gmail.com** وكلمة مرور:

1. افتح [Supabase Dashboard](https://supabase.com/dashboard) → مشروعك → **Authentication** → **Providers**.
2. تأكد أن **Email** مفعّل (مفعّل افتراضياً).
3. اذهب إلى **Authentication** → **Users** → **Add user** → **Create new user**.
4. أدخل:
   - **Email:** `admin@gmail.com`
   - **Password:** كلمة المرور التي تريدها للمدير
5. احفظ. بعدها يمكنك فتح `/dashboard` وتسجيل الدخول بهذا البريد وكلمة المرور.

**ملاحظة:** تأكد أن `ADMIN_EMAILS=admin@gmail.com` في ملف `.env` بالمشروع.
