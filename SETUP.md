# Setup Guide: Vercel Deployment

This guide will help you set up Vercel deployment for your CyberQP application.

## Step 1: Deploy to Vercel (10 minutes)

### 1.1 Push Code to GitHub

1. Make sure your code is committed and pushed to GitHub:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

### 1.2 Deploy to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings

### 1.3 Configure Build Settings

Vercel will automatically detect:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

No additional configuration needed!

### 1.4 Deploy

1. Click "Deploy"
2. Vercel will automatically deploy on every push to `main`
3. Preview deployments are created for every pull request
4. Your app will be live at: `https://your-project.vercel.app`

## Step 2: Environment Variables (Optional)

If you need environment variables later (e.g., for Supabase or other services):

1. In your Vercel project, go to **Settings** → **Environment Variables**
2. Add your variables:
   - `NEXT_PUBLIC_*` variables are available in the browser
   - Other variables are only available server-side
3. Add them for all environments (Production, Preview, Development)
4. Redeploy after adding variables

## Step 3: Continue Building

Now you can:

1. **Build components** in your local environment
2. **Test locally** with `npm run dev`
3. **Preview changes** via Vercel preview deployments
4. **Share with stakeholders** using Vercel URLs

## Next Steps

1. ✅ Vercel deployment set up
2. 🚀 Start building features!
3. 📦 Add Supabase or other services later as needed

## Troubleshooting

### Vercel deployment fails
- Check Vercel build logs for specific errors
- Ensure all dependencies are in `package.json`
- Verify build command is correct (`npm run build`)

### Environment variables not working
- Make sure `NEXT_PUBLIC_` prefix is used for client-side variables
- Redeploy after adding environment variables
- Check that variables are set for the correct environment (Production/Preview/Development)

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Vercel + Next.js Integration](https://vercel.com/docs/frameworks/nextjs)
