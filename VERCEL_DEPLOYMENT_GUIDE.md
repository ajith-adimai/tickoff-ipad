# 🚀 Vercel Deployment Guide for TickOff

Complete step-by-step guide to deploy your TickOff habit tracker to Vercel.

## 📋 Prerequisites

- ✅ Node.js installed
- ✅ Your TickOff app ready
- ✅ Supabase project set up
- ✅ Vercel account (free)

## 🎯 Step-by-Step Deployment

### **Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

### **Step 2: Build Your App**
```bash
cd tickoff-ipad
npm run build
```
This creates a `build` folder with your production-ready app.

### **Step 3: Deploy to Vercel**
```bash
vercel
```

**Follow the prompts:**
1. **Set up and deploy?** → Type `Y` and press Enter
2. **Which scope?** → Select your account (usually your email)
3. **Link to existing project?** → Type `N` and press Enter
4. **Project name:** → Type `tickoff-ipad` and press Enter
5. **Directory:** → Press Enter (use current directory)
6. **Override settings?** → Type `N` and press Enter

### **Step 4: Configure Environment Variables**

After deployment, you need to add your Supabase credentials:

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign in** to your account
3. **Click on your project** (tickoff-ipad)
4. **Go to Settings** → **Environment Variables**
5. **Add these variables:**

   **Variable Name:** `REACT_APP_SUPABASE_URL`
   **Value:** `https://your-project-id.supabase.co`
   **Environment:** Production, Preview, Development

   **Variable Name:** `REACT_APP_SUPABASE_ANON_KEY`
   **Value:** `your-anon-key-here`
   **Environment:** Production, Preview, Development

6. **Click Save**

### **Step 5: Redeploy with Environment Variables**
```bash
vercel --prod
```

### **Step 6: Test Your Deployment**

1. **Open your Vercel URL** (shown after deployment)
2. **Test the app functionality:**
   - Sign up/sign in
   - Add habits
   - Mark habits as complete
3. **Check for any errors** in browser console

## 📱 Install on iPad

### **Method 1: Add to Home Screen (PWA)**
1. **Open Safari** on your iPad
2. **Navigate** to your Vercel URL
3. **Tap the Share button** (square with arrow)
4. **Tap "Add to Home Screen"**
5. **Customize the name** (e.g., "TickOff")
6. **Tap "Add"**

### **Method 2: Bookmark in Safari**
1. **Open Safari** on your iPad
2. **Go to** your Vercel URL
3. **Tap the Share button**
4. **Tap "Add Bookmark"**
5. **Save** the bookmark

## 🔧 Troubleshooting

### **Build Errors**
```bash
# Clear cache and rebuild
npm run build -- --reset-cache
```

### **Environment Variables Not Working**
1. **Check variable names** (must start with `REACT_APP_`)
2. **Redeploy** after adding variables
3. **Clear browser cache**

### **Supabase Connection Issues**
1. **Verify Supabase URL** and anon key
2. **Check Supabase project** is active
3. **Test connection** in Supabase dashboard

### **PWA Not Installing**
1. **Check HTTPS** (Vercel provides this automatically)
2. **Clear browser cache**
3. **Try in incognito mode**

## 📊 Post-Deployment

### **Monitor Your App**
- **Vercel Analytics** (built-in)
- **Performance monitoring**
- **Error tracking**

### **Update Your App**
```bash
# Make changes to your code
# Build again
npm run build

# Deploy updates
vercel --prod
```

### **Custom Domain (Optional)**
1. **Go to Vercel dashboard**
2. **Settings** → **Domains**
3. **Add your custom domain**
4. **Configure DNS** as instructed

## 🎉 Success Checklist

- ✅ App builds successfully
- ✅ Deployed to Vercel
- ✅ Environment variables configured
- ✅ App works on desktop browser
- ✅ App works on iPad Safari
- ✅ PWA installs on iPad home screen
- ✅ All features working (auth, habits, etc.)

## 🔗 Useful Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://supabase.com/dashboard
- **PWA Testing:** https://web.dev/measure/

## 🆘 Common Issues & Solutions

### **"Module not found" errors**
- Run `npm install` before building
- Check all dependencies are installed

### **"Environment variable not defined"**
- Add variables in Vercel dashboard
- Redeploy after adding variables

### **"App not loading"**
- Check Vercel deployment status
- Verify environment variables
- Check browser console for errors

### **"PWA not installing"**
- Ensure HTTPS is working
- Check manifest.json is accessible
- Clear browser cache

---

## 🎯 Quick Commands Summary

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Build app
npm run build

# 3. Deploy
vercel

# 4. Add environment variables in Vercel dashboard

# 5. Redeploy with variables
vercel --prod

# 6. Install on iPad via Safari
```

**Your TickOff app will be live and ready for iPad! 🚀** 