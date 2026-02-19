# Vercel par Products Load karne ke liye (Database Setup)

Vercel par app **PostgreSQL** use karti hai. SQLite (`file:./dev.db`) serverless par kaam nahi karti, isliye products tab tak load nahi honge jab tak aap production database set na kar dein.

## Steps

### 1. PostgreSQL database banao (free)

Koi bhi use kar sakte ho:

- **Neon** (recommended): https://neon.tech → Sign up → New project → **Connection string** copy karo (URI format).
- **Vercel Postgres**: Vercel dashboard → Storage → Create Database → Postgres.
- **Supabase**: https://supabase.com → New project → Settings → Database → Connection string (URI).

### 2. Vercel par `DATABASE_URL` set karo

1. Vercel dashboard → Apna project → **Settings** → **Environment Variables**.
2. Add:
   - **Name:** `DATABASE_URL`
   - **Value:** Apna Postgres connection string, e.g.  
     `postgresql://user:password@host/database?sslmode=require`
3. Save karo (Production, Preview, Development sab ke liye set kar sakte ho).

### 3. Tables create karo aur data daalo (sirf ek baar)

Apne computer par (jahan repo cloned hai), same database ke liye tables banao aur seed chalao:

```bash
# .env mein DATABASE_URL set karo (ya export karo)
# Windows (PowerShell):
$env:DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# Phir:
npx prisma db push
npm run seed
```

- `prisma db push` → Schema ke hisaab se Postgres mein tables bana dega.
- `npm run seed` → Products / initial data daal dega.

### 4. Redeploy

Vercel par naya deploy trigger karo (git push ya “Redeploy” button). Ab products page par products dikhne chahiye.

---

**Local development:**  
Local par bhi ab Postgres chahiye. Same Neon/Vercel Postgres URL ko `.env` mein `DATABASE_URL` de do, phir `npx prisma db push` aur `npm run seed` chalao. Ya alag local Postgres bana kar uski URL use karo.
