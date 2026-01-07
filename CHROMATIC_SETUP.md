# Chromatic Setup Guide

## What is Chromatic?

Chromatic is a visual testing and review platform for Storybook. It automatically:
- Builds and deploys your Storybook on every commit/PR
- Captures visual snapshots of all your components
- Detects visual regressions
- Provides shareable URLs for each build

## Setup Steps

### 1. Create a Chromatic Account

1. Go to [https://www.chromatic.com](https://www.chromatic.com)
2. Sign up with your GitHub account (recommended) or email
3. Create a new project
4. Connect your GitHub repository: `charenk/CyberQP-design-prototype`

### 2. Get Your Project Token

After creating the project, Chromatic will provide you with a **Project Token**. It looks like:
```
chr_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Set Up Environment Variable

**Option A: Local Development (for testing)**
```bash
export CHROMATIC_PROJECT_TOKEN=chr_your_token_here
```

**Option B: GitHub Actions (for automatic deployments)**

Create a GitHub Actions workflow or add the token to your repository secrets:
1. Go to your GitHub repo → Settings → Secrets and variables → Actions
2. Add a new secret: `CHROMATIC_PROJECT_TOKEN` with your token value

### 4. Deploy to Chromatic

**First Time (Manual):**
```bash
npx chromatic --project-token=chr_your_token_here
```

**After setting environment variable:**
```bash
npx chromatic
```

**Or add to package.json:**
```json
{
  "scripts": {
    "chromatic": "chromatic --project-token=$CHROMATIC_PROJECT_TOKEN"
  }
}
```

### 5. Automatic Deployments (GitHub Actions)

Create `.github/workflows/chromatic.yml`:

```yaml
name: 'Chromatic'

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  chromatic-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - run: npm ci
      
      - uses: chromaui/action@v1
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          buildScriptName: build-storybook
```

## Using Chromatic

### Viewing Your Storybook

After deployment, Chromatic provides:
- **Public URL**: Shareable link to your Storybook (e.g., `https://main--xxxxx.chromatic.com`)
- **PR Preview**: Automatic preview for each pull request
- **Visual Diffs**: See what changed visually between commits

### Adding to Jira Tickets

1. Copy the Chromatic URL from your build
2. Paste it in your Jira ticket alongside Figma links
3. Example format:
   ```
   Storybook Preview: https://main--xxxxx.chromatic.com/?path=/story/components-datatable--full-featured
   ```

### Visual Testing

Chromatic automatically:
- Captures screenshots of all stories
- Compares them with previous versions
- Flags visual changes for review
- Allows you to approve or reject changes

## Troubleshooting

### Build Fails
- Check that `build-storybook` script works locally
- Verify your project token is correct
- Check Chromatic dashboard for error details

### Stories Not Appearing
- Ensure stories are in the correct location (`src/**/*.stories.tsx`)
- Check `.storybook/main.ts` configuration
- Verify Storybook builds successfully locally

### Need Help?
- Chromatic Docs: https://www.chromatic.com/docs
- Support: support@chromatic.com


