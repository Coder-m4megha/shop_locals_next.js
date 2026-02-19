# Profile Photo Upload Setup (Vercel Blob)

Photo upload ab **Vercel Blob** use karta hai — Vercel par filesystem write allowed nahi hai, isliye cloud storage zaroori hai.

## Vercel par Blob Store setup karo

1. **Vercel Dashboard** → Apna project
2. **Storage** tab click karo
3. **Create Database** → **Blob** select karo (agar option ho)
   - Ya **"Connect Store"** → **Blob**
4. Store create hone ke baad **`BLOB_READ_WRITE_TOKEN`** automatically add ho jata hai Environment Variables mein
5. Agar manually add karna ho:
   - Settings → Environment Variables
   - Key: `BLOB_READ_WRITE_TOKEN`
   - Value: Blob store ke dashboard se copy karo

## Redeploy

Blob store create ke baad **Redeploy** karo:
- Deployments → Latest → "..." → Redeploy

---

## Local development

Local par test karne ke liye bhi `BLOB_READ_WRITE_TOKEN` chahiye:
- Vercel project ke Blob store se token copy karo
- `.env` file mein add karo:
  ```
  BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxx
  ```

---

## Package install

Agar abhi `npm install` nahi kiya:
```bash
npm install
```

Phir commit & push karo.
