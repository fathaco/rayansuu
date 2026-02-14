# إعداد التخزين والوقت الفعلي

## مجلد التخزين "fatha"

1. في [Supabase Dashboard](https://supabase.com/dashboard) → **Storage** → **New bucket**.
2. الاسم: `fatha`.
3. فعّل **Public bucket** (لظهور الصور للزوار).
4. احفظ. بعدها يمكن رفع صور الفعاليات من لوحة الإدارة وستُخزَّن في هذا المجلد.

## الوقت الفعلي (قبول/رفض الحجوزات)

1. في **Supabase Dashboard** → **Database** → **Replication** (أو **Publications**).
2. في منشور `supabase_realtime` أضف الجدول `reservations`:
   - أو نفّذ في **SQL Editor**:
   ```sql
   alter publication supabase_realtime add table public.reservations;
   ```
3. بعدها أي تحديث لحالة الحجز (قبول/رفض) يظهر فوراً في لوحة الإدارة دون تحديث الصفحة.
