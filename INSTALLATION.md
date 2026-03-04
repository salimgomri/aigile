# Installation Guide - AIgile Platform

## ⚠️ Important Notice

The current disk (`/Volumes/T9`) has **inode exhaustion** (100% inodes used), which prevents npm from installing dependencies even though there's plenty of disk space available (3TB free).

## 🔧 Solutions

### Option 1: Install on Another System (Recommended)

1. **Copy the project to a different location** (local disk, another external drive, or cloud):
   ```bash
   # Copy entire project
   cp -r /Volumes/T9/aigile ~/aigile-project
   cd ~/aigile-project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Visit**: http://localhost:3000

### Option 2: Fix Inode Issue on T9

The T9 drive has 100% inodes used. To fix this:

1. **Find and remove unnecessary small files**:
   ```bash
   # Find directories with many files
   find /Volumes/T9 -type d -exec sh -c 'echo "$(find "{}" -maxdepth 1 -type f | wc -l) {}"' \; | sort -rn | head -20
   
   # Common culprits:
   # - node_modules folders (can have thousands of files)
   # - .git folders with many objects
   # - Cache directories
   # - Log files
   ```

2. **Clean up**:
   ```bash
   # Remove node_modules from old projects
   find /Volumes/T9 -name "node_modules" -type d -prune
   
   # Remove .next build folders
   find /Volumes/T9 -name ".next" -type d -prune
   
   # Remove npm cache if on T9
   npm cache clean --force
   ```

3. **After freeing inodes, install**:
   ```bash
   cd /Volumes/T9/aigile
   npm install
   ```

### Option 3: Use Yarn Instead

Yarn sometimes handles inodes better:

```bash
# Install yarn globally if not installed
npm install -g yarn

# In project directory
yarn install
yarn dev
```

### Option 4: Deploy Without Installing Locally

If you just want to deploy, you can push to a platform that builds for you:

#### Vercel (Recommended for Next.js)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   cd /Volumes/T9/aigile
   vercel
   ```

3. Vercel will build and deploy automatically

#### Netlify

1. Push code to GitHub/GitLab
2. Connect repository to Netlify
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `out`

## 📦 Manual Dependency List

If you need to install dependencies one by one:

### Core Dependencies
```bash
npm install next@^15.1.6 react@^19.0.0 react-dom@^19.0.0
```

### UI & Styling
```bash
npm install lucide-react@^0.344.0 clsx@^2.1.0 tailwind-merge@^2.2.1 class-variance-authority@^0.7.1
```

### Dev Dependencies
```bash
npm install -D typescript@^5 @types/node@^20 @types/react@^19 @types/react-dom@^19 tailwindcss@^3.4.1 postcss@^8 autoprefixer@^10.0.1 eslint@^8 eslint-config-next@15.1.6
```

## 🚀 Quick Start (After Installation)

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint
npm run lint
```

## 📂 Project Status

✅ **Fully configured and ready**:
- Next.js 15 App Router
- TypeScript configuration
- TailwindCSS setup
- All components created
- Full retro tool logic implemented
- Bilingual support (EN/FR)
- Dual theme system (Sarah/Maya)

❌ **Missing**:
- node_modules (dependencies not installed due to inode issue)

## 🔍 Verify Project Structure

Check that all files are present:

```bash
# Count TypeScript files (should be ~30+)
find . -name "*.tsx" -o -name "*.ts" | grep -v node_modules | wc -l

# List main directories
ls -la app/ components/ lib/

# Check retro tool structure
ls -la app/retro/ lib/retro/
```

## 📝 What's Included

### Pages
- `/` - AIgile Manifesto landing page
- `/retro` - Retro tool landing
- `/retro/questionnaire` - 8-question diagnostic
- `/retro/result` - Personalized retro results

### Core Logic
- Pattern detection algorithm (9 patterns)
- Questionnaire system (8 questions)
- Activity mapping (50+ Retromat activities)
- Theme system (2 themes)
- Translation system (2 languages)

## 🆘 Support

If you continue having issues:

1. **Check disk health**: `diskutil info /Volumes/T9`
2. **Check inode usage**: `df -i /Volumes/T9`
3. **Try different Node version**: Use `nvm` to switch to Node 20
4. **Contact**: Salim.gomri@gmail.com

## 📚 Next Steps After Installation

1. Test the home page: http://localhost:3000
2. Test language toggle (EN/FR)
3. Test theme toggle (Sarah/Maya)
4. Navigate to `/retro`
5. Complete the questionnaire
6. Review generated retrospective
7. Customize as needed

---

**Status**: Project fully set up, waiting for dependency installation on a system with available inodes.
