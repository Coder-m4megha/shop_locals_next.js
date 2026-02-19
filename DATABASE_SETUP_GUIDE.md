# PostgreSQL Database Setup Guide (Step-by-Step)

## Option 1: Neon.tech (Recommended - Free & Easy)

### Step 1: Account banao
1. Browser mein jao: **https://neon.tech**
2. Top right corner par **"Sign Up"** ya **"Get Started"** click karo
3. GitHub, Google, ya email se sign up karo (GitHub recommended)

### Step 2: New Project banao
1. Login ke baad dashboard par **"Create a project"** ya **"New Project"** button dikhega
2. Click karo
3. Project details:
   - **Project name:** `saree-shop` (ya kuch bhi naam)
   - **Region:** `US East (Ohio)` ya apne paas wala (India ke liye closest)
   - **PostgreSQL version:** Latest (15 ya 16) - default hi theek hai
4. **"Create Project"** button click karo

### Step 3: Connection String copy karo
1. Project create hone ke baad ek page dikhega jahan **"Connection string"** dikhega
2. Ya **"Connection Details"** section mein jao
3. **"Connection string"** ya **"URI"** copy karo
   - Example: `postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`
4. **Important:** Ye string copy karke safe jagah save karo (notepad ya notes mein)

### Step 4: Vercel par add karo
1. **Vercel Dashboard** kholo: https://vercel.com/dashboard
2. Apna project select karo
3. **Settings** tab click karo
4. Left sidebar mein **"Environment Variables"** click karo
5. **"Add New"** button click karo
6. Form mein:
   - **Key:** `DATABASE_URL`
   - **Value:** Neon se copy ki hui connection string paste karo
   - **Environment:** Sab select karo (Production, Preview, Development)
7. **"Save"** click karo

---

## Option 2: Vercel Postgres (Agar Vercel Pro plan hai)

### Step 1: Vercel Dashboard mein
1. Vercel Dashboard → Apna project
2. **Storage** tab click karo
3. **"Create Database"** → **"Postgres"** select karo
4. **"Create"** click karo

### Step 2: Connection String
1. Database create hone ke baad automatically **"Connection String"** dikhega
2. Copy karo
3. Same project ke **Settings** → **Environment Variables** mein add karo (upar wale Step 4 jaisa)

---

## Option 3: Supabase (Free Alternative)

### Step 1: Account banao
1. Jao: **https://supabase.com**
2. **"Start your project"** click karo
3. GitHub se sign up karo

### Step 2: New Project
1. Dashboard par **"New Project"** click karo
2. Details:
   - **Name:** `saree-shop`
   - **Database Password:** Strong password set karo (save karo!)
   - **Region:** Closest select karo
3. **"Create new project"** click karo (2-3 minutes lag sakte hain)

### Step 3: Connection String
1. Project ready hone ke baad **"Settings"** (gear icon) click karo
2. Left sidebar mein **"Database"** click karo
3. **"Connection string"** section mein **"URI"** tab select karo
4. Copy karo (password apne set kiye hue password se replace karna hoga)
5. Vercel par add karo (Option 1 ke Step 4 jaisa)

---

## Database Setup Complete hone ke baad

### Local par tables create karo:

1. **Terminal/PowerShell** kholo
2. Project folder mein jao:
   ```bash
   cd "f:\Megha\saree shop"
   ```

3. **Connection string set karo** (temporary):
   ```powershell
   # PowerShell mein:
   $env:DATABASE_URL="postgresql://username:password@host/dbname?sslmode=require"
   ```
   (Yahan apna Neon/Supabase connection string paste karo)

4. **Tables create karo:**
   ```bash
   npx prisma db push
   ```
   Ye command schema ke hisaab se tables bana dega.

5. **Products seed karo:**
   ```bash
   npm run seed
   ```
   Ye command sample products database mein daal dega.

6. **Verify karo:**
   - Neon/Supabase dashboard mein jao
   - **"Tables"** section check karo
   - `Product`, `User`, `Order` etc. tables dikhne chahiye

### Vercel par redeploy:
1. Git push karo (agar changes kiye ho)
2. Vercel automatically redeploy karega
3. Ya manually **"Redeploy"** button click karo

---

## Troubleshooting

### Agar connection string copy nahi ho rahi:
- Neon mein: **"Connection Details"** section expand karo
- **"Copy"** button use karo (text select karke copy mat karo)

### Agar `npx prisma db push` fail ho:
- Connection string check karo (sahi paste hui hai?)
- Internet connection check karo
- Neon dashboard mein database **"Active"** hai ya nahi check karo

### Agar products nahi dikh rahe:
- Vercel logs check karo (Deployments → Latest → Logs)
- `DATABASE_URL` environment variable set hai ya nahi verify karo
- Database mein products hain ya nahi check karo (Neon dashboard → Tables → Product)

---

## Quick Reference

**Neon:** https://neon.tech  
**Supabase:** https://supabase.com  
**Vercel Dashboard:** https://vercel.com/dashboard

**Commands:**
```bash
# Connection string set karo (PowerShell)
$env:DATABASE_URL="your-connection-string-here"

# Tables create karo
npx prisma db push

# Data seed karo
npm run seed
```
