# Mango Mart - Step-by-Step GitHub Deployment Guide

## ✅ Pre-Deployment Checklist

- [ ] You have a GitHub account (https://github.com)
- [ ] You have Git installed on your computer
- [ ] All files are in correct folder structure
- [ ] index.html is in root directory
- [ ] js/mango-mart.js exists
- [ ] styles/main.css exists

---

## 🚀 STEP 1: Create GitHub Repository

### 1.1 Go to GitHub
1. Open https://github.com
2. Click "+" icon (top right)
3. Click "New repository"

### 1.2 Create Repository
1. Repository name: **`mango-mart`** (or any name)
2. Description: **Mango Mart - Fresh Groceries Website**
3. Make it **Public** (important for GitHub Pages)
4. Click "Create repository"

### 1.3 Copy Repository URL
- You'll see something like: `https://github.com/YOUR_USERNAME/mango-mart.git`
- **Save this URL** - you'll need it in Step 2

---

## 🚀 STEP 2: Upload Files to GitHub

### Option A: Using Command Line (RECOMMENDED)

#### 2A.1 Open Command Prompt
1. Open Start Menu
2. Search for "Command Prompt" or "PowerShell"
3. Click to open

#### 2A.2 Navigate to Your Project
```bash
cd C:\Users\VARUN RAJ S\Downloads\mango
```
Press Enter

#### 2A.3 Initialize Git
```bash
git init
```
Press Enter

#### 2A.4 Add All Files
```bash
git add .
```
Press Enter

#### 2A.5 Commit Files
```bash
git commit -m "Initial commit - Mango Mart website"
```
Press Enter

#### 2A.6 Add Remote Repository
```bash
git remote add origin https://github.com/YOUR_USERNAME/mango-mart.git
```
Replace `YOUR_USERNAME` with your actual GitHub username
Press Enter

#### 2A.7 Push to GitHub
```bash
git branch -M main
git push -u origin main
```
Press Enter

You'll be asked to log in to GitHub - enter your credentials

### Option B: Using GitHub Desktop

1. Download from https://desktop.github.com
2. Install and open GitHub Desktop
3. File → Clone Repository
4. Select your mango-mart repository
5. Copy all your project files into the cloned folder
6. Make changes in GitHub Desktop
7. Click "Commit to main"
8. Click "Push origin"

---

## 🚀 STEP 3: Enable GitHub Pages

### 3.1 Go to Repository Settings
1. Go to your repository: https://github.com/YOUR_USERNAME/mango-mart
2. Click "Settings" (top menu)

### 3.2 Find Pages Section
1. Left sidebar → Click "Pages"
2. Under "Build and deployment"

### 3.3 Configure GitHub Pages
1. **Branch**: Select `main`
2. **Folder**: Select `/ (root)`
3. Click "Save"

### 3.4 Wait for Deployment
- GitHub will deploy your site
- Takes 2-5 minutes usually
- You'll see a message like: "Your site is live at..."

---

## 🌐 STEP 4: Access Your Website

### 4.1 Get Your Website URL
Your site will be available at:
```
https://YOUR_USERNAME.github.io/mango-mart/
```

Replace `YOUR_USERNAME` with your actual GitHub username

### 4.2 Visit Your Website
1. Copy the URL above
2. Paste in browser address bar
3. Press Enter

### 4.3 Verify It's Working
✅ Page loads without errors
✅ Styling looks good (not plain text)
✅ You see Mango Mart branding
✅ Buttons and forms visible
✅ No 404 errors in console (F12)

---

## ✅ STEP 5: Verify Deployment Success

### 5.1 Open Browser Console
1. Press F12 on your keyboard
2. Click "Console" tab
3. Look for errors

### 5.2 Check for These Errors
❌ BAD: `Failed to load resource: the server responded with a status of 404`
✅ GOOD: No 404 errors

### 5.3 Test Functionality
1. Try adding a product to cart
2. Try clicking buttons
3. Check if page responds

### 5.4 Check Supabase Connection
1. Console should show Supabase messages
2. If you see errors about Supabase, check your API keys in mango-mart.js

---

## 🔧 TROUBLESHOOTING

### Problem: Page shows 404 error
**Solution:**
- Wait 5 minutes for GitHub Pages to finish deploying
- Clear browser cache (Ctrl+F5)
- Check GitHub → Settings → Pages is enabled
- Verify branch is set to 'main'

### Problem: Styling looks broken (plain text)
**Solution:**
- Check file path: `styles/main.css` (must be exact case)
- Press Ctrl+F5 to clear cache
- Check browser console for CSS 404 errors

### Problem: JavaScript not working
**Solution:**
- Check file path: `js/mango-mart.js` (must be exact case)
- Press Ctrl+F5 to clear cache
- Check browser console for JS errors

### Problem: Supabase connection failing
**Solution:**
- Check your Supabase API keys in js/mango-mart.js (lines 350-351)
- Make sure keys are correct
- Verify Supabase project is active

### Problem: Page takes long to load
**Solution:**
- External CDNs (Tailwind, Supabase, Razorpay) need internet
- Check internet connection
- Wait for all resources to load

---

## 📝 Complete File Structure

After deployment, your GitHub repository should have:

```
mango-mart/
├── index.html
├── about.html
├── contact.html
├── privacy.html
├── profile.html
├── orders.html
├── shipping.html
├── thanks.html
├── README.md
├── DEPLOYMENT_CHECKLIST.md
├── js/
│   └── mango-mart.js
└── styles/
    └── main.css
```

---

## 🎉 You're Done!

Your website is now live on GitHub Pages!

- ✅ Website URL: `https://YOUR_USERNAME.github.io/mango-mart/`
- ✅ Repository URL: `https://github.com/YOUR_USERNAME/mango-mart`
- ✅ Can be shared with anyone
- ✅ Automatically updates when you push changes

---

## 📚 Next Steps (Optional)

### Update Website Later
```bash
# Make changes to your files
git add .
git commit -m "Update message describing changes"
git push
```

### Get Custom Domain
1. Buy domain (GoDaddy, Namecheap, etc.)
2. GitHub → Settings → Pages → Custom domain
3. Point domain DNS to GitHub Pages
4. Wait 24 hours for DNS to update

---

## 💬 Need Help?

If something goes wrong:
1. Check the troubleshooting section above
2. Check GitHub status: https://www.githubstatus.com
3. Read GitHub Pages docs: https://docs.github.com/en/pages
