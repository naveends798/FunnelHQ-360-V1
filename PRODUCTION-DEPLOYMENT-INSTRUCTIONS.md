# 🚀 FunnelHQ 360 - Production Deployment Instructions

## Step-by-Step Deployment to Vercel

### Prerequisites
- [ ] Vercel account (free tier works) - Sign up at vercel.com
- [ ] GitHub repository with your code
- [ ] Supabase project with database configured
- [ ] Clerk account with production keys

---

## 🔧 **Step 1: Prepare Your Vercel Account**

### 1.1 Sign up for Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign up"
3. Connect with GitHub account
4. Verify your email

### 1.2 Install Vercel CLI (Optional but recommended)
```bash
npm install -g vercel
```

---

## 📤 **Step 2: Deploy Your Application**

### 2.1 Deploy from GitHub (Recommended)
1. Push your code to GitHub repository
2. Go to Vercel dashboard
3. Click "New Project"
4. Import your GitHub repository
5. Configure as follows:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `client/dist`
   - **Install Command**: `npm install`

### 2.2 Deploy from CLI (Alternative)
```bash
cd /path/to/your/project
vercel --prod
```

---

## ⚙️ **Step 3: Configure Environment Variables**

### 3.1 In Vercel Dashboard
1. Go to your project settings
2. Click "Environment Variables"
3. Add the following variables (get values from .env.production.template):

**Authentication Variables:**
```
VITE_CLERK_PUBLISHABLE_KEY = pk_live_YOUR_CLERK_KEY
CLERK_SECRET_KEY = sk_live_YOUR_CLERK_SECRET
CLERK_WEBHOOK_SECRET = whsec_YOUR_WEBHOOK_SECRET
```

**Database Variables:**
```
VITE_SUPABASE_URL = https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY = eyJ...YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY = eyJ...YOUR_SERVICE_KEY
DATABASE_URL = postgresql://postgres:pass@db.project.supabase.co:5432/postgres
```

**Application Variables:**
```
NODE_ENV = production
APP_BETA = false
```

### 3.2 Where to Get These Values

**Clerk Keys:**
1. Go to [clerk.com](https://clerk.com) dashboard
2. Select your project
3. Go to "API Keys"
4. Copy the production keys

**Supabase Keys:**
1. Go to [supabase.com](https://supabase.com) dashboard
2. Select your project
3. Go to "Settings" > "API"
4. Copy URL and anon key
5. Copy service role key (keep this secret!)

---

## 🌐 **Step 4: Domain Configuration (Optional)**

### 4.1 Custom Domain
If you want a custom domain:
1. Go to project settings
2. Click "Domains"
3. Add your domain
4. Follow DNS configuration instructions

### 4.2 Default Vercel Domain
Your app will be available at: `https://your-project-name.vercel.app`

---

## ✅ **Step 5: Verify Deployment**

### 5.1 Check Deployment Status
1. Go to Vercel dashboard
2. Check "Deployments" tab
3. Ensure latest deployment shows "Ready"

### 5.2 Test Your Application
1. Visit your production URL
2. Test login with Clerk
3. Verify database connection
4. Test all user roles (admin, team_member, client)

---

## 🔍 **Step 6: Monitoring & Troubleshooting**

### 6.1 View Logs
1. Go to Vercel dashboard
2. Click on your deployment
3. View "Functions" tab for API logs

### 6.2 Common Issues & Solutions

**Issue: "Environment variable not found"**
- Solution: Double-check all environment variables are set correctly
- Make sure to redeploy after adding variables

**Issue: "Database connection failed"**
- Solution: Verify DATABASE_URL and Supabase keys
- Check if Supabase project is active

**Issue: "Authentication not working"**
- Solution: Verify Clerk keys are production keys
- Check Clerk dashboard for correct domain settings

---

## 📋 **Deployment Checklist**

- [ ] Code pushed to GitHub
- [ ] Vercel project created and deployed
- [ ] All environment variables configured
- [ ] Deployment shows "Ready" status
- [ ] Application loads at production URL
- [ ] Login/authentication working
- [ ] Database connection successful
- [ ] All user roles working correctly
- [ ] No errors in function logs

---

## 🆘 **Getting Help**

If you encounter issues:
1. Check Vercel function logs
2. Verify all environment variables
3. Test locally with production environment
4. Contact support if needed

---

**Deployment completed successfully! 🎉**

Your FunnelHQ 360 application is now live in production with:
- ✅ Persistent database storage
- ✅ Role-based access control
- ✅ Secure authentication
- ✅ Real-time communication system