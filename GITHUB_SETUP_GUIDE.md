# 📚 GitHub Setup Guide for TickOff

Complete guide to push your TickOff app to GitHub before deploying to Vercel.

## 🎯 Step-by-Step GitHub Setup

### **Step 1: Create GitHub Repository**

1. **Go to [github.com](https://github.com)**
2. **Sign in** to your account
3. **Click the "+" icon** in the top right
4. **Select "New repository"**
5. **Fill in the details:**
   - **Repository name:** `tickoff-ipad`
   - **Description:** `TickOff - iPad Habit Tracker App`
   - **Visibility:** Public (recommended) or Private
   - **Initialize with:** Don't check any boxes
6. **Click "Create repository"**

### **Step 2: Initialize Git in Your Project**

Open PowerShell/Command Prompt and run:

```bash
# Navigate to your project directory
cd "C:\Users\Ajith\Tracker App\tickoff-ipad"

# Initialize git repository
git init

# Add all files
git add .

# Make initial commit
git commit -m "Initial commit: TickOff iPad Habit Tracker App"

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/tickoff-ipad.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### **Step 3: Verify Your Repository**

1. **Go to your GitHub repository** URL
2. **Check that all files are uploaded:**
   - `src/` folder with components
   - `public/` folder with PWA files
   - `package.json` and other config files
   - Documentation files

## 📁 Files That Should Be in Your Repository

### **✅ Core Application Files:**
- `src/App.tsx` - Main app component
- `src/components/` - All React components
- `src/supabaseClient.ts` - Supabase configuration
- `src/index.css` - Styling with Tailwind

### **✅ Configuration Files:**
- `package.json` - Dependencies and scripts
- `tailwind.config.js` - Tailwind configuration
- `tsconfig.json` - TypeScript configuration
- `capacitor.config.ts` - Capacitor configuration

### **✅ PWA Files:**
- `public/manifest.json` - PWA manifest
- `public/sw.js` - Service worker
- `public/index.html` - HTML template

### **✅ Documentation:**
- `README.md` - Project overview
- `VERCEL_DEPLOYMENT_GUIDE.md` - Deployment guide
- `IPAD_DEPLOYMENT_GUIDE.md` - iPad setup guide
- `APP_STORE_DEPLOYMENT.md` - App Store guide

### **❌ Files NOT in Repository (Protected by .gitignore):**
- `node_modules/` - Dependencies (installed via npm)
- `.env` - Environment variables (private)
- `build/` - Production build (generated)
- `.vercel/` - Vercel configuration (generated)

## 🔐 Environment Variables Setup

### **Create .env file locally:**
Create a `.env` file in your project root:

```env
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

### **Important:** 
- **Don't commit** the `.env` file to GitHub
- **Add environment variables** in Vercel dashboard after deployment
- **Keep your Supabase credentials** private

## 🚀 After GitHub Setup

### **Deploy to Vercel:**
```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Deploy from GitHub
vercel

# Or deploy directly from local files
npm run build
vercel --prod
```

### **Connect GitHub to Vercel:**
1. **Go to [vercel.com](https://vercel.com)**
2. **Import your GitHub repository**
3. **Configure environment variables**
4. **Deploy automatically**

## 📋 Complete Commands Summary

```bash
# 1. Navigate to project
cd "C:\Users\Ajith\Tracker App\tickoff-ipad"

# 2. Initialize git
git init

# 3. Add all files
git add .

# 4. Initial commit
git commit -m "Initial commit: TickOff iPad Habit Tracker App"

# 5. Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/tickoff-ipad.git

# 6. Push to GitHub
git branch -M main
git push -u origin main

# 7. Deploy to Vercel
vercel
```

## 🎯 Repository Structure

Your GitHub repository should look like this:

```
tickoff-ipad/
├── src/
│   ├── components/
│   │   ├── Auth.tsx
│   │   ├── Dashboard.tsx
│   │   ├── HabitCard.tsx
│   │   └── AddHabitModal.tsx
│   ├── App.tsx
│   ├── supabaseClient.ts
│   └── index.css
├── public/
│   ├── manifest.json
│   ├── sw.js
│   └── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── capacitor.config.ts
├── README.md
├── VERCEL_DEPLOYMENT_GUIDE.md
├── IPAD_DEPLOYMENT_GUIDE.md
├── APP_STORE_DEPLOYMENT.md
├── GITHUB_SETUP_GUIDE.md
└── .gitignore
```

## 🔗 Useful Links

- **GitHub:** https://github.com
- **Vercel:** https://vercel.com
- **Supabase:** https://supabase.com

## 🆘 Common Issues

### **"Repository not found"**
- Check your GitHub username is correct
- Verify repository exists on GitHub
- Ensure you have proper permissions

### **"Permission denied"**
- Use HTTPS instead of SSH
- Check your GitHub credentials
- Try logging out and back in

### **"Large files" error**
- Check `.gitignore` is working
- Remove `node_modules/` if accidentally added
- Use `git rm --cached` for large files

---

**Once your code is on GitHub, you can easily deploy to Vercel and share your project! 🚀** 