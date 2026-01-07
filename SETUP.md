# Setup Guide: Supabase + Vercel

This guide will help you set up Supabase and Vercel for your CyberQP application.

## Step 1: Set Up Supabase (15 minutes)

### 1.1 Create Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name**: `cyberqp-pam` (or your preferred name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine to start

### 1.2 Get API Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

### 1.3 Configure Local Environment

1. Create a `.env.local` file in the project root:
   ```bash
   cp .env.example .env.local
   ```

2. Add your Supabase credentials to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Important**: `.env.local` is already in `.gitignore` and won't be committed

### 1.4 Test Connection

The Supabase client is already set up in `src/lib/supabase/`. You can test it by:

1. Creating a simple test page or API route
2. Import: `import { supabase } from '@/lib/supabase'`
3. Make a test query

## Step 2: Set Up Vercel (10 minutes)

### 2.1 Deploy to Vercel

1. Push your code to GitHub (if not already):
   ```bash
   git add .
   git commit -m "Add Supabase setup"
   git push origin main
   ```

2. Go to [https://vercel.com](https://vercel.com)
3. Click "Add New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js settings

### 2.2 Configure Environment Variables in Vercel

1. In your Vercel project, go to **Settings** → **Environment Variables**
2. Add the same variables from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Important**: Add them for all environments (Production, Preview, Development)

### 2.3 Deploy

1. Vercel will automatically deploy on every push to `main`
2. Preview deployments are created for every pull request
3. Your app will be live at: `https://your-project.vercel.app`

## Step 3: Continue Building

Now you can:

1. **Build components** that connect to Supabase
2. **Test locally** with `npm run dev`
3. **Preview changes** via Vercel preview deployments
4. **Share with stakeholders** using Vercel URLs

### Example: Using Supabase in Components

```tsx
'use client'

import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export function MyComponent() {
  const [data, setData] = useState([])

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('your_table')
        .select('*')
      
      if (error) console.error(error)
      else setData(data)
    }
    
    fetchData()
  }, [])

  return <div>{/* Your component */}</div>
}
```

### Example: Using Supabase in Server Components

```tsx
import { createServerClient } from '@/lib/supabase/server'

export default async function ServerPage() {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('your_table')
    .select('*')

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return <div>{/* Render data */}</div>
}
```

## Next Steps

1. ✅ Supabase project created
2. ✅ Environment variables configured
3. ✅ Vercel deployment set up
4. 🚀 Start building features with real data!

## Troubleshooting

### "Missing Supabase environment variables" error
- Make sure `.env.local` exists in the project root
- Verify the variable names match exactly (including `NEXT_PUBLIC_` prefix)
- Restart your dev server after adding env variables

### Vercel deployment fails
- Check that all environment variables are set in Vercel dashboard
- Ensure `NEXT_PUBLIC_` prefix is used for client-side variables
- Check Vercel build logs for specific errors

### Database connection issues
- Verify your Supabase project is active
- Check that your IP is allowed (Supabase free tier allows all IPs by default)
- Verify your API keys are correct

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel + Supabase Integration](https://vercel.com/guides/deploying-supabase-on-vercel)

