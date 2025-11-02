# 🚀 Quick Update Guide - Netlify Deployment

## Your Site: https://tubitak2209a.netlify.app

## Method 1: Drag & Drop Update (EASIEST - 2 minutes)

### Steps:
1. Go to **https://app.netlify.com** (login if needed)
2. Click on your site: **tubitak2209a**
3. Click **"Deploys"** tab at the top
4. Drag these 3 files into the drop zone:
   - `index.html`
   - `styles.css`
   - `script.js`
5. Wait ~30 seconds for deployment
6. Visit https://tubitak2209a.netlify.app to see changes

**✅ Done! Your site is updated with all new features.**

---

## Method 2: Netlify CLI (For Frequent Updates)

### First-Time Setup:
```powershell
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login
```

### Deploy Updates:
```powershell
# Navigate to your project folder
cd "c:\Users\med7a\Desktop\Tubitak"

# Deploy to production
netlify deploy --prod
```

When prompted:
- **Publish directory:** `.` (current folder)
- Confirm deployment

---

## What's New in Version 2.0

When you update, your friends will see:

### 🎨 UI Improvements
- Fixed preset bugs (no more duplicate labels)
- Live configuration table showing all body stats
- Keyboard shortcuts hint bar
- Cleaner 3-column responsive layout

### 🔬 New Physics Features
- **Velocity Verlet** integrator (better energy conservation!)
- Integrator selector dropdown (RK4 vs Verlet)
- Real-time energy drift % display

### 📊 Analysis Panel (Right Side)
- **Energy vs Time** graph
- **Angular Momentum** graph
- **Pairwise Distances** graph
- Export buttons (CSV, JSON, Share Link)

### 📚 Better Documentation
- Units clarification (G=1, dimensionless)
- Academic citation (Šuvakov-Dmitrašinović 2013)
- "How to cite this tool" section

### ⌨️ Keyboard Controls
- Space = Play/Pause
- R = Reset
- C = Clear trails
- +/- = Speed
- G = Toggle CoM
- V = Toggle vectors

---

## Testing After Update

Visit your site and verify:

1. **Presets work**
   - Click "Figure-8" → should load smoothly
   - Check that label shows "Figure-8 ✓ Stable" (no duplicates)

2. **Integrator toggle**
   - Change dropdown from "RK4" to "Velocity Verlet"
   - Notice improved energy conservation in graphs

3. **Analysis panel**
   - Right side should show 3 graphs
   - Graphs update as simulation runs
   - Try export buttons (CSV, JSON, Share)

4. **Keyboard shortcuts**
   - Press Space → simulation plays/pauses
   - Press R → resets
   - Press +/- → changes speed

5. **Mobile responsive**
   - Open on phone → should show single column layout
   - All features accessible

---

## Share Updated Link

Send this to your friends:

```
🌌 Check out my improved Three-Body Problem Simulator!

https://tubitak2209a.netlify.app

New features:
✅ Better physics (symplectic integrator)
✅ Real-time analysis graphs
✅ Data export (CSV/JSON)
✅ Keyboard shortcuts
✅ Energy conservation tracking

Try the Figure-8 orbit with Velocity Verlet integrator!
```

---

## Custom Domain (Optional)

If you want a custom domain like `threebody.com`:

1. Buy domain from Namecheap/GoDaddy
2. In Netlify: **Domain settings** → **Add custom domain**
3. Update DNS records (Netlify provides instructions)
4. Get free SSL certificate automatically

---

## Troubleshooting

### Issue: Changes not showing up
**Fix:** 
- Hard refresh browser: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Or clear browser cache

### Issue: "Deploy failed"
**Fix:** 
- Make sure all 3 files are in same folder
- Check file names (lowercase, no spaces)
- Re-drag and drop

### Issue: JavaScript errors
**Fix:** 
- Open browser console (F12)
- Screenshot the error
- Check that `script.js` uploaded correctly

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Earlier | Initial version with 12 presets |
| 2.0 | Nov 2, 2025 | Analysis panel, Verlet integrator, keyboard shortcuts |

---

## Performance Tips

If site feels slow:
- Analysis panel: Click ▼ to collapse (saves CPU)
- Trail length: Reduce to 200-300 for smoother animation
- Use RK4 instead of Verlet if only need short demos

---

## Analytics (Optional)

To track visitors, add to Netlify:
1. **Site settings** → **Build & deploy** → **Post processing**
2. Enable **Analytics**
3. See visitor stats, popular presets, etc.

---

## Backup Your Work

Before major changes:
```powershell
# Create timestamped backup
$date = Get-Date -Format "yyyyMMdd_HHmmss"
Copy-Item "c:\Users\med7a\Desktop\Tubitak" "c:\Users\med7a\Desktop\Tubitak_backup_$date" -Recurse
```

---

## Quick Command Reference

```powershell
# Open site in browser
Start-Process "https://tubitak2209a.netlify.app"

# Open local version
Start-Process "c:\Users\med7a\Desktop\Tubitak\index.html"

# Create ZIP for email sharing
Compress-Archive -Path index.html,styles.css,script.js -DestinationPath simulator.zip
```

---

## Need Help?

1. Check browser console (F12) for errors
2. Test locally first (open `index.html`)
3. Compare with backup version
4. Netlify support: https://answers.netlify.com

---

**Current Status:** ✅ Ready to deploy  
**Estimated Deploy Time:** 2 minutes  
**Downtime:** None (Netlify handles seamlessly)

🎉 **Your friends are going to love the improvements!**
