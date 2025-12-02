# CyberQP - Privileged Access Management

A code-first prototype for Privileged Access Management built with Next.js and Chakra UI.

**Repository**: [https://github.com/charenk/CyberQP-design-prototype](https://github.com/charenk/CyberQP-design-prototype)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **Chakra UI** - Component library
- **TypeScript** - Type safety
- **React Icons** - Icon library
- **date-fns** - Date utilities

## Project Structure

```
src/
├── app/              # Next.js app router pages
│   ├── layout.tsx   # Root layout
│   ├── providers.tsx # Chakra UI provider
│   └── page.tsx     # Dashboard page
├── components/       # React components
│   ├── layout/      # Layout components
│   ├── shared/      # Reusable components
│   └── ...
├── hooks/           # Custom React hooks
├── utils/           # Utility functions
└── theme/           # Chakra UI theme configuration
```

## Documentation

UX guidelines and component documentation will be maintained in `/docs` and synced to Confluence.

## Development

This is a code-first prototype for design and product feedback, testing, and iteration.

## Git Workflow

To keep the repository synced:

```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push origin main
```

The repository is automatically synced to GitHub. All changes should be committed and pushed regularly.

