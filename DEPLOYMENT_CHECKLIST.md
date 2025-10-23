# Mango Mart - Deployment Checklist

## 📁 File Structure (EXACT)

Your project should have this structure on the server:

```
your-domain.com/
├── index.html                 (Main page - ROOT)
├── about.html                 (About page)
├── contact.html               (Contact page)
├── privacy.html               (Privacy page)
├── profile.html               (User profile)
├── orders.html                (Orders page)
├── shipping.html              (Shipping page)
├── thanks.html                (Thank you page)
│
├── js/                        (FOLDER)
│   └── mango-mart.js         (Main JavaScript file)
│
└── styles/                    (FOLDER)
    └── main.css              (Main CSS file)
```

## 🚀 GitHub Deployment Steps

### Step 1: Create a GitHub Repository
1. Go to https://github.com/new
2. Repository name: `mango-mart` (or any name)
3. Click "Create repository"

### Step 2: Upload Files to GitHub

**Option A: Using Git Command Line (Recommended)**

```bash
cd C:\Users\VARUN RAJ S\Downloads\mango

# Initialize git
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit - Mango Mart website"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/mango-mart.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Option B: Using GitHub Desktop**
1. Download GitHub Desktop from https://desktop.github.com
2. File → Clone Repository → Select your mango-mart repo
3. Copy your project files into the cloned folder
4. Commit and Push

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Settings → Pages
3. Branch: `main`
4. Folder: `/ (root)`
5. Click "Save"
6. Wait 2-3 minutes for deployment
7. Your site will be available at: `https://YOUR_USERNAME.github.io/mango-mart/`

### Step 4: Verify Deployment

1. Visit: `https://YOUR_USERNAME.github.io/mango-mart/`
2. Check browser console (F12)
   - Should NOT see 404 errors
3. Verify styling loads
4. Test functionality

## ✅ GitHub Upload Checklist

- [ ] Created GitHub account
- [ ] Created new repository
- [ ] Uploaded all files to repository
- [ ] Files are in correct folder structure
- [ ] Enabled GitHub Pages in Settings
- [ ] Website is live at GitHub Pages URL
- [ ] No 404 errors in console

## 📋 Files to Upload to GitHub

**Root Directory (8 HTML files):**
- [ ] index.html
- [ ] about.html
- [ ] contact.html
- [ ] privacy.html
- [ ] profile.html
- [ ] orders.html
- [ ] shipping.html
- [ ] thanks.html

**Folders:**
- [ ] js/mango-mart.js
- [ ] styles/main.css

**Documentation:**
- [ ] README.md
- [ ] DEPLOYMENT_CHECKLIST.md (this file)

## 🚫 DO NOT Upload
- .git folder (created automatically)
- node_modules (not needed)
- .DS_Store (Mac files)
- Thumbs.db (Windows files)

## 🔗 GitHub Pages URLs

After enabling GitHub Pages, your URL will be:
```
https://YOUR_USERNAME.github.io/mango-mart/
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## 🆘 Troubleshooting

**404 Errors After Upload:**
- Check file paths in index.html
- Ensure folder structure is correct
- Clear browser cache (Ctrl+F5)

**GitHub Pages Not Loading:**
- Wait 2-3 minutes after enabling Pages
- Check Settings → Pages is enabled
- Verify branch is set to 'main'

**External CDNs Not Loading:**
- Tailwind CSS needs internet connection
- Supabase API calls need valid credentials
- Razorpay needs proper configuration
