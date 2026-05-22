# Deployment Instructions: Critical Bug Fix for Blank Page / Deleted Leads

A critical frontend bug fix has been pushed to the GitHub repository to resolve the issue where pages (specifically the **Design** page and potentially others) go completely blank. 

This error was caused by type errors when the search and filter functions attempted to format `null` or numeric values (`.toLowerCase()`) after construction leads were deleted from the Neon database.

Here is how to get this fix live on the production site.

---

## What You Need to Do (Developer / Deployer Steps)

Since you are running the deployment, please follow these steps to pull the code and update the production servers:

### Step 1: Pull the latest changes from GitHub
Open your terminal inside the project directory and run:
```bash
git pull origin main
```
This will download the 8 safeguarded files:
* `frontend/src/pages/DesignPage.jsx`
* `frontend/src/pages/QuotationPage.jsx`
* `frontend/src/pages/ConstructionPage.jsx`
* `frontend/src/pages/AMCPage.jsx`
* `frontend/src/pages/SiteAccountsPage.jsx`
* `frontend/src/pages/SendToClientPage.jsx`
* `frontend/src/pages/ReviewsPage.jsx`
* `frontend/src/pages/FollowupPage.jsx`

---

### Step 2: Rebuild & Redeploy the Frontend

#### If you deploy via Vercel / Netlify / Render:
* **If connected via automatic Git builds**: The deployment should have already triggered automatically when the commit was pushed. You can check your hosting dashboard to verify the build status.
* **If you deploy manually via CLI**, run:
  * For Vercel: `vercel --prod` (inside the `frontend` folder)
  * For Netlify: `netlify deploy --prod`

#### If you build locally and upload the folder:
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Rebuild the production assets:
   ```bash
   npm run build
   ```
3. Upload the newly generated `dist/` folder to your static hosting provider or host server.

---

## Technical Details of the Fix
All search filter inputs have been safeguarded with defensive checks:
```javascript
// Safely cast fields to string and fallback to an empty string if null
const leadId = d.leadId ? String(d.leadId).toLowerCase() : '';
const client = d.client ? String(d.client).toLowerCase() : '';
```
If a database relation is missing (due to deleted leads), the app will now gracefully show `"Deleted Lead"` or `"N/A"` instead of crashing.
