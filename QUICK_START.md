# Quick Start Guide

## 🚀 Fastest Way to Get Started

### On a Different System (Recommended)

```bash
# 1. Copy project
cp -r /Volumes/T9/aigile ~/aigile-local
cd ~/aigile-local

# 2. Run quick start script
./quick-start.sh

# Opens automatically on http://localhost:3000
```

### Manual Steps

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open browser
open http://localhost:3000
```

## 📋 What You'll See

### Home Page (/)
- AIgile Manifesto landing
- 4 values with animations
- 10 principles
- About section
- Theme toggle (Sarah/Maya)
- Language toggle (EN/FR)

### Retro Tool (/retro)
- Landing page with explanation
- Click "Start Questionnaire"
- Answer 8 questions
- See your team's pattern detected
- Get personalized retrospective

## 🧪 Test Checklist

- [ ] Home page loads
- [ ] Theme switch works (top left buttons)
- [ ] Language switch works (top right buttons)
- [ ] Navigate to `/retro`
- [ ] Complete questionnaire
- [ ] See pattern detection
- [ ] Review retro activities
- [ ] Check responsive design (resize browser)

## 🐛 Troubleshooting

### npm install fails
```bash
# Try with legacy peer deps
npm install --legacy-peer-deps

# Or use yarn
npm install -g yarn
yarn install
```

### Port 3000 already in use
```bash
# Use different port
PORT=3001 npm run dev
```

### TypeScript errors
```bash
# Check TypeScript
npx tsc --noEmit

# If errors, they're likely import issues
# Check that all imports use correct paths
```

## 📦 Build for Production

```bash
# Build static site
npm run build

# Output will be in 'out/' folder
# Deploy to any static host:
# - Vercel: vercel
# - Netlify: netlify deploy
# - GitHub Pages: push out/ folder
```

## 🎯 Next Steps After Testing

1. **Customize content** if needed
   - Edit translations in `lib/translations.ts`
   - Adjust colors in `app/globals.css`
   - Modify activities in `lib/retro/activities.ts`

2. **Add more features**
   - Additional retro activities
   - More team patterns
   - Export retro as PDF
   - Save retro history

3. **Deploy to production**
   ```bash
   vercel --prod
   # or
   netlify deploy --prod
   ```

## 📞 Need Help?

- Check `README.md` for full documentation
- Check `INSTALLATION.md` for detailed setup
- Email: salim.gomri@gmail.com

---

**Ready?** Run `./quick-start.sh` and you're live in seconds! 🚀
