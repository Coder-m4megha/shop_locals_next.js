# Database Connection Fix

## Issue: P1001 - Can't reach database server

### Fix 1: Neon Database ko Resume karo (Free tier pauses automatically)

1. **Neon Dashboard** mein jao: https://console.neon.tech
2. Apna project select karo
3. Agar database **"Paused"** dikhe, **"Resume"** button click karo
4. 10-20 seconds wait karo (database start hone ke liye)

### Fix 2: Connection String ko simplify karo

`.env` file mein connection string se `&channel_binding=require` hata do:

**Before:**
```
DATABASE_URL=postgresql://...?sslmode=require&channel_binding=require
```

**After:**
```
DATABASE_URL=postgresql://...?sslmode=require
```

Ya Neon dashboard se **fresh connection string** copy karo (without channel_binding).

### Fix 3: Direct connection string use karo (pooler ke bajay)

Neon mein:
1. **Connection Details** → **"Direct connection"** tab select karo
2. Us connection string ko copy karo
3. `.env` mein update karo

### Fix 4: Network/Firewall check

Agar abhi bhi nahi chal raha:
- Internet connection check karo
- VPN off karo (agar hai)
- Company/school network se try karo (firewall block kar sakta hai)

---

## Ab try karo:

```powershell
# .env file update karo (connection string fix karke)
# Phir:
cd "f:\Megha\saree shop"
npx prisma db push
npm run seed
```

---

## Important Security Note:

Aapke `.env` file mein database password exposed hai. **Abhi immediately:**

1. **Neon Dashboard** → **Settings** → **Reset Password**
2. **New connection string** generate karo
3. `.env` file update karo
4. **Vercel** mein bhi update karo (Environment Variables)

**Never commit `.env` file to Git!**
